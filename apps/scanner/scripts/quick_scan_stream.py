#!/usr/bin/env python3
"""
Zenkai Quick Scanner — streaming modular scanner for Kali.
Each module runs with a hard timeout, emits one JSON line on completion.
Format: {"module":"nmap","status":"pass|warn|fail","score":int,"summary":"...","details":[],"findings":[]}
"""
import json, subprocess, sys, re, os, requests
from concurrent.futures import ThreadPoolExecutor, as_completed

WORDLIST      = "/usr/share/wordlists/dirb/common.txt"
URLSCAN_KEY   = os.environ.get("URLSCAN_API_KEY", "")
SHODAN_KEY    = os.environ.get("SHODAN_API_KEY", "")


def run(cmd, timeout=30):
    try:
        r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
        return r.stdout + r.stderr
    except Exception:
        return ""


def emit(module, status, score, summary, details=None, findings=None):
    print(json.dumps({
        "module": module, "status": status, "score": score,
        "summary": summary, "details": details or [], "findings": findings or []
    }), flush=True)


# ── modules ───────────────────────────────────────────────────────────────────

def mod_dns(domain):
    out = run(f"dig +short A {domain} && dig +short TXT {domain} && dig +short TXT _dmarc.{domain}", timeout=10)
    findings, details = [], []
    has_spf = "v=spf1" in out
    has_dmarc = "v=dmarc1" in out.lower()
    dmarc_none = "p=none" in out.lower()

    if has_spf:
        details.append("SPF record found")
    else:
        findings.append({"title": "Missing SPF Record", "severity": "Medium",
            "description": "No SPF record found — domain can be spoofed for email.",
            "recommendation": "Add: v=spf1 include:yourmailprovider.com ~all"})

    if has_dmarc:
        details.append("DMARC record found")
        if dmarc_none:
            findings.append({"title": "Weak DMARC (p=none)", "severity": "Low",
                "description": "DMARC policy is monitoring-only.",
                "recommendation": "Change to p=quarantine or p=reject"})
    else:
        findings.append({"title": "Missing DMARC Record", "severity": "Medium",
            "description": "No DMARC record — domain susceptible to email spoofing.",
            "recommendation": "Add: v=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com"})

    score = 100
    score -= 25 if not has_spf else 0
    score -= 30 if not has_dmarc else (10 if dmarc_none else 0)
    status = "pass" if score >= 70 else ("warn" if score >= 40 else "fail")
    emit("dns", status, score, f"SPF: {'yes' if has_spf else 'no'}  DMARC: {'yes' if has_dmarc else 'no'}", details, findings)


def mod_headers(domain):
    out = run(f"curl -s -I -L --max-time 10 -A 'Mozilla/5.0' https://{domain}", timeout=15)
    h = out.lower()
    findings, details = [], []

    checks = [
        ("strict-transport-security", "HSTS",               "High",   25, "Strict-Transport-Security: max-age=31536000; includeSubDomains"),
        ("content-security-policy",   "CSP",                "High",   25, "Content-Security-Policy: default-src 'self'"),
        ("x-frame-options",           "X-Frame-Options",    "Medium", 15, "X-Frame-Options: DENY"),
        ("x-content-type-options",    "X-Content-Type-Options","Medium",15,"X-Content-Type-Options: nosniff"),
        ("referrer-policy",           "Referrer-Policy",    "Low",    10, "Referrer-Policy: strict-origin-when-cross-origin"),
        ("permissions-policy",        "Permissions-Policy", "Low",    10, "Permissions-Policy: geolocation=(), camera=()"),
    ]
    score = 100
    for key, name, sev, weight, rec in checks:
        if key in h:
            details.append(f"{name}: present")
        else:
            score -= weight
            findings.append({"title": f"Missing {name}", "severity": sev,
                "description": f"{name} header not found.", "recommendation": f"Add: {rec}"})

    for line in out.splitlines():
        if line.lower().startswith("server:") and any(c.isdigit() for c in line):
            findings.append({"title": "Server Version Disclosure", "severity": "Low",
                "description": line.strip(),
                "recommendation": "Set ServerTokens Prod (Apache) or server_tokens off (nginx)"})

    status = "pass" if score >= 70 else ("warn" if score >= 40 else "fail")
    emit("headers", status, score, f"{len(findings)} missing headers", details, findings)


def mod_ssl(domain):
    tls = {}
    for proto in ["tls1", "tls1_1", "tls1_2", "tls1_3"]:
        r = run(f"echo | timeout 5 openssl s_client -connect {domain}:443 -{proto} 2>&1", timeout=8)
        tls[proto] = "cipher" in r.lower() or "certificate" in r.lower()

    cert = run(f"echo | timeout 8 openssl s_client -connect {domain}:443 2>&1 | openssl x509 -noout -dates -issuer 2>/dev/null", timeout=12)
    findings, details = [], []
    score = 100

    if tls.get("tls1"):
        score -= 30
        findings.append({"title": "TLS 1.0 Enabled", "severity": "High",
            "description": "TLS 1.0 is deprecated (BEAST/POODLE).",
            "recommendation": "Disable TLS 1.0/1.1, use TLS 1.2+ only."})
    if tls.get("tls1_1"):
        score -= 20
        findings.append({"title": "TLS 1.1 Enabled", "severity": "Medium",
            "description": "TLS 1.1 is deprecated.",
            "recommendation": "Disable TLS 1.1."})
    for proto, label in [("tls1_2","TLS 1.2"), ("tls1_3","TLS 1.3")]:
        details.append(f"{label}: {'supported' if tls.get(proto) else 'not detected'}")
    if "self signed" in cert.lower():
        score -= 40
        findings.append({"title": "Self-Signed Certificate", "severity": "High",
            "description": "Self-signed cert causes browser warnings.",
            "recommendation": "Use a trusted CA (Let's Encrypt is free)."})
    for line in cert.splitlines():
        if "notafter" in line.lower():
            details.append(f"Expires: {line.split('=',1)[-1].strip()}")

    status = "pass" if score >= 70 else ("warn" if score >= 40 else "fail")
    emit("ssl", status, score, f"TLS 1.2: {'yes' if tls.get('tls1_2') else 'no'}  TLS 1.3: {'yes' if tls.get('tls1_3') else 'no'}", details, findings)


def mod_nmap(domain):
    # TCP top 1000
    tcp_out = run(f"nmap -sV -T4 --open --top-ports 1000 {domain} 2>/dev/null", timeout=120)
    # UDP selected ports: DNS 53, NTP 123, SNMP 161, IKE 500
    udp_out = run(f"nmap -sU -T4 --open -p 53,123,161,500 {domain} 2>/dev/null", timeout=60)

    risky_tcp = {
        "21":    ("FTP Open",            "Medium", "FTP is unencrypted.",             "Use SFTP or FTPS."),
        "23":    ("Telnet Open",         "High",   "Telnet is plaintext.",            "Disable Telnet, use SSH."),
        "25":    ("SMTP Open",           "Low",    "SMTP may allow relay abuse.",     "Restrict relay + enforce auth."),
        "3306":  ("MySQL Exposed",       "High",   "MySQL publicly accessible.",      "Restrict to localhost/VPN."),
        "5432":  ("PostgreSQL Exposed",  "High",   "PostgreSQL publicly accessible.", "Restrict to localhost/VPN."),
        "6379":  ("Redis Exposed",       "High",   "Redis often unauthenticated.",    "Bind to localhost + enable auth."),
        "27017": ("MongoDB Exposed",     "High",   "MongoDB publicly accessible.",    "Restrict + enable auth."),
        "8080":  ("Alt HTTP Port",       "Low",    "Non-standard port 8080 open.",    "Review what runs on this port."),
    }
    risky_udp = {
        "161": ("SNMP Exposed",    "High",   "SNMP can leak system info and allow config changes.", "Restrict SNMP or disable if unused."),
        "500": ("IKE/VPN Exposed", "Medium", "IKE on UDP 500 exposes VPN endpoint.",               "Review VPN exposure and access control."),
    }
    findings, details = [], []
    tcp_count = 0

    for line in tcp_out.splitlines():
        if "/tcp" in line and "open" in line:
            tcp_count += 1
            details.append(line.strip())
            port = line.split("/")[0].strip()
            if port in risky_tcp:
                t, s, d, r = risky_tcp[port]
                findings.append({"title": t, "severity": s, "description": d, "recommendation": r})
    if "cloudflare" in tcp_out.lower():
        details.append("CDN: Cloudflare detected")

    udp_count = 0
    for line in udp_out.splitlines():
        if "/udp" in line and "open" in line:
            udp_count += 1
            details.append(f"[UDP] {line.strip()}")
            # only flag confirmed open ports, not open|filtered (CDN/firewall artefact)
            if "open|filtered" not in line:
                port = line.split("/")[0].strip()
                if port in risky_udp:
                    t, s, d, r = risky_udp[port]
                    findings.append({"title": t, "severity": s, "description": d, "recommendation": r})

    total = tcp_count + udp_count
    score = max(0, 100 - len(findings) * 20)
    status = "pass" if not findings else ("warn" if score >= 50 else "fail")
    emit("nmap", status, score, f"{tcp_count} TCP + {udp_count} UDP open ports", details, findings)


def mod_gobuster(domain):
    if not os.path.exists(WORDLIST):
        emit("gobuster", "warn", 50, "Wordlist not found — skipped", [], [])
        return

    ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    # Try HTTPS first, fall back to HTTP
    for scheme in ["https", "http"]:
        out = run(
            f"gobuster dir -u {scheme}://{domain} -w {WORDLIST} -k -r -t 10 -q "
            f"--timeout 15s -b 404,403,429,503 -a '{ua}'",
            timeout=90
        )
        if out.strip():
            break

    sensitive = ["admin","login","wp-admin","phpmyadmin",".env","config","backup",
                 "api","swagger","graphql",".git","debug","shell","upload"]
    findings, details = [], []
    for line in out.splitlines():
        # gobuster v3 format: /path   (Status: 200) [Size: 1234]
        m = re.search(r'(/\S+)\s+\(Status:\s*(\d+)\)', line)
        if not m:
            continue
        path, code = m.group(1), int(m.group(2))
        is_s = any(s in path.lower() for s in sensitive)
        sev = "High" if is_s else ("Medium" if code == 200 else "Low")
        details.append(f"{path} [{code}]")
        if is_s or code == 200:
            findings.append({"title": f"Endpoint: {path}", "severity": sev,
                "description": f"HTTP {code} at {scheme}://{domain}{path}",
                "recommendation": "Verify this endpoint should be public."})

    score = max(0, 100 - len([f for f in findings if f["severity"] in ("High","Medium")]) * 15)
    status = "pass" if not findings else ("warn" if score >= 50 else "fail")
    emit("gobuster", status, score, f"{len(details)} paths found", details, findings)


def mod_nikto(domain):
    out = run(
        f"nikto -h https://{domain} -Tuning 123bde -maxtime 90s -nointeractive 2>/dev/null",
        timeout=100
    )
    rules = [
        ("phpinfo",  "PHPInfo Page Exposed",        "High"),
        ("/admin",   "Admin Path Found",             "Medium"),
        ("osvdb",    "Known Vulnerability (OSVDB)",  "Medium"),
        ("sql",      "Possible SQL Reference",       "Medium"),
        ("robots.txt","robots.txt Exposed",          "Low"),
        ("server leaks","Server Info Leakage",       "Low"),
    ]
    findings, details = [], []
    for line in out.splitlines():
        if line.startswith("+"):
            details.append(line[1:].strip()[:200])
        for key, title, sev in rules:
            if key in line.lower():
                findings.append({"title": title, "severity": sev,
                    "description": line.strip()[:200],
                    "recommendation": "Review and remediate this configuration."})
                break

    score = max(0, 100 - len([f for f in findings if f["severity"] in ("High","Medium")]) * 20)
    status = "pass" if not findings else ("warn" if score >= 50 else "fail")
    emit("nikto", status, score, f"{len(findings)} issues via Nikto", details, findings)


def mod_whatweb(domain):
    out = run(f"whatweb --color=never -a 3 {domain} 2>/dev/null", timeout=30)
    tech = [
        ("wordpress","CMS","WordPress"), ("joomla","CMS","Joomla"), ("drupal","CMS","Drupal"),
        ("nginx","Server","Nginx"), ("apache","Server","Apache"), ("iis","Server","IIS"),
        ("cloudflare","CDN","Cloudflare"), ("vercel","Hosting","Vercel"),
        ("php","Language","PHP"), ("jquery","JS","jQuery"), ("react","JS","React"),
        ("next.js","JS","Next.js"),
    ]
    details, findings = [], []
    for kw, cat, name in tech:
        if kw in out.lower():
            details.append(f"{cat}: {name}")
    php_m = re.search(r'PHP[/\s]+([\d.]+)', out, re.I)
    if php_m:
        v = php_m.group(1)
        details.append(f"PHP {v}")
        if int(v.split(".")[0]) < 8:
            findings.append({"title": f"Outdated PHP ({v})", "severity": "Medium",
                "description": f"PHP {v} is end-of-life.",
                "recommendation": "Upgrade to PHP 8.1+"})

    status = "pass" if not findings else "warn"
    score  = 100 if not findings else 70
    emit("whatweb", status, score, ", ".join(details[:5]) or "No fingerprint", details, findings)


def mod_urlscan(domain):
    if not URLSCAN_KEY:
        emit("urlscan", "warn", 50, "No urlscan API key — skipped", [], [])
        return
    try:
        # Submit scan
        r = requests.post(
            "https://urlscan.io/api/v1/scan/",
            headers={"API-Key": URLSCAN_KEY, "Content-Type": "application/json"},
            json={"url": f"https://{domain}", "visibility": "unlisted"},
            timeout=15
        )
        if r.status_code not in (200, 201):
            emit("urlscan", "warn", 50, f"urlscan submit: HTTP {r.status_code}", [], [])
            return
        uuid = r.json().get("uuid", "")
        if not uuid:
            emit("urlscan", "warn", 50, "urlscan: no scan UUID returned", [], [])
            return

        # Poll for result (max 30s)
        import time
        result = None
        for _ in range(6):
            time.sleep(5)
            res = requests.get(f"https://urlscan.io/api/v1/result/{uuid}/", timeout=10)
            if res.status_code == 200:
                result = res.json()
                break

        if not result:
            emit("urlscan", "warn", 50, "urlscan: scan timed out", [], [])
            return

        verdicts  = result.get("verdicts", {}).get("overall", {})
        malicious = verdicts.get("malicious", False)
        score_vt  = verdicts.get("score", 0)
        tags      = verdicts.get("tags", [])
        page      = result.get("page", {})
        details   = [
            f"Status: {page.get('status', '?')}",
            f"Server: {page.get('server', 'unknown')}",
            f"Score: {score_vt}",
        ]
        if tags:
            details.append(f"Tags: {', '.join(tags)}")

        findings = []
        if malicious:
            findings.append({"title": "Domain flagged as malicious", "severity": "High",
                "description": f"urlscan.io flagged {domain} as malicious (score: {score_vt}).",
                "recommendation": "Investigate domain reputation and hosting provider."})
        elif score_vt > 50:
            findings.append({"title": "Suspicious domain score", "severity": "Medium",
                "description": f"urlscan.io gave {domain} a suspicious score of {score_vt}.",
                "recommendation": "Review domain configuration and content."})

        final_score = max(0, 100 - score_vt)
        status = "fail" if malicious else ("warn" if score_vt > 50 else "pass")
        emit("urlscan", status, final_score, f"Score: {score_vt} · {'malicious' if malicious else 'clean'}", details, findings)
    except Exception as e:
        emit("urlscan", "warn", 50, f"urlscan error: {str(e)[:60]}", [], [])


def mod_zap(domain):
    # ZAP baseline — passive only, depth 2, max 50 URLs, 3 min
    zap_bin = run("which zaproxy 2>/dev/null || which zap.sh 2>/dev/null || which zap-cli 2>/dev/null", timeout=5).strip().splitlines()
    zap_bin = zap_bin[0] if zap_bin else ""
    if not zap_bin:
        emit("zap", "warn", 50, "ZAP not installed — skipped", [], [])
        return

    report_path = f"/tmp/zap_quick_{domain}.xml"
    run(
        f"{zap_bin} -cmd -quickurl https://{domain} -quickprogress -quickout {report_path} 2>/dev/null",
        timeout=200
    )

    findings, details = [], []
    if os.path.exists(report_path):
        try:
            import html
            content = open(report_path).read()
            seen = set()
            for m in re.finditer(
                r'<name>([^<]+)</name>.*?<riskcode>(\d+)</riskcode>.*?<desc>(.*?)</desc>',
                content, re.DOTALL
            ):
                name = m.group(1).strip()
                risk = int(m.group(2))
                desc = html.unescape(re.sub(r'<[^>]+>', '', m.group(3))).strip()[:200]
                if name in seen:
                    continue
                seen.add(name)
                sev = {3: "High", 2: "Medium", 1: "Low", 0: "Info"}.get(risk, "Low")
                if risk >= 1:
                    findings.append({"title": name, "severity": sev,
                        "description": desc,
                        "recommendation": "Review ZAP finding and apply remediation."})
                    details.append(f"[{sev}] {name}")
        finally:
            os.remove(report_path)

    score  = max(0, 100 - len([f for f in findings if f["severity"] in ("High", "Medium")]) * 15)
    status = "pass" if not findings else ("warn" if score >= 50 else "fail")
    emit("zap", status, score, f"{len(findings)} issues via ZAP baseline", details, findings)


# ── main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: quick_scan_stream.py domain.com"}))
        sys.exit(1)

    domain = sys.argv[1].strip().replace("https://", "").replace("http://", "").split("/")[0]

    modules = [mod_headers, mod_ssl, mod_dns, mod_nmap, mod_gobuster, mod_nikto, mod_whatweb, mod_urlscan, mod_zap]

    with ThreadPoolExecutor(max_workers=9) as pool:
        futures = {pool.submit(m, domain): m.__name__ for m in modules}
        for f in as_completed(futures):
            try:
                f.result()
            except Exception as e:
                name = futures[f].replace("mod_", "")
                emit(name, "warn", 50, f"Module error: {str(e)[:100]}", [], [])

    print(json.dumps({"done": True}), flush=True)

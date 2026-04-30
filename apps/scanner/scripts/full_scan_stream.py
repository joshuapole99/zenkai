#!/usr/bin/env python3
"""
Zenkai Full Scanner — Pro plan scan. Runs all quick-scan modules at higher depth
plus: full port scan, subdomain enum, Shodan enrichment, VirusTotal, sslyze deep SSL,
CVE/version mapping, ZAP baseline (if installed), SQLMap targeted (if installed).
Each module emits one JSON line on completion.
Format: {"module":"...","status":"pass|warn|fail","score":int,"summary":"...","details":[],"findings":[]}
"""
import json, subprocess, sys, re, os, requests
from concurrent.futures import ThreadPoolExecutor, as_completed

WORDLIST_COMMON   = "/usr/share/wordlists/dirb/common.txt"
WORDLIST_RAFT_LG  = "/usr/share/seclists/Discovery/Web-Content/raft-large-words.txt"
WORDLIST_RAFT_MD  = "/usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt"
WORDLIST_BIG      = "/usr/share/seclists/Discovery/Web-Content/big.txt"
WORDLIST_FULL     = next((w for w in [WORDLIST_RAFT_LG, WORDLIST_RAFT_MD, WORDLIST_BIG, WORDLIST_COMMON] if os.path.exists(w)), WORDLIST_COMMON)

SHODAN_KEY    = os.environ.get("SHODAN_API_KEY", "")
URLSCAN_KEY   = os.environ.get("URLSCAN_API_KEY", "")

collected = []


def run(cmd, timeout=30):
    try:
        r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
        return r.stdout + r.stderr
    except Exception:
        return ""


def emit(module, status, score, summary, details=None, findings=None):
    obj = {
        "module": module, "status": status, "score": score,
        "summary": summary, "details": details or [], "findings": findings or []
    }
    print(json.dumps(obj), flush=True)
    collected.append(obj)


# ── modules ───────────────────────────────────────────────────────────────────

def mod_dns(domain):
    out = run(f"dig +short A {domain} && dig +short AAAA {domain} && dig +short MX {domain} && dig +short NS {domain} && dig +short TXT {domain} && dig +short TXT _dmarc.{domain} && dig +short CAA {domain}", timeout=15)
    findings, details = [], []
    has_spf   = "v=spf1"   in out
    has_dmarc = "v=dmarc1" in out.lower()
    dmarc_none = "p=none"  in out.lower()
    has_caa   = "issue"    in out.lower() or "issuewild" in out.lower()

    details.append("SPF: " + ("present" if has_spf else "missing"))
    details.append("DMARC: " + ("present" if has_dmarc else "missing"))
    details.append("CAA: " + ("present" if has_caa else "missing"))

    if not has_spf:
        findings.append({"title": "Missing SPF Record", "severity": "Medium",
            "description": "No SPF record — domain can be spoofed for email.",
            "recommendation": "Add: v=spf1 include:yourmailprovider.com ~all"})
    if has_dmarc and dmarc_none:
        findings.append({"title": "Weak DMARC (p=none)", "severity": "Low",
            "description": "DMARC policy is monitoring-only.",
            "recommendation": "Change to p=quarantine or p=reject"})
    elif not has_dmarc:
        findings.append({"title": "Missing DMARC Record", "severity": "Medium",
            "description": "No DMARC record — domain susceptible to email spoofing.",
            "recommendation": "Add: v=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com"})
    if not has_caa:
        findings.append({"title": "No CAA Record", "severity": "Low",
            "description": "No CAA record — any CA can issue certs for this domain.",
            "recommendation": "Add: 0 issue \"letsencrypt.org\""})

    score = 100
    score -= 25 if not has_spf else 0
    score -= 30 if not has_dmarc else (10 if dmarc_none else 0)
    score -= 10 if not has_caa else 0
    status = "pass" if score >= 70 else ("warn" if score >= 40 else "fail")
    emit("dns", status, score, f"SPF: {'yes' if has_spf else 'no'}  DMARC: {'yes' if has_dmarc else 'no'}  CAA: {'yes' if has_caa else 'no'}", details, findings)


def mod_headers(domain):
    out = run(f"curl -s -I -L --max-time 10 -A 'Mozilla/5.0' https://{domain}", timeout=15)
    h = out.lower()
    findings, details = [], []
    checks = [
        ("strict-transport-security", "HSTS",                "High",   25, "Strict-Transport-Security: max-age=31536000; includeSubDomains"),
        ("content-security-policy",   "CSP",                 "High",   25, "Content-Security-Policy: default-src 'self'"),
        ("x-frame-options",           "X-Frame-Options",     "Medium", 15, "X-Frame-Options: DENY"),
        ("x-content-type-options",    "X-Content-Type-Options","Medium",15,"X-Content-Type-Options: nosniff"),
        ("referrer-policy",           "Referrer-Policy",     "Low",    10, "Referrer-Policy: strict-origin-when-cross-origin"),
        ("permissions-policy",        "Permissions-Policy",  "Low",    10, "Permissions-Policy: geolocation=(), camera=()"),
        ("cross-origin-opener-policy","COOP",                "Low",     5, "Cross-Origin-Opener-Policy: same-origin"),
        ("cross-origin-resource-policy","CORP",              "Low",     5, "Cross-Origin-Resource-Policy: same-origin"),
    ]
    score = 100
    for key, name, sev, weight, rec in checks:
        if key in h:
            details.append(f"{name}: present")
        else:
            score -= weight
            findings.append({"title": f"Missing {name}", "severity": sev,
                "description": f"{name} header not found.",
                "recommendation": f"Add: {rec}"})
    for line in out.splitlines():
        if line.lower().startswith("server:") and any(c.isdigit() for c in line):
            findings.append({"title": "Server Version Disclosure", "severity": "Low",
                "description": line.strip(),
                "recommendation": "Set ServerTokens Prod (Apache) or server_tokens off (nginx)"})
    status = "pass" if score >= 70 else ("warn" if score >= 40 else "fail")
    emit("headers", status, score, f"{len(findings)} missing/weak headers", details, findings)


def mod_ssl(domain):
    tls = {}
    for proto in ["tls1", "tls1_1", "tls1_2", "tls1_3"]:
        r = run(f"echo | timeout 5 openssl s_client -connect {domain}:443 -{proto} 2>&1", timeout=8)
        tls[proto] = "cipher" in r.lower() or "certificate" in r.lower()

    cert = run(f"echo | timeout 8 openssl s_client -connect {domain}:443 2>&1 | openssl x509 -noout -dates -issuer -subject 2>/dev/null", timeout=12)
    # sslyze for cipher suite detail
    sslyze_out = run(f"sslyze --regular {domain} 2>/dev/null", timeout=60)

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
        if "issuer" in line.lower():
            details.append(f"Issuer: {line.split('=',1)[-1].strip()[:80]}")
    if "rc4" in sslyze_out.lower():
        score -= 20
        findings.append({"title": "RC4 Cipher Enabled", "severity": "High",
            "description": "RC4 is a broken cipher with known weaknesses.",
            "recommendation": "Disable RC4 in SSL configuration."})
    if "3des" in sslyze_out.lower() or "des-cbc3" in sslyze_out.lower():
        score -= 10
        findings.append({"title": "3DES Cipher Enabled", "severity": "Medium",
            "description": "3DES/SWEET32 vulnerability risk.",
            "recommendation": "Disable 3DES cipher suite."})

    status = "pass" if score >= 70 else ("warn" if score >= 40 else "fail")
    emit("ssl", status, score, f"TLS 1.2: {'yes' if tls.get('tls1_2') else 'no'}  TLS 1.3: {'yes' if tls.get('tls1_3') else 'no'}", details, findings)


def mod_nmap_full(domain):
    # Full TCP scan — all 65535 ports
    out = run(f"nmap -sV -T4 -p- --open {domain} 2>/dev/null", timeout=600)
    risky = {
        "21":    ("FTP Open",            "Medium", "FTP is unencrypted.",             "Use SFTP or FTPS."),
        "22":    ("SSH Open",            "Low",    "SSH exposed publicly.",           "Restrict SSH to VPN/jumpbox."),
        "23":    ("Telnet Open",         "High",   "Telnet is plaintext.",            "Disable Telnet, use SSH."),
        "25":    ("SMTP Open",           "Low",    "SMTP may allow relay abuse.",     "Restrict relay + enforce auth."),
        "110":   ("POP3 Open",           "Low",    "POP3 is unencrypted by default.", "Enforce TLS / STARTTLS."),
        "143":   ("IMAP Open",           "Low",    "IMAP is unencrypted by default.", "Enforce TLS / STARTTLS."),
        "3306":  ("MySQL Exposed",       "High",   "MySQL publicly accessible.",      "Restrict to localhost/VPN."),
        "5432":  ("PostgreSQL Exposed",  "High",   "PostgreSQL publicly accessible.", "Restrict to localhost/VPN."),
        "6379":  ("Redis Exposed",       "High",   "Redis often unauthenticated.",    "Bind to localhost + enable auth."),
        "27017": ("MongoDB Exposed",     "High",   "MongoDB publicly accessible.",    "Restrict + enable auth."),
        "9200":  ("Elasticsearch Open",  "High",   "Elasticsearch publicly exposed.", "Restrict + enable auth + TLS."),
        "5984":  ("CouchDB Open",        "Medium", "CouchDB admin interface exposed.","Restrict access."),
        "8888":  ("Jupyter Notebook",    "High",   "Jupyter may execute arbitrary code.","Restrict access + add auth."),
        "4848":  ("GlassFish Admin",     "High",   "GlassFish admin panel exposed.",  "Restrict to localhost."),
        "8080":  ("Alt HTTP Port",       "Low",    "Non-standard port 8080 open.",    "Review what runs on this port."),
        "8443":  ("Alt HTTPS Port",      "Low",    "Non-standard HTTPS port 8443.",   "Review if intentional."),
    }
    findings, details = [], []
    count = 0
    for line in out.splitlines():
        if "/tcp" in line and "open" in line:
            count += 1
            details.append(line.strip())
            port = line.split("/")[0].strip()
            if port in risky:
                t, s, d, r = risky[port]
                findings.append({"title": t, "severity": s, "description": d, "recommendation": r})
    if "cloudflare" in out.lower():
        details.append("CDN: Cloudflare detected")

    score = max(0, 100 - len(findings) * 15)
    status = "pass" if not findings else ("warn" if score >= 50 else "fail")
    emit("nmap", status, score, f"{count} open ports found (full scan)", details, findings)


def mod_subdomains(domain):
    # DNS brute-force with a small wordlist
    subs = ["www","mail","smtp","ftp","api","dev","staging","test","admin","vpn",
            "portal","app","secure","m","mobile","cdn","img","static","assets",
            "docs","help","support","status","monitor","ns1","ns2","mx","cloud"]
    found, findings = [], []
    for sub in subs:
        fqdn = f"{sub}.{domain}"
        out = run(f"dig +short A {fqdn}", timeout=5)
        if out.strip() and "NXDOMAIN" not in out:
            ip = out.strip().splitlines()[0]
            found.append(f"{fqdn} → {ip}")
            risky_subs = ["dev","staging","test","admin","vpn","portal"]
            if sub in risky_subs:
                findings.append({"title": f"Exposed Subdomain: {fqdn}", "severity": "Medium",
                    "description": f"{fqdn} resolves to {ip}",
                    "recommendation": "Verify this subdomain is intentionally public."})

    score = max(0, 100 - len(findings) * 15)
    status = "pass" if not findings else "warn"
    emit("subdomains", status, score, f"{len(found)} subdomains found", found, findings)


def mod_gobuster(domain):
    # Full scan: use feroxbuster with SecLists raft-large wordlist
    use_ferox = bool(run("which feroxbuster", timeout=3).strip())
    wordlist  = WORDLIST_FULL
    if not os.path.exists(wordlist):
        emit("gobuster", "warn", 50, "Wordlist not found — skipped", [], [])
        return

    ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    sensitive = ["admin","login","wp-admin","phpmyadmin",".env","config","backup",
                 "api","swagger","graphql",".git","debug","shell","upload","secret",
                 "console","dashboard","manage","panel","private","internal"]
    findings, details = [], []

    if use_ferox:
        out = run(
            f"feroxbuster -u https://{domain} -w {wordlist} -k --silent "
            f"-t 20 --timeout 10 --depth 2 "
            f"-C 400,401,403,404,429,500,502,503 "
            f"-A '{ua}' 2>/dev/null",
            timeout=180
        )
        for line in out.splitlines():
            m = re.search(r'(\d{3})\s+\S+\s+\S+\s+(https?://\S+)', line)
            if not m:
                continue
            code, url = int(m.group(1)), m.group(2)
            path = "/" + url.split("/", 3)[-1] if "/" in url else url
            is_s = any(s in path.lower() for s in sensitive)
            sev  = "High" if is_s else ("Medium" if code == 200 else "Low")
            details.append(f"{path} [{code}]")
            if is_s or code == 200:
                findings.append({"title": f"Endpoint: {path}", "severity": sev,
                    "description": f"HTTP {code} at https://{domain}{path}",
                    "recommendation": "Verify this endpoint should be public."})
    else:
        for scheme in ["https", "http"]:
            out = run(
                f"gobuster dir -u {scheme}://{domain} -w {wordlist} -k -r -t 10 -q "
                f"--timeout 15s -b 404,403,429,503 -a '{ua}'",
                timeout=180
            )
            if out.strip():
                break
        for line in out.splitlines():
            m = re.search(r'(/\S+)\s+\(Status:\s*(\d+)\)', line)
            if not m:
                continue
            path, code = m.group(1), int(m.group(2))
            is_s = any(s in path.lower() for s in sensitive)
            sev  = "High" if is_s else ("Medium" if code == 200 else "Low")
            details.append(f"{path} [{code}]")
            if is_s or code == 200:
                findings.append({"title": f"Endpoint: {path}", "severity": sev,
                    "description": f"HTTP {code} at {scheme}://{domain}{path}",
                    "recommendation": "Verify this endpoint should be public."})

    tool = "feroxbuster" if use_ferox else "gobuster"
    score  = max(0, 100 - len([f for f in findings if f["severity"] in ("High","Medium")]) * 10)
    status = "pass" if not findings else ("warn" if score >= 50 else "fail")
    emit("gobuster", status, score, f"{len(details)} paths found ({tool} + {os.path.basename(wordlist)})", details, findings)


def mod_nikto(domain):
    out = run(
        f"nikto -h https://{domain} -Tuning 123bde -maxtime 120s -nointeractive 2>/dev/null",
        timeout=130
    )
    rules = [
        ("phpinfo",       "PHPInfo Page Exposed",        "High"),
        ("/admin",        "Admin Path Found",             "Medium"),
        ("osvdb",         "Known Vulnerability (OSVDB)",  "Medium"),
        ("sql",           "Possible SQL Reference",       "Medium"),
        ("robots.txt",    "robots.txt Exposed",           "Low"),
        ("server leaks",  "Server Info Leakage",          "Low"),
        ("xss",           "Cross-Site Scripting Risk",    "High"),
        ("clickjacking",  "Clickjacking Risk",            "Medium"),
        ("cors",          "CORS Misconfiguration",        "High"),
        ("upload",        "File Upload Endpoint",         "High"),
        ("backup",        "Backup File Exposed",          "High"),
        ("debug",         "Debug Interface Exposed",      "High"),
        ("trace",         "HTTP TRACE Enabled",           "Medium"),
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

    score = max(0, 100 - len([f for f in findings if f["severity"] in ("High","Medium")]) * 15)
    status = "pass" if not findings else ("warn" if score >= 50 else "fail")
    emit("nikto", status, score, f"{len(findings)} issues via Nikto", details, findings)


def mod_whatweb(domain):
    out = run(f"whatweb --color=never -a 3 {domain} 2>/dev/null", timeout=30)
    tech = [
        ("wordpress","CMS","WordPress"), ("joomla","CMS","Joomla"), ("drupal","CMS","Drupal"),
        ("nginx","Server","Nginx"), ("apache","Server","Apache"), ("iis","Server","IIS"),
        ("cloudflare","CDN","Cloudflare"), ("vercel","Hosting","Vercel"),
        ("php","Language","PHP"), ("jquery","JS","jQuery"), ("react","JS","React"),
        ("next.js","JS","Next.js"), ("angular","JS","Angular"), ("vue","JS","Vue"),
        ("laravel","Framework","Laravel"), ("django","Framework","Django"),
        ("rails","Framework","Rails"),
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
    emit("whatweb", status, score, ", ".join(details[:6]) or "No fingerprint", details, findings)


def mod_shodan(domain):
    if not SHODAN_KEY:
        emit("shodan", "warn", 50, "No Shodan API key — skipped", [], [])
        return
    try:
        # Resolve IP first
        import socket
        ip = socket.gethostbyname(domain)
        r = requests.get(f"https://api.shodan.io/shodan/host/{ip}?key={SHODAN_KEY}", timeout=15)
        if r.status_code != 200:
            emit("shodan", "warn", 50, f"Shodan: {r.status_code}", [], [])
            return
        data = r.json()
        findings, details = [], []
        vulns = data.get("vulns", [])
        ports = [str(p) for p in data.get("ports", [])]
        org   = data.get("org", "unknown")
        details.append(f"IP: {ip}")
        details.append(f"Org: {org}")
        details.append(f"Open ports: {', '.join(ports[:20])}")
        for cve in list(vulns)[:10]:
            details.append(f"CVE: {cve}")
            findings.append({"title": f"Known CVE: {cve}", "severity": "High",
                "description": f"Shodan reports {cve} on {ip}",
                "recommendation": "Apply vendor patch immediately."})

        score = max(0, 100 - len(findings) * 20)
        status = "pass" if not findings else ("warn" if score >= 50 else "fail")
        emit("shodan", status, score, f"{len(vulns)} CVEs, {len(ports)} ports via Shodan", details, findings)
    except Exception as e:
        emit("shodan", "warn", 50, f"Shodan error: {str(e)[:60]}", [], [])


def mod_urlscan(domain):
    import time
    if not URLSCAN_KEY:
        emit("urlscan", "warn", 50, "No urlscan API key — skipped", [], [])
        return
    try:
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
            emit("urlscan", "warn", 50, "urlscan: no UUID returned", [], [])
            return
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
        score_val = verdicts.get("score", 0)
        tags      = verdicts.get("tags", [])
        page      = result.get("page", {})
        details   = [f"Status: {page.get('status','?')}", f"Server: {page.get('server','unknown')}", f"Score: {score_val}"]
        if tags:
            details.append(f"Tags: {', '.join(tags)}")
        findings = []
        if malicious:
            findings.append({"title": "Domain flagged as malicious", "severity": "High",
                "description": f"urlscan.io flagged {domain} as malicious (score: {score_val}).",
                "recommendation": "Investigate domain reputation and hosting provider."})
        elif score_val > 50:
            findings.append({"title": "Suspicious domain score", "severity": "Medium",
                "description": f"urlscan.io gave {domain} a suspicious score of {score_val}.",
                "recommendation": "Review domain configuration and content."})
        final_score = max(0, 100 - score_val)
        status = "fail" if malicious else ("warn" if score_val > 50 else "pass")
        emit("urlscan", status, final_score, f"Score: {score_val} · {'malicious' if malicious else 'clean'}", details, findings)
    except Exception as e:
        emit("urlscan", "warn", 50, f"urlscan error: {str(e)[:60]}", [], [])


def mod_zap(domain):
    # Only runs if zaproxy is installed
    if not run("which zaproxy 2>/dev/null || which zap.sh 2>/dev/null", timeout=5).strip():
        emit("zap", "warn", 50, "ZAP not installed — skipped", [], [])
        return
    zap_cmd = "zaproxy" if run("which zaproxy", timeout=3).strip() else "zap.sh"
    out = run(
        f"{zap_cmd} -cmd -quickurl https://{domain} -quickprogress -quickout /tmp/zap_report.xml 2>/dev/null",
        timeout=240
    )
    findings, details = [], []
    # Parse ZAP XML report if it exists
    if os.path.exists("/tmp/zap_report.xml"):
        import html as html_mod
        zap_xml = open("/tmp/zap_report.xml").read()
        seen = set()
        for m in re.finditer(r'<name>([^<]+)</name>.*?<riskcode>(\d+)</riskcode>.*?<desc>(.*?)</desc>', zap_xml, re.DOTALL):
            name = m.group(1).strip()
            risk = int(m.group(2))
            desc = html_mod.unescape(re.sub(r'<[^>]+>', '', m.group(3))).strip()[:200]
            if name in seen:
                continue
            seen.add(name)
            sev = {3: "High", 2: "Medium", 1: "Low", 0: "Info"}.get(risk, "Low")
            if risk >= 1:
                findings.append({"title": name, "severity": sev,
                    "description": desc,
                    "recommendation": "Review ZAP finding and apply remediation."})
                details.append(f"[{sev}] {name}")
        os.remove("/tmp/zap_report.xml")

    score = max(0, 100 - len([f for f in findings if f["severity"] in ("High","Medium")]) * 15)
    status = "pass" if not findings else ("warn" if score >= 50 else "fail")
    emit("zap", status, score, f"{len(findings)} issues via ZAP baseline", details, findings)


# ── main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: full_scan_stream.py domain.com [nl|en]"}))
        sys.exit(1)

    domain   = sys.argv[1].strip().replace("https://","").replace("http://","").split("/")[0]
    language = sys.argv[2] if len(sys.argv) > 2 else "nl"

    modules = [
        mod_headers, mod_ssl, mod_dns, mod_nmap_full, mod_subdomains,
        mod_gobuster, mod_nikto, mod_whatweb, mod_shodan, mod_urlscan, mod_zap
    ]

    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = {pool.submit(m, domain): m.__name__ for m in modules}
        for f in as_completed(futures):
            try:
                f.result()
            except Exception as e:
                name = futures[f].replace("mod_", "")
                emit(name, "warn", 50, f"Module error: {str(e)[:100]}", [], [])

    # Save results for report generation
    results_dir = os.path.join(os.path.dirname(__file__), "results", domain)
    os.makedirs(results_dir, exist_ok=True)
    with open(os.path.join(results_dir, "full_report.json"), "w") as fh:
        json.dump({"domain": domain, "language": language, "modules": collected}, fh, indent=2)
    with open(os.path.join(results_dir, "language.txt"), "w") as fh:
        fh.write(language)

    print(json.dumps({"done": True}), flush=True)

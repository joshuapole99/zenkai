from jinja2 import Template
from weasyprint import HTML
import json, sys, os, re
from datetime import datetime

if len(sys.argv) < 2:
    print("Usage: python render.py target.com [nl|en]")
    sys.exit(1)

target    = sys.argv[1]
language  = (sys.argv[2] if len(sys.argv) > 2 else "nl").lower()
scan_type = sys.argv[3] if len(sys.argv) > 3 else "full"
if language not in ("nl", "en"):
    language = "nl"

base = f"results/{target}/"

candidate_files = {
    "quick": ["quick_report.json", "report.json"],
    "full":  ["full_report.json",  "report.json"],
}.get(scan_type, ["report.json"])

report_path = None
for f in candidate_files:
    p = base + f
    if os.path.exists(p):
        report_path = p
        break

if not report_path:
    print(f"[!] No report found for {target} (tried: {candidate_files})")
    sys.exit(1)

with open(report_path) as f:
    raw = json.load(f)

if "modules" in raw:
    modules = raw["modules"]
    all_findings = []
    for m in modules:
        for fi in m.get("findings", []):
            fi["module"] = m["module"]
            all_findings.append(fi)
    high   = sum(1 for fi in all_findings if fi.get("severity") == "High")
    medium = sum(1 for fi in all_findings if fi.get("severity") == "Medium")
    low    = sum(1 for fi in all_findings if fi.get("severity") == "Low")
    scores = [m["score"] for m in modules if isinstance(m.get("score"), (int, float))]
    risk_score = round((sum(scores) / len(scores)) / 10) if scores else 5
    data = {
        "domain":       raw.get("domain", target),
        "findings":     all_findings,
        "fingerprints": [],
        "risk_score":   risk_score,
        "summary":      {"high": high, "medium": medium, "low": low, "info": 0, "total": len(all_findings)},
        "date":         datetime.now().strftime("%d %B %Y"),
        "scan_type":    scan_type,
        "modules":      modules,
    }
else:
    data = raw
    data.setdefault("fingerprints", [])
    data.setdefault("findings", [])
    data.setdefault("risk_score", 0)
    data.setdefault("summary", {})
    data["summary"].setdefault("high",   0)
    data["summary"].setdefault("medium", 0)
    data["summary"].setdefault("low",    0)
    data["summary"].setdefault("info",   0)
    data["summary"].setdefault("total",  len(data["findings"]))
    data.setdefault("date", datetime.now().strftime("%d %B %Y"))

# ── NL / EN labels ────────────────────────────────────────────────────────────
LABELS = {
    "nl": {
        "report_title":        "Beveiligingsrapport",
        "confidential":        "Vertrouwelijk",
        "eyebrow":             "Geautomatiseerde domein audit",
        "title_line1":         "Beveiligings-",
        "title_line2":         "rapport.",
        "high_risk":           "Hoog risico",
        "medium":              "Gemiddeld",
        "low_risk":            "Laag risico",
        "total":               "Totaal",
        "risk_score_label":    "RISICOSCORE / 10",
        "footer_left":         "scan.zenkai.nl",
        "footer_right":        "Automatisch gegenereerd — geen penetratietest",
        "section_summary":     "Samenvatting",
        "section_tech":        "Technologie",
        "section_overview":    "Scan Overzicht",
        "section_ports":       "Poortscan",
        "section_findings":    "Bevindingen",
        "chart_title":         "Verdeling bevindingen",
        "bar_high":            "Hoog",
        "bar_medium":          "Medium",
        "bar_low":             "Laag",
        "f_description_label": "Bevinding",
        "f_rec_label":         "Aanbeveling",
        "empty_findings":      "Geen bevindingen gevonden",
        "footer_generated":    "Gegenereerd door Zenkai Scan",
        "footer_score":        "Risicoscore",
        "port_col_port":       "Poort",
        "port_col_proto":      "Protocol",
        "port_col_service":    "Service",
        "port_col_product":    "Product / Banner",
        "port_col_status":     "Status",
        "section_dns":         "DNS Configuratie",
        "section_ssl":         "SSL / TLS Certificaat",
        "section_sub":         "Subdomeinen",
        "dns_col_type":        "Record Type",
        "dns_col_value":       "Waarde",
        "dns_col_status":      "Status",
        "ssl_col_proto":       "Protocol",
        "ssl_col_status":      "Status",
        "ssl_col_issuer":      "Uitgever",
        "ssl_col_expiry":      "Geldig tot",
        "sub_col_subdomain":   "Subdomein",
        "sub_col_ip":          "IP-adres",
        "sub_col_status":      "Status",
        "sub_sensitive_label": "Gevoelig",
        "sub_ok_label":        "OK",
        "sub_more":            "meer subdomeinen niet weergegeven",
        "section_headers":     "Security Headers",
        "hdr_col_name":        "Header",
        "hdr_col_status":      "Status",
        "hdr_col_rec":         "Aanbeveling",
        "hdr_present_title":   "Aanwezige headers",
        "hdr_missing_title":   "Ontbrekende headers",
    },
    "en": {
        "report_title":        "Security Report",
        "confidential":        "Confidential",
        "eyebrow":             "Automated domain audit",
        "title_line1":         "Security",
        "title_line2":         "Report.",
        "high_risk":           "High risk",
        "medium":              "Medium",
        "low_risk":            "Low risk",
        "total":               "Total",
        "risk_score_label":    "RISK SCORE / 10",
        "footer_left":         "scan.zenkai.nl",
        "footer_right":        "Automatically generated — not a penetration test",
        "section_summary":     "Summary",
        "section_tech":        "Technology",
        "section_overview":    "Scan Overview",
        "section_ports":       "Port Scan",
        "section_findings":    "Findings",
        "chart_title":         "Finding distribution",
        "bar_high":            "High",
        "bar_medium":          "Medium",
        "bar_low":             "Low",
        "f_description_label": "Finding",
        "f_rec_label":         "Recommendation",
        "empty_findings":      "No findings detected",
        "footer_generated":    "Generated by Zenkai Scan",
        "footer_score":        "Risk score",
        "port_col_port":       "Port",
        "port_col_proto":      "Protocol",
        "port_col_service":    "Service",
        "port_col_product":    "Product / Banner",
        "port_col_status":     "Status",
        "section_dns":         "DNS Configuration",
        "section_ssl":         "SSL / TLS Certificate",
        "section_sub":         "Subdomains",
        "dns_col_type":        "Record Type",
        "dns_col_value":       "Value",
        "dns_col_status":      "Status",
        "ssl_col_proto":       "Protocol",
        "ssl_col_status":      "Status",
        "ssl_col_issuer":      "Issuer",
        "ssl_col_expiry":      "Valid until",
        "sub_col_subdomain":   "Subdomain",
        "sub_col_ip":          "IP Address",
        "sub_col_status":      "Status",
        "sub_sensitive_label": "Sensitive",
        "sub_ok_label":        "OK",
        "sub_more":            "more subdomains not shown",
        "section_headers":     "Security Headers",
        "hdr_col_name":        "Header",
        "hdr_col_status":      "Status",
        "hdr_col_rec":         "Recommendation",
        "hdr_present_title":   "Present headers",
        "hdr_missing_title":   "Missing headers",
    },
}
data["L"] = LABELS[language]

# ── CVSS mapping ──────────────────────────────────────────────────────────────
CVSS_MAP = {
    "TLS 1.0 Enabled":                   ("7.5", "HIGH",     "CWE-326", "CVE-2011-3389"),
    "TLS 1.1 Enabled":                   ("5.3", "MEDIUM",   "CWE-326", None),
    "Self-Signed Certificate":           ("6.5", "MEDIUM",   "CWE-295", None),
    "Expired SSL Certificate":           ("7.5", "HIGH",     "CWE-298", None),
    "SSL Scan Failed":                   (None,  None,       None,      None),
    "Missing DMARC Record":              ("5.3", "MEDIUM",   "CWE-1294",None),
    "Weak DMARC Policy":                 ("3.7", "LOW",      "CWE-1294",None),
    "Missing SPF Record":                ("5.3", "MEDIUM",   "CWE-1294",None),
    "Missing Strict-Transport-Security": ("6.5", "MEDIUM",   "CWE-319", None),
    "Missing Content-Security-Policy":   ("6.1", "MEDIUM",   "CWE-693", None),
    "Missing X-Frame-Options":           ("4.3", "MEDIUM",   "CWE-1021",None),
    "Missing X-Content-Type-Options":    ("4.3", "MEDIUM",   "CWE-16",  None),
    "Missing Referrer-Policy":           ("3.7", "LOW",      "CWE-116", None),
    "Missing Permissions-Policy":        ("3.7", "LOW",      "CWE-16",  None),
    "Server Version Disclosure":         ("5.3", "MEDIUM",   "CWE-200", None),
    "MySQL Exposed":                     ("9.8", "CRITICAL", "CWE-284", None),
    "PostgreSQL Exposed":                ("9.8", "CRITICAL", "CWE-284", None),
    "Redis Exposed":                     ("9.8", "CRITICAL", "CWE-284", None),
    "MongoDB Exposed":                   ("9.8", "CRITICAL", "CWE-284", None),
    "FTP Open":                          ("7.5", "HIGH",     "CWE-319", None),
    "Telnet Open":                       ("9.8", "HIGH",     "CWE-319", None),
    "SMTP Open":                         ("5.3", "MEDIUM",   "CWE-183", None),
    "PHP Info Page Exposed":             ("7.5", "HIGH",     "CWE-200", None),
    "Outdated PHP Version":              ("6.5", "MEDIUM",   "CWE-1104",None),
    "WordPress Detected":                ("3.7", "LOW",      "CWE-1104",None),
    "Cloudflare WAF Detected":           ("0.0", "INFO",     "N/A",     None),
}


def get_cvss(title):
    if title in CVSS_MAP:
        return CVSS_MAP[title]
    for key, val in CVSS_MAP.items():
        if key and title.lower().startswith(key.lower()[:25]):
            return val
    return (None, None, None, None)


# ── Sort findings by severity: Critical/High → Medium → Low → Info ────────────
_SEV_ORDER = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3, "Info": 4}
data["findings"].sort(key=lambda f: _SEV_ORDER.get(f.get("severity", ""), 5))

for f in data["findings"]:
    cs, cv, cw, cve = get_cvss(f["title"])
    f["cvss_score"]    = cs
    f["cvss_severity"] = cv
    f["cwe"]           = cw
    f["cve"]           = cve

# ── Port scan table ───────────────────────────────────────────────────────────
_PORT_RE  = re.compile(r'^(\d+)/(tcp|udp)\s+(open|closed|filtered)\s+(\S+)(?:\s+(.+))?')
_nmap_mod = next((m for m in data.get("modules", []) if m.get("module") == "nmap"), {})
_ports    = []
for _line in _nmap_mod.get("details", []):
    _pm = _PORT_RE.match(_line.strip())
    if _pm:
        _port, _proto, _pstatus, _svc, _prod = _pm.groups()
        _ports.append({
            "port":     _port,
            "protocol": _proto.upper(),
            "service":  _svc,
            "product":  (_prod or "").strip(),
            "status":   _pstatus,
        })
data["ports_table"] = _ports

_mod_by_name = {m["module"]: m for m in data.get("modules", [])}
# ── DNS table ─────────────────────────────────────────────────────────────────
_dns          = _mod_by_name.get("dns", {})
_dns_details  = _dns.get("details", [])
_dns_findings = _dns.get("findings", [])
_dns_ftitles  = {f["title"] for f in _dns_findings}
_dns_table    = []
for _d in _dns_details:
    if ":" not in _d:
        continue
    _key, _val = _d.split(":", 1)
    _key = _key.strip(); _val = _val.strip()
    if _val.lower() in ("present", "yes"):
        _ds = "pass"
        for _ft in _dns_ftitles:
            if _key.upper() in _ft.upper() and ("weak" in _ft.lower() or "invalid" in _ft.lower()):
                _ds = "warn"; break
    elif _val.lower() in ("missing", "no", "absent", "not found"):
        _ds = "fail"
    else:
        _ds = "warn"
    _dns_table.append({"type": _key, "value": _val, "status": _ds})
for _f in _dns_findings:
    if "Missing" in _f["title"]:
        _rt  = _f["title"].replace("Missing ", "").replace(" Record", "").strip()
        _lbl = "ontbreekt" if language == "nl" else "missing"
        if not any(_d["type"].upper() == _rt.upper() for _d in _dns_table):
            _dns_table.append({"type": _rt, "value": _lbl, "status": "fail"})
data["dns_table"] = _dns_table

# ── SSL certificate table ─────────────────────────────────────────────────────
_ssl         = _mod_by_name.get("ssl", {})
_ssl_details = _ssl.get("details", [])
_ssl_ftitles = {f["title"] for f in _ssl.get("findings", [])}
_ssl_table   = []
_TLS_PROTOS  = [
    ("SSL 2.0", "deprecated"), ("SSL 3.0", "deprecated"),
    ("TLS 1.0", "deprecated"), ("TLS 1.1", "deprecated"),
    ("TLS 1.2", "recommended"), ("TLS 1.3", "recommended"),
]
for _proto, _ptype in _TLS_PROTOS:
    _sup  = any(_proto.lower() in _d.lower() and "supported" in _d.lower()             for _d in _ssl_details)
    _has  = any(_proto in _t                                                            for _t in _ssl_ftitles)
    _nsup = any(_proto.lower() in _d.lower() and ("not " in _d.lower() or "no " in _d.lower()) for _d in _ssl_details)
    if _has and _ptype == "deprecated":
        _slbl = "ACTIEF — DEPRECATED" if language == "nl" else "ACTIVE — DEPRECATED"
        _ssl_table.append({"proto": _proto, "type": _ptype, "status": "fail",  "label": _slbl})
    elif _sup:
        _slbl = "Ondersteund" if language == "nl" else "Supported"
        _ssl_table.append({"proto": _proto, "type": _ptype, "status": "pass",  "label": _slbl})
    elif _nsup:
        _slbl = "Niet actief" if language == "nl" else "Not active"
        _ssl_table.append({"proto": _proto, "type": _ptype, "status": "pass",  "label": _slbl})
_ssl_cert_expiry = _ssl_cert_issuer = ""
for _d in _ssl_details:
    if _d.startswith("Expires:"):
        _ssl_cert_expiry = _d.replace("Expires:", "").strip()
    elif _d.startswith("Issuer:"):
        _iss = _d.replace("Issuer:", "").strip()
        if "CN = " in _iss:
            _ssl_cert_issuer = _iss.split("CN = ")[-1].strip()
        elif "CN=" in _iss:
            _ssl_cert_issuer = _iss.split("CN=")[-1].strip()
        else:
            _ssl_cert_issuer = _iss
data["ssl_table"]       = _ssl_table
data["ssl_cert_expiry"] = _ssl_cert_expiry
data["ssl_cert_issuer"] = _ssl_cert_issuer

# ── Subdomains table ──────────────────────────────────────────────────────────
_sub = _mod_by_name.get("subdomains", {})
_SENSITIVE_KW = {
    "vpn", "staging", "dev", "test", "admin", "internal", "intranet", "backup",
    "db", "database", "ssh", "ftp", "smtp", "panel", "cpanel", "webmail",
    "phpmyadmin", "jenkins", "gitlab", "jira", "confluence", "sonarqube",
    "grafana", "prometheus", "kibana", "elastic", "rustdesk", "rdp", "remote",
    "mgmt", "management", "monitor", "shell", "root",
}
_sens_found = set()
for _f in _sub.get("findings", []):
    if ":" in _f["title"]:
        _sens_found.add(_f["title"].split(": ")[-1].strip().lower())
_sub_table = []
for _d in _sub.get("details", []):
    for _sep in ("→", "->"):
        if _sep in _d:
            _parts   = _d.split(_sep, 1)
            _sdom    = _parts[0].strip()
            _sip     = _parts[1].strip() if len(_parts) > 1 else ""
            _prefix  = _sdom.split(".")[0].lower()
            _is_sens = _sdom.lower() in _sens_found or _prefix in _SENSITIVE_KW
            _sub_table.append({
                "subdomain": _sdom, "ip": _sip,
                "sensitive": _is_sens,
                "status":    "fail" if _is_sens else "pass",
            })
            break
_sub_table.sort(key=lambda x: (0 if x["sensitive"] else 1, x["subdomain"]))
data["sub_table"]        = _sub_table[:30]
data["sub_table_total"]  = len(_sub_table)
data["sub_table_hidden"] = max(0, len(_sub_table) - 30)

# ── Headers table ────────────────────────────────────────────────────────────
_hdr         = _mod_by_name.get("headers", {})
_hdr_present = []
for _d in _hdr.get("details", []):
    if ":" in _d:
        _k, _v = _d.split(":", 1)
        _k = _k.strip(); _v = _v.strip()
        _s = "pass" if _v.lower() in ("present", "yes") else "warn"
        _hdr_present.append({"name": _k, "value": _v, "status": _s})
_hdr_missing = []
for _f in _hdr.get("findings", []):
    _n   = _f["title"].replace("Missing ", "").strip()
    _rec = _f.get("recommendation", "")
    _hdr_missing.append({"name": _n, "recommendation": _rec})
data["headers_present"] = _hdr_present
data["headers_missing"]  = _hdr_missing

# ── Filtered findings (remove findings covered by dedicated sections) ──────────
_COVERED_MODS = {"dns", "ssl", "headers", "nmap", "subdomains"}
data["filtered_findings"] = [
    f for f in data["findings"]
    if f.get("module", "") not in _COVERED_MODS
]
data["language"] = language


# ── Risk gauge ────────────────────────────────────────────────────────────────
SEMICIRCLE_ARC = 251.3
score = data["risk_score"]
data["gauge_dash"]  = round(score / 10 * SEMICIRCLE_ARC, 1)
data["gauge_color"] = "#b83225" if score >= 7.0 else ("#a05c08" if score >= 4.0 else "#1a5e28")

# ── Severity bars ─────────────────────────────────────────────────────────────
max_count = max(data["summary"]["high"], data["summary"]["medium"], data["summary"]["low"], 1)
data["bar_high"]   = round(data["summary"]["high"]   / max_count * 100)
data["bar_medium"] = round(data["summary"]["medium"] / max_count * 100)
data["bar_low"]    = round(data["summary"]["low"]    / max_count * 100)

# ── Summary paragraph (single flowing text) ─────────────────────────────────
high   = data["summary"]["high"]
medium = data["summary"]["medium"]
low    = data["summary"]["low"]
total  = data["summary"]["total"]

if language == "en":
    _sents = [f"Security scan of <strong>{target}</strong>, performed on {data['date']}."]
    if _ports:
        _pl = ", ".join(f"{p['port']}/{p['protocol'].lower()} ({p['service']})" for p in _ports[:4])
        _sents.append(f"{len(_ports)} open port{'s' if len(_ports)!=1 else ''} found — {_pl}.")
    _ssl_issues = [f["title"] for f in _ssl.get("findings", [])]
    if _ssl_issues:
        _sents.append(f"SSL configuration: {'; '.join(_ssl_issues[:2])}.")
    else:
        _sents.append("SSL/TLS configuration meets current standards.")
    _dns_issues = [f["title"] for f in _dns.get("findings", [])]
    if _dns_issues:
        _sents.append(f"DNS: {'; '.join(_dns_issues[:2])}.")
    else:
        _sents.append("DNS configuration correct (SPF, DMARC and CAA present).")
    if _hdr_missing:
        _mn = [h["name"] for h in _hdr_missing[:3]]
        _sents.append(f"{len(_hdr_missing)} HTTP security header{'s' if len(_hdr_missing)!=1 else ''} missing: {', '.join(_mn)}.")
    if data["sub_table_total"] > 0:
        _sc = sum(1 for s in data["sub_table"] if s["sensitive"])
        _sl = f"{data['sub_table_total']} subdomains identified"
        if _sc:
            _sn = [s["subdomain"].split(".")[0] for s in data["sub_table"] if s["sensitive"]][:3]
            _sl += f", {_sc} sensitive ({', '.join(_sn)})"
        _sents.append(_sl + ".")
    if score >= 7.0:   _sents.append(f"Risk score <strong>{score}/10</strong> — immediate action required.")
    elif score >= 4.0: _sents.append(f"Risk score <strong>{score}/10</strong> — timely follow-up recommended.")
    else:              _sents.append(f"Risk score <strong>{score}/10</strong> — no critical issues.")
    data["summary_paragraph"] = " ".join(_sents)
else:
    _sents = [f"Beveiligingsscan van <strong>{target}</strong>, uitgevoerd op {data['date']}."]
    if _ports:
        _pl = ", ".join(f"{p['port']}/{p['protocol'].lower()} ({p['service']})" for p in _ports[:4])
        _sents.append(f"{len(_ports)} open poort{'en' if len(_ports)!=1 else ''} gedetecteerd — {_pl}.")
    _ssl_issues = [f["title"] for f in _ssl.get("findings", [])]
    if _ssl_issues:
        _sents.append(f"SSL-configuratie: {'; '.join(_ssl_issues[:2])}.")
    else:
        _sents.append("SSL/TLS-configuratie voldoet aan de huidige standaard.")
    _dns_issues = [f["title"] for f in _dns.get("findings", [])]
    if _dns_issues:
        _sents.append(f"DNS: {'; '.join(_dns_issues[:2])}.")
    else:
        _sents.append("DNS-configuratie correct (SPF, DMARC en CAA aanwezig).")
    if _hdr_missing:
        _mn = [h["name"] for h in _hdr_missing[:3]]
        _sents.append(f"{len(_hdr_missing)} HTTP security header{'s' if len(_hdr_missing)!=1 else ''} ontbreken: {', '.join(_mn)}.")
    if data["sub_table_total"] > 0:
        _sc = sum(1 for s in data["sub_table"] if s["sensitive"])
        _sl = f"{data['sub_table_total']} subdomeinen geïdentificeerd"
        if _sc:
            _sn = [s["subdomain"].split(".")[0] for s in data["sub_table"] if s["sensitive"]][:3]
            _sl += f", waarvan {_sc} gevoelig ({', '.join(_sn)})"
        _sents.append(_sl + ".")
    if score >= 7.0:   _sents.append(f"Risicoscore <strong>{score}/10</strong> — directe actie vereist.")
    elif score >= 4.0: _sents.append(f"Risicoscore <strong>{score}/10</strong> — tijdige opvolging aanbevolen.")
    else:              _sents.append(f"Risicoscore <strong>{score}/10</strong> — geen kritieke tekortkomingen.")
    data["summary_paragraph"] = " ".join(_sents)

# ── Section numbering ──────────────────────────────────────────────────
_sec = 1
data["sec_summary"]  = f"{_sec:02d}"
_sec += 1
data["sec_tech"]     = f"{_sec:02d}"
if data.get("fingerprints"): _sec += 1
data["sec_overview"] = f"{_sec:02d}"
if data.get("modules"): _sec += 1
data["sec_dns"]      = f"{_sec:02d}"; _sec += (1 if data.get("dns_table")                                 else 0)
data["sec_ssl"]      = f"{_sec:02d}"; _sec += (1 if data.get("ssl_table")                                 else 0)
data["sec_headers"]  = f"{_sec:02d}"; _sec += (1 if data.get("headers_present") or data.get("headers_missing") else 0)
data["sec_ports"]    = f"{_sec:02d}"; _sec += (1 if data.get("ports_table")                               else 0)
data["sec_sub"]      = f"{_sec:02d}"; _sec += (1 if data.get("sub_table")                                 else 0)
data["sec_findings"] = f"{_sec:02d}"

# ── Render ────────────────────────────────────────────────────────────────────
template_path = "template.html"
if not os.path.exists(template_path):
    print("[!] template.html not found")
    sys.exit(1)

with open(template_path) as f:
    template = Template(f.read())

html_content = template.render(**data)

pdf_path = base + "report.pdf"
HTML(string=html_content, base_url=".").write_pdf(pdf_path)

print(f"[+] PDF report created : {pdf_path}")
print(f"[+] Target             : {target}")
print(f"[+] Language           : {language}")
print(f"[+] Score              : {score}/10")
print(f"[+] Findings           : {len(data['findings'])}")
print(f"[+] Open ports         : {len(_ports)}")

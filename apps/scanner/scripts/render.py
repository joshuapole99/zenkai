from jinja2 import Template
from weasyprint import HTML
import json, sys, os
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

# Try scan-type specific report first, fall back to report.json
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

# Normalise: quick/full scan output is {"domain":..., "modules":[...]}
# Full scan report.json from parser is {"findings":[], "risk_score":...}
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
    # Risk score: weighted average of module scores
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
    },
}
data["L"] = LABELS[language]

# ── CVSS mapping ─────────────────────────────────────────────────────────────
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


for f in data["findings"]:
    cs, cv, cw, cve = get_cvss(f["title"])
    f["cvss_score"]    = cs
    f["cvss_severity"] = cv
    f["cwe"]           = cw
    f["cve"]           = cve

# ── Risk gauge ────────────────────────────────────────────────────────────────
SEMICIRCLE_ARC = 251.3
score = data["risk_score"]
data["gauge_dash"]  = round(score / 10 * SEMICIRCLE_ARC, 1)
data["gauge_color"] = "#b83225" if score >= 7.0 else ("#a05c08" if score >= 4.0 else "#1a5e28")

# ── Severity bars ─────────────────────────────────────────────────────────────
max_count = max(data["summary"]["high"], data["summary"]["medium"], data["summary"]["low"], 1)
data["bar_high"]   = round(data["summary"]["high"]   / max_count * 260)
data["bar_medium"] = round(data["summary"]["medium"] / max_count * 260)
data["bar_low"]    = round(data["summary"]["low"]    / max_count * 260)

# ── Executive summary ─────────────────────────────────────────────────────────
high, medium, low, total = (
    data["summary"]["high"], data["summary"]["medium"],
    data["summary"]["low"],  data["summary"]["total"]
)

if language == "en":
    if score >= 7.0:
        posture, urgency = "high risk", "Immediate action is required."
    elif score >= 4.0:
        posture, urgency = "moderate risk", "Timely follow-up is strongly recommended."
    else:
        posture, urgency = "low risk", "No critical issues were detected."

    parts = []
    if high:   parts.append(f"{high} critical finding{'s' if high > 1 else ''}")
    if medium: parts.append(f"{medium} medium-priority finding{'s' if medium > 1 else ''}")
    if low:    parts.append(f"{low} low-priority finding{'s' if low > 1 else ''}")
    finding_line = ", ".join(parts) if parts else "no findings"

    data["executive_summary"] = [
        f"This report presents the results of an automated security scan of <strong>{target}</strong>, "
        f"conducted on {data['date']}. The analysis covers DNS configuration, TLS/SSL settings, "
        f"HTTP security headers, open ports, and exposed paths.",

        f"The scan identified a total of <strong>{total} finding{'s' if total != 1 else ''}</strong>: "
        f"{finding_line}. The overall risk is assessed as <strong>{posture}</strong> "
        f"(score: {score}/10). {urgency}",

        "Findings are sorted by severity. Address high findings first. "
        "Refer to the per-finding recommendations for concrete remediation steps.",
    ]
else:
    if score >= 7.0:
        posture, urgency = "hoog risico", "Onmiddellijke actie is vereist."
    elif score >= 4.0:
        posture, urgency = "matig risico", "Tijdige opvolging wordt sterk aanbevolen."
    else:
        posture, urgency = "laag risico", "Geen kritieke tekortkomingen gedetecteerd."

    parts = []
    if high:   parts.append(f"{high} kritieke bevinding{'en' if high > 1 else ''}")
    if medium: parts.append(f"{medium} met gemiddelde prioriteit")
    if low:    parts.append(f"{low} met lage prioriteit")
    finding_line = ", ".join(parts) if parts else "geen bevindingen"

    data["executive_summary"] = [
        f"Dit rapport bevat de resultaten van een geautomatiseerde beveiligingsscan van <strong>{target}</strong>, "
        f"uitgevoerd op {data['date']}. De analyse betreft DNS-configuratie, TLS/SSL-instellingen, "
        f"HTTP-beveiligingsheaders, open poorten en blootgestelde paden.",

        f"De scan identificeerde in totaal <strong>{total} bevinding{'en' if total != 1 else ''}</strong>: "
        f"{finding_line}. Het risico wordt beoordeeld als <strong>{posture}</strong> "
        f"(score: {score}/10). {urgency}",

        "Bevindingen zijn gesorteerd op risico. Verhelp hoge bevindingen eerst. "
        "Raadpleeg de aanbevelingen per bevinding voor concrete herstelstappen.",
    ]

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

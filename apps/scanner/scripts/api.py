from flask import Flask, request, jsonify, send_file
import subprocess
import os
import re
import json
import base64
import resend

app = Flask(__name__)

API_KEY        = os.environ.get("ZENKAI_API_KEY", "verander-dit")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
SCRIPT_DIR     = os.path.dirname(os.path.abspath(__file__))

DOMAIN_RE = re.compile(r'^[a-zA-Z0-9][a-zA-Z0-9\-\.]+[a-zA-Z0-9]$')


def clean_domain(raw: str) -> str:
    return raw.strip().replace("https://", "").replace("http://", "").split("/")[0].lower()


def valid_language(lang: str) -> str:
    lang = (lang or "nl").lower()
    return lang if lang in ("nl", "en") else "nl"


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/scan", methods=["POST"])
def scan():
    key = request.headers.get("X-API-Key")
    if key != API_KEY:
        return jsonify({"error": "Unauthorized"}), 401

    data     = request.json or {}
    domain   = clean_domain(data.get("domain", ""))
    email    = data.get("email", "").strip()
    language = valid_language(data.get("language", "nl"))

    if not domain or not email:
        return jsonify({"error": "domain and email required"}), 400

    if not DOMAIN_RE.match(domain):
        return jsonify({"error": "Invalid domain"}), 400

    result = subprocess.run(
        ["bash", f"{SCRIPT_DIR}/run.sh", domain],
        capture_output=True, text=True, timeout=300,
        cwd=SCRIPT_DIR
    )

    pdf_path  = f"{SCRIPT_DIR}/results/{domain}/report.pdf"
    json_path = f"{SCRIPT_DIR}/results/{domain}/report.json"

    if not os.path.exists(pdf_path):
        return jsonify({"error": "Scan failed", "log": result.stdout}), 500

    # Re-render with chosen language
    subprocess.run(
        ["python3", f"{SCRIPT_DIR}/render.py", domain, language],
        capture_output=True, text=True, cwd=SCRIPT_DIR
    )

    with open(json_path) as f:
        report = json.load(f)

    score    = report.get("risk_score", 0)
    findings = report.get("summary", {}).get("total", 0)

    resend.api_key = RESEND_API_KEY

    with open(pdf_path, "rb") as f:
        pdf_bytes = base64.b64encode(f.read()).decode()

    resend.Emails.send({
        "from": "scan@zenkai.nl",
        "to": email,
        "subject": f"Jouw Zenkai Security Rapport — {domain}",
        "html": f"""
        <h2>Jouw beveiligingsrapport is klaar</h2>
        <p>Domein: <strong>{domain}</strong></p>
        <p>Risicoscore: <strong>{score}/10</strong></p>
        <p>Totaal bevindingen: <strong>{findings}</strong></p>
        <p>Het volledige rapport vind je als bijlage.</p>
        <br>
        <p>Zenkai Scan — scan.zenkai.nl</p>
        """,
        "attachments": [{
            "filename": f"zenkai-rapport-{domain}.pdf",
            "content": pdf_bytes
        }]
    })

    return jsonify({"status": "success", "domain": domain, "score": score, "findings": findings})


@app.route("/quick-scan", methods=["POST"])
def quick_scan_stream():
    key = request.headers.get("X-API-Key")
    if key != API_KEY:
        return jsonify({"error": "Unauthorized"}), 401

    data     = request.json or {}
    domain   = clean_domain(data.get("domain", ""))
    language = valid_language(data.get("language", "nl"))

    if not domain:
        return jsonify({"error": "domain required"}), 400

    if not DOMAIN_RE.match(domain):
        return jsonify({"error": "Invalid domain"}), 400

    # Save language preference for report generation
    results_dir = os.path.join(SCRIPT_DIR, "results", domain)
    os.makedirs(results_dir, exist_ok=True)
    with open(os.path.join(results_dir, "language.txt"), "w") as f:
        f.write(language)

    script = os.path.join(SCRIPT_DIR, "quick_scan_stream.py")

    def generate():
        proc = subprocess.Popen(
            ["python3", script, domain],
            stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
            text=True, cwd=SCRIPT_DIR
        )
        try:
            for line in iter(proc.stdout.readline, ""):
                line = line.strip()
                if line:
                    yield line + "\n"
        finally:
            proc.wait()

    return app.response_class(
        generate(),
        mimetype="text/plain",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


@app.route("/report/<path:domain>", methods=["GET"])
def get_report(domain):
    key = request.headers.get("X-API-Key")
    if key != API_KEY:
        return jsonify({"error": "Unauthorized"}), 401

    domain = re.sub(r'[^a-zA-Z0-9\-\.]', '', domain)
    if not domain:
        return jsonify({"error": "Invalid domain"}), 400

    json_path = os.path.join(SCRIPT_DIR, "results", domain, "report.json")
    if not os.path.exists(json_path):
        return jsonify({"error": "No report found for this domain"}), 404

    with open(json_path) as f:
        return jsonify(json.load(f))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

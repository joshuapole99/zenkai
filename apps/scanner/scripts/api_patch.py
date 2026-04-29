
@app.route("/quick-scan", methods=["POST"])
def quick_scan_stream():
    key = request.headers.get("X-API-Key")
    if key != API_KEY:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json or {}
    domain = data.get("domain", "").strip()
    if not domain:
        return jsonify({"error": "domain required"}), 400

    # Strip protocol/path
    domain = domain.lstrip("https://").lstrip("http://").split("/")[0]

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
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )

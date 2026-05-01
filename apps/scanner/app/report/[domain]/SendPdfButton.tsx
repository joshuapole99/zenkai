"use client";
import { useState } from "react";

export function SendPdfButton({
  domain,
  defaultEmail,
  scanType,
}: {
  domain: string;
  defaultEmail: string;
  scanType: string;
}) {
  const [email, setEmail]   = useState(defaultEmail);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function send() {
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, email, scan_type: scanType }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("sent");
      } else {
        setErrMsg(data.error ?? "Onbekende fout");
        setStatus("error");
      }
    } catch (e) {
      setErrMsg(String(e));
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px",
        color: "#16A34A", margin: 0,
      }}>
        ✓ PDF verstuurd naar {email}
      </p>
    );
  }

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={status === "loading"}
        style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px",
          border: "1px solid rgba(15,14,14,0.2)", padding: "9px 14px",
          background: "#fff", color: "#0F0E0E", minWidth: "230px",
          outline: "none",
        }}
      />
      <button
        onClick={send}
        disabled={status === "loading"}
        style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px",
          fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
          background: "#0284C7", color: "#fff", border: "none",
          padding: "10px 20px", cursor: status === "loading" ? "wait" : "pointer",
          opacity: status === "loading" ? 0.6 : 1,
        }}
      >
        {status === "loading" ? "Bezig…" : "Stuur PDF ✉"}
      </button>
      {status === "error" && (
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px",
          color: "#DC2626",
        }}>
          {errMsg}
        </span>
      )}
    </div>
  );
}

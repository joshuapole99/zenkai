"use client";

import { useState } from "react";

interface GenerateResult {
  domain: string;
  token: string;
  expires_at: string;
  dns_record: string;
  well_known_url: string;
  well_known_content: string;
}

export default function VerifyDomainPage() {
  const [domain, setDomain]       = useState("");
  const [info, setInfo]           = useState<GenerateResult | null>(null);
  const [generating, setGen]      = useState(false);
  const [checking, setChecking]   = useState(false);
  const [result, setResult]       = useState<{ verified: boolean; method?: string } | null>(null);
  const [error, setError]         = useState("");

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setGen(true); setError(""); setInfo(null); setResult(null);
    try {
      const res = await fetch("/api/verify-domain/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json() as GenerateResult & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Mislukt");
      setInfo(data);
    } catch (e) { setError((e as Error).message); }
    finally { setGen(false); }
  }

  async function check() {
    if (!info) return;
    setChecking(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/verify-domain/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: info.domain }),
      });
      const data = await res.json() as { verified: boolean; method?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Check mislukt");
      setResult(data);
    } catch (e) { setError((e as Error).message); }
    finally { setChecking(false); }
  }

  const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono',monospace" };

  return (
    <div style={{ ...mono, maxWidth: "640px", margin: "0 auto", padding: "48px 24px 80px" }}>
      <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900, fontSize: "2rem", letterSpacing: "-0.04em", marginBottom: "8px" }}>
        Domein verifiëren
      </h1>
      <p style={{ fontSize: "12px", color: "rgba(15,14,14,0.4)", marginBottom: "32px" }}>
        Beschikbaar voor Starter en Pro — token verloopt na 1 uur
      </p>

      <form onSubmit={generate} style={{ display: "flex", gap: 0, marginBottom: "32px" }}>
        <input
          type="text"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder="example.com"
          disabled={generating}
          style={{ flex: 1, padding: "12px 14px", border: "1px solid rgba(15,14,14,0.18)", borderRight: "none", fontSize: "14px", ...mono, outline: "none" }}
        />
        <button
          type="submit"
          disabled={generating || !domain.trim()}
          style={{ padding: "12px 20px", background: "#0284C7", color: "#fff", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600, ...mono, whiteSpace: "nowrap" }}
        >
          {generating ? "..." : "Token aanvragen"}
        </button>
      </form>

      {error && (
        <p style={{ fontSize: "12px", color: "#DC2626", marginBottom: "24px" }}>✗ {error}</p>
      )}

      {info && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ padding: "20px", border: "1px solid rgba(15,14,14,0.1)", background: "rgba(15,14,14,0.02)" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.15em", color: "rgba(15,14,14,0.35)", textTransform: "uppercase", margin: "0 0 12px" }}>
              Methode 1 — DNS TXT record
            </p>
            <p style={{ fontSize: "11px", color: "rgba(15,14,14,0.5)", margin: "0 0 8px" }}>
              Voeg het volgende DNS TXT record toe aan jouw domein:
            </p>
            <code style={{ display: "block", fontSize: "11px", background: "#0F0E0E", color: "#F5F3EC", padding: "12px 14px", wordBreak: "break-all" }}>
              {info.dns_record}
            </code>
          </div>

          <div style={{ padding: "20px", border: "1px solid rgba(15,14,14,0.1)", background: "rgba(15,14,14,0.02)" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.15em", color: "rgba(15,14,14,0.35)", textTransform: "uppercase", margin: "0 0 12px" }}>
              Methode 2 — Well-known bestand (Vercel / Netlify)
            </p>
            <p style={{ fontSize: "11px", color: "rgba(15,14,14,0.5)", margin: "0 0 8px" }}>
              Publiceer het volgende JSON-bestand op:{" "}
              <code style={{ background: "rgba(15,14,14,0.06)", padding: "2px 6px" }}>{info.well_known_url}</code>
            </p>
            <code style={{ display: "block", fontSize: "11px", background: "#0F0E0E", color: "#F5F3EC", padding: "12px 14px" }}>
              {info.well_known_content}
            </code>
          </div>

          <p style={{ fontSize: "11px", color: "#D97706", margin: 0 }}>
            ⚠ Token verloopt op {new Date(info.expires_at).toLocaleTimeString("nl-NL")}
          </p>

          <button
            onClick={check}
            disabled={checking}
            style={{ padding: "12px 24px", background: "#0F0E0E", color: "#fff", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600, ...mono, alignSelf: "flex-start" }}
          >
            {checking ? "Controleren..." : "Verificatie controleren →"}
          </button>

          {result && (
            <div style={{ padding: "16px 20px", border: `1px solid ${result.verified ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.3)"}`, background: result.verified ? "rgba(22,163,74,0.04)" : "rgba(220,38,38,0.04)" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: result.verified ? "#16A34A" : "#DC2626", margin: "0 0 4px" }}>
                {result.verified ? `✓ Domein geverifieerd via ${result.method}` : "✗ Verificatie mislukt — record nog niet gevonden"}
              </p>
              {!result.verified && (
                <p style={{ fontSize: "11px", color: "rgba(15,14,14,0.45)", margin: 0 }}>
                  DNS-wijzigingen kunnen tot 10 minuten duren. Probeer het opnieuw.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
import { getBrowserClient } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Wachtwoorden komen niet overeen."); return; }
    if (password.length < 8)  { setError("Minimaal 8 tekens."); return; }
    setError("");
    setLoading(true);
    const { error } = await getBrowserClient().auth.updateUser({ password });
    setLoading(false);
    if (error) setError(error.message);
    else setDone(true);
  }

  const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };
  const inp: React.CSSProperties  = {
    ...mono, width: "100%", padding: "12px 16px",
    background: "#1a1918", border: "1px solid rgba(245,243,236,0.12)",
    borderRadius: 6, color: "#F5F3EC", fontSize: 14, outline: "none",
    boxSizing: "border-box", marginBottom: 12,
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F0E0E" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: "0 24px" }}>
        <p style={{ ...mono, fontSize: 11, color: "rgba(245,243,236,0.4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>
          Zenkai Scanner
        </p>

        {done ? (
          <div>
            <h1 style={{ ...mono, fontSize: 22, color: "#F5F3EC", marginBottom: 12 }}>Wachtwoord ingesteld</h1>
            <p style={{ ...mono, fontSize: 13, color: "rgba(245,243,236,0.5)", marginBottom: 24, lineHeight: 1.6 }}>
              Je kunt nu inloggen met je e-mail en wachtwoord.
            </p>
            <a href="/scan" style={{ ...mono, display: "block", textAlign: "center", padding: "12px 0", background: "#0284C7", color: "#fff", borderRadius: 6, fontSize: 14, textDecoration: "none" }}>
              Ga naar scanner →
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1 style={{ ...mono, fontSize: 22, color: "#F5F3EC", marginBottom: 28 }}>Nieuw wachtwoord</h1>

            <label style={{ ...mono, fontSize: 11, color: "rgba(245,243,236,0.4)", display: "block", marginBottom: 8 }}>Wachtwoord</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Minimaal 8 tekens" style={inp} />

            <label style={{ ...mono, fontSize: 11, color: "rgba(245,243,236,0.4)", display: "block", marginBottom: 8 }}>Bevestig wachtwoord</label>
            <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Herhaal wachtwoord" style={inp} />

            {error && <p style={{ ...mono, fontSize: 12, color: "#ef4444", marginBottom: 12 }}>{error}</p>}

            <button type="submit" disabled={loading}
              style={{ ...mono, width: "100%", padding: "12px 0", background: "#0284C7", color: "#fff", border: "none", borderRadius: 6, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1 }}>
              {loading ? "Opslaan..." : "Sla wachtwoord op →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

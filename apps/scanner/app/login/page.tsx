"use client";
import { useState } from "react";
import { getBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode]       = useState<"login" | "reset">("login");
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await getBrowserClient().auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/scan";
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await getBrowserClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/api/auth/callback?next=/reset-password`,
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };
  const inp: React.CSSProperties  = {
    ...mono, width: "100%", padding: "12px 16px",
    background: "#1a1918", border: "1px solid rgba(245,243,236,0.12)",
    borderRadius: 6, color: "#F5F3EC", fontSize: 14, outline: "none",
    boxSizing: "border-box", marginBottom: 12,
  };
  const btn: React.CSSProperties = {
    ...mono, width: "100%", padding: "12px 0",
    background: "#0284C7", color: "#fff", border: "none",
    borderRadius: 6, fontSize: 14, cursor: "pointer", letterSpacing: 0.5,
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F0E0E" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: "0 24px" }}>
        <p style={{ ...mono, fontSize: 11, color: "rgba(245,243,236,0.4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>
          Zenkai Scanner
        </p>

        {sent ? (
          <div>
            <h1 style={{ ...mono, fontSize: 22, color: "#F5F3EC", marginBottom: 12 }}>Check je inbox</h1>
            <p style={{ ...mono, fontSize: 13, color: "rgba(245,243,236,0.5)", lineHeight: 1.6 }}>
              Reset link verstuurd naar <strong style={{ color: "#F5F3EC" }}>{email}</strong>.
            </p>
          </div>
        ) : mode === "login" ? (
          <form onSubmit={handleLogin}>
            <h1 style={{ ...mono, fontSize: 22, color: "#F5F3EC", marginBottom: 28 }}>Inloggen</h1>

            <label style={{ ...mono, fontSize: 11, color: "rgba(245,243,236,0.4)", display: "block", marginBottom: 8 }}>E-mailadres</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="jou@bedrijf.nl" style={inp} />

            <label style={{ ...mono, fontSize: 11, color: "rgba(245,243,236,0.4)", display: "block", marginBottom: 8 }}>Wachtwoord</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" style={inp} />

            {error && <p style={{ ...mono, fontSize: 12, color: "#ef4444", marginBottom: 12 }}>{error}</p>}

            <button type="submit" disabled={loading} style={{ ...btn, opacity: loading ? 0.5 : 1, marginBottom: 16 }}>
              {loading ? "Bezig..." : "Inloggen →"}
            </button>

            <button type="button" onClick={() => { setMode("reset"); setError(""); }}
              style={{ ...mono, background: "none", border: "none", color: "rgba(245,243,236,0.4)", fontSize: 12, cursor: "pointer", padding: 0 }}>
              Wachtwoord vergeten?
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <h1 style={{ ...mono, fontSize: 22, color: "#F5F3EC", marginBottom: 8 }}>Wachtwoord resetten</h1>
            <p style={{ ...mono, fontSize: 13, color: "rgba(245,243,236,0.4)", marginBottom: 28 }}>
              We sturen een reset link naar je e-mail.
            </p>

            <label style={{ ...mono, fontSize: 11, color: "rgba(245,243,236,0.4)", display: "block", marginBottom: 8 }}>E-mailadres</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="jou@bedrijf.nl" style={inp} />

            {error && <p style={{ ...mono, fontSize: 12, color: "#ef4444", marginBottom: 12 }}>{error}</p>}

            <button type="submit" disabled={loading} style={{ ...btn, opacity: loading ? 0.5 : 1, marginBottom: 16 }}>
              {loading ? "Versturen..." : "Stuur reset link →"}
            </button>

            <button type="button" onClick={() => { setMode("login"); setError(""); }}
              style={{ ...mono, background: "none", border: "none", color: "rgba(245,243,236,0.4)", fontSize: 12, cursor: "pointer", padding: 0 }}>
              ← Terug naar inloggen
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

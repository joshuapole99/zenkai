"use client";
import { useState } from "react";
import { getBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail]   = useState("");
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const sb = getBrowserClient();
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

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
              We hebben een login link gestuurd naar <strong style={{ color: "#F5F3EC" }}>{email}</strong>.
              Klik de link om in te loggen.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1 style={{ ...mono, fontSize: 22, color: "#F5F3EC", marginBottom: 8 }}>Inloggen</h1>
            <p style={{ ...mono, fontSize: 13, color: "rgba(245,243,236,0.4)", marginBottom: 32 }}>
              We sturen je een magic link — geen wachtwoord nodig.
            </p>

            <label style={{ ...mono, fontSize: 11, color: "rgba(245,243,236,0.4)", display: "block", marginBottom: 8 }}>
              E-mailadres
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jou@bedrijf.nl"
              style={{
                ...mono,
                width: "100%",
                padding: "12px 16px",
                background: "#1a1918",
                border: "1px solid rgba(245,243,236,0.12)",
                borderRadius: 6,
                color: "#F5F3EC",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 16,
              }}
            />

            {error && (
              <p style={{ ...mono, fontSize: 12, color: "#ef4444", marginBottom: 12 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...mono,
                width: "100%",
                padding: "12px 0",
                background: loading ? "rgba(2,132,199,0.5)" : "#0284C7",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 14,
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: 0.5,
              }}
            >
              {loading ? "Versturen..." : "Stuur login link →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

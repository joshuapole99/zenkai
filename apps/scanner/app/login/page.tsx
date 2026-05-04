"use client";
import { useState } from "react";
import { getBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail]   = useState("");
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogle() {
    setGoogleLoading(true);
    const sb = getBrowserClient();
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/api/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const sb = getBrowserClient();
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/api/auth/callback` },
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
          <>
            <h1 style={{ ...mono, fontSize: 22, color: "#F5F3EC", marginBottom: 8 }}>Inloggen</h1>
            <p style={{ ...mono, fontSize: 13, color: "rgba(245,243,236,0.4)", marginBottom: 28 }}>
              Kies een loginmethode.
            </p>

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              style={{
                ...mono,
                width: "100%",
                padding: "12px 0",
                background: googleLoading ? "rgba(255,255,255,0.1)" : "#fff",
                color: "#0F0E0E",
                border: "none",
                borderRadius: 6,
                fontSize: 14,
                cursor: googleLoading ? "not-allowed" : "pointer",
                letterSpacing: 0.5,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              {googleLoading ? "Bezig..." : "Inloggen met Google"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(245,243,236,0.1)" }} />
              <span style={{ ...mono, fontSize: 11, color: "rgba(245,243,236,0.3)" }}>of</span>
              <div style={{ flex: 1, height: 1, background: "rgba(245,243,236,0.1)" }} />
            </div>

            {/* Magic link */}
            <form onSubmit={handleSubmit}>
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
          </>
        )}
      </div>
    </div>
  );
}

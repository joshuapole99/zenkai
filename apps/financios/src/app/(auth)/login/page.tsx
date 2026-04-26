"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "De inloglink is ongeldig.",
  expired: "De inloglink is verlopen. Vraag een nieuwe aan.",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    const res = await fetch("/api/auth/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setFormError(data.error ?? "Er ging iets mis. Probeer opnieuw.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Check je email</h2>
          <p className="text-muted text-sm leading-relaxed">
            We hebben een inloglink gestuurd naar <span className="text-foreground font-medium">{email}</span>. De link is 15 minuten geldig.
          </p>
          <button
            onClick={() => { setSent(false); setEmail(""); }}
            className="mt-6 text-sm text-muted hover:text-foreground transition-colors"
          >
            Andere email gebruiken
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Link href="/" className="text-xl font-bold text-foreground tracking-tight">
          Financios
        </Link>
        <h1 className="text-2xl font-bold text-foreground mt-6 mb-2">Inloggen</h1>
        <p className="text-muted text-sm">We sturen je een inloglink per email — geen wachtwoord nodig.</p>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-xl px-4 py-3 mb-4 text-sm text-danger">
          {ERROR_MESSAGES[error] ?? "Er is een fout opgetreden."}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-card">
        <label className="block text-sm font-medium text-foreground mb-2">
          Emailadres
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="jij@voorbeeld.nl"
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mb-4 text-sm"
        />

        {formError && (
          <p className="text-danger text-sm mb-4">{formError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98] text-sm"
        >
          {loading ? "Versturen…" : "Stuur inloglink"}
        </button>
      </form>

      <p className="text-center text-xs text-muted mt-4">
        Nog geen account? Je account wordt automatisch aangemaakt bij je eerste login.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

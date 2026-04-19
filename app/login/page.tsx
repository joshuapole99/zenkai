"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
      router.push("/dashboard");
    } catch {
      setError("No connection. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#0a0a0a" }}
    >
      <div className="w-full max-w-sm">

        <div className="mb-10 text-center">
          <Link href="/"><Image src="/logo.png" alt="Zenkai" width={150} height={50} className="h-10 w-auto mx-auto" /></Link>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <h1 className="text-xl font-black text-white mb-1">Sign in</h1>
          <p className="text-sm text-gray-600 mb-7">Welcome back. Your arc continues.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email" htmlFor="email">
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-700 outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,107,53,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </Field>

            <Field label="Password" htmlFor="password">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Your password"
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-700 outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,107,53,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </Field>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-black text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 mt-2"
              style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-5">
          No account yet?{" "}
          <Link href="/signup" className="text-gray-300 hover:text-white transition-colors font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5" htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs rounded-lg px-3 py-2"
      style={{ color: "#f87171", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}
    >
      {children}
    </p>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

function PowerBar() {
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => {
      setLevel((prev) => {
        if (prev >= 9700) { clearInterval(timer); return 9700; }
        return prev + Math.floor(Math.random() * 120) + 40;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [started]);

  return (
    <div ref={ref} className="w-full max-w-sm mx-auto mt-8">
      <div className="flex justify-between text-xs mb-2">
        <span className="font-bold tracking-widest uppercase text-gray-500">Power Level</span>
        <span className="font-mono font-bold" style={{ color: "#FF6B35" }}>{level.toLocaleString("en-US")}</span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-75"
          style={{
            width: `${Math.min((level / 9700) * 100, 97)}%`,
            background: "linear-gradient(90deg, #FF6B35, #7C3AED)",
            boxShadow: "0 0 8px rgba(255,107,53,0.5)",
          }}
        />
      </div>
    </div>
  );
}

function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're on the list. Your arc starts now.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("No connection. Try again later.");
    }
  }

  if (status === "success") {
    return (
      <div
        className="text-center py-6 rounded-xl"
        style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.2)" }}
      >
        <p className="font-black text-lg" style={{ color: "#FF6B35" }}>{message}</p>
        <p className="text-sm text-gray-500 mt-1">We&apos;ll reach out when Zenkai goes live.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex ${compact ? "flex-col sm:flex-row" : "flex-col"} gap-3 w-full`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className={`flex-1 px-4 py-3 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all ${compact ? "text-sm" : "text-base"}`}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,107,53,0.5)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 rounded-xl font-black text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 whitespace-nowrap text-sm"
        style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
      >
        {status === "loading" ? "Joining..." : "Start Your Zenkai"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400 mt-1">{message}</p>
      )}
    </form>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "#0a0a0a" }}>

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(10,10,10,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span className="font-black text-xl tracking-tight gradient-text">ZENKAI</span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        {/* Ambient glows */}
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,107,53,0.07) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-40 right-0 w-72 h-72 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)" }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-8"
            style={{
              background: "rgba(255,107,53,0.08)",
              border: "1px solid rgba(255,107,53,0.2)",
              color: "#FF6B35",
            }}
          >
            Anime Fitness RPG
          </div>

          <h1 className="text-5xl sm:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            <span className="gradient-text">Every setback</span>
            <br />
            <span className="text-white">makes you stronger.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Train in real life. Level up like an anime character.{" "}
            <span className="text-white font-medium">Miss a week?</span>{" "}
            That&apos;s when your{" "}
            <span style={{ color: "#FF6B35" }} className="font-bold">Zenkai Boost</span> begins.
          </p>

          <div className="max-w-md mx-auto mb-4">
            <WaitlistForm compact />
            <p className="text-xs text-gray-600 mt-3">No spam. No credit card. 7 days free.</p>
          </div>

          <PowerBar />

          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-600">
            <span>1,200+ on the waitlist</span>
            <span className="w-px h-4" style={{ background: "rgba(255,255,255,0.1)" }} />
            <span>Free to start</span>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="py-24 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#FF6B35" }}>
              The problem
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white">Sound familiar?</h2>
          </div>

          <div className="space-y-4">
            {[
              "You start fired up — then life gets in the way. You miss a day. Then a week. Somehow that becomes your fault.",
              "Other apps punish you for stopping. Streak gone. Badges wiped. Progress erased. Like you already lost.",
              "You feel guilty, quit completely — and the app collects dust. The cycle repeats.",
            ].map((text, i) => (
              <div
                key={i}
                className="flex gap-5 items-start p-5 rounded-xl"
                style={{
                  background: "rgba(255,107,53,0.04)",
                  border: "1px solid rgba(255,107,53,0.1)",
                  borderLeft: "3px solid rgba(255,107,53,0.4)",
                }}
              >
                <span
                  className="text-xs font-black mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,107,53,0.15)", color: "#FF6B35" }}
                >
                  {i + 1}
                </span>
                <p className="text-gray-300 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-2xl sm:text-3xl font-black text-white">
              Zenkai flips the script.{" "}
              <span className="gradient-text">Completely.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY ZENKAI ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#7C3AED" }}>
              Why Zenkai
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Built for real people
            </h2>
            <p className="text-gray-500 mt-4">Who know that life gets in the way.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                label: "01",
                title: "Zenkai Boost",
                desc: "Miss a few days? You get a special comeback quest — just like Saiyans after every defeat. Your setback becomes your power.",
                accent: "#FF6B35",
              },
              {
                label: "02",
                title: "Home workouts",
                desc: "No gym needed. Your room is your dojo. Built for small spaces, zero equipment, any schedule.",
                accent: "#7C3AED",
              },
              {
                label: "03",
                title: "You are the main character",
                desc: "Your anime character levels up with your real progress. Every workout is XP. Every comeback is a power-up.",
                accent: "#FF6B35",
              },
            ].map(({ label, title, desc, accent }) => (
              <div
                key={title}
                className="p-7 rounded-2xl flex flex-col gap-4 transition-all duration-200 hover:translate-y-[-2px]"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span
                  className="text-xs font-black tracking-widest"
                  style={{ color: accent }}
                >
                  {label}
                </span>
                <h3 className="text-lg font-black text-white">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#FF6B35" }}>
              How it works
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              3 steps to your comeback
            </h2>
          </div>

          <div className="space-y-0">
            {[
              {
                step: "01",
                title: "Create your character",
                desc: "Pick your class, name your character, set your starting level. You decide who you become.",
              },
              {
                step: "02",
                title: "Complete daily quests",
                desc: "Home workouts — no equipment needed. 3 new challenges every day, scaled to your level.",
              },
              {
                step: "03",
                title: "Watch your character grow",
                desc: "As you train, your character evolves. Fall off? No punishment — your Zenkai Boost gives you bonus XP when you return.",
              },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="flex gap-6 items-start relative">
                {i < 2 && (
                  <div
                    className="absolute left-[22px] top-14 bottom-0 w-px"
                    style={{ background: "linear-gradient(to bottom, rgba(255,107,53,0.3), transparent)" }}
                  />
                )}
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-black text-xs z-10"
                  style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)", color: "#fff" }}
                >
                  {step}
                </div>
                <div className="pb-12">
                  <h3 className="text-lg font-black text-white mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#7C3AED" }}>
              Pricing
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Simple. Fair. Affordable.
            </h2>
            <p className="text-gray-500 mt-4">Less than a cup of coffee a week.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Free */}
            <div
              className="p-8 rounded-2xl flex flex-col gap-5"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Free trial</p>
                <p className="text-4xl font-black text-white">€0</p>
                <p className="text-sm text-gray-600 mt-1">7 days, full access</p>
              </div>
              <ul className="space-y-2.5 flex-1 text-sm text-gray-400">
                {[
                  "Create your character",
                  "7 days of daily quests",
                  "Basic workout library",
                  "Progress tracker",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span style={{ color: "#FF6B35" }}>—</span> {item}
                  </li>
                ))}
              </ul>
              <a
                href="#waitlist"
                className="block text-center py-3 px-6 rounded-xl font-bold text-white text-sm transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Start for free
              </a>
            </div>

            {/* Pro */}
            <div
              className="p-8 rounded-2xl flex flex-col gap-5 relative overflow-hidden"
              style={{
                background: "rgba(124,58,237,0.06)",
                border: "1px solid rgba(124,58,237,0.3)",
              }}
            >
              <div
                className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black"
                style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)", color: "#fff" }}
              >
                POPULAR
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#7C3AED" }}>
                  Full Power
                </p>
                <div className="flex items-baseline gap-1">
                  <p className="text-4xl font-black text-white">€4.99</p>
                  <p className="text-gray-500 text-sm">/month</p>
                </div>
                <p className="text-sm text-gray-600 mt-1">Billed monthly, cancel anytime</p>
              </div>
              <ul className="space-y-2.5 flex-1 text-sm text-gray-300">
                {[
                  "Everything in Free",
                  "Full character system",
                  "Zenkai Boost quests",
                  "Unlimited workout history",
                  "Exclusive character skins",
                  "Priority new features",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span style={{ color: "#7C3AED" }}>—</span> {item}
                  </li>
                ))}
              </ul>
              <a
                href="#waitlist"
                className="block text-center py-3 px-6 rounded-xl font-black text-white transition-all hover:opacity-90 text-sm"
                style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
              >
                Start Your Zenkai
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAITLIST ── */}
      <section id="waitlist" className="py-24 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#FF6B35" }}>
            Join the waitlist
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            Be first in line
          </h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Zenkai is coming. Get early access — including an exclusive{" "}
            <span style={{ color: "#FF6B35" }} className="font-bold">Founding Member skin</span>{" "}
            for those who show up early.
          </p>

          <div
            className="p-7 rounded-2xl"
            style={{
              background: "rgba(255,107,53,0.03)",
              border: "1px solid rgba(255,107,53,0.12)",
            }}
          >
            <WaitlistForm />
            <div className="mt-5 flex items-center justify-center gap-5 text-xs text-gray-600 flex-wrap">
              <span>No spam</span>
              <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
              <span>7 days free</span>
              <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
              <span>No credit card</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-black gradient-text tracking-tight">ZENKAI</span>
          <p className="text-xs text-gray-700 text-center">
            © 2026 Zenkai. Every setback makes you stronger.
          </p>
          <div className="flex gap-5 text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="mailto:support@zenkai.app" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

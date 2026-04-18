"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ── WaitlistForm ──────────────────────────────────────────────────────────────

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

// ── PowerScouter ──────────────────────────────────────────────────────────────

function PowerScouter() {
  const TARGET = 9700;
  const [phase, setPhase] = useState<"scanning" | "counting" | "done">("scanning");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setPhase("counting"), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "counting") return;
    const steps = 90;
    const duration = 1800;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      // Ease-out: slower near the end
      const progress = 1 - Math.pow(1 - step / steps, 2);
      const current = Math.floor(progress * TARGET);
      setCount(current);
      if (step >= steps) {
        setCount(TARGET);
        setPhase("done");
        clearInterval(timer);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [phase]);

  return (
    <div
      className="relative inline-block mx-auto px-8 py-5 scouter-border"
      style={{
        border: "1px solid rgba(255,107,53,0.4)",
        background: "rgba(255,107,53,0.03)",
        minWidth: "280px",
      }}
    >
      {/* Corner brackets */}
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />

      {/* Scan line — only visible during counting */}
      {phase === "counting" && (
        <div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,107,53,0.6), transparent)",
            animation: "scanSweep 0.9s linear forwards",
            zIndex: 2,
          }}
        />
      )}

      {/* Label */}
      <p
        className="text-xs font-bold tracking-[0.3em] uppercase mb-3 text-center"
        style={{ color: "rgba(255,107,53,0.6)", fontFamily: "monospace" }}
      >
        POWER LEVEL
      </p>

      {/* Number / Scanning state */}
      <div className="text-center" style={{ minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {phase === "scanning" ? (
          <div
            className="font-bold tracking-[0.2em] text-xl"
            style={{ color: "rgba(255,107,53,0.5)", fontFamily: "monospace" }}
          >
            SCANNING<span className="cursor-blink">_</span>
          </div>
        ) : (
          <div
            className={phase === "done" ? "number-glow" : ""}
            style={{
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              fontWeight: 900,
              fontFamily: "monospace",
              letterSpacing: "-0.02em",
              color: "#FF6B35",
              lineHeight: 1,
            }}
          >
            {count.toLocaleString("en-US")}
          </div>
        )}
      </div>

      {/* Status line */}
      <div
        className="mt-3 flex items-center justify-between gap-4"
        style={{ borderTop: "1px solid rgba(255,107,53,0.1)", paddingTop: "10px" }}
      >
        <span
          className="text-xs tracking-[0.2em] uppercase"
          style={{ color: "rgba(255,107,53,0.4)", fontFamily: "monospace" }}
        >
          ZENKAI
        </span>
        <span
          className="text-xs tracking-[0.2em] uppercase"
          style={{
            color: phase === "done" ? "rgba(255,107,53,0.7)" : "rgba(255,255,255,0.2)",
            fontFamily: "monospace",
            transition: "color 0.5s",
          }}
        >
          {phase === "done" ? "SCAN COMPLETE" : "..."}
        </span>
      </div>
    </div>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const style: React.CSSProperties = {
    position: "absolute",
    width: "12px",
    height: "12px",
    borderColor: "#FF6B35",
    borderStyle: "solid",
    borderWidth: "0",
  };
  if (pos === "tl") { style.top = -1; style.left = -1; style.borderTopWidth = "2px"; style.borderLeftWidth = "2px"; }
  if (pos === "tr") { style.top = -1; style.right = -1; style.borderTopWidth = "2px"; style.borderRightWidth = "2px"; }
  if (pos === "bl") { style.bottom = -1; style.left = -1; style.borderBottomWidth = "2px"; style.borderLeftWidth = "2px"; }
  if (pos === "br") { style.bottom = -1; style.right = -1; style.borderBottomWidth = "2px"; style.borderRightWidth = "2px"; }
  return <div style={style} />;
}

// ── HeroCards ─────────────────────────────────────────────────────────────────

function HeroCards() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(t);
  }, []);

  const cards = [
    {
      label: "Level",
      value: "Lv. 12",
      valueSize: "22px",
      valueColor: "#FF6B35",
      desc: "Saiyan Warrior",
      barColor: "#FF6B35",
      barTarget: 68,
      bottom: "680 / 1000 XP",
    },
    {
      label: "Power",
      value: "Zenkai Boost",
      valueSize: "13px",
      valueColor: "#a78bfa",
      desc: "Active after comeback",
      barColor: "#7C3AED",
      barTarget: 45,
      bottom: "+300 XP bonus",
    },
    {
      label: "Streak",
      value: "14",
      valueSize: "22px",
      valueColor: "#fff",
      desc: "Day streak",
      barColor: "rgba(255,255,255,0.35)",
      barTarget: 82,
      bottom: "Personal best",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        maxWidth: "520px",
        margin: "0 auto",
        animation: "bootIn 0.6s ease 1.1s both",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "12px",
            padding: "14px 12px",
            textAlign: "left",
            minWidth: 0,
          }}
        >
          {/* Label */}
          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", marginBottom: "6px" }}>
            {card.label}
          </p>

          {/* Value */}
          <p style={{ fontSize: card.valueSize, fontWeight: 900, color: card.valueColor, lineHeight: 1.1, marginBottom: "4px", wordBreak: "break-word" }}>
            {card.value}
          </p>

          {/* Description */}
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "10px" }}>
            {card.desc}
          </p>

          {/* XP bar track */}
          <div style={{ height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: "6px" }}>
            <div
              style={{
                height: "100%",
                borderRadius: "2px",
                background: card.barColor,
                width: mounted ? `${card.barTarget}%` : "0%",
                transition: "width 1s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>

          {/* Bottom label */}
          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.18)" }}>
            {card.bottom}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── HeroBackground ────────────────────────────────────────────────────────────

function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Energy orb — center */}
      <div
        className="energy-orb-1 absolute rounded-full"
        style={{
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "500px",
          background: "radial-gradient(ellipse, rgba(255,107,53,0.09) 0%, transparent 65%)",
        }}
      />
      {/* Energy orb — left */}
      <div
        className="energy-orb-2 absolute rounded-full"
        style={{
          top: "20%",
          left: "-10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)",
        }}
      />
      {/* Energy orb — right */}
      <div
        className="energy-orb-3 absolute rounded-full"
        style={{
          top: "10%",
          right: "-8%",
          width: "350px",
          height: "350px",
          background: "radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 65%)",
        }}
      />
      {/* Bottom purple glow */}
      <div
        className="energy-orb-2 absolute rounded-full"
        style={{
          bottom: "-5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "200px",
          background: "radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,107,53,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "#0a0a0a" }}>

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(10,10,10,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <span
          className="font-black text-xl tracking-tight gradient-text"
          style={{ letterSpacing: "-0.02em" }}
        >
          ZENKAI
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-gray-500 hover:text-white transition-colors hidden sm:block"
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
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6 pt-20 pb-16">
        <HeroBackground />

        <div
          className="relative z-10 max-w-4xl mx-auto w-full text-center"
          style={{ animation: "bootIn 0.8s ease both" }}
        >

          {/* System badge */}
          <div
            className="inline-flex items-center gap-3 px-4 py-2 mb-10"
            style={{
              border: "1px solid rgba(255,107,53,0.25)",
              background: "rgba(255,107,53,0.04)",
              animation: "bootIn 0.6s ease 0.1s both",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#FF6B35", boxShadow: "0 0 6px #FF6B35" }}
            />
            <span
              className="text-xs font-bold tracking-[0.25em] uppercase"
              style={{ color: "rgba(255,107,53,0.8)", fontFamily: "monospace" }}
            >
              ANIME FITNESS RPG // SYSTEM INITIALIZED
            </span>
          </div>

          {/* Power Scouter — centerpiece */}
          <div
            className="flex justify-center mb-10"
            style={{ animation: "bootIn 0.6s ease 0.2s both" }}
          >
            <PowerScouter />
          </div>

          {/* Hero title */}
          <h1
            className="font-black uppercase text-white mb-6 leading-none tracking-tighter"
            style={{
              fontSize: "clamp(2.8rem, 9vw, 6.5rem)",
              animation: "bootIn 0.6s ease 0.5s both",
            }}
          >
            <span className="gradient-text">Every setback</span>
            <br />
            <span style={{ color: "#fff" }}>makes you stronger.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ animation: "bootIn 0.6s ease 0.7s both" }}
          >
            Train in real life. Level up like an anime character.{" "}
            <span className="text-white font-medium">Miss a week?</span>{" "}
            That&apos;s when your{" "}
            <span style={{ color: "#FF6B35" }} className="font-bold">Zenkai Boost</span> begins.
          </p>

          {/* Waitlist form */}
          <div
            className="max-w-md mx-auto"
            style={{ animation: "bootIn 0.6s ease 0.85s both" }}
          >
            <WaitlistForm compact />
            <p className="text-xs text-gray-700 mt-3">No spam. No credit card. 7 days free.</p>
          </div>

          {/* Social proof */}
          <div
            className="mt-10 flex items-center justify-center gap-6 text-sm text-gray-600"
            style={{ animation: "bootIn 0.6s ease 1s both" }}
          >
            <span>1,200+ on the waitlist</span>
            <span
              className="w-px h-4"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
            <span>Free to start</span>
          </div>

          {/* Stat cards */}
          <div className="mt-8">
            <HeroCards />
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
                <span className="text-xs font-black tracking-widest" style={{ color: accent }}>
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
                {["Create your character", "7 days of daily quests", "Basic workout library", "Progress tracker"].map((item) => (
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

            <div
              className="p-8 rounded-2xl flex flex-col gap-5 relative overflow-hidden"
              style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.3)" }}
            >
              <div
                className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black"
                style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)", color: "#fff" }}
              >
                POPULAR
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#7C3AED" }}>Full Power</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-4xl font-black text-white">€4.99</p>
                  <p className="text-gray-500 text-sm">/month</p>
                </div>
                <p className="text-sm text-gray-600 mt-1">Billed monthly, cancel anytime</p>
              </div>
              <ul className="space-y-2.5 flex-1 text-sm text-gray-300">
                {["Everything in Free", "Full character system", "Zenkai Boost quests", "Unlimited workout history", "Exclusive character skins", "Priority new features"].map((item) => (
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
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">Be first in line</h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Zenkai is coming. Get early access — including an exclusive{" "}
            <span style={{ color: "#FF6B35" }} className="font-bold">Founding Member skin</span>{" "}
            for those who show up early.
          </p>
          <div
            className="p-7 rounded-2xl"
            style={{ background: "rgba(255,107,53,0.03)", border: "1px solid rgba(255,107,53,0.12)" }}
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
          <p className="text-xs text-gray-700 text-center">© 2026 Zenkai. Every setback makes you stronger.</p>
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

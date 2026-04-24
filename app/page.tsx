"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ── WeekPreviewCard ───────────────────────────────────────────────────────────

function WeekPreviewCard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 500);
    return () => clearTimeout(t);
  }, []);

  const days = [
    { label: "MON", type: "done", exercise: "Push-ups" },
    { label: "TUE", type: "rest" },
    { label: "WED", type: "done", exercise: "Squats" },
    { label: "THU", type: "rest" },
    { label: "FRI", type: "today", exercise: "Plank 60s" },
    { label: "SAT", type: "rest" },
    { label: "SUN", type: "rest" },
  ];

  return (
    <div
      style={{
        maxWidth: "460px",
        margin: "0 auto",
        border: "1px solid rgba(255,107,53,0.25)",
        borderRadius: "16px",
        padding: "20px 18px",
        background: "rgba(255,107,53,0.03)",
        animation: "bootIn 0.6s ease 0.3s both",
      }}
    >
      <p
        style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.2em",
          color: "rgba(255,107,53,0.6)",
          textTransform: "uppercase",
          marginBottom: "14px",
          fontFamily: "monospace",
        }}
      >
        THIS WEEK
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "5px",
          marginBottom: "16px",
        }}
      >
        {days.map((d) => (
          <div
            key={d.label}
            style={{
              borderRadius: "10px",
              padding: "10px 3px",
              textAlign: "center",
              background:
                d.type === "today"
                  ? "rgba(255,107,53,0.1)"
                  : "rgba(255,255,255,0.02)",
              border:
                d.type === "today"
                  ? "1px solid rgba(255,107,53,0.4)"
                  : "1px solid rgba(255,255,255,0.06)",
              transition: "all 0.4s ease",
            }}
          >
            <p
              style={{
                fontSize: "9px",
                color: "rgba(255,255,255,0.3)",
                marginBottom: "6px",
                fontWeight: 700,
              }}
            >
              {d.label}
            </p>
            {d.type === "done" && (
              <p
                style={{
                  fontSize: "15px",
                  color: "#22c55e",
                  opacity: mounted ? 1 : 0,
                  transition: "opacity 0.5s ease",
                }}
              >
                ✓
              </p>
            )}
            {d.type === "rest" && (
              <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.18)" }}>
                Rest
              </p>
            )}
            {d.type === "today" && (
              <p
                style={{ fontSize: "9px", color: "#FF6B35", fontWeight: 700 }}
              >
                Today
              </p>
            )}
            {d.exercise && (
              <p
                style={{
                  fontSize: "7px",
                  color: "rgba(255,255,255,0.25)",
                  marginTop: "3px",
                  lineHeight: 1.3,
                }}
              >
                {d.exercise}
              </p>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "12px",
        }}
      >
        <span style={{ fontSize: "12px", color: "#FF6B35", fontWeight: 700 }}>
          2-day streak
        </span>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
          Up next: Plank 60s
        </span>
      </div>
    </div>
  );
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
      label: "Streak",
      value: "14 days",
      valueSize: "18px",
      valueColor: "#FF6B35",
      desc: "Consecutive weeks",
      barColor: "#FF6B35",
      barTarget: 68,
      bottom: "Personal best",
    },
    {
      label: "Zenkai Boost",
      value: "Active",
      valueSize: "14px",
      valueColor: "#a78bfa",
      desc: "Comeback week bonus",
      barColor: "#7C3AED",
      barTarget: 45,
      bottom: "+300 XP ready",
    },
    {
      label: "This week",
      value: "2 / 3",
      valueSize: "18px",
      valueColor: "#fff",
      desc: "Workouts done",
      barColor: "rgba(34,197,94,0.7)",
      barTarget: 66,
      bottom: "Friday left",
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
          <p
            style={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.3)",
              marginBottom: "6px",
            }}
          >
            {card.label}
          </p>
          <p
            style={{
              fontSize: card.valueSize,
              fontWeight: 900,
              color: card.valueColor,
              lineHeight: 1.1,
              marginBottom: "4px",
              wordBreak: "break-word",
            }}
          >
            {card.value}
          </p>
          <p
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.3)",
              marginBottom: "10px",
            }}
          >
            {card.desc}
          </p>
          <div
            style={{
              height: "3px",
              borderRadius: "2px",
              background: "rgba(255,255,255,0.07)",
              overflow: "hidden",
              marginBottom: "6px",
            }}
          >
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
      <div
        className="absolute rounded-full"
        style={{
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "500px",
          background:
            "radial-gradient(ellipse, rgba(255,107,53,0.09) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          top: "20%",
          left: "-10%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          top: "10%",
          right: "-8%",
          width: "350px",
          height: "350px",
          background:
            "radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,107,53,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)",
        }}
      />
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

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("done");
      } else {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("No connection. Try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-sm font-bold" style={{ color: "#FF6B35" }}>
        You&apos;re on the list. We&apos;ll email you when spots open.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 rounded-xl text-sm font-black text-white transition-all hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
        style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
      >
        {status === "loading" ? "..." : "Join waitlist"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400 w-full sm:col-span-2">{errorMsg}</p>
      )}
    </form>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "#0a0a0a" }}>

      {/* ── BETA BANNER ── */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] text-center py-1.5 px-4"
        style={{
          background: "rgba(124,58,237,0.3)",
          borderBottom: "1px solid rgba(124,58,237,0.4)",
          fontSize: "12px",
          color: "rgba(255,255,255,0.7)",
        }}
      >
        Open Beta — Free during beta. Help us build Zenkai.
      </div>

      {/* ── NAV ── */}
      <nav
        className="fixed left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          top: "30px",
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
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6 pt-28 pb-16">
        <HeroBackground />

        <div
          className="relative z-10 max-w-4xl mx-auto w-full text-center"
          style={{ animation: "bootIn 0.8s ease both" }}
        >
          {/* Badge */}
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
              OPEN BETA — FREE DURING BETA
            </span>
          </div>

          {/* Week preview widget */}
          <div
            className="flex justify-center mb-10"
            style={{ animation: "bootIn 0.6s ease 0.2s both" }}
          >
            <WeekPreviewCard />
          </div>

          {/* Hero title */}
          <h1
            className="font-black text-white mb-5 leading-tight"
            style={{
              fontSize: "clamp(2rem, 7vw, 4.5rem)",
              animation: "bootIn 0.6s ease 0.5s both",
            }}
          >
            The reason you quit isn&apos;t discipline.
            <br />
            <span className="gradient-text">It&apos;s guilt.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg text-gray-400 max-w-xl mx-auto mb-3 leading-relaxed"
            style={{ animation: "bootIn 0.6s ease 0.65s both" }}
          >
            When you miss a few days, most apps make you feel like you failed.
          </p>
          <p
            className="text-lg font-bold max-w-xl mx-auto mb-10"
            style={{
              color: "#FF6B35",
              animation: "bootIn 0.6s ease 0.75s both",
            }}
          >
            Zenkai is built for what happens next.
          </p>

          {/* CTA */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            style={{ animation: "bootIn 0.6s ease 0.85s both" }}
          >
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl font-black text-white text-base transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
            >
              Get your comeback workout
            </Link>
            <Link
              href="/login"
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Already have an account?
            </Link>
          </div>

          {/* Social proof */}
          <div
            className="flex items-center justify-center gap-6 text-sm text-gray-600"
            style={{ animation: "bootIn 0.6s ease 1s both" }}
          >
            <span>1,200+ already training</span>
            <span className="w-px h-4" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span>Free to start</span>
            <span className="w-px h-4" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span>No credit card</span>
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
              "You miss a few days. The app gives you a red card. You feel like you failed. You stop entirely — not because you're lazy, but because the guilt is heavier than the workout.",
              "Most fitness apps are built for people who are already consistent. They don't handle the real world — travel, bad weeks, injuries, life. They punish absence instead of working around it.",
              "What you need is a coach who remembers where you left off, adapts to why you stopped, and hands you a comeback workout instead of a red card.",
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
              Zenkai remembers you.{" "}
              <span className="gradient-text">It adapts to your life.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#FF6B35" }}>
              How it works
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Simple. Personal. Consistent.
            </h2>
          </div>

          <div className="space-y-0">
            {[
              {
                step: "01",
                title: "You choose your exercises",
                desc: "Push-ups, squats, plank — whatever you do. Add them once. Zenkai remembers your workout so you never have to think about what to do.",
              },
              {
                step: "02",
                title: "You pick when to train",
                desc: "Monday, Wednesday, Friday? Twice a week? You decide. Zenkai builds your calendar around your life — not the other way around.",
              },
              {
                step: "03",
                title: "Zenkai reminds, tracks, celebrates",
                desc: "Smart reminders at your chosen time. Every workout logged. Every streak celebrated. No judgment, no pressure — just your coach showing up with you.",
              },
              {
                step: "04",
                title: "Miss a week? Your comeback is waiting",
                desc: "Life gets in the way. Zenkai asks what happened, adapts your next workout, and gives you a Zenkai Boost — a special comeback session with bonus momentum.",
              },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="flex gap-6 items-start relative">
                {i < 3 && (
                  <div
                    className="absolute left-[22px] top-14 bottom-0 w-px"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(255,107,53,0.3), transparent)",
                    }}
                  />
                )}
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-black text-xs z-10"
                  style={{
                    background: "linear-gradient(135deg, #FF6B35, #7C3AED)",
                    color: "#fff",
                  }}
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

      {/* ── WHY ZENKAI ── */}
      <section className="py-24 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#7C3AED" }}>
              Why Zenkai
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Design your own workouts.
            </h2>
            <p className="text-gray-500 mt-4">We handle consistency.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                label: "01",
                title: "Your workouts, your rules",
                desc: "No pre-built programs. Add the exercises you actually do — and Zenkai builds your week around them. Full control, zero friction.",
                accent: "#FF6B35",
              },
              {
                label: "02",
                title: "Zenkai Boost",
                desc: "Miss a few days? Zenkai asks what got in the way, adapts your comeback workout to fit, and gives you a bonus session. No punishment. Just momentum.",
                accent: "#7C3AED",
              },
              {
                label: "03",
                title: "Coached consistency",
                desc: "Weekly summaries tell you where you tend to fall off. Reminders hit at your chosen time. Master Kael keeps your motivation grounded in reality.",
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

      {/* ── THE ZENKAI CONCEPT ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#FF6B35" }}>
              The Zenkai principle
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
              What is a Zenkai?
            </h2>
          </div>
          <div
            className="rounded-2xl p-8 mb-8"
            style={{
              background: "rgba(255,107,53,0.03)",
              border: "1px solid rgba(255,107,53,0.12)",
            }}
          >
            <p className="text-gray-300 leading-relaxed text-base mb-4">
              In ancient warrior texts,{" "}
              <span style={{ color: "#FF6B35" }} className="font-bold">
                Zenkai
              </span>{" "}
              describes what happens when a fighter is pushed to their limit and
              recovers — they come back stronger than before. Not despite the
              setback. <em>Because</em> of it.
            </p>
            <p className="text-gray-400 leading-relaxed text-sm">
              We built an app around that idea. Miss a few days? Your Zenkai
              activates. The app doesn&apos;t punish you — it remembers where you
              left off, asks what happened, and adapts your comeback workout to
              meet you exactly where you are.
            </p>
          </div>
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-sm font-bold text-white mb-2">
              No red cards. No guilt trips.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Just a coach who remembers you, understands why you stopped, and
              keeps going with you — wherever you left off.
            </p>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-24 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
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

          <p className="text-center text-sm text-gray-600 italic mb-8">
            During open beta, all features are free.{" "}
            Paid plans activate at official launch.
          </p>

          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            <div
              className="p-8 rounded-2xl flex flex-col gap-5"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Free trial</p>
                <p className="text-4xl font-black text-white">€0</p>
                <p className="text-sm text-gray-600 mt-1">7 days, full access</p>
              </div>
              <ul className="space-y-2.5 flex-1 text-sm text-gray-400">
                {[
                  "Design your own workouts",
                  "Weekly calendar view",
                  "Streak tracking",
                  "Zenkai Boost on comeback",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span style={{ color: "#FF6B35" }}>—</span> {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block text-center py-3 px-6 rounded-xl font-bold text-white text-sm transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Start for free
              </Link>
            </div>

            <div
              className="p-8 rounded-2xl flex flex-col gap-5 relative overflow-hidden"
              style={{
                background: "rgba(124,58,237,0.06)",
                border: "1px solid rgba(124,58,237,0.3)",
              }}
            >
              <div
                className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black"
                style={{
                  background: "linear-gradient(135deg, #FF6B35, #7C3AED)",
                  color: "#fff",
                }}
              >
                POPULAR
              </div>
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "#7C3AED" }}
                >
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
                  "Smart reminders at your time",
                  "Weekly coaching summaries",
                  "Comeback workout adapts to you",
                  "Unlimited workout history",
                  "Priority new features",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span style={{ color: "#7C3AED" }}>—</span> {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block text-center py-3 px-6 rounded-xl font-black text-white transition-all hover:opacity-90 text-sm"
                style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
              >
                Get your comeback workout
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAITLIST ── */}
      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.2)" }}>
            Not ready to sign up yet?
          </p>
          <h2 className="text-2xl font-black text-white mb-3">Join the waitlist</h2>
          <p className="text-sm text-gray-600 mb-8">
            We&apos;ll email you when the next beta spots open. No spam.
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#FF6B35" }}>
            Start now
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            Your comeback workout is waiting.
          </h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Design your first week in 60 seconds.{" "}
            <span style={{ color: "#FF6B35" }} className="font-bold">
              No judgment. No reset.
            </span>{" "}
            Just show up.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 rounded-xl font-black text-white text-lg transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
          >
            Get started — it&apos;s free
          </Link>
          <p className="text-xs text-gray-700 mt-4">
            Free during beta. No credit card required.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-10 px-6 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-black gradient-text tracking-tight">ZENKAI</span>
          <p className="text-xs text-gray-700 text-center">
            © 2026 Zenkai. Consistency over perfection.
          </p>
          <div className="flex gap-5 text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <a
              href="mailto:support@zenkai.app"
              className="hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

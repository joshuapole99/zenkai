"use client";

import { useState, useEffect, useRef } from "react";

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
    <div ref={ref} className="w-full max-w-md mx-auto mt-8">
      <div className="flex justify-between text-xs mb-2" style={{ color: "#FFD700" }}>
        <span className="font-bold tracking-widest uppercase">Power Level</span>
        <span className="font-mono font-bold">{level.toLocaleString("nl-NL")}</span>
      </div>
      <div
        className="h-3 rounded-full overflow-hidden"
        style={{ background: "rgba(255,215,0,0.15)", border: "1px solid rgba(255,215,0,0.3)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-75"
          style={{
            width: `${Math.min((level / 9700) * 100, 97)}%`,
            background: "linear-gradient(90deg, #FF6B35, #FFD700)",
            boxShadow: "0 0 10px rgba(255,215,0,0.7)",
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
        setMessage(data.message || "Je staat op de lijst!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Er ging iets mis. Probeer opnieuw.");
      }
    } catch {
      setStatus("error");
      setMessage("Geen verbinding. Probeer het later opnieuw.");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-2">⚡</div>
        <p className="font-bold text-lg" style={{ color: "#FFD700" }}>{message}</p>
        <p className="text-sm text-gray-400 mt-1">We sturen je een bericht zodra Zenkai live gaat.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex ${compact ? "flex-col sm:flex-row" : "flex-col"} gap-3 w-full`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="jouw@email.nl"
        required
        className={`flex-1 px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${compact ? "text-sm" : "text-base"}`}
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="glow-btn px-6 py-3 rounded-xl font-bold text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-60 whitespace-nowrap"
        style={{ background: "linear-gradient(135deg, #FFD700, #FF6B35)" }}
      >
        {status === "loading" ? "⚡ Laden..." : "Start je Zenkai →"}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-sm mt-1">{message}</p>
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
          background: "rgba(10,10,10,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,215,0,0.1)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="font-black text-xl tracking-tight gradient-text">ZENKAI</span>
        </div>
        <a
          href="#waitlist"
          className="px-4 py-2 rounded-lg text-sm font-bold text-black transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #FFD700, #FF6B35)" }}
        >
          Aanmelden
        </a>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-40 right-10 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%)" }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-8"
            style={{
              background: "rgba(255,215,0,0.1)",
              border: "1px solid rgba(255,215,0,0.3)",
              color: "#FFD700",
            }}
          >
            <span>⚡</span> Dragon Ball × Fitness
          </div>

          <h1 className="text-5xl sm:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            <span className="gradient-text">Elke terugval</span>
            <br />
            <span className="text-white">maakt je sterker.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Train in real life. Groei als een anime karakter.{" "}
            <span className="text-white font-medium">Mis je een week?</span>{" "}
            Dan begint je{" "}
            <span style={{ color: "#FFD700" }} className="font-bold">Zenkai Boost</span>.
          </p>

          <div className="max-w-md mx-auto mb-4">
            <WaitlistForm compact />
            <p className="text-xs text-gray-600 mt-3">Geen spam. Geen creditcard. Gratis 7 dagen proberen.</p>
          </div>

          <PowerBar />

          <div className="float-anim mt-12 text-7xl sm:text-8xl select-none">🔥</div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span>👥</span>
              <span>1.200+ op de wachtlijst</span>
            </div>
            <div className="w-px h-4 bg-gray-700" />
            <div className="flex items-center gap-1">
              <span>⭐</span>
              <span>Gratis te starten</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HET PROBLEEM ── */}
      <section className="py-24 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#FF6B35" }}>
              Het probleem
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white">Ken je dit gevoel?</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                emoji: "😤",
                text: "Je begint vol motivatie maar valt steeds weer uit je ritme — en voelt je er schuldig over.",
              },
              {
                emoji: "😞",
                text: "Andere apps straffen je als je stopt. Streaks kwijt, badges weg. Alsof je al hebt verloren.",
              },
              {
                emoji: "🚫",
                text: "Jij voelt je schuldig, geeft helemaal op — en de app stoft in.",
              },
            ].map(({ emoji, text }) => (
              <div
                key={emoji}
                className="flex gap-4 items-start p-6 rounded-2xl"
                style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.15)" }}
              >
                <span className="text-3xl flex-shrink-0">{emoji}</span>
                <p className="text-gray-300 text-lg leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-2xl sm:text-3xl font-black text-white">
              Zenkai keert dit om.{" "}
              <span className="gradient-text">Volledig.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── ONDERSCHEID ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#FFD700" }}>
              Jouw onderscheid
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Gebouwd voor echte mensen
            </h2>
            <p className="text-gray-400 mt-4 text-lg">Die weten dat het leven soms in de weg zit.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                emoji: "⚡",
                title: "Zenkai Boost",
                desc: "Na gemiste dagen krijg je een speciale comeback quest — net als Saiyans na elke nederlaag. Jouw terugval is je kracht.",
                color: "#FFD700",
              },
              {
                emoji: "🏠",
                title: "Thuis workouts",
                desc: "Geen gym nodig. Jouw kamer is je dojo. Workouts ontworpen voor kleine ruimtes, zonder equipment.",
                color: "#FF6B35",
              },
              {
                emoji: "🎭",
                title: "Jij bent de hoofdpersoon",
                desc: "Je eigen anime karakter groeit mee met jouw echte progressie. Elke workout = XP. Elke comeback = power-up.",
                color: "#FFD700",
              },
            ].map(({ emoji, title, desc, color }) => (
              <div
                key={title}
                className="neon-border p-8 rounded-2xl flex flex-col gap-4 hover:scale-[1.02] transition-transform cursor-default"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="text-5xl">{emoji}</div>
                <h3 className="text-xl font-black" style={{ color }}>{title}</h3>
                <p className="text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOE HET WERKT ── */}
      <section className="py-24 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#FF6B35" }}>
              Hoe het werkt
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              3 stappen naar je comeback
            </h2>
          </div>

          <div className="space-y-0">
            {[
              {
                step: "01",
                emoji: "🧬",
                title: "Maak je karakter aan",
                desc: "Kies je stijl, geef je karakter een naam en stel je startniveau in. Jij bepaalt wie je wilt worden.",
              },
              {
                step: "02",
                emoji: "⚔️",
                title: "Voltooi dagelijkse quests",
                desc: "Thuis workouts — geen equipment nodig. Iedere dag nieuwe uitdagingen afgestemd op jouw level.",
              },
              {
                step: "03",
                emoji: "📈",
                title: "Zie je karakter groeien",
                desc: "Terwijl jij traint, groeit je karakter. Val je af? Geen straf — je Zenkai Boost geeft je extra XP bij je comeback.",
              },
            ].map(({ step, emoji, title, desc }, i) => (
              <div key={step} className="flex gap-6 items-start relative">
                {i < 2 && (
                  <div
                    className="absolute left-6 top-16 bottom-0 w-px"
                    style={{ background: "linear-gradient(to bottom, rgba(255,215,0,0.3), transparent)" }}
                  />
                )}
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-black text-sm z-10"
                  style={{ background: "linear-gradient(135deg, #FFD700, #FF6B35)", color: "#0a0a0a" }}
                >
                  {step}
                </div>
                <div className="pb-12">
                  <div className="text-3xl mb-2">{emoji}</div>
                  <h3 className="text-xl font-black text-white mb-2">{title}</h3>
                  <p className="text-gray-400 leading-relaxed">{desc}</p>
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
            <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#FFD700" }}>
              Prijzen
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Simpel. Eerlijk. Betaalbaar.
            </h2>
            <p className="text-gray-400 mt-4 text-lg">"Minder dan een kop koffie per week."</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div
              className="p-8 rounded-2xl flex flex-col gap-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Gratis</p>
                <p className="text-4xl font-black text-white">€0</p>
                <p className="text-gray-500 text-sm mt-1">7 dagen volledig proberen</p>
              </div>
              <ul className="space-y-3 flex-1">
                {[
                  "Karakter aanmaken",
                  "7 dagen quests",
                  "Basis workout library",
                  "Voortgang tracker",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-300 text-sm">
                    <span style={{ color: "#FFD700" }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <a
                href="#waitlist"
                className="block text-center py-3 px-6 rounded-xl font-bold text-white border border-white/20 hover:border-white/40 transition-colors text-sm"
              >
                Gratis starten
              </a>
            </div>

            {/* Pro */}
            <div
              className="p-8 rounded-2xl flex flex-col gap-4 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,107,53,0.08))",
                border: "1px solid rgba(255,215,0,0.3)",
              }}
            >
              <div
                className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black"
                style={{ background: "linear-gradient(135deg, #FFD700, #FF6B35)", color: "#0a0a0a" }}
              >
                POPULAIR
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: "#FFD700" }}>
                  Volledig
                </p>
                <div className="flex items-baseline gap-1">
                  <p className="text-4xl font-black text-white">€4,99</p>
                  <p className="text-gray-400 text-sm">/maand</p>
                </div>
                <p className="text-gray-500 text-sm mt-1">Minder dan een kop koffie per week</p>
              </div>
              <ul className="space-y-3 flex-1">
                {[
                  "Alles in Gratis",
                  "Volledig karakter systeem",
                  "Zenkai Boost quests",
                  "Onbeperkte workout history",
                  "Exclusieve karakter skins",
                  "Priority nieuwe features",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-200 text-sm">
                    <span style={{ color: "#FFD700" }}>⚡</span> {item}
                  </li>
                ))}
              </ul>
              <a
                href="#waitlist"
                className="block text-center py-3 px-6 rounded-xl font-black text-black transition-all hover:scale-105 text-sm"
                style={{ background: "linear-gradient(135deg, #FFD700, #FF6B35)" }}
              >
                Start je Zenkai →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAITLIST ── */}
      <section id="waitlist" className="py-24 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-xl mx-auto text-center">
          <div className="text-6xl mb-6 float-anim">⚡</div>
          <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#FFD700" }}>
            Wachtlijst
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            Wees er als eerste bij
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Zenkai komt eraan. Meld je aan en ontvang als eerste toegang — inclusief een exclusieve{" "}
            <span style={{ color: "#FFD700" }} className="font-bold">Founding Member skin</span> voor vroege aanmelders.
          </p>

          <div
            className="neon-border p-8 rounded-2xl"
            style={{ background: "rgba(255,215,0,0.03)" }}
          >
            <WaitlistForm />
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-600 flex-wrap">
              <span>🔒 Geen spam</span>
              <span>•</span>
              <span>✓ Gratis 7 dagen</span>
              <span>•</span>
              <span>❌ Geen creditcard</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-black gradient-text tracking-tight">ZENKAI</span>
          </div>
          <p className="text-xs text-gray-600 text-center">
            © 2026 Zenkai. Elke terugval maakt je sterker.
          </p>
          <div className="flex gap-4 text-xs text-gray-600">
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

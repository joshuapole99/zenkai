"use client";

import Link from "next/link";
import posthog from "posthog-js";

const LEMONSQUEEZY_CHECKOUT_URL = "https://financios.lemonsqueezy.com/checkout/buy/f636b083-cc9d-436f-a1ed-075c4096fa19";

export default function UpgradePage() {
  return (
    <main className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors mb-8 inline-block">
        ← Home
      </Link>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-foreground mb-3 tracking-tight">
          Stop met hopen. Begin met een plan.
        </h1>
        <p className="text-muted">
          Geen vage tips. Een concreet weekplan gebaseerd op jóuw eigen cijfers.
        </p>
      </div>

      {/* Zonder plan vs Met plan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div className="bg-danger/5 border border-danger/20 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-danger mb-3">
            Zonder plan
          </p>
          <ul className="space-y-2">
            {[
              "Je weet niet hoeveel je mag uitgeven",
              "Iedere maand hetzelfde: te weinig over",
              "Je doel schuift steeds verder weg",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-muted">
                <span className="text-danger shrink-0 mt-0.5 font-bold">✗</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-success/5 border border-success/20 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-success mb-3">
            Met plan
          </p>
          <ul className="space-y-2">
            {[
              "Je weet elke week precies hoeveel",
              "Je spaart consequent, zonder stress",
              "Je ziet wanneer je je doel haalt",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-foreground">
                <span className="text-success shrink-0 mt-0.5 font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Preview locked content */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6 shadow-[var(--shadow-card)]">
        <h2 className="font-semibold text-foreground mb-4">Wat je direct krijgt</h2>
        <div className="flex flex-col gap-3">
          {[
            ["📅", "Weekplan", "Weet elke week hoeveel je mag uitgeven — geen giswerk meer."],
            ["📊", "Maandelijkse breakdown", "Zie in één oogopslag waar je geld naartoe gaat en wat je kunt schrappen."],
            ["🔄", "3 alternatieve scenario's", "Kies zelf wat haalbaar is — ook als je nu tekortkomt."],
            ["✂️", "Persoonlijke bezuinigingstips", "Op basis van jóuw uitgavepatroon, niet generieke adviezen."],
            ["🎯", "Exacte afrondingsdatum", "Weet precies wanneer jij je doel haalt — als je dit plan volgt."],
          ].map(([icon, title, desc]) => (
            <div key={title} className="flex gap-3 items-start">
              <span className="text-xl w-7">{icon}</span>
              <div>
                <span className="text-sm font-medium text-foreground block">{title}</span>
                <span className="text-xs text-muted">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing + CTA */}
      <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 mb-6 text-center shadow-[var(--shadow-card)]">
        <p className="text-muted text-sm mb-1">Eenmalige investering</p>
        <p className="text-4xl font-bold text-foreground mb-1">€4,99</p>
        <p className="text-sm text-muted mb-6">Geen abonnement. Geen gedoe. Minder dan twee koppen koffie.</p>
        <a
          href={LEMONSQUEEZY_CHECKOUT_URL}
          onClick={() => posthog.capture("cta_clicked", { button: "fix_mijn_spaardoel", page: "upgrade" })}
          className="block w-full bg-accent hover:bg-accent-hover text-white font-semibold py-4 rounded-xl text-base tracking-wide transition-all shadow-lg shadow-accent/20 active:scale-[0.98] text-center"
        >
          Fix mijn spaardoel (€4,99) →
        </a>
        <p className="text-xs text-muted mt-3">
          Creditcard of Apple Pay · iDEAL komt binnenkort · Veilig &amp; versleuteld
        </p>
      </div>

      <p className="text-xs text-muted text-center">
        Geen financieel advies.{" "}
        <Link href="/disclaimer" className="underline hover:text-foreground">
          Lees onze disclaimer
        </Link>
        .
      </p>
    </main>
  );
}

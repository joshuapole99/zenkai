import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Betaling gelukt",
  robots: { index: false },
};

export default function BetalingGeluktPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center max-w-sm mx-auto">
      {/* Success icon */}
      <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-6">
        <span className="text-success text-3xl font-bold">✓</span>
      </div>

      <h1 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
        Betaling gelukt!
      </h1>
      <p className="text-muted leading-relaxed mb-2">
        Je persoonlijk spaarplan is aangemaakt. Je ontvangt binnen enkele minuten een e-mail van{" "}
        <span className="text-foreground font-medium">noreply@financios.nl</span> met jouw persoonlijke link.
      </p>
      <p className="text-sm text-muted mb-8">
        Check ook je spamfolder als je de mail niet ziet.
      </p>

      {/* Email checklist */}
      <div className="bg-card border border-border rounded-2xl p-5 w-full text-left mb-8 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Wat nu?</p>
        <div className="flex flex-col gap-3">
          {[
            ["1", "Check je inbox", "E-mail van noreply@financios.nl"],
            ["2", "Klik op de link", "Opent jouw persoonlijk spaarplan"],
            ["3", "Sla de link op", "Werkt altijd — ook later nog"],
          ].map(([num, title, desc]) => (
            <div key={num} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {num}
              </span>
              <div>
                <span className="text-sm font-medium text-foreground block">{title}</span>
                <span className="text-xs text-muted">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted">
        Geen mail ontvangen na 5 minuten?{" "}
        <a href="mailto:hallo@financios.nl" className="text-accent underline">
          hallo@financios.nl
        </a>
      </p>

      <Link
        href="/"
        className="mt-6 text-sm text-muted hover:text-foreground transition-colors"
      >
        Terug naar home
      </Link>
    </main>
  );
}

"use client";

import Link from "next/link";

export default function PlanParamsLoader() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center max-w-sm mx-auto">
      <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center mb-5">
        <span className="text-warning text-xl">⚠</span>
      </div>
      <h1 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
        Je plan is niet meer beschikbaar
      </h1>
      <p className="text-muted leading-relaxed mb-2">
        Je spaarplan is gekoppeld aan de magic link die je per email hebt ontvangen na je aankoop. Open die email en klik op de link.
      </p>
      <p className="text-sm text-muted mb-8">
        Email niet ontvangen? Check je spam of neem contact op via hallo@financios.nl
      </p>
      <Link
        href="/scan"
        className="bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-accent/20 tracking-wide"
      >
        Nieuwe scan starten
      </Link>
    </main>
  );
}

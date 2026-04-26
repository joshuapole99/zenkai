import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-medium uppercase tracking-wider text-muted mb-4">
        404
      </p>
      <h1 className="text-3xl font-semibold text-foreground tracking-tight mb-3">
        Pagina niet gevonden
      </h1>
      <p className="text-muted mb-8 max-w-sm leading-relaxed">
        De pagina die je zoekt bestaat niet of is verplaatst. Misschien kun je
        vinden wat je zoekt via de homepage.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
        >
          Terug naar home
        </Link>
        <Link
          href="/scan"
          className="bg-card border border-border hover:border-accent/50 text-foreground font-medium px-6 py-3 rounded-xl transition-all text-sm"
        >
          Start scan →
        </Link>
      </div>
    </main>
  );
}

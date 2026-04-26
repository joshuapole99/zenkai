import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Financios geeft geen financieel advies. Lees onze disclaimer.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors mb-8 inline-block">
        ← Home
      </Link>
      <h1 className="text-3xl font-semibold text-foreground mb-2 tracking-tight">Disclaimer</h1>
      <p className="text-xs text-muted mb-8">Laatst bijgewerkt: april 2026</p>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-6 text-sm text-muted leading-[1.75] shadow-[var(--shadow-card)]">

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Geen financieel advies</h2>
          <p>
            Financios biedt uitsluitend informatieve en educatieve tools aan. Alle berekeningen, resultaten en plannen —
            inclusief het betaalde persoonlijke spaarplan — zijn schattingen op basis van de door jou ingevoerde gegevens.
            Dit is <strong className="text-foreground">geen financieel advies</strong>.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Nauwkeurigheid</h2>
          <p>
            De berekeningen zijn gebaseerd op algemene rekenmodellen en zijn niet gecontroleerd door een financieel adviseur.
            Financios geeft geen garanties over de juistheid, volledigheid of toepasbaarheid van de gepresenteerde informatie
            op jouw persoonlijke situatie.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Eigen verantwoordelijkheid</h2>
          <p>
            Het gebruik van Financios geschiedt volledig op eigen risico. Financios is niet aansprakelijk voor financiële
            beslissingen die je neemt op basis van de resultaten of het spaarplan, noch voor eventuele schade die daaruit
            voortvloeit.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Professioneel advies</h2>
          <p>
            Raadpleeg voor persoonlijk financieel advies altijd een gecertificeerd financieel adviseur (FFP, CFP of vergelijkbaar).
            Financios vervangt dit advies niet.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Externe links</h2>
          <p>
            Financios kan links bevatten naar externe websites. Wij zijn niet verantwoordelijk voor de inhoud of het
            privacybeleid van deze websites.
          </p>
        </div>

      </div>
    </main>
  );
}

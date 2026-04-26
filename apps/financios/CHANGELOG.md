# CHANGELOG.md

## v2.1 — Scan upgrade: abonnementen + schrikmoment + conversie (2026-04-17)

- **Scan:** Abonnementenveld omgebouwd naar dynamische lijst (naam + bedrag per rij, onbeperkt toevoegen)
- **Scan:** Schrikmoment card na abonnementenlijst — maand/jaartotaal + vergelijking met Nederlands gemiddelde (€150/maand)
- **Result:** "Jij laat €X per maand liggen" boven betaald-plan features (alleen bij gap > 0)
- **Result:** CTA knop in `ChoosePlanSection` groter (py-4) + extra trust copy "Dit plan betaalt zichzelf terug in maand één"

---

## v2.0 - SEO pagina /hoeveel-moet-je-sparen-per-maand (2026-04-11)

### Nieuwe SEO pagina
- **/hoeveel-moet-je-sparen-per-maand** — informationeel keyword met hoog zoekvolume
- 50/30/20-vuistregel uitgelegd, spaartabel per inkomensniveau (€1.800–€3.500), doeltabel per spaardoel (noodfonds/vakantie/auto/huis), 3 tips, mid-page CTA, FAQ, toegevoegd aan sitemap

---

## v1.9 - Partner CTA op /plan + "Voor & na" op homepage (2026-04-11)

### Virale groei
- **"Bereken voor een vriend of partner"** card op `/plan` (onderaan, boven "Terug naar home") — WhatsApp deelknop met prefilled bericht naar `https://financios.nl/scan`

### Conversie homepage
- **"Voor & na" sectie** toegevoegd op homepage (na benefit cards, vóór final CTA) — concreet cijfervoorbeeld: inkomen €2.800, "€0 over" zonder plan vs "€550/maand spaarruimte" met plan, grootste lek (horeca) zichtbaar

---

## v1.8 - SEO pagina's /fire-beweging-nederland + /beleggen-beginnen (2026-04-11)

### Nieuwe SEO pagina's
- **/fire-beweging-nederland** — FIRE-getal tabel (4%-regel), uitleg compound interest, 3 stappen, FAQ
- **/beleggen-beginnen** — eerste interactieve calculator op de site: sliders voor maandelijks bedrag (€25–€1.000), looptijd (5–40 jaar), rendement (4/6/8%). Toont eindkapitaal, gestapelde balk (inleg vs rendement), winst%. `BeleggenCalculator.tsx` als aparte client component.

---

## v1.7 - SEO pagina /pensioen-sparen-jongeren (2026-04-11)

### Nieuwe SEO pagina
- **/pensioen-sparen-jongeren** — keyword "pensioen sparen jongeren", doelgroep 18–30 jaar
- Berekeningstafel (leeftijd 25–40 × doelkapitaal €50k/€100k/€200k), compound interest uitleg, 3 tips (begin klein, lijfrente/banksparen, AOW-gat ZZP), mid-page CTA, FAQ

---

## v1.6 - SEO pagina /huurweek-overleven (2026-04-11)

### Nieuwe SEO pagina
- **/huurweek-overleven** — targets "huurweek overleven" / "salaris op begin maand", specifiek Nederlands pijnmoment
- Voorbeeld-overzicht vaste lasten (wat er rond de 1e afgaat), formule, 3 tips, mid-page CTA, FAQ, toegevoegd aan sitemap

---

## v1.5 - OG image (2026-04-11)

### Social preview
- **Dynamic OG image** via `next/og` ImageResponse — `src/app/opengraph-image.tsx`
- Design: donkere achtergrond (#0B0F14), "Waarom ben jij **altijd blut?**" in paars (#6366F1), subtitle, financios.nl URL + gratis-badge
- Geldt automatisch voor alle pagina's zonder eigen OG image override

---

## v1.4 - Mid-page CTA op alle SEO pagina's (2026-04-11)

### Funnel fix
- **Mid-page CTA backport** naar alle 7 bestaande SEO-pagina's (vakantie, huis, bruiloft, auto, studie, 5000, 10000)
- Gepersonaliseerde CTA per pagina, geplaatst tussen tips en FAQ — vangt Chrome/zoekverkeer dat halverwege vertrekt

---

## v1.3 - SEO pagina + funnel fix (2026-04-11)

### Nieuwe SEO pagina
- **/noodfonds-opbouwen** live — keyword "noodfonds opbouwen", berekeningstafel (€1k–€10k × 4 looptijden), formule, 3 tips, FAQ, toegevoegd aan sitemap
- **Mid-page CTA patroon** geïntroduceerd: compact CTA-card tussen tips en FAQ, zodat Chrome/zoekverkeer een conversiepunt ziet vóórdat ze de pagina verlaten

### Funnel analyse
- PostHog: Chrome desktop 7.69% stap 1→2, Mobile Safari 35%. Zodra Chrome-gebruikers doorklikken converteren ze 100% — eerste pagina is het knelpunt. Mid-page CTA is gerichte fix.

---

## v1.2 - Plan kwaliteit fixes (2026-04-11)

### generatePlan.ts
- **Scenario volgorde gefixt**: `mediumMonthly` gebruikte `Math.max(..., requiredMonthly*0.5)` waardoor medium soms sneller was dan fast. Nu bouwen alle drie scenario's op dezelfde basis zodat slow ≤ medium ≤ fast altijd klopt.
- **€0-categorieën overgeslagen**: bezuinigingstips voor boodschappen, horeca en vervoer worden niet meer getoond als de gebruiker €0 heeft ingevuld.

---

## v1.1 - Positioning Sprint & Growth (2026-04-11)

### Positionering & conversie-helderheid
- **Homepage hero**: h1 "Waarom ben jij altijd blut?" + concrete subtitel "Het is de 20ste. Je saldo klopt alweer niet."
- **How it works copy**: concreter, stap 3 benoemt expliciet gratis vs betaald
- **Benefit cards**: directere taal ("geen vage antwoorden", "precies vertelt wat je moet doen")

### Result page — gratis vs betaald
- **"Jouw gratis inzicht" divider** toegevoegd boven gratis sectie
- **Gratis tip** in grootste-uitgavenpost card: "bezuinig 20% → €X extra/maand"
- **"Kies hoe je verder wilt" sectie**: gestapeld layout (mobile-first), gratis vs €4,99 naast elkaar met volledige feature vergelijking
- **Email capture verwijderd** — maakte belofte die we niet waarmaken in validatiefase

### Upgrade page
- **"Zonder plan vs Met plan" contrast** toegevoegd boven feature lijst — rode kolom (negatief) vs groene kolom (positief)
- **Email capture verwijderd** (zelfde reden als /result)

### WhatsApp share
- **WhatsApp share knop** toegevoegd op /result boven de Twitter/X knop
- Gepersonaliseerde tekst met echte cijfers (€X/maand tekort of haalbaar)

---

## v1.0 - First Sale & Post-Launch Fixes (2026-04-11)

### Betaalflow end-to-end gevalideerd
- Eerste test betaling gedaan (€6,04 incl. 21% BTW), volledige flow werkt
- Webhook ontvangt `order_created`, token in Redis, Brevo magic link verstuurd

### Bugfixes
- **Plan pagina crash gefixt**: Upstash deserialiseert objecten automatisch; oude `JSON.parse(stored)` gooide SyntaxError. Fix: type check `typeof stored === "string"`
- **Idempotency key** slaat nu token op i.p.v. `"processed"` — recovery via `order:{orderId}` mogelijk
- **Webhook** wikkelt Brevo in try/catch — email failure blokkeert order niet meer

### Re-scan zonder opnieuw betalen
- "Scan aanpassen" op `/plan` → `/scan?token=X&{prefill}` met alle ingevulde waarden
- Scan page leest token + alle velden uit URL; submit met token → `/plan?token=X&{nieuwe params}`

### Betere UX na betaling
- `success_url` → `/betaling-gelukt` (was `/plan` → toonde foutscherm zonder token)
- Nieuwe pagina `/betaling-gelukt`: 3 stappen uitleg, contactlink bij geen mail

### Checkout verbeterd
- Introductieprijs badge + ~~€9,99~~ doorgestreept + €4,99
- Value anchor: "Financieel adviseur €150+/uur vs €4,99 eenmalig"
- Trust: "Eenmalig · Geen abonnement · Nooit meer betalen"
- Refund notice: 10 werkdagen

### Docs bijgewerkt
- AI_CONTEXT.md, README.md, PRODUCT_BACKLOG.md volledig actueel

---

## v0.9 - Security, Magic Links & Email (2026-04-10)

### Live betalingen
- LemonSqueezy checkout variant gewisseld van test naar live (variant f636b083)
- Gratis test-bypass knop verwijderd van /checkout

### Magic link beveiliging
- /plan is nu beveiligd via server-side token validatie
- Webhook handler `POST /api/webhooks/lemonsqueezy` verifieert HMAC-SHA256 handtekening
- Na betaling: UUID token opgeslagen in Upstash Redis (TTL 1 jaar) met scan params + email
- Magic link gestuurd via Brevo naar koper: `financios.nl/plan?token={uuid}`
- Legacy localStorage flow (PlanParamsLoader) blijft werken als fallback

### Email capture
- EmailCapture component toegevoegd op /result pagina
- `POST /api/capture-email`: slaat email op in Redis + notificatie naar hallo@financios.nl
- Brevo als email provider (gratis, geen creditcard, verzendt van noreply@financios.nl)

### Share button
- "Deel je resultaat" is nu een echte button met X/Twitter logo
- Tweet tekst gepersonaliseerd met echte cijfers (tekort of benodigde spaarbedrag)

---

## v0.8 - Validation & Monetization Sprint (2026-04-09)

### SEO page added
- New page `/5000-euro-sparen` targeting keyword "5000 euro sparen"
- Includes: intro, monthly savings table (6–36 months), realistic calculation example with income breakdown, 4 tips, 5-question FAQ, two CTAs to `/scan`
- Added to `sitemap.ts` with priority 0.8

### Analytics added
- Plausible Analytics integrated via `next/script` (`strategy="afterInteractive"`) in root layout
- Script: `script.tagged-events.js` — no cookies, GDPR-compliant
- Tracks all page views automatically; CTA clicks tracked via `plausible-event-name` attribute on key links

### Email capture added
- Email input + submit button on `/upgrade` page below pricing card
- Logs email to console as placeholder (no backend required)
- Shows inline success state after submission

### Payment flow prepared (LemonSqueezy)
- `/checkout` now redirects to LemonSqueezy checkout URL (placeholder constant `LEMONSQUEEZY_CHECKOUT_URL`)
- Query params forwarded via `checkout[custom][params]` so `/plan` can receive them after redirect
- Test fallback: direct `/plan` link still visible for testing without payment
- `/upgrade` CTA is now a real `<a>` link to LemonSqueezy (tagged with Plausible event)
- Next step: swap placeholder URL with real LemonSqueezy product URL + configure redirect to `https://financios.nl/plan`

---

## v0.7 - Launch Preparation (2026-04-09)
- **SEO metadata**: `metadataBase` set to `https://financios.nl` in root layout; `title` template (`%s – Financios`) applied to all pages; per-page `description` and `openGraph` on every route
- **robots.ts**: generated `/robots.txt` — allows landing, scan, upgrade, SEO pages; blocks /result, /plan, /checkout (personalized/payment pages)
- **sitemap.ts**: generated `/sitemap.xml` with all 7 indexable routes + priorities
- **Custom 404** (`not-found.tsx`): design-matched dark page with home + scan CTA
- **Security headers** in `next.config.ts`: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection
- **Scan pre-fill from URL**: `/scan?doelNaam=Vakantie&doel=1500&maanden=12` pre-fills the form — enables SEO pages to link into a populated scan
- **SEO page `/vakantie-sparen`**: full Dutch content page targeting "vakantie sparen" keyword — example calculation table, 3 tips, FAQ section, CTA to scan; linked from sitemap
- **15 routes** building cleanly (13 static, 2 dynamic)

## v0.6 - Fake Payment Flow + Full Premium Plan (2026-04-09)
- **New page `/checkout`** — simulated payment confirmation screen with order summary, "Betaal €4,99" CTA, processing state, and success animation before redirecting to `/plan`
- **New page `/plan`** — full post-payment premium output (server component):
  - Payment success banner
  - Prominent recommended target date
  - Personalized 4-week weekly plan with specific actionable tips
  - Full monthly income breakdown with per-category % bars
  - Up to 4 personalized expense reduction suggestions with savings potential
  - 3 progression scenarios (Rustig / Slim / Maximaal) with dates and "Aanbevolen" badge
  - Written conclusion with feasibility verdict
- **New lib `/lib/generatePlan.ts`** — deterministic premium plan generator; derives weekly tasks, breakdown, reductions, scenarios, and conclusion from existing ScanInput + ScanResult (no calculation logic changed)
- **Result page CTA updated**: "Fix mijn spaardoel voor €4,99" now links to `/checkout?[all scan params]` instead of `/upgrade`
- **Checkout page**: clearly marked as test environment (⚠ Testomgeving notice) so it's transparent

## v0.5 - Copy Optimization: /result + /upgrade (2026-04-08)
- **Status badge copy** (not-achievable): "Op dit tempo haal jij [doel] nooit op tijd" + "Dat is geld dat je nu al verliest" — concrete, emotional
- **Status badge copy** (no capacity): "Je geeft meer uit dan je verdient. Zonder concrete aanpassingen is dit doel onhaalbaar."
- **Warning copy**: "Bijna is niet genoeg. Doe je niets, dan mis je [X] in totaal — en haal je je doel niet."
- **Free scenarios subtitle**: reframed to create urgency — "zonder concreet weekplan weet je morgen nog steeds niet hoe"
- **PremiumCard intro**: "Zonder plan gaat er maand na maand voorbij" — loss-aversion framing
- **PremiumCard features**: rewritten to outcome-first ("weet elke week hoeveel je mag uitgeven", "exacte datum", "persoonlijke bezuinigingstips gericht op jóuw kostenpost")
- **Value anchor**: "Dit plan betaalt zichzelf al terug in maand één" — tighter ROI framing
- **/upgrade H1**: "Stop met hopen. Begin met een plan." — direct, no fluff
- **/upgrade subtitle**: "Geen vage tips. Een concreet weekplan gebaseerd op jóuw eigen cijfers."
- **/upgrade section title**: "Wat zit er in het plan?" → "Wat je direct krijgt"
- **/upgrade feature descriptions**: all rewritten to outcome-focused language
- **/upgrade pricing label**: "Eenmalig" → "Eenmalige investering"
- **/upgrade pricing subtext**: added "Minder dan twee koppen koffie" price anchor
- **/upgrade trust line**: added "Direct beschikbaar" to remove hesitation

## v0.4 - Result Page Conversion Optimization (2026-04-08)
- **Page reordered for not-achievable/warning**: gap visualization → premium CTA → free scenarios (was buried last)
- **Stronger status copy**: "Op dit tempo haal je je doel X maanden te laat" — concrete, emotional
- **Total gap impact line**: shows total money missed over the full period (gap × months), not just monthly
- **New GapBar component**: visual split bar showing % covered vs % short — makes the gap visceral
- **3-column gap card**: "Jij spaart / Nodig / Tekort" side by side for instant comprehension
- **PremiumCard redesign**: replaces blur-mystery overlay with a clean, credible checklist card
  - 5 specific features listed with checkmarks
  - CTA: "Fix mijn spaardoel voor €4,99 →" (was "Unlock jouw fix plan")
  - Trust line: "Eenmalig · Direct beschikbaar · Geen abonnement"
  - Value anchor: "Je mist nu €X/maand. Dit plan betaalt zichzelf terug in de eerste maand."
  - Accent header strip for premium feel
- **Warning status now gets premium CTA** (previously had no conversion path)
- **Free scenarios labeled "Gratis inzicht"** to frame them as a teaser, not the full solution
- **Achievable path cleaned up**: only 2 metric cards, scenarios reframed as "hoe je het sneller haalt"

## v0.1 - Project Setup
- Initialized Financios project
- Defined AI-assisted workflow
- Added core documentation files:
  - AI_CONTEXT.md
  - PRODUCT_BACKLOG.md
  - README.md

## v0.2 - MVP Build (2026-04-08)
- Built full MVP in one pass
- Design system: dark theme (#0B0F14 bg, #111827 cards, #6366F1 accent) via Tailwind v4 `@theme inline`
- Landing page (/) with hook, 3 benefit cards, footer with legal links
- Scan page (/scan) — client component with 4 sections: inkomen, vaste lasten, variabele kosten, spaardoel
  - Live spaarruimte preview updates as user types
  - Form validation before submit
  - Passes all values as URL query params to /result
- Calculation engine (lib/calculate.ts)
  - Computes: monthly capacity, required monthly savings, savings gap
  - Status: achievable / warning / not-achievable
  - Biggest expense leak detection
  - 3 fix scenarios (extend timeline, reduce expense, adjust goal)
- Result page (/result) — server component reading searchParams (Next.js 16 async pattern)
  - Status badge with color coding
  - 4 key metric cards
  - Biggest expense leak with progress bar
  - Fix scenarios
  - Locked premium section (blur overlay) for not-achievable goals with CTA
- Upgrade page (/upgrade) — plan preview, €4.99 pricing, Stripe coming soon
- Legal pages: /disclaimer, /privacy, /terms

## v0.3 - UI Polish (2026-04-08)
- Switched font from Geist to **Inter** for sharper SaaS readability
- Added `--shadow-card` design token: subtle depth without heavy gradients
- Added `::selection` with accent color + `scroll-behavior: smooth` globally
- **Cards**: all cards now have `shadow-[var(--shadow-card)]`, consistent `mb-6` spacing
- **Buttons**: primary buttons get `shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide` glow + micro-interaction
- **Inputs**: taller inputs (`py-3.5`), ring-based focus state (`focus:ring-2 focus:ring-accent/30`), styled `€` prefix with separator border
- **Labels**: Stripe-style `text-xs font-medium uppercase tracking-wider` throughout scan form
- **Headings**: `font-semibold tracking-tight` on sub-headings (not hero h1)
- **Nav**: sticky + `backdrop-blur-md bg-background/80` for scroll depth effect
- **BenefitCards**: hover border accent glow on landing page cards
- **MetricCard**: labels upgraded to uppercase style, values bumped to `text-2xl`
- **Section totals**: added `border-t border-border` separator for visual clarity
- **Secondary button**: added `hover:bg-card-hover` for clearer interactive state
- **Legal pages**: `leading-[1.75]` body text, uppercase section headings
- Container width: `max-w-2xl` → `max-w-xl` on scan and result pages for better column readability

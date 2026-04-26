# PRODUCT_BACKLOG.md

## 🧪 VALIDATION PHASE (CURRENT)

- Product wordt getest met familie/vrienden (manual distribution)
- Geen echte marketing of schaalverkeer
- Focus: begrip, usability, clarity en friction detection
- Succes = users kunnen zonder uitleg: scan → result → plan doorlopen

Geen harde conversiepercentages in deze fase.

## 📊 LATER (AFTER VALIDATION)

> Worden pas relevant bij echte traffic. Gebruikt voor optimalisatie na eerste gebruikersvalidatie.

- Homepage → scan start: doel 40%+
- Scan → result: doel 80%+
- Result → checkout click: doel 5–10%
- Checkout → betaling voltooid: doel 50%+
- Overall homepage → betaling: doel 1–3%

---

## ✅ MVP (DONE)

- [x] Landing page (/)
- [x] Scan page UI (/scan) with URL pre-fill support
- [x] Input validation
- [x] Financial calculation logic (lib/calculate.ts)
- [x] Result page (/result) with conversion optimization
- [x] Status badge: achievable / warning / not-achievable
- [x] Gap visualization + savings gap numbers
- [x] Biggest expense leak card
- [x] Fix scenarios (free tier teaser)
- [x] Premium section with conversion-focused CTA
- [x] Upgrade page (/upgrade)

## ✅ UI / DESIGN (DONE)

- [x] Inter font + Tailwind v4 dark design system
- [x] Shadow tokens, Stripe-style labels, glow buttons, focus rings
- [x] Sticky nav with backdrop blur
- [x] Consistent spacing (max-w-xl, mb-6, shadow-card)
- [x] Mobile-first layout
- [x] Animated ambient gradient background (homepage)

## ✅ CONVERSION (DONE)

- [x] Stronger copy on /result (urgency, total gap, loss aversion)
- [x] Stronger copy on /upgrade (outcome-first, price anchoring)
- [x] PremiumCard with checklist + trust line + value anchor
- [x] Warning status gets premium CTA (was missing)
- [x] Homepage redesign: How it works + Voorbeelden + Trust CTA
- [x] Scan: dynamic subscription list (per abonnement naam + bedrag)
- [x] Scan: schrikmoment card — jaarlijkse kosten + vergelijking met NL-gemiddelde
- [x] Result: "Jij laat €X per maand liggen" copy boven betaald plan features
- [x] Result: grotere CTA knop + "betaalt zichzelf terug in maand één"

## ✅ MONETIZATION (DONE)

- [x] Full premium plan output page (/plan)
- [x] lib/generatePlan.ts (deterministic, no external deps)
- [x] LemonSqueezy checkout wired (test mode → live in ~3 days)
- [x] Redirect after payment → /plan (localStorage + checkout[success_url])
- [x] End-to-end payment flow validated with test payment

## ✅ ANALYTICS & VALIDATION (DONE)

- [x] PostHog EU installed (posthog-js, provider, SPA page view tracking)
- [x] NEXT_PUBLIC_POSTHOG_KEY + NEXT_PUBLIC_POSTHOG_HOST deployed to Vercel
- [x] Email capture on /upgrade (console placeholder)
- [x] Google Search Console verified + sitemap submitted (8 pages indexed)

## ✅ SEO (DONE)

- [x] /vakantie-sparen
- [x] /5000-euro-sparen
- [x] /10000-euro-sparen
- [x] /auto-sparen
- [x] Per-page metadata (title, description, OG)
- [x] sitemap.xml + robots.txt
- [x] SEO pages linked from homepage

## 🔥 NEXT — TRACK & CONVERT (CRITICAL)

- [x] Fix CTA event tracking: PostHog captures on checkout + upgrade buttons
- [x] Switch LemonSqueezy from test → live mode
- [x] Wire email capture to real service (Brevo, gratis)
- [x] Rate limiting op /api/capture-email (3 req/hr per IP, Upstash)
- [x] First real sale — validate willingness to pay (test betaling gedaan, flow werkt)

## 📊 AFTER FIRST DATA (1–2 weeks)

- [ ] Check PostHog funnel: homepage → scan → result → checkout → plan
- [x] Identify biggest drop-off in funnel and fix it — Chrome desktop 7.69% stap 1→2; mid-page CTA toegevoegd aan alle 7 SEO-pagina's
- [ ] A/B test CTA copy if conversion < 2%

## 🧠 PRODUCT (AFTER FIRST SALES)

- [ ] AI-generated personalization text (Claude API)
- [ ] Improve premium plan depth (more tailored advice)
  - [x] Fix scenario inconsistency (fast < medium when expenses are low)
  - [x] Smarter bezuinigingstips (skip categories with €0 spend)
  - [x] Motivational element: week checklist — interactieve checkboxes op /plan met localStorage persistentie
- [x] More SEO pages (/huis-sparen, /bruiloft-sparen, /studie-sparen live)
- [ ] Abonnement model — pas bouwen als accounts bestaan (gebruiker wil terugkeren voor voortgang)
- [x] Re-scan zonder opnieuw betalen — token pass-through via /scan?token=X

## 🔒 POST-LAUNCH: SERVER-SIDE ENTITLEMENT VALIDATION (P1 — AFTER LAUNCH)

> Current MVP uses client-side state (localStorage) for premium access. Acceptable for launch. Must be fixed after first sales to protect revenue at scale.

- [x] **Server-side entitlement validation geïmplementeerd**
  - Lemon Squeezy webhook (`order_created`) verifieert handtekening en genereert UUID token
  - Token + scan params opgeslagen in Upstash Redis (TTL 1 jaar)
  - `/plan?token=xxx` valideert server-side via Redis lookup
  - localStorage fallback (PlanParamsLoader) blijft werken voor bestaande users

## 🔮 POST-LAUNCH: PLAN PERSISTENCE (HIGH PRIORITY — NA EERSTE SALES)

> Bewust uitgesteld. Eerst valideren dat users willen betalen, dan pas bouwen.

- [x] **Magic link plan access** — geïmplementeerd
  - Na betaling ontvangt de user een magic link via Brevo email
  - Link formaat: `/plan?token=xxxxx` — werkt op elk apparaat / elke browser
  - Token opgeslagen in Upstash Redis met scan params

## 📧 EMAIL INFRA (NA LIVE LAUNCH)

> Na eerste sales opzetten. Niet eerder.

- [x] @financios.nl emailadressen aanmaken (hallo@, support@, privacy@, noreply@) — forwarding via ImprovMX → joshuapole@live.nl
- [x] Transactionele emails via Brevo (betalingsbevestiging + magic link na aankoop)
- [ ] Klantenupdates / nieuwsbrief sturen vanuit @financios.nl

## 📄 FUTURE (ONLY AFTER TRACTION)

- [ ] PDF export van /plan pagina
- [x] User authentication / accounts + database — magic link auth via Brevo, Neon PostgreSQL
- [x] Dashboard met meerdere spaardoelen — /dashboard/spaardoelen met voortgangsbalk
- [x] Investments importeren & bijhouden — /dashboard/assets (spaar/belegging/crypto/overig)
- [ ] Calculators (pensioen, hypotheek, FIRE)
- [ ] Abonnement model (alleen nadat accounts bestaan)

## 🔥 POSITIONING, CLARITY & FREE VS PAID STRUCTURE (HIGH PRIORITY)

> Feedback: positionering te breed, gratis vs betaald onduidelijk, waarde niet duidelijk voor betaling.
> Doel: conversie verhogen door helderheid — geen nieuwe gratis features toevoegen.

### 1. Focus op één concreet pijnmoment (core positionering)
- [x] Homepage hero herschrijven: h1 "Waarom ben jij altijd blut?" + subtitle "Het is de 20ste. Je saldo klopt alweer niet."
- [x] Copy concreet maken, niet generiek — één gevoel centraal
- [x] Zelfde positionering doorvoeren op /result page
- [ ] SEO pagina's geleidelijk aanpassen

### 2. Copy verbeteren met echte gebruikerstaal
- [x] Generieke financiële taal vervangen: steps, benefit cards, result page copy
- [ ] Toepassen op SEO pagina's

### 3. Meer waarde zichtbaar maken vóór betaling
- [x] 1 concrete bespaartip gratis tonen op /result (20% bezuiniging op grootste kostenpost)
- [x] Premium plan blijft achter betaalscherm

### 4. Visuele scheiding GRATIS vs BETAALD (KRITISCH)
- [x] "Jouw gratis inzicht" divider label op /result
- [x] Gratis gedeelte: status, spaarruimte, grootste kostenpost, 1 tip, scenario's
- [x] Gratis gedeelte bevat NIET: weekplan, breakdown, exacte datum
- [x] Tekst: "Zonder concreet weekplan weet je morgen nog steeds niet hoe"

### 5. Expliciete "Kies hoe je verder wilt" sectie
- [x] Gratis inzicht vs Persoonlijk plan (€4,99) — gestapeld op mobiel, leesbaar

### 6. Upgrade sectie verduidelijken
- [x] Visueel contrast: "Zonder plan" vs "Met plan" op /upgrade
- [ ] SEO pagina's copy aanpassen aan positionering

### ⚠️ NIET DOEN IN DEZE FASE
- [ ] Geen freemium model introduceren — alleen conversie-helderheid verbeteren
- [ ] Geen extra gratis features — focus op positionering en structuur

---

## 🎨 BRANDING & SITE VERBETERING

- [x] Custom OG image (social preview bij delen van link)
- [ ] Logo — nu alleen tekst, overweeg een simpel icoon (spaarpot, grafiek)
- [ ] Testimonials sectie op homepage zodra eerste echte reviews binnenkomen
- [x] "Voor & na" vergelijking op homepage — concreet voorbeeld met cijfers
- [ ] Vertrouwensbadges op checkout: "Veilig betalen", "10.000+ gebruikers" (zodra waar)
- [ ] Animated number counter op homepage (bijv. "€X bespaard door gebruikers")

## 📱 SOCIAL MEDIA & PROMOTIE

### TikTok / Instagram Reels ideeën
- [ ] "Doe de scan live" format — schermopname van iemand die de scan invult
- [ ] "Ik heb €X/maand verspild zonder het te weten" hook → scan resultaat reveal
- [ ] "Reageer met je maandinkomen, ik bereken je spaarruimte" engagement format
- [ ] Before/after: chaotisch budget vs Financios plan
- [ ] "POV: je wilt €5000 sparen maar weet niet hoe" → product demo

### Groei mechanismen
- [x] WhatsApp share knop op /result ("Deel met een vriend die ook wil sparen")
- [ ] Referral systeem: "Deel Financios, krijg 1 gratis herberekening" (na accounts)
- [x] "Bereken voor je partner/vriend" CTA op plan pagina
- [ ] Affiliate / creator deal: Nederlandse finance creators (kleine commissie per sale)

### SEO uitbreiding
- [x] /noodfonds-opbouwen
- [x] /huurweek-overleven — specifiek Nederlands pijnmoment (Reddit-tip: "rent week panic"), hoge emotionele lading
- [x] /pensioen-sparen-jongeren
- [x] /fire-beweging-nederland
- [x] /beleggen-beginnen (calculator)
- [x] Blog: "Hoeveel moet je sparen per maand?" — /hoeveel-moet-je-sparen-per-maand live

### Copy & taal
- [ ] Real Dutch language sourcing: zoek r/geldzaken + r/thenetherlands op "ik hou niks over", "huurweek", "salaris op" voor copy-iteraties op homepage en result page

## 🚨 FUNNEL ANALYSE — 13 april 2026 (7-daags)

> 66 bezoekers, 16.67% totale conversie (3 pagina's diep), 77% single-page bounce.
> Grootste lek: homepage → scan (77.27% drop). Chrome desktop converteert slechter (10.81%) dan Mobile Safari (21.74%).

### Prioriteit: homepage → scan drop-off fixen

- [x] **Pricing eerder zichtbaar op homepage** — "Gratis scan · Plan voor €4,99 eenmalig · Geen account" onder de CTA knop
- [x] **CTA aanpassen op desktop** — knop groter op desktop (sm:px-12 sm:py-5 sm:text-xl) + trust badges
- [x] **"60 seconden" claim versterken** — 4-stap voortgangsindicator op /scan die meebewegt met ingevulde velden

### Homepage copy & trust

- [x] **"Voor & na" cijfers concreter** — ronde getallen vervangen door oneven bedragen (€2.847, €1.163, €1.034, €312) zodat het op echte data lijkt
- [x] **Disclaimer herformuleerd** — "Financios is een rekentool, geen financieel adviseur. Uitkomsten zijn berekeningen op basis van jouw invoer — geen advies."

---

## 📝 BLOG / CONTENT HUB

> Huidige SEO-pagina's staan geïndexeerd op root URLs — NIET verplaatsen.
> Wel een /blog index maken die ze allemaal linkt voor interne linking, SEO-autoriteit en geloofwaardigheid.

- [x] **`/blog` index pagina** — grid van alle content-artikelen + calculators. Twee categorieën: "Spaardoelen" en "Slimmer sparen". Links naar bestaande pagina's, geen 301 redirects.
- [x] **Blog link in navigatie** — sticky nav uitbreiden met "Blog" naast de huidige items (alle 13 SEO-pagina's + homepage)
- [x] **Interne links vanuit SEO-pagina's naar blog index** — "← Bekijk alle spaargidsen" bovenaan elke pagina
- [x] **Volgende blog artikelen** live:
  - [x] /geld-besparen-tips — 15 tips met bespaartabel per categorie
  - [x] /maandbudget-maken — 5-stappen gids + voorbeeldbudget modaal inkomen
  - [x] /spaardoelen-stellen — SMART-doelen uitleg + prioriteitenlijst

---

## 🚀 TRAFFIC GENEREREN (HUIDIGE PRIORITEIT)

> Codeerwerk is grotendeels klaar. Bottleneck is nu traffic — meer bezoekers zodat
> PostHog funnel betekenis krijgt en je weet wat je moet optimaliseren.

### SEO (passief, langzaam)
- [ ] Google Search Console: controleer welke pagina's al ranken en op welke zoekwoorden
- [ ] Nieuwe blog artikelen schrijven op basis van keywords die bijna op pagina 1 staan
- [ ] Interne linking audit: elke pagina linkt naar minimaal 2 andere pagina's

### Organisch / community
- [ ] Reddit: r/geldzaken, r/thenetherlands — waardevolle reacties posten (geen spam, echte hulp + link als relevant)
- [ ] TikTok/Instagram: "Doe de scan live" — schermopname scan invullen met eigen cijfers
- [ ] WhatsApp: scan doorsturen naar vrienden/familie met persoonlijk berichtje

### Betaald (pas na organische validatie)
- [ ] Meta Ads: klein testbudget (€5–€10/dag) op "geld besparen tips" doelgroep NL
- [ ] Google Ads: branded + "spaarplan maken" zoekwoorden

---

## ⚠️ DECISIONS

- [ ] Payment provider: LemonSqueezy (current) vs Stripe + iDEAL (later, vereist KVK)
- [x] Introduce accounts ONLY after returning users exist — accounts gebouwd april 2026

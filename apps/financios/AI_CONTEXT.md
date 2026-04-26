# AI_CONTEXT.md

## Project
Financios — Persoonlijk Spaarplan tool voor de Nederlandse markt. Gebruikers vullen hun financiële situatie in, zien een gratis analyse, en kopen een persoonlijk spaarplan voor €4,99 eenmalig.

## Target Users
Gen Z (18–30), Nederland. Mensen met een spaardoel (vakantie, auto, bruiloft, huis, studie). Eerste keer budgetteren — geen financieel jargon.

## Live Stack
- **Next.js 16.2.2** App Router — server components, `searchParams: Promise<...>`
- **Tailwind v4** — `@theme inline` design tokens, geen tailwind.config
- **Upstash Redis** (`@upstash/redis`, `@upstash/ratelimit`) — token storage, idempotency
- **Brevo** — transactionele email via fetch (geen SDK), `noreply@financios.nl`
- **Lemon Squeezy** — betaling, Merchant of Record, live variant `f636b083`
- **PostHog EU** — analytics + funnel tracking
- **Vercel** — deployment
- **ImprovMX** — email forwarding `@financios.nl` → `joshuapole@live.nl`

## Scan Form Velden
- `inkomen` — maandelijks netto inkomen
- `huur` — huur of hypotheek
- `abonnementen` — **totaal** abonnementen (geserialiseerd als getal in URL); in de UI een dynamische lijst van rijen (naam + bedrag per abonnement), totaal wordt berekend bij submit. Schrikmoment card toont maand/jaar totaal vs NL-gemiddelde (€150/maand).
- `verzekeringen` — zorg, auto, inboedel
- `boodschappen`, `vervoer`, `horeca`, `overig` — variabele kosten
- `doel` — doelbedrag spaardoel
- `spaargeld` — huidig spaargeld
- `maanden` — tijdsdoel in maanden (default 12)
- `doelNaam` — naam spaardoel (optioneel)

## Betaalflow
1. `/checkout` → LS URL met `checkout[custom][params]` + `success_url=/betaling-gelukt`
2. LS webhook `POST /api/webhooks/lemonsqueezy` → HMAC-SHA256 → UUID token → Redis `plan:{token}` (TTL 1 jaar) → Brevo magic link
3. Idempotency: `order:{orderId} = token` (recovery mogelijk via order ID)
4. `/plan?token=X` → server valideert → plan gerenderd
5. Re-scan: `/scan?token=X&{prefill}` → submit → `/plan?token=X&{nieuwe params}`

## Environment Variables (Vercel)
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
- `BREVO_API_KEY`
- `LEMONSQUEEZY_WEBHOOK_SECRET` (40 hex chars)
- `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST`

## Design System
- Background `#0B0F14` · Card `#111827` · Accent `#6366F1` · Font Inter
- `--shadow-card` token · Mobile-first · `max-w-xl` content, `max-w-5xl` checkout

## Pagina's
`/` `/scan` `/result` `/checkout` `/betaling-gelukt` `/plan` (token-gated) `/upgrade`
Blog hub: `/blog`
SEO/blog: `/vakantie-sparen` `/auto-sparen` `/5000-euro-sparen` `/10000-euro-sparen` `/huis-sparen` `/bruiloft-sparen` `/studie-sparen` `/noodfonds-opbouwen` `/huurweek-overleven` `/pensioen-sparen-jongeren` `/fire-beweging-nederland` `/beleggen-beginnen` `/hoeveel-moet-je-sparen-per-maand` `/geld-besparen-tips` `/maandbudget-maken` `/spaardoelen-stellen`
Legal: `/privacy` `/terms` `/disclaimer`

## API Routes
- `POST /api/webhooks/lemonsqueezy` — betaling + token
- `POST /api/capture-email` — email capture, rate limited (3/hr per IP)

## Regels
- Simpelste oplossing eerst — geen overengineering
- Geen accounts totdat er een echte reden is (meerdere doelen, voortgang)
- Geen abonnement totdat accounts bestaan
- Deterministische berekeningen — geen AI in de berekening zelf
- GDPR: Upstash/Brevo/LS/PostHog gedocumenteerd in /privacy
- Herroepingsrecht vervalt bij openen digitaal product (art. 6:230p BW)
- Altijd disclaimer: dit is GEEN financieel advies

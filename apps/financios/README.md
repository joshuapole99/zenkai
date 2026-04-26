# Financios

Nederlandstalige SaaS tool die Gen Z helpt hun spaarsituatie begrijpen en een persoonlijk spaarplan koopt voor €4,99 eenmalig.

**Live:** [financios.nl](https://financios.nl)

## Wat het doet
1. Gebruiker vult inkomen, vaste lasten en spaardoel in (`/scan`)
2. Gratis analyse met status, grootste kostenlekpost en 3 scenario's (`/result`)
3. Betaalt €4,99 via Lemon Squeezy (`/checkout`)
4. Ontvangt magic link via email → persoonlijk weekplan, breakdown, bezuinigingstips (`/plan`)
5. Kan scan herhalen zonder opnieuw te betalen (`/scan?token=X`)

## Stack
- Next.js 16.2.2 (App Router, server components)
- Tailwind v4 (`@theme inline`)
- Upstash Redis — token storage + rate limiting
- Brevo — transactionele email
- Lemon Squeezy — betaling (Merchant of Record)
- PostHog EU — analytics
- Vercel — deployment

## Lokaal draaien

```bash
npm install
cp .env.example .env.local   # vul env vars in
npm run dev
```

### Vereiste env vars
```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
BREVO_API_KEY=
LEMONSQUEEZY_WEBHOOK_SECRET=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

## Project structuur
```
src/app/
  page.tsx              # Landing
  scan/                 # Formulier
  result/               # Gratis analyse
  checkout/             # Betaalbevestiging
  betaling-gelukt/      # Na betaling succes pagina
  plan/                 # Premium plan (token-gated)
  upgrade/              # Alternatieve salespagina
  [seo-pages]/          # vakantie-sparen, auto-sparen, etc.
  api/
    webhooks/lemonsqueezy/  # Betaling → token → email
    capture-email/          # Email capture

src/lib/
  calculate.ts          # Berekening engine
  generatePlan.ts       # Premium plan generator
  redis.ts              # Upstash client
  email.ts              # Brevo helper
```

## Context bestanden
- `AI_CONTEXT.md` — architectuur, stack, regels
- `PRODUCT_BACKLOG.md` — wat er nog gebouwd moet worden
- `CHANGELOG.md` — wat er gebouwd is

## Disclaimer
Financios geeft geen financieel advies. Alle resultaten zijn schattingen voor informatieve doeleinden.

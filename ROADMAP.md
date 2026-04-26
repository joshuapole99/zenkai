# Zenkai Platform — Roadmap

## Monorepo structure

```
zenkai/
├── apps/
│   ├── web/        → zenkai.nl          (Vercel: root = apps/web)
│   ├── scanner/    → scanner.zenkai.nl  (Vercel: root = apps/scanner)
│   ├── financios/  → financios.zenkai.nl
│   └── jobs/       → jobs.zenkai.nl
└── packages/
    └── ui/         → @zenkai/ui design tokens
```

**Vercel setup per project:**
- Set "Root Directory" to `apps/web` for zenkai.nl
- Set "Root Directory" to `apps/scanner` for scanner.zenkai.nl
- Repeat for each subdomain app

---

## Status

| Tool              | Domain                   | Status     |
|-------------------|--------------------------|------------|
| SenseiScan        | scanner.zenkai.nl        | Waitlist   |
| Financios         | financios.zenkai.nl      | Live       |
| Sollicitatie Coach| jobs.zenkai.nl           | Live       |
| Zenkai Workout    | zenkai.nl/dashboard      | Live       |

---

## Phase 3 — Shipping (current)

- [x] Monorepo migration (apps/web, apps/scanner, packages/ui)
- [x] Design tokens in @zenkai/ui
- [x] zenkai.nl homepage (hero, 4 product cards, about, blog, hamburger nav)
- [x] scanner.zenkai.nl landing (SenseiScan, 7 checks, pricing, waitlist)
- [ ] Deploy apps/web to Vercel (update Root Directory)
- [ ] Deploy apps/scanner to Vercel (new project, root = apps/scanner)
- [ ] Connect scanner.zenkai.nl subdomain

## Phase 4 — SenseiScan MVP

- [ ] Backend: domain scan engine (SSL, DNS, headers, open ports, email auth)
- [ ] PDF report generation
- [ ] Stripe payment (€29 one-time, €49 monitored)
- [ ] Email delivery of PDF report
- [ ] Launch to waitlist

## Phase 5 — Platform

- [ ] Unified login across subdomains (shared JWT/session)
- [ ] zenkai.nl dashboard overview (all tools in one place)
- [ ] Blog CMS (MDX or Contentlayer)
- [ ] Newsletter (building in public)

## Phase 6 — Financios v2

- [ ] Bank import (Nordigen/GoCardless API)
- [ ] Category AI (auto-tag transactions)
- [ ] Subscription detection

## Feature flags (locked)

```typescript
export const FEATURES = {
  enemies: false,
  bosses: false,
  friends: false,
  leaderboard: false,
  co_op: false,
  character_evolution: false,
  weekly_bosses: false,
}
```

These stay `false` until explicitly enabled.

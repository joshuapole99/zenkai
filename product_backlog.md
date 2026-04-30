# Product Backlog (archived — workout app)

> Active backlog has moved to **[BACKLOG.md](./BACKLOG.md)**
> This file is kept for workout app history only.

---

## Bugs (Known Issues)
- [x] Timezone display — Netherlands (UTC+2) showed Saturday instead of Friday — FIXED
- [x] Can't add workouts if onboarding step 5 was skipped — FIXED
- [x] "Design your workouts" button missing from dashboard when no plan — FIXED

## Done

### Phase 1 — Core Coach (COMPLETE - April 24, 2026)
- [x] Landing page rewrite — "The reason you quit isn't discipline. It's guilt."
- [x] Auth system (signup/login/logout)
- [x] Onboarding flow — 5 steps: fighter type, weak spot, training days, time of day, first week design
- [x] Custom workout setup — user enters own exercises (name + detail), picks days + time
- [x] Weekly calendar dashboard — shows workout/rest/done/today per day
- [x] Workout logging API (/api/workout/complete)
- [x] Streak tracking
- [x] Zenkai Boost mechanic — triggered after 3 missed days
- [x] Weak spot memory — coach messages keyed to user's weak spot
- [x] Fighter type identity — stored in onboarding, shown in dashboard
- [x] Post-workout moment screen
- [x] Master Kael NPC — coach voice in dashboard
- [x] Founding Member system — auto-detected via waitlist cross-check
- [x] Privacy + Terms pages
- [x] PWA manifest
- [x] Security audit — JWT secret required in prod, rate limiting, input validation, debug reset guarded
- [x] Rate limiting — 10 login/IP/15min, 5 signup/IP/hour

### Phase 2 — Retention & Intelligence (COMPLETE - April 24, 2026)
- [x] Grace day — 1x per week automatic streak protection when workout missed (/api/workout/grace)
- [x] Weekly pattern insight — detects most-skipped day over 4 weeks, shows coach nudge
- [x] Exit survey — "What got in the way?" 4-tap card when workout missed (/api/workout/survey)
- [x] Weekly coach summary — Sunday wrap-up card: X/Y workouts + Kael message
- [ ] Smart reminders — push notification at user's chosen time (needs service worker + VAPID, deferred)
- [x] Comeback friction reducer — handled by existing Zenkai Boost mechanic
- [ ] Adaptive difficulty — deferred to Phase 3
- [ ] Cohort monitoring — D1/D3/D7/D30 internal dashboard (deferred)

## Todo

### Phase 3 — Gamification Layer (OPTIONAL — only if Phase 2 retention is proven)
- [ ] XP and level progression — secondary display, not primary motivation
- [ ] Character progression / stages — visual changes every N workouts
- [ ] Story arc segments — unlock after 7 days of consistency
- [ ] Achievement badges — consistency milestones (7-day, 30-day, etc.)

### Phase 4 — Social (ONLY IF USERS ASK — NEVER LEADERBOARD)
- [ ] Accountability partner — 2-person pair only, not groups
- [ ] Shared weekly check-ins — see partner's week, send a reaction

### Monetization
- [ ] Lemon Squeezy payments (7-day trial → €4.99/month)
- [ ] Resend email integration — transactional emails (welcome, weekly recap)

### Deferred from Phase 2
- [ ] Smart reminders — push notification at user's chosen time (requires service worker + VAPID keys)
- [ ] Adaptive difficulty — suggest lighter workout based on absence length
- [ ] Cohort monitoring — D1/D3/D7/D30 retention tracking (internal dashboard)

---

## Won't Build
- ❌ Enemies & combat system
- ❌ Weekly boss fights
- ❌ Leaderboard (public or friends)
- ❌ Co-op mode
- ❌ Character visual evolution (moved to Phase 3 only if needed)
- ❌ Custom character creator
- ❌ Daily food/HP logging
- ❌ Exercise swap mechanic
- ❌ Pre-built daily quest library
- ❌ Global XP ranking

---

## Build Priority (next)
1. Lemon Squeezy payments
2. Resend email — welcome + weekly recap
3. Cohort monitoring (internal)
4. Smart reminders (push notifications)
5. Phase 3 gamification (only if D30 retention >20%)

---

## Design Principle
Every feature must answer: "Does this help users stay consistent?"
If not, we don't build it.

## Metrics We're Tracking (Beta)
- D1 retention: % users return day 1
- D3 retention: % users return after first miss
- D7 retention: % users active after 1 week
- Streak length distribution
- Grace day usage rate
- Exit survey reason distribution
- Time to Zenkai Boost trigger

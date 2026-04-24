# Product Backlog

## Bugs (Known Issues)
- [ ] Timezone display — Netherlands (UTC+2) showed Saturday instead of Friday — CRITICAL
- [ ] Can't add workouts if onboarding step 5 was skipped — HIGH
- [ ] "Design your workouts" button missing from dashboard when no plan — HIGH

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

## Todo

### Phase 2 — Retention & Intelligence (NEXT)

High impact (build now):
- [ ] Streak pause / grace day — 1 per week automatic, no guilt
- [ ] Weekly pattern insight — "You skip Thursdays" detected from logs
- [ ] Exit survey — "What got in the way?" 4-tap options when workout missed
- [ ] Weekly coach summary — Sunday: "You did X workouts, weak spot was Y"
- [ ] Smart reminders — push notification at user's chosen time of day

Nice-to-have:
- [ ] Comeback friction reducer — special re-entry screen after 3+ days absent
- [ ] Adaptive difficulty — suggest lighter workout based on absence length
- [ ] Cohort monitoring — D1/D3/D7/D30 retention tracking (internal dashboard)

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

## Build Priority
1. Fix known bugs (timezone, no-plan dashboard state)
2. Grace day mechanic
3. Weekly pattern insight
4. Exit survey
5. Smart reminders / push notifications
6. Weekly coach summary
7. Lemon Squeezy payments
8. Resend emails
9. Cohort monitoring (internal)
10. Phase 3 gamification (only if D30 retention >20%)

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
- Time to Zenkai Boost trigger

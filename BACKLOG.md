## Zenkai Product Backlog

### Phase 1 — Core Coach ✓ (COMPLETE - April 24)
- [x] Custom workout setup in onboarding
- [x] Weekly calendar dashboard
- [x] Workout logging API
- [x] Streak tracking
- [x] Weak spot memory (onboarding)
- [x] Fighter type identity
- [x] Zenkai Boost mechanic (3 days trigger)
- [x] Post-workout moment screen
- [x] Landing page rewrite ("The reason you quit...")
- [x] Security audit & fixes
- [x] Rate limiting on auth routes

### Phase 2 — Retention & Intelligence (NEXT)
High impact (build now):
- [ ] Streak pause / grace day (1 per week automatic)
- [ ] Weekly pattern insight ("You skip Thursdays")
- [ ] Exit survey (push: "What got in the way?" with 4 taps)
- [ ] Weekly coach summary (Sunday: "You did X workouts, weak spot was Y")
- [ ] Smart reminders at user's chosen time

Nice-to-have:
- [ ] Comeback friction reducer (special re-entry screen after 3 days)
- [ ] Adaptive workout difficulty based on absence length
- [ ] Cohort monitoring (D1/D3/D7/D30 retention tracking)

### Phase 3 — Gamification Layer (OPTIONAL - AFTER PHASE 2)
Only build if retention is proven:
- [ ] XP and level progression (secondary, not primary)
- [ ] Character progression / stages
- [ ] Story arc segments (unlock after 7 days)
- [ ] Achievement badges (consistency milestones)

### Phase 4 — Social (ONLY IF DATA SUPPORTS - NEVER LEADERBOARD)
Only build if users ask for it:
- [ ] Accountability partner (2-person pair, not group)
- [ ] Shared weekly check-ins
- [ ] NO public leaderboard (principle)

### Known Issues
- [ ] Timezone display (showing Sat when it's Fri) — CRITICAL
- [ ] Can't add workouts if onboarding step 5 skipped — HIGH
- [ ] Need "Design your workouts" button on dashboard — HIGH

### REMOVED (Won't Build)
- ❌ Enemies & combat system
- ❌ Weekly boss fights
- ❌ Leaderboard (public or friends)
- ❌ Co-op mode
- ❌ Character visual evolution
- ❌ Custom character creator
- ❌ Daily food/HP logging
- ❌ Story arc narrative (moved to Phase 3, optional)

### Metrics We're Tracking (Beta)
- D1 retention: % users return day 1
- D3 retention: % users return after first miss
- D7 retention: % users active after 1 week
- Streak length distribution
- Grace day usage rate
- Time to Zenkai Boost trigger

### Design Principle
Every feature must answer: "Does this help users stay consistent?"
If not, we don't build it.

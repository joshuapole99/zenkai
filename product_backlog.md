# Product Backlog

## Bugs
- [x] "Level 10 / 100 XP" shows incorrect level number — fixed: flat 100 XP/level formula
- [x] Plank quest shows "Done" incorrectly on first load — fixed: Number() coercion + force-dynamic + DATE cast
- [x] Streak not updating correctly — fixed: PostgreSQL interval math instead of JS date arithmetic

## Done
- [x] Landing page
- [x] Waitlist email form
- [x] PWA manifest
- [x] English copy
- [x] Auth system (signup/login)
- [x] Character creation (onboarding flow, 4 steps)
- [x] Dashboard with daily quests
- [x] XP system (level, XP bar, +100 XP per day)
- [x] Streak counter
- [x] Food check (daily HP log — yes/no)
- [x] Privacy + Terms pages
- [x] UI polish — no emojis, Linear-inspired, orange/purple accents
- [x] Hero redesign — anime game aesthetic, power scouter, stat cards
- [x] Story data — 7-day Origin Arc + Zenkai Boost arc (lib/story.ts)
- [x] Exercise library — 27 exercises in Neon DB (push/pull/legs/core/cardio × beginner/intermediate/advanced)
- [x] Exercise swap feature — inline picker, saves per day, resets next day
- [x] Founding Member system — auto-detected on signup via waitlist cross-check; gold badge + name in dashboard; special onboarding screen; open beta messaging on signup + landing page
- [x] Story engine — daily RPG narrative flow: story screen → workout → completion screen; typewriter text; Zenkai Boost trigger; next chapter teaser; story_day progression saved per user
- [x] Visual structure — lib/visuals.ts asset registry; placeholder system; story screen background + NPC per day; character image on dashboard

## Todo

### Core product
- [ ] Zenkai Boost arc: expand with more story arcs beyond day 7
- [ ] Side quests: unlocked after main quest complete
- [ ] Arc system: week 1 Origin Arc, week 2 Saiyan Warrior Arc
- [ ] Zenkai Boost mechanic (comeback quest when streak breaks)
- [x] Body stats onboarding: weight, height, age — step 4 in onboarding flow; skip option available
- [x] Protein calculator: weight_kg × 1.8 = daily protein goal in grams; shown on dashboard under HP bar
- [ ] Custom workout selection: user picks their own exercises per session from exercise library
- [ ] Daily food log: full meal input with protein/calories (replaces yes/no check)
- [ ] Character visual evolution: avatar changes every 5 levels (original designs, anime-inspired, no IP)
- [ ] Weekly boss quest: harder challenge every Sunday
- [ ] Workout history / XP log
- [ ] Gym + home workouts: user chooses workout environment per session
- [ ] Push notifications (daily quest reminder)

### Monetization
- [ ] Lemon Squeezy payments (7-day trial → €4.99/month)
- [ ] Resend email integration (RESEND_API_KEY in Vercel) — transactional emails

### Enemies & Combat
- [ ] Daily enemies: each story day has a weak enemy defeated by completing the workout
- [ ] Enemy HP bar goes down as each exercise is completed
- [ ] Enemy types: grunt fighters, shadow warriors, corrupt monks (original designs, no IP)
- [ ] Enemy defeated animation when all quests done

### Weekly Boss
- [ ] Every 7 days: a boss fight requiring all quests + side quest
- [ ] Boss defeated = arc complete + special XP reward
- [ ] Week 1 boss: The Shadow General
- [ ] Week 2 boss: Ryo (rival becomes boss)
- [ ] Week 3 boss: A corrupted version of yourself

### Friends & Co-op
- [ ] Friends system: search by username, send/accept/decline requests
- [ ] View friends' power level and streak
- [ ] Co-op story: two players share a story arc
- [ ] Co-op quests: both must complete workout for it to count
- [ ] Shared power level boost when both players train on the same day

### Leaderboard
- [ ] Global XP ranking (top 100 visible)
- [ ] Weekly streak ranking
- [ ] Power level ranking
- [ ] Friends-only leaderboard
- [ ] Your own rank always visible regardless of position

### Social / Growth
- [ ] Instagram content strategy — @zenkai_app (1 platform focus, consistent posting)

### Depth
- [ ] Custom character creator: users design their own original anime-inspired character (no licensed IP)

---

## Build Priority
1. Fix bugs
2. Story engine (show story intro/completion in dashboard)
3. Body stats + protein calculator
4. Zenkai Boost mechanic
5. Custom workout selection from library
6. Full food tracking
7. Lemon Squeezy payments
8. Resend emails
9. Anime story mode arc system + enemies
10. Weekly boss fights
11. Character visual evolution
12. Push notifications
13. Leaderboard
14. Friends system
15. Co-op mode
16. Custom character creator

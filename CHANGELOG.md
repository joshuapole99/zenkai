## [0.2.0] - 2026-04-24

### Changed
- **MAJOR PIVOT**: Zenkai is now a custom workout coach focused on consistency, not an anime RPG
- Landing page rewritten: "The reason you quit isn't discipline. It's guilt."
- Onboarding step 5: Users now design their own workouts (exercises, days, time of day)
- Dashboard completely rebuilt: Weekly calendar view instead of pre-built quests
- Removed: EnemyCard, HP bar, story arc from critical path, bosses, leaderboard, co-op
- Removed: Pre-built daily quests — replaced with user's custom workouts

### Added
- Custom workout setup in onboarding
- Workout logging API (/api/workout/complete)
- Weekly calendar view with scheduled workouts
- Smart coach messages based on weak spot
- "Design your workouts" button for users without a plan

### Fixed
- Security: JWT secret now required in production (no fallback)
- Security: Rate limiting on auth routes (10 login/IP/15min, 5 signup/IP/hour)
- Bug: Week counter now shows correct denominator (all scheduled workouts this week)
- Bug: Input validation and length caps (exercises 50 chars max)
- Bug: Database migrations auto-heal "squads" → "Squats"
- Bug: Reset endpoint only works in dev (403 in production)

### Security
- Added rate limiting to /api/auth routes
- Input sanitization and length validation
- SQL injection prevention verified
- XSS prevention in React components
- Password hashing with bcrypt verified

---

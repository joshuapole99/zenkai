# Changelog

## [Unreleased]

### Added
- **Story engine** — daily narrative RPG flow using data from `lib/story.ts`
  - `story_day` + `last_story_date` columns added to users table (lazy migration)
  - On dashboard load: if story not read today → `StoryScreen` overlay renders first (full-screen)
  - `StoryScreen`: chapter badge, chapter title, RPG dialogue box with "Master Kael" speaker chip, typewriter text reveal (22ms/char), tap-to-reveal-all, "Accept Quest" button, skip option; orange/purple theme; gold theme for Zenkai Boost
  - On "Accept Quest": POST `/api/story/read` saves `last_story_date = today`, transitions to workout view
  - After all quests complete: `CompletionScreen` overlay fades in (700ms delay)
  - `CompletionScreen`: animated XP counter (counts up to 100), power level badge, Master Kael completion quote (italic), next chapter teaser with chapter title, "Continue" button
  - On "Continue": POST `/api/story/advance` increments `story_day` (1→7, clamps at 7); Zenkai Boost does not advance story day
  - **Zenkai Boost**: triggered when `story_day > 1` AND `last_streak_date` is 7+ days ago; shows golden screen design with special intro/completion text; resumes normal arc afterward
  - `GET /api/story/read` + `GET /api/story/advance` API routes
- **Founding Member system** — on signup, email is cross-checked against `waitlist_zenkai`; if match, `is_founding_member = true` and `founding_member_since = NOW()` set automatically
  - Dashboard: gold character name, gold "Founding Member" badge, "Founding Member — Origin Arc" line, "Exclusive skin unlocks at official launch" note
  - Onboarding: special full-screen "Founding Member Detected" interstitial with perks list and "Claim your spot" CTA before character creation; onboarding is now a server component wrapping `OnboardingClient`
  - Signup page: subtle open beta banner ("Open Beta — You are one of the first...")
  - Landing page waitlist section: disclaimer text about open beta and skin delivery at launch
- **Story data** (`lib/story.ts`) — full 7-day Origin Arc with Master Kael and rival Ryo; Zenkai Boost arc for comeback after missed days; each day has intro, quest, completion text, XP reward; day 7 triggers arc complete
- **Exercise library** (`exercises` table) — 27 exercises across 5 categories (push, pull, legs, core, cardio) × 3 difficulties (beginner, intermediate, advanced); auto-created and seeded on first dashboard load
- **Quest swap feature** — "Swap" button on each uncompleted quest card opens inline alternative picker; fetches 3 exercises matching user's fitness level from the exercise library; user picks one → replaces quest display for that day; saved in `quest_swaps` table; resets next day; "swapped" badge on replaced quests
- `app/api/quest/alternatives` — GET route, returns 3 random exercises by difficulty, excludes current quest names
- `app/api/quest/swap` — POST route, upserts swap into `quest_swaps` table, returns exercise details

### Fixed
- **Level display** (`lib/quests.ts`): switched from increasing-difficulty formula (`level * 100` XP per level) to flat 100 XP per level — `level = floor(xp / 100) + 1`, `xpIntoLevel = xp % 100`, `xpRequired = 100` always. Predictable and consistent.
- **Quest "Done" on first load** (`app/dashboard/page.tsx`, `app/api/quest/complete/route.ts`): added `Number()` coercion when mapping `quest_id` from Neon results (driver can return integers as strings, breaking `Array.includes()` comparison); added `::date` cast in SQL WHERE clauses; added `export const dynamic = "force-dynamic"` to dashboard to prevent stale route cache.
- **Streak increment** (`app/api/quest/complete/route.ts`): replaced JS `new Date(Date.now() - 86400000)` "yesterday" calculation (UTC, timezone-sensitive) with PostgreSQL `${today}::date - INTERVAL '1 day'` — the DB now computes yesterday consistently relative to the same reference date.

### Docs
- **Backlog restructured** — added Bugs section (3 known issues), expanded Core product with body stats, protein calculator, custom workouts, full food log, story mode, boss quests, character evolution; added Build Priority order (13 items); added Instagram / social media item
- **ai_context.md** — added character design rules (no licensed anime IP, original-inspired only) and social media section (@zenkai_app Instagram, 1-platform focus)

### Added
- **Hero stat cards** — 3 animated preview cards below the waitlist form in the hero section
  - Level card: "Lv. 12", Saiyan Warrior, orange XP bar animates to 68%, "680 / 1000 XP"
  - Power card: "Zenkai Boost", purple bar animates to 45%, "+300 XP bonus"
  - Streak card: "14", white/muted bar animates to 82%, "Personal best"
  - Cards boot in with `bootIn` animation (1.1s delay, after rest of hero)
  - Bars animate from 0 → target width on mount via CSS transition (1s ease-out, triggered 400ms after load)
  - Exact spec: `rgba(255,255,255,0.035)` background, `rgba(255,255,255,0.07)` border, 12px radius, 14px/12px padding, 3px bar height

### Changed
- **Hero section — anime game aesthetic redesign**
  - `HeroBackground`: 4 animated energy orbs (CSS `energyPulse` keyframes), subtle orange grid overlay (80px cells), scanline CRT overlay, radial vignette — all pure CSS, no JS
  - `PowerScouter`: replaces old `PowerBar`; Dragon Ball scouter panel with HUD corner brackets, glowing animated border (`borderPulse`), sweeping scan line (`scanSweep`), monospace display; 3-phase sequence: "SCANNING\_" (blinking cursor) → count from 0 to 9,700 with ease-out → "SCAN COMPLETE" status; number glows continuously when done (`numberGlow`)
  - Hero fills full viewport height (`min-h-screen`, vertically centered)
  - All hero elements boot in with staggered `bootIn` animation (0.1s – 1.0s delays) — feels like powering up a game
  - System badge: `ANIME FITNESS RPG // SYSTEM INITIALIZED` with live orange dot
  - Title: uppercase, `clamp(2.8rem, 9vw, 6.5rem)` — game-title scale, `leading-none tracking-tighter`
  - Nav: tightened backdrop blur, reduced border opacity
  - `globals.css`: added `energyPulse`, `energyPulse2`, `scanSweep`, `bootIn`, `cursorBlink`, `numberGlow`, `borderPulse` keyframes; `.energy-orb-*`, `.scouter-border`, `.cursor-blink`, `.number-glow` utility classes

### Added
- **Privacy page** (`/privacy`) — full privacy policy covering data collection, storage, cookies, user rights, third-party services, GDPR contact
- **Terms page** (`/terms`) — terms of service covering service description, health disclaimer, account rules, subscription/payment terms, liability
- Both pages share the dark design with Privacy/Terms footer links
- Privacy + Terms links added to landing page footer and dashboard footer

### Changed
- **Landing page** — full UI polish
  - All emojis removed; replaced with numbered labels, CSS border accents, and text markers
  - `gradient-text` updated from gold/orange to orange/purple (`#FF6B35 → #7C3AED`)
  - Problem section: numbered left-border cards instead of emoji cards
  - Why Zenkai: numbered `01/02/03` labels, subtle hover lift, orange/purple accents
  - How it works: step circles use orange→purple gradient instead of gold
  - Pricing: dash list markers, purple accent on Full Power tier
  - Waitlist section: no floating emoji, tighter card
  - Nav: `⚡` emoji removed; added Sign in + Get started links to auth pages
  - Footer: `Privacy` and `Terms` are now real `<Link>` components
  - WaitlistForm: removed emoji from button and success state; orange focus rings
  - PowerBar: updated to orange→purple gradient
- **Login + Signup** — orange focus rings (`#FF6B35`) replace gold; gradient button uses orange→purple; `font-black` heading; `Field`/`ErrorMessage` components extracted
- **Dashboard** — footer added with Privacy/Terms links
- **globals.css** — gold variable removed; gradient-text updated to orange/purple; `float-anim`, `glow-btn`, `flicker-text`, `neon-border`, `power-bar` classes removed (unused); `font-family` uses Geist variable with system-ui fallback

### Added
- **Onboarding** (`/onboarding`) — 4-step client-side character creation flow
  - Step 1: Character class (Saiyan Warrior / Shadow Assassin / Iron Guardian)
  - Step 2: Goal (Get Stronger / Lose Weight / Be Consistent)
  - Step 3: Fitness level (Beginner / Intermediate / Advanced)
  - Step 4: Character name (max 20 chars)
  - `POST /api/onboarding` — saves to `users` table; auto-migrates new columns via `ALTER TABLE ADD COLUMN IF NOT EXISTS`
  - Redirects to `/dashboard` on success; orange + purple accent design
- **Dashboard** (`/dashboard`) — fully functional, replaces placeholder
  - Character header: name, class badge, power level, total XP, streak counter
  - Daily quests: 3 exercises per day, deterministic by date, no equipment needed
  - Per-quest "Complete" button with optimistic UI; all 3 done = +100 XP banner
  - XP progress bar animated toward next level
  - Daily food check (Yes/No), locks after first answer
  - `POST /api/quest/complete` — marks quest in `quest_completions`; awards +100 XP + streak update when all 3 done
  - `POST /api/food-check` — upserts into `food_logs`
- `lib/quests.ts` — 12-exercise quest pool, `getDailyQuests(date)` (deterministic seed), `calcLevel(xp)`, `xpProgress(xp)`
- New DB tables (auto-created): `quest_completions`, `food_logs`
- New `users` columns: `character_class`, `goal`, `fitness_level`, `character_name`, `xp`, `onboarding_complete`, `last_streak_date`
- `--purple: #7C3AED` CSS variable added to globals

### Changed
- `/signup` now redirects to `/onboarding` (was `/dashboard`)
- `/dashboard` redirects unauthenticated users to `/login`, non-onboarded users to `/onboarding`

---

### Added
- `app/sitemap.ts` — Next.js built-in sitemap route, serves `/sitemap.xml`; includes `/`, `/login`, `/signup` with priorities and weekly/monthly change frequencies; reads `NEXT_PUBLIC_BASE_URL` env var (falls back to `https://zenkai.app`)
- Auth system — JWT-based (jose + bcryptjs), HTTP-only cookie session, 7-day expiry
  - `POST /api/auth/signup` — creates user, returns set-cookie; validates email, username (3–20 chars, alphanumeric/underscore), password (min 8)
  - `POST /api/auth/login` — verifies credentials, returns set-cookie
  - `POST /api/auth/logout` — clears cookie
  - `proxy.ts` — route protection: unauthenticated → /login, authenticated on /login|/signup → /dashboard
- `/signup` page — Linear-inspired dark form, no emojis, gold focus rings, inline validation errors
- `/login` page — same design, "Welcome back. Your arc continues."
- `/dashboard` page — server component; shows username, placeholder stat cards (Power Level, Streak, Quests Done), coming-soon block
- `lib/auth.ts` — `signToken`, `verifyToken`, `hashPassword`, `comparePasswords`, `COOKIE_NAME`
- `lib/db.ts` — `getDb()` lazy Neon SQL factory
- `users` table (auto-created on first signup): `id, email, username, password_hash, created_at, power_level (default 0), streak (default 0)`
- `JWT_SECRET` env var required in production (falls back to dev placeholder locally)

### Changed
- Translated entire landing page from Dutch to English — bold shonen anime protagonist tone throughout
  - Hero: "Every setback makes you stronger." / "That's when your Zenkai Boost begins."
  - Problem section: punchy, second-person copy ("You start fired up…")
  - Why Zenkai, How it works, Pricing, Waitlist, Footer — all English
  - Nav CTA: "Aanmelden" → "Join Now"
  - Form: placeholder, button, success/error messages all translated
  - Power level bar locale: `nl-NL` → `en-US`
  - Pro tier renamed from "Volledig" → "Full Power"; badge "POPULAIR" → "POPULAR"
- `layout.tsx`: `lang="nl"` → `lang="en"`
- `api/waitlist/route.ts`: all Dutch error/success strings translated to English

---


### Added
- Initial landing page with 6 sections: Hero, Het Probleem, Jouw Onderscheid, Hoe Het Werkt, Pricing, Waitlist
- Animated power level bar (0 → 9.700) triggered by IntersectionObserver on scroll
- Waitlist API route (`POST /api/waitlist`) backed by Neon PostgreSQL — auto-creates `waitlist_zenkai` table, handles duplicate emails (409)
- PWA manifest (`/manifest.json`) with standalone display, dark theme, Dutch locale
- Dark theme with neon gold (#FFD700) and orange (#FF6B35) accents
- CSS keyframe animations: `gradientShift`, `floatUp`, `glowPulse`, `powerRise`
- Sticky nav with glassmorphism blur
- Pricing section: free (7-day trial) and €4,99/month full plan

### Changed
- `layout.tsx` metadata switched to English:
  - Title: "Zenkai — Train. Fall. Come Back Stronger."
  - Description: "The anime fitness app where every setback makes you stronger. Daily quests, XP system, and Zenkai Boost for when you fall off track."
  - OpenGraph title and description updated to match

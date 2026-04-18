# Changelog

## [Unreleased]

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

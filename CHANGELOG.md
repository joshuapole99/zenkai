# Changelog

## [Unreleased]

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

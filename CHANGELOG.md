# Changelog

## [Unreleased]

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

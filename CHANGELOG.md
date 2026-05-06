# Zenkai Platform — Changelog

## [Unreleased] — 6 mei 2026

### Scanner (scan.zenkai.nl)

**Bug fixes**
- **fix (critical):** Paid scans (quick/full) gaven silent 401 — oorzaak: `SCANNER_API_KEY` in Vercel matcht niet met `ZENKAI_API_KEY` in `/root/zenkai/start_api.sh` op VPS. Flask `/health` heeft geen auth → health check groen maar scans faalden. Fix: keys gesynchroniseerd.
- **fix:** Twee Flask processen draaiden tegelijk (één met key, één zonder) na handmatig herstarten — veroorzaakte non-deterministische auth failures.
- **fix:** `getUserFromRequest` gebruikte `getSession()` als cookie-fallback in route handlers. `getSession()` leest JWT lokaal en kan silent null teruggeven. Teruggedraaid naar `getUser()` (network-validated, identiek aan dashboard aanpak).
- **fix:** `quick-scan` upsert overschreef `plan` naar `"free"` wanneer een paid user nog geen rij in `public.users` had. Fix: bestaande rijen → `update` (plan onaangeroerd); nieuwe rijen → `insert` met `plan: "free"`.
- **fix:** `onAuthStateChange` INITIAL_SESSION event overschreef server-side `initialLoggedIn=true` → auth banner zichtbaar voor correct ingelogde gebruikers. Fix: alleen SIGNED_IN / SIGNED_OUT / TOKEN_REFRESHED / USER_UPDATED updaten client-side state.

**Infra regel toegevoegd** (zie ook CLAUDE.md + BACKLOG.md):
`SCANNER_API_KEY` (Vercel) moet altijd exact gelijk zijn aan `ZENKAI_API_KEY` in `start_api.sh`. Mismatch → alleen betaalde scans falen, gratis scan is niet aangedaan.

---

## [Unreleased] — 3 mei 2026

### Scanner (scan.zenkai.nl)
- **feat:** Auth banner direct zichtbaar op `/scan` voor niet-ingelogde gebruikers — geen klik vereist
- **feat:** Verplichte consent checkbox boven scan knop — disabled totdat aangevinkt; `consent` boolean gelogd in Supabase `scans` tabel
- **feat:** Domein verificatie — `/api/verify-domain/generate` + `/api/verify-domain/check`; DNS TXT (`_zenkai-verify.<domain>`) en `/.well-known/zenkai-verify` methoden; tokens verlopen na 1 uur; alleen Starter/Pro
- **feat:** Verdict badges per finding in scan UI en rapport — `EXPLOITED` / `BLOCKED` / `POTENTIAL`; SSTI + Cloudflare auto-detectie → `BLOCKED` + severity downgrade naar Info
- **feat:** Upgrade trigger na gratis scan — "Wil je een volledig PDF rapport? Upgrade naar Starter vanaf €19/mnd"
- **feat:** `/dashboard/verify` pagina met verificatie UI
- **fix:** Alle "VPS" vermeldingen verwijderd uit scan UI (mode labels, info banner)
- **fix:** Module-aantallen gecorrigeerd — `11 → 16` bij Full Scan (hero, stats, pricing)
- **fix:** Hero CTA tekst → "Start met scannen →"
- **fix:** Enterprise contact email → `info@zenkai.nl` op pricing pagina
- **fix:** `consent` boolean toegevoegd aan quick-scan en full-scan Supabase insert

### Web (zenkai.nl)
- **feat:** `/cookies` pagina aangemaakt (cookietabel, Supabase auth cookies)
- **feat:** CookieBanner component — verschijnt bij eerste bezoek, accepteer knop, opgeslagen in localStorage
- **feat:** `/terms` bijgewerkt naar officiële Algemene Voorwaarden (AVG-conform, mei 2026)
- **feat:** `/privacy` bijgewerkt naar officieel Privacybeleid (AVG-conform, 10 secties, mei 2026)
- **feat:** Pricing CTA's gekoppeld aan Lemon Squeezy checkout — Starter + Pro directe betaallinks
- **fix:** Pricing features bijgewerkt per plan — correcte modules, aantallen en beschrijvingen
- **fix:** About sectie — `5+ jaar → 2+ jaar`, `Amsterdam → Utrecht`
- **fix:** Placeholder blog posts verwijderd; Writing-sectie verborgen bij lege array
- **fix:** `hi@zenkai.nl → info@zenkai.nl` in footer (zenkai.nl + scan.zenkai.nl)

### Shared (packages/ui)
- **feat:** `CookieBanner` component toegevoegd aan `@zenkai/ui` exports
- **feat:** `ZenkaiFooter` — Cookies link toegevoegd aan nav
- **fix:** `ZenkaiFooter` — onderste rij omgezet naar column layout; naam en email staan nu apart

### Database (supabase/schema.sql)
- **feat:** `public.scans` tabel gedocumenteerd met `consent` kolom
- **feat:** `public.domain_verifications` tabel toegevoegd voor domein verificatie flow

---

## [Unreleased] — 30 april 2026

### Scanner — Full Scan (VPS)
- **fix:** feroxbuster output parser — correct regex field count (`STATUS METHOD LINES WORDS BYTES URL`). Was silently capturing 0 paths per full scan.
- **fix:** SQLMap now tests HTML forms (crawl=3) AND common URL params (`?id=1&cat=1&q=test&search=test`) — covers sites with no HTML forms.
- **fix:** Shodan 403 (CDN IP) → graceful warn; 404 → graceful pass instead of error.
- **fix:** Subdomain enumeration expanded to SecLists `subdomains-top1million-5000.txt` (5000 entries, xargs -P 40 parallel).

### Scanner — PDF Report (Phase 5)
- **fix:** Bar chart overflow — switched from pixel to percentage widths; bars no longer escape the chart box.
- **feat:** "Scan Overzicht" section in PDF — 2-column module grid showing status badge, summary, and first 8 detail lines per module (open ports, subdomain list, ZAP findings, injection results, etc.)
- **fix:** Section numbering now dynamic — accounts for fingerprints + modules sections to avoid duplicate numbers.
- **fix:** `render.py` — reads `full_report.json` for full scans (has modules data) instead of falling through to `report.json` (empty modules).
- **fix:** PDF generation for IP address targets — `api.py` now uses `sys.executable` for all subprocess calls, ensuring WeasyPrint venv is used.

### Web (zenkai.nl)
- **feat:** Privacy Policy rewritten in security platform style (9 sections, AVG/GDPR compliant, scanner-specific).
- **feat:** Terms of Service rewritten — authorized-use-only clause, 14-day refund, Lemon Squeezy payment terms.

---

## [Phase 3 complete] — 29 april 2026

### Scanner — Full Scan
- **feat:** SQL Injection module — SQLMap BEUSTQ, level 2, risk 1, 5 min cap.
- **feat:** Injection checks module — SSTI (Jinja2/Twig/Freemarker), Open Redirect (7 params), Host Header Injection.
- **fix:** gobuster/feroxbuster 403 fix — sensitive paths → max 15 HIGH findings; all other 200s → 1 summary finding. Eliminates 4000+ false positive medium findings.

### Web (zenkai.nl)
- **feat:** Rebranded as pure security platform — removed Goals/Job/Workout from hub.
- **feat:** Pricing section added (Free €0 / Starter €19 / Pro €49 / Enterprise op aanvraag).
- **feat:** Real Zenkai logo with `mix-blend-mode: multiply` on light, `filter: invert(1)` on dark backgrounds.
- **feat:** scan.zenkai.nl landing page — live status, real module list, correct pricing.
- **feat:** ZenkaiNav + ZenkaiFooter rewritten (packages/ui).

---

## [Phase 2 complete] — april 2026

### Scanner
- **feat:** Quick Scan — 9 modules (headers, ssl, dns, nmap, gobuster, nikto, whatweb, urlscan, zap).
- **feat:** Full Scan — 13 modules + active injection testing.
- **feat:** Streaming scan UI with real-time per-module results.
- **feat:** Bilingual PDF report (NL/EN) — WeasyPrint + Jinja2, CVSS + CWE mapping.
- **feat:** VPS deployment — Ubuntu, nginx, systemd, Let's Encrypt HTTPS.

---

## [Phase 1 complete] — 24 april 2026

### Workout app (workout.zenkai.nl)
- Custom workout setup, weekly calendar, streak tracking, Zenkai Boost mechanic.
- Grace day (1× per week streak protection), exit survey, pattern insight, weekly coach summary.

---

## [0.5.0] — 2026-04-29

### Scanner (scan.zenkai.nl)
- **feat:** streaming scan API with real-time results per check
- **feat:** 6 security checks — headers, SSL/TLS, DNS (SPF/DMARC), OWASP indicators, Shodan host, urlscan.io
- **feat:** grade scoring A–F with weighted per-check scores
- **feat:** scan UI with animated progress, expandable detail panels, color-coded severity
- **fix:** @zenkai/ui as `file:` path for Vercel monorepo builds
- **fix:** remove explicit React import from packages/ui (React 17+ JSX transform)
- **fix:** `preserveSymlinks: true` in scanner tsconfig — resolves jsx-runtime symlink issue on Vercel

### Platform
- **feat:** shared Zenkai design system — ZenkaiNav + ZenkaiFooter across all apps
- **feat:** Goals app bar with pathname-aware active states (Spaar Scan / Blog / Prijzen / Dashboard)
- **feat:** homepage rewrite — white base (#ffffff), blue accent (#0284C7), Fraunces headings
- **feat:** per-app accent colors — Scan #0284C7, Goals #16A34A, Job #7C3AED, Workout #EA580C
- **feat:** financios and jobs apps added to monorepo

---

## [0.4.0] — 2026-04-26

### Workout (zenkai.nl)
- **feat:** TodayCard rebuild — 4 scenarios, workout checklist, comeback light mode
- **feat:** feedback form in dashboard, waitlist form on landing, email blast API
- **feat:** grace day — 1x per week automatic streak protection on missed workout
- **feat:** exit survey ("What got in the way?" — 4-tap options)
- **feat:** weekly pattern insight ("You tend to skip Thursdays")
- **feat:** weekly coach summary (Sunday recap: workouts done, weak spot)
- **fix:** suppress pattern insight when user already logged that day this week

---

## [0.3.0] — 2026-04-20

### Platform
- **feat:** monorepo migration — apps/web, apps/scanner, apps/financios, apps/jobs
- **feat:** new zenkai.nl platform hub homepage
- **feat:** light editorial redesign of hub homepage
- **feat:** rename products, update domains, migrate DB to Supabase-ready schema
- **fix:** various TypeScript postgres RowList cast issues

---

## [0.2.0] — 2026-04-15

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

## [0.1.0] — 2026-04-10 (Open Beta Launch)

### Workout (zenkai.nl)
- **feat:** core workout coach — custom workouts, streak tracking, Zenkai Boost mechanic
- **feat:** fighter type identity + weak spot memory from onboarding
- **feat:** post-workout moment screen
- **feat:** landing page ("The reason you quit...")

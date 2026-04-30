# Zenkai — Security Platform Roadmap

## Monorepo structure

```
zenkai/
├── apps/web/        → zenkai.nl          (Vercel)
├── apps/scanner/    → scan.zenkai.nl     (Vercel)
├── apps/financios/  → goals.zenkai.nl    (Vercel, secondary)
└── packages/ui/     → shared components + design tokens
```

---

## Product status

| Product | Domain | Status |
|---|---|---|
| Zenkai Scanner | scan.zenkai.nl | **Live** |
| Zenkai Hub | zenkai.nl | **Live** |
| Workout app | workout.zenkai.nl | Open Beta (secondary) |
| Goals | goals.zenkai.nl | Live (secondary) |
| Job Coach | job.zenkai.nl | Live (secondary) |

---

## Scanner roadmap (primary focus)

### Done ✓
- Quick Scan — 9 modules, streaming UI, PDF report
- Full Scan — 13 modules, active injection testing (SQLMap + SSTI + open redirect)
- Bilingual PDF (NL/EN), CVSS mapping, risk gauge
- VPS deployment (nginx, systemd, Let's Encrypt)
- zenkai.nl rebranded as security platform hub

### Next — Phase 3 remaining
- [ ] ZAP active scan + XSS testing (Full Scan)
- [ ] ffuf — LFI + API endpoint discovery (Pro)
- [ ] wfuzz — parameter + SQLi fuzzing (Pro)
- [ ] WPScan — WordPress scanning (Pro, WP-only)

### Phase 4 — Enterprise
- [ ] IP range scanning (/24 max)
- [ ] Brute force tools (netexec, Kerbrute, wfuzz login) — opt-in, Enterprise only
- [ ] API access with key
- [ ] Custom PDF branding

### Phase 5 — Platform
- [ ] Lemon Squeezy subscription gating (plan enforcement)
- [ ] User dashboard — scan history, report downloads
- [ ] Async job queue (scan isolation)
- [ ] GitHub CI/CD to VPS

---

## Architecture principles
- Security-first: scanner is the flagship, everything else is secondary
- One domain per scan (no IP ranges on Free/Starter/Pro)
- Modules run isolated — one failure never stops the full scan
- Brute force: Enterprise-only, explicit opt-in checkbox required
- See BACKLOG.md for full feature tracking and CHANGELOG.md for release history

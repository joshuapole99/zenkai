# Zenkai — Security Platform Roadmap

## Structuur

```
zenkai/
├── apps/web/        → zenkai.nl          (Vercel) — marketing + hub
├── apps/scanner/    → scan.zenkai.nl     (Vercel) — primary product
└── packages/ui/     → shared components + design tokens
```

> **Archived (not maintained):** workout.zenkai.nl · goals.zenkai.nl · job.zenkai.nl

---

## Product status

| Product | Domain | Status |
|---|---|---|
| Zenkai Scanner | scan.zenkai.nl | **Live — primary focus** |
| Zenkai Hub | zenkai.nl | **Live — marketing/hub** |

---

## Scanner roadmap

### ✓ Klaar (April 2026)

- Quick Scan — 9 modules, streaming UI, PDF rapport
- Full Scan — 13 modules, active injection testing (SQLMap, SSTI, open redirect)
- Bilingual PDF (NL/EN), CVSS mapping, risk gauge, severity bar chart
- VPS deployment (nginx, systemd, Let's Encrypt)
- ffuf — LFI + API endpoint discovery (Pro)
- wfuzz — parameter + SQLi fuzzing (Pro)
- WPScan — WordPress scanning (Pro, WP-only)
- ZAP active scan + XSS testing (Full Scan)
- Shodan API credits cache (24h)
- zenkai.nl rebranded als security platform hub

---

### 🔴 Nu — Revenue unlocker

**1. Lemon Squeezy plan enforcement**
Webhook → Supabase `user.plan` updaten → Flask API checkt plan bij elke scan aanroep.
Zonder dit geen betaalde klanten.

**2. Gebruiker dashboard**
Scan geschiedenis + rapport downloads per plan (30 dagen / 1 jaar / onbeperkt).

**3. Known bugs fixen**
- Timezone display (toont Sat terwijl het Fri is) — CRITICAL
- Async job queue stabiliteit

---

### 🟡 Daarna — Reporting quality

Uit Phase 7 backlog, hoge waarde voor Pro/Enterprise conversie:

- Poortscan resultaten → tabel in PDF (IP, hostname, port, service)
- DNS records → tabel (type, value, policy)
- SSL misconfiguraties → tabel per issue
- Elke finding: uitleg wat het is + concrete aanbeveling
- Executive summary verbeteren (nu generiek → specifiek per scan)
- feroxbuster/gobuster: Cloudflare CDN paden (`/cdn-cgi/`) filteren

---

### 🟢 Enterprise (wanneer Pro traction heeft)

- IP ranges ondersteuning (max /24 per scan)
- Brute force tools (netexec, Kerbrute, wfuzz login) — opt-in + checkbox
- API toegang met eigen key
- Custom PDF branding
- 10 gelijktijdige scans

---

### 💡 Toekomst (na Enterprise)

- Pentest-as-a-Service — handmatige pentest op basis van OSCP, apart product
- Scheduled scans (automatisch wekelijks/maandelijks)
- Slack/email alerting bij nieuwe bevindingen
- Multi-domain monitoring dashboard

---

## Architecture principles

- Scanner is het flagship — alles else is secundair
- One domain per scan (geen IP ranges op Free/Starter/Pro)
- Modules draaien geïsoleerd — één failure stopt nooit de hele scan
- Brute force: Enterprise-only, expliciete opt-in vereist
- Active testing alleen op bevestigd attack surface

---

*Zie BACKLOG.md voor volledige feature tracking en CHANGELOG.md voor release history.*

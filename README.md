# Zenkai — Security Platform

Automated domain security auditing. Scan your attack surface, get a PDF report, fix what matters.

**Live:** [zenkai.nl](https://zenkai.nl) · [scan.zenkai.nl](https://scan.zenkai.nl)

## Scanner

| Scan type | Modules | Plan |
|---|---|---|
| Quick Scan | 9 — headers, SSL/TLS, DNS, nmap, gobuster, nikto, whatweb, urlscan, ZAP baseline | Starter |
| Full Scan | 13 — all Quick + full TCP/UDP, subdomain enum, sslyze, SQLMap, injection checks | Pro |

PDF report: CVSS scores, CWE mappings, risk gauge, bilingual (NL/EN), executive summary.

## Structure

```
apps/web/        → zenkai.nl          (Next.js, Vercel)
apps/scanner/    → scan.zenkai.nl     (Next.js, Vercel)
packages/ui/     → shared components
```

**Scanner backend:** Flask on Ubuntu VPS — nmap, feroxbuster, nikto, sqlmap, sslyze, ZAP  
**Stack:** Next.js 15 · Supabase · Lemon Squeezy · Resend · Vercel

## Plans

| Plan | Price | Scans/mnd |
|---|---|---|
| Free | €0 | 1 |
| Starter | €19/mnd | 3 |
| Pro | €49/mnd | Unlimited |
| Enterprise | Op aanvraag | Unlimited + IP ranges |

## Dev

```bash
bun install
cd apps/web && bun dev        # zenkai.nl
cd apps/scanner && bun dev    # scan.zenkai.nl
```

Scanner backend runs on VPS (185.137.122.205:5000). See `apps/scanner/scripts/` for Python scan modules.

---

Built by [Joshua Pole](https://zenkai.nl) — OSCP · Security Analyst

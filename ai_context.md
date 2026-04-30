# Zenkai — AI Context

## What is Zenkai?
Security platform for automated domain auditing. Flagship product is
scan.zenkai.nl — a scanner that runs nmap, gobuster, sqlmap, sslyze,
ZAP and other tools against a domain and generates a PDF report with
CVSS-scored findings and remediation advice.

## Owner
Joshua Pole — security analyst, OSCP certified.
Primary niche: security. Everything else is secondary.

## Products
- scan.zenkai.nl — domain security scanner (LIVE, flagship)
- zenkai.nl — hub / landing page for all tools
- workout.zenkai.nl — fitness RPG (Open Beta, secondary)
- goals.zenkai.nl — finance tool (secondary)
- job.zenkai.nl — job coach (secondary)

## Tech stack
- Next.js 15 + Tailwind CSS + TypeScript (frontend)
- Flask + Python (scanner backend, Ubuntu VPS)
- Supabase (auth + database)
- Vercel (hosting)
- Lemon Squeezy (payments)
- Resend (email / PDF delivery)

## Scanner pricing
- Free: €0 — 1 scan/mnd, basic checks
- Starter: €19/mnd — Quick Scan (9 modules)
- Pro: €49/mnd — Full Scan (13 modules, active injection testing)
- Enterprise: op aanvraag — IP ranges, brute force (opt-in), dedicated support

## Design (zenkai.nl / scanner)
- White background #ffffff
- Black text #0F0E0E
- IBM Plex Mono for labels/meta
- Fraunces for headings
- Logo: zenkai-logo.jpg with mix-blend-mode: multiply (light bg) or filter: invert(1) (dark bg)

## Development rules
- BACKLOG.md is the source of truth for what to build
- CHANGELOG.md tracks what shipped
- CLAUDE.md is the system prompt for Claude Code
- Scanner backend files live at /root/zenkai/ on VPS
- Always SCP to upload Python changes, then restart zenkai-scanner.service

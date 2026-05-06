# ZENKAI - CLAUDE CODE SYSTEM

This is the single source of truth for Claude Code behavior in this repository.

========================

## ROLE

Claude is a senior full-stack engineer for Zenkai — a security platform.

Products (active):
* zenkai.nl → marketing hub + landing page
* scan.zenkai.nl → security scanner (Quick Scan + Full Scan) — PRIMARY

Archived (do not touch, do not suggest features for):
* goals.zenkai.nl
* job.zenkai.nl
* workout.zenkai.nl

========================

## CORE PLATFORM RULES

Monorepo structure:
* apps/web     → zenkai.nl
* apps/scanner → scan.zenkai.nl
* packages/ui  → shared components + design tokens

Stack: Next.js + Tailwind + Supabase + Vercel + Lemon Squeezy + Resend

Scanner backend:
* Kali VM (local): 192.168.178.36:5000
* VPS (production): 185.137.122.205:5000 — root@185.137.122.205
* Flask API at /root/zenkai/api.py — started via /root/zenkai/start_api.sh
* Tools: nmap, nikto, gobuster, sslyze, whatweb, ffuf, wfuzz, WPScan, SQLMap, ZAP

VPS API key (CRITICAL):
* Flask reads: ZENKAI_API_KEY (set in /root/zenkai/start_api.sh)
* Vercel must have: SCANNER_API_KEY = same value as ZENKAI_API_KEY
* MISMATCH = all paid scans return 401 silently — free scan is unaffected (runs locally)
* Free scan (/api/scan) uses local Next.js checks — does NOT call Flask
* Quick/Full scan call Flask — they WILL fail if the key is wrong
* To restart Flask: ssh root@185.137.122.205 "pkill -f api.py; cd /root/zenkai && nohup bash start_api.sh > /var/log/zenkai-api.log 2>&1 &"
* To verify key match: GET https://scan.zenkai.nl/api/auth/scan-debug (rebuild endpoint if needed)

========================

## CURRENT PRIORITIES (in order)

1. Timezone display (shows Sat when it's Fri) — CRITICAL bug
2. Async job queue stabiliteit
3. Phase 7 reporting improvements (see BACKLOG.md)

Done:
* Lemon Squeezy webhook → Supabase plan enforcement ✓
* User dashboard — scan history + report downloads ✓
* Auth (Bearer + cookie fallback, getUser not getSession) ✓
* PDF rapport per email ✓

========================

## TOKEN EFFICIENCY RULES

* Always use /compact before starting a new major task
* Read maximum 2 files per task unless explicitly asked
* Use grep/search instead of reading whole files
* Batch SSH commands into one call instead of multiple
* Never read node_modules, .next, venv, or results directories
* Never cat entire files unless strictly necessary
* Prefer targeted edits over full rewrites

========================

## TOOLING RULES

Claude MUST assume tools are OPTIONAL and may or may not be installed.

Available tools (if present):
* graphify       → codebase knowledge graph
* fewer-permission-prompts → allowlist management
* leanctx        → context reduction
* context7       → documentation lookup

IMPORTANT:
NEVER install tools automatically
NEVER execute npm install commands without asking
ONLY suggest installation if tools are missing

========================

## EXECUTION RULES

* Minimal context only — do not load full repo
* 1–2 files max per change
* No feature creep
* Simplify before adding logic
* Always check BACKLOG.md before starting new features
* Never suggest features for archived products

========================

## OUTPUT STYLE

* Minimal responses
* No long explanations
* Focus on code changes only
* Short commit messages

========================

## IMPORTANT

If AGENTS.md exists:
→ It is ignored unless explicitly referenced here

This file overrides all other AI behavior rules.

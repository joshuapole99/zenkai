# ZENKAI - CLAUDE CODE SYSTEM

This is the single source of truth for Claude Code behavior in this repository.

========================

## ROLE

Claude is a senior full-stack engineer for Zenkai — a multi-product SaaS platform.

Products:
- zenkai.nl → hub/landing page
- scan.zenkai.nl → security scanner (Quick Scan + Full Scan)
- goals.zenkai.nl → finance tool for students/Gen Z
- job.zenkai.nl → job coach with CV score + cover letter
- workout.zenkai.nl → fitness RPG app (Open Beta)

Primary goal per product:
→ Scan: automated security audit → PDF report → paid product
→ Goals: budget tracking → saving goals
→ Job: CV analysis → cover letter generation
→ Workout: 1 daily quest → XP → level up → streak tracking

========================

## CORE PLATFORM RULES

Monorepo structure:
- apps/web → zenkai.nl
- apps/scanner → scan.zenkai.nl
- apps/financios → goals.zenkai.nl
- apps/jobs → job.zenkai.nl
- packages/ui → shared components + design tokens

Stack: Next.js + Tailwind + Supabase + Vercel + Lemon Squeezy + Resend

Scanner backend:
- Kali VM (local): 192.168.178.36:5000
- VPS (production): 185.137.122.205:5000
- Flask API with /scan, /quick-scan, /report/{domain} endpoints
- Tools: nmap, nikto, gobuster, sslyze, whatweb, ffuf

========================

## TOKEN EFFICIENCY RULES

- Always use /compact before starting a new major task
- Read maximum 2 files per task unless explicitly asked
- Use grep/search instead of reading whole files
- Batch SSH commands into one call instead of multiple
- Never read node_modules, .next, venv, or results directories
- Never cat entire files unless strictly necessary
- Prefer targeted edits over full rewrites

========================

## TOOLING RULES

Claude MUST assume tools are OPTIONAL and may or may not be installed.

Available tools (if present):
- graphify → codebase knowledge graph
- fewer-permission-prompts → allowlist management
- leanctx → context reduction
- context7 → documentation lookup

IMPORTANT:
NEVER install tools automatically
NEVER execute npm install commands without asking
ONLY suggest installation if tools are missing

========================

## EXECUTION RULES

- Minimal context only — do not load full repo
- 1–2 files max per change
- No feature creep
- Simplify before adding logic
- Always check BACKLOG.md before starting new features

========================

## WORKOUT FEATURE FLAGS (STRICT)

```js
export const FEATURES = {
  enemies: false,
  bosses: false,
  friends: false,
  leaderboard: false,
  co_op: false,
  character_evolution: false,
  weekly_bosses: false
}
```

If false → MUST NOT appear in UI.

========================

## OUTPUT STYLE

- Minimal responses
- No long explanations
- Focus on code changes only
- Short commit messages

========================

## IMPORTANT

If AGENTS.md exists:
→ It is ignored unless explicitly referenced here

This file overrides all other AI behavior rules.

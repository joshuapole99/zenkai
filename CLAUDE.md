# ZENKAI - CLAUDE CODE SYSTEM

This is the single source of truth for Claude Code behavior in this repository.

========================
ROLE
========================

Claude is a senior SaaS engineer for Zenkai (Next.js fitness RPG SaaS).

Primary goal:
→ Build a SIMPLE Open Beta product
→ Focus only on core loop (1 daily quest → XP → level up)

========================
CORE PRODUCT RULE
========================

The app must always prioritize:

1. 1 daily quest
2. instant feedback (XP gain)
3. level progression
4. streak tracking
5. Zenkai Boost (comeback mechanic)

Everything else is optional or hidden.

========================
TOOLING RULES
========================

Claude MUST assume tools are OPTIONAL and may or may not be installed.

Available tools (if present in environment):

- leanctx → context reduction
- caveman → output compression
- context7 → documentation lookup
- code-simplifier → code refactoring
- sequential-thinking → complex reasoning
- symdex → code navigation
- context-skills → workflow patterns
- superpowers → UX reasoning

IMPORTANT:
- NEVER install tools automatically
- NEVER execute npm install commands
- ONLY suggest installation commands if tools are missing

========================
EXECUTION RULES
========================

1. Minimal context only (do not load full repo)
2. 1–2 files max per change
3. No feature creep
4. Simplify before adding logic
5. Always preserve Open Beta simplicity

========================
FEATURE FLAGS (STRICT)
========================

export const FEATURES = {
  enemies: false,
  bosses: false,
  friends: false,
  leaderboard: false,
  co_op: false,
  character_evolution: false,
  weekly_bosses: false
}

If false → MUST NOT appear in UI.

========================
OUTPUT STYLE
========================

- minimal responses
- no long explanations
- focus on code changes only
- caveman-style output preferred

========================
IMPORTANT
========================

If AGENTS.md exists:
→ It is ignored unless explicitly referenced here

This file overrides all other AI behavior rules.

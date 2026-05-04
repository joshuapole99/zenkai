"""
Zenkai — shared finding classification and risk scoring.

classify_finding(finding) → finding with severity + confidence normalised.
calculate_risk_score(findings) → int 0-100 + label string.
deduplicate_findings(findings) → list with near-duplicate groups collapsed.
"""

import re

# ── Sensitive keywords that upgrade a finding ─────────────────────────────────
_SENSITIVE = re.compile(
    r"password|passwd|token|secret|apikey|api[_-]?key|\.env|\.git|backup|admin"
    r"|config|credentials|private[_-]?key|aws|stripe|bearer",
    re.I,
)

# ── Patterns that force INFO regardless of original severity ──────────────────
_FORCE_INFO = re.compile(
    r"\b(403|401|404)\b"                      # status codes
    r"|cdn-cgi|/__/"                           # CDN internals
    r"|robots\.txt$"                           # robots.txt alone is info
    r"|server banner|version disclosure",      # tech fingerprint = LOW at most
    re.I,
)

# Severity rank (higher index = worse)
_RANK = {"Info": 0, "Low": 1, "Medium": 2, "High": 3, "Critical": 4}
_LABEL = {v: k for k, v in _RANK.items()}


def _rank(sev: str) -> int:
    return _RANK.get(sev, 0)


def classify_finding(finding: dict) -> dict:
    """
    Normalise severity + add confidence field.
    Returns a *new* dict — does not mutate the original.
    """
    f = dict(finding)
    title = f.get("title", "")
    desc  = f.get("description", "") or ""
    rec   = f.get("recommendation", "") or ""
    text  = f"{title} {desc} {rec}"

    sev = f.get("severity") or f.get("risk") or f.get("level") or "Info"
    # Normalise capitalisation
    sev = sev.capitalize()
    if sev not in _RANK:
        sev = "Info"

    confidence = "High"  # default — most hardcoded rules are reliable

    # ── Force-downgrade to INFO ───────────────────────────────────────────────
    if _FORCE_INFO.search(text):
        sev = "Info"
        confidence = "High"

    # ── Upgrade if sensitive keywords present in title/desc ──────────────────
    elif _SENSITIVE.search(text):
        if _rank(sev) < _rank("High"):
            sev = "High"
        confidence = "Medium"  # keyword match, not tool confirmation

    # ── Confidence heuristics ─────────────────────────────────────────────────
    else:
        lower = text.lower()
        if any(k in lower for k in ("confirmed", "verified", "sqlmap", "exploited")):
            confidence = "High"
        elif any(k in lower for k in ("possible", "potential", "suspicious", "might")):
            confidence = "Low"
            # Potential only → cap at Medium
            if _rank(sev) > _rank("Medium"):
                sev = "Medium"
        elif any(k in lower for k in ("missing", "not set", "not found")):
            confidence = "High"

    f["severity"]   = sev
    f["confidence"] = confidence
    return f


def deduplicate_findings(findings: list[dict]) -> list[dict]:
    """
    Collapse near-duplicate findings into one representative entry.

    Groups: same (module, normalised-title-prefix).
    Keeps the highest-severity item; appends a count note when collapsed.
    """
    from collections import defaultdict

    first_seen: dict[tuple, int] = {}
    groups: dict[tuple, list] = defaultdict(list)
    for i, f in enumerate(findings):
        module = f.get("module", "")
        prefix = re.sub(r"[^a-z0-9 ]", "", f.get("title", "").lower())[:40].strip()
        key = (module, prefix)
        if key not in first_seen:
            first_seen[key] = i
        groups[key].append(f)

    keyed: list[tuple[int, dict]] = []
    for key, items in groups.items():
        best = max(items, key=lambda x: _rank(x.get("severity", "Info")))
        best = dict(best)
        if len(items) > 1:
            best["title"] = f"{best['title']} (×{len(items)})"
        keyed.append((first_seen[key], best))

    keyed.sort(key=lambda t: t[0])
    return [f for _, f in keyed]


def calculate_risk_score(findings: list[dict]) -> tuple[int, str]:
    """
    Returns (score_0_to_100, label).

    Points:
      HIGH     → 25 each, cap 100
      MEDIUM   → 10 each, cap 50
      LOW      →  3 each, cap 20
      INFO     →  0

    Ceiling modifiers:
      no HIGH findings      → max 70
      no HIGH and no MEDIUM → max 40
      only INFO             → max 10
    """
    classified = [classify_finding(f) for f in findings]

    high   = [f for f in classified if f["severity"] == "High"]
    medium = [f for f in classified if f["severity"] == "Medium"]
    low    = [f for f in classified if f["severity"] == "Low"]

    pts  = 0
    pts += min(len(high)   * 25, 100)
    pts += min(len(medium) * 10,  50)
    pts += min(len(low)    *  3,  20)

    # Ceiling modifiers
    if not high and not medium and not low:
        pts = min(pts, 10)   # INFO only
    elif not high and not medium:
        pts = min(pts, 40)   # LOW only
    elif not high:
        pts = min(pts, 70)   # no confirmed HIGH

    score = min(pts, 100)

    if score <= 20:
        label = "LOW"
    elif score <= 50:
        label = "MEDIUM"
    elif score <= 80:
        label = "HIGH"
    else:
        label = "CRITICAL"

    return score, label

## Zenkai Product Backlog

### Phase 1 — Core Coach ✓ (COMPLETE - April 24)
- [x] Custom workout setup in onboarding
- [x] Weekly calendar dashboard
- [x] Workout logging API
- [x] Streak tracking
- [x] Weak spot memory (onboarding)
- [x] Fighter type identity
- [x] Zenkai Boost mechanic (3 days trigger)
- [x] Post-workout moment screen
- [x] Landing page rewrite ("The reason you quit...")
- [x] Security audit & fixes
- [x] Rate limiting on auth routes

### Phase 2 — Retention & Intelligence (NEXT)
High impact (build now):
- [ ] Streak pause / grace day (1 per week automatic)
- [ ] Weekly pattern insight ("You skip Thursdays")
- [ ] Exit survey (push: "What got in the way?" with 4 taps)
- [ ] Weekly coach summary (Sunday: "You did X workouts, weak spot was Y")
- [ ] Smart reminders at user's chosen time

Nice-to-have:
- [ ] Comeback friction reducer (special re-entry screen after 3 days)
- [ ] Adaptive workout difficulty based on absence length
- [ ] Cohort monitoring (D1/D3/D7/D30 retention tracking)

### Phase 3 — Gamification Layer (OPTIONAL - AFTER PHASE 2)
Only build if retention is proven:
- [ ] XP and level progression (secondary, not primary)
- [ ] Character progression / stages
- [ ] Story arc segments (unlock after 7 days)
- [ ] Achievement badges (consistency milestones)

### Phase 4 — Social (ONLY IF DATA SUPPORTS - NEVER LEADERBOARD)
Only build if users ask for it:
- [ ] Accountability partner (2-person pair, not group)
- [ ] Shared weekly check-ins
- [ ] NO public leaderboard (principle)

### Known Issues
- [ ] Timezone display (showing Sat when it's Fri) — CRITICAL
- [ ] Can't add workouts if onboarding step 5 skipped — HIGH
- [ ] Need "Design your workouts" button on dashboard — HIGH

### REMOVED (Won't Build)
- ❌ Enemies & combat system
- ❌ Weekly boss fights
- ❌ Leaderboard (public or friends)
- ❌ Co-op mode
- ❌ Character visual evolution
- ❌ Custom character creator
- ❌ Daily food/HP logging
- ❌ Story arc narrative (moved to Phase 3, optional)

### Metrics We're Tracking (Beta)
- D1 retention: % users return day 1
- D3 retention: % users return after first miss
- D7 retention: % users active after 1 week
- Streak length distribution
- Grace day usage rate
- Time to Zenkai Boost trigger

### Design Principle
Every feature must answer: "Does this help users stay consistent?"
If not, we don't build it.

---

## Zenkai Scanner Backlog (scan.zenkai.nl)

### Phase 1 — Free Checks ✓ (COMPLETE - April 2026)
- [x] Security headers check (HSTS, CSP, X-Frame, X-Content, Referrer, Permissions)
- [x] SSL/TLS validity & expiry check
- [x] DNS records analysis (SPF, DMARC)
- [x] OWASP basic indicators (passive analysis)
- [x] Shodan host enrichment (free tier API)
- [x] urlscan.io reputation + screenshot
- [x] Streaming scan UI with real-time results
- [x] Grade scoring (A–F) with per-check scores

### Phase 2 — Quick Scan (NEXT)

Goal: fast broad inventory without impacting the target.

**Port & Service Discovery**
- [ ] TCP port scan — top 1000 ports (nmap -sV or equivalent)
- [ ] UDP scan — selected ranges (DNS 53, SNMP 161, NTP 123)
- [ ] Service fingerprinting on open ports

**Web & Infrastructure**
- [ ] Directory enumeration — small wordlist (max 50 req/s, 2 min timeout)
- [ ] Webserver information gathering (Server header, X-Powered-By, framework detection)
- [ ] Full DNS records (A, AAAA, MX, NS, TXT, CNAME, CAA)
- [ ] URL/IP reputation via VirusTotal API
- [ ] ZAP Proxy API — passive/baseline scan

**Limits:**
- Max ~1000 ports, 20–50 req/s, 1–2 min per module
- No active exploitation, no deep crawling
- Input: one domain per scan, scope-validated

### Phase 3 — Full Scan (AFTER PHASE 2)

Goal: full attack surface mapping + controlled vulnerability testing.

**Deep Discovery**
- [ ] Full TCP scan (1–65535)
- [ ] Advanced DNS + subdomain enumeration (capped)
- [ ] Full web crawling via ZAP Proxy API (depth-limited)
- [ ] Endpoint + parameter discovery
- [ ] SSL/TLS deep analysis (cipher suites, protocol versions)
- [ ] Version-based vulnerability detection (CVE mapping)
- [ ] Common misconfiguration detection

**Active Testing (only where relevant attack surface exists)**
- [ ] SQL Injection — SQLMap, targeted only
- [ ] XSS testing — browser-based / ZAP active scan
- [ ] SSRF detection
- [ ] Server-Side Template Injection (SSTI)
- [ ] Client-Side Prototype Pollution
- [ ] Code injection checks (Python / JS / PHP patterns)
- [ ] ZAP API active scan + full crawl

**Intelligence**
- [ ] VirusTotal domain/IP reputation (expanded)
- [ ] Shodan enrichment (ports, CVEs, banners)

**Limits:**
- Hard caps: subdomain count, URLs crawled, request rate, scan depth
- Concurrency limited per target
- Per-module timeouts (not global)
- No uncontrolled recursive crawling

### Phase 4 — Output & Reporting
- [ ] PDF report (client-ready, branded)
- [ ] JSON output for API consumers
- [ ] Risk score 0–100 with severity breakdown
- [ ] Top findings + actionable fixes + evidence per issue

### Phase 5 — Infrastructure (Wednesday+)
- [ ] Deploy tool stack on Ubuntu VPS (nmap, ZAP, sqlmap)
- [ ] Async job queue (scan runs isolated per job)
- [ ] Module isolation (subprocess/container per tool)
- [ ] GitHub CI/CD to VPS
- [ ] SaaS-ready rate limiting & queue management

### Architecture Rules
- One domain per scan — no IP ranges in Quick Scan
- All scans async via job queue
- Modules run isolated — one failure never kills the whole scan
- ZAP: always set crawl depth, URL cap, request rate, and scan timeout
- Active testing only on confirmed attack surface — never full aggression mode
- Target safety principle: scanner must never overload or crash target systems

### Tool Stack
| Tool | Role |
|------|------|
| nmap | Port scanning + service detection |
| ZAP Proxy API | Crawling + passive/active web testing |
| SQLMap | Targeted SQL injection validation |
| VirusTotal API | URL/IP reputation |
| Shodan API | External exposure intelligence |
| urlscan.io API | Screenshot + web reputation |

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

### Pricing & Plans

**Abonnement model — maandelijks**

| Plan | Doelgroep | Prijs |
|---|---|---|
| Free | Iedereen — lead magnet | €0 |
| Starter | ZZP, developer, kleine ondernemer | €19/mnd |
| Pro | MKB, IT team, agencies | €49/mnd |
| Enterprise | Grote bedrijven, pentesters, security teams | Op aanvraag |

**Feature vergelijking per plan**

| Feature | Free | Starter | Pro | Enterprise |
|---|---|---|---|---|
| Domeinen | 1 | 1 | 5 | Onbeperkt |
| Scans/mnd | 1 | 3 | Onbeperkt | Onbeperkt |
| Scan type | Basis (6 checks) | Quick Scan | Full Scan | Full + IP ranges |
| PDF rapport | ❌ | ✅ | ✅ | ✅ Custom |
| JSON output | ❌ | ❌ | ✅ | ✅ |
| API toegang | ❌ | ❌ | ❌ | ✅ |
| Rapport bewaren | ❌ | 30 dagen | 1 jaar | Onbeperkt |
| Gelijktijdige scans | 1 | 1 | 3 | 10 |
| IP ranges | ❌ | ❌ | ❌ | ✅ /24 max |
| Support | ❌ | Email | Prioriteit | Dedicated |

**Tool limieten per plan**

Nmap:
| | Free | Starter | Pro | Enterprise |
|---|---|---|---|---|
| Poorten | Top 100 | Top 1000 | 1-65535 | 1-65535 + UDP |
| Timeout | 30s | 2min | 10min | Onbeperkt |
| Threads | 10 | 50 | 200 | 500 |

Gobuster:
| | Free | Starter | Pro | Enterprise |
|---|---|---|---|---|
| Wordlist | 100 woorden | common.txt | big.txt | custom + SecLists |
| Max requests | 50 | 500 | 5000 | Onbeperkt |
| Snelheid | 10 req/s | 30 req/s | 50 req/s | 100 req/s |

ZAP:
| | Free | Starter | Pro | Enterprise |
|---|---|---|---|---|
| Scan type | ❌ | Baseline/passief | Active scan | Full crawl + active |
| Crawl depth | ❌ | 2 | 5 | 10 |
| Max URLs | ❌ | 50 | 500 | Onbeperkt |
| Timeout | ❌ | 3min | 15min | Onbeperkt |

SQLMap:
| | Free | Starter | Pro | Enterprise |
|---|---|---|---|---|
| Beschikbaar | ❌ | ❌ | Basis | Volledig |
| Technieken | ❌ | ❌ | BEUSTQ | Alle + tamper scripts |
| Timeout | ❌ | ❌ | 5min | Onbeperkt |

Shodan / VirusTotal:
| | Free | Starter | Pro | Enterprise |
|---|---|---|---|---|
| Shodan | ❌ | Basis host lookup | CVEs + banners | Volledig |
| VirusTotal | ❌ | URL check | URL + IP + domain | Volledig |

---

### Phase 1 — Free Checks ✓ (COMPLETE - April 2026)
- [x] Security headers check (HSTS, CSP, X-Frame, X-Content, Referrer, Permissions)
- [x] SSL/TLS validity & expiry check
- [x] DNS records analysis (SPF, DMARC)
- [x] OWASP basic indicators (passive analysis)
- [x] Shodan host enrichment (free tier API)
- [x] urlscan.io reputation + screenshot
- [x] Streaming scan UI with real-time results
- [x] Grade scoring (A–F) with per-check scores

---

### Phase 2 — Quick Scan / Starter Plan ✓ (COMPLETE - April 2026)

Goal: fast broad inventory without impacting the target.

**Port & Service Discovery**
- [x] TCP port scan — top 1000 ports (nmap -sV)
- [x] UDP scan — selected ranges (DNS 53, SNMP 161, NTP 123, IKE 500)
- [x] Service fingerprinting on open ports

**Web & Infrastructure**
- [x] Directory enumeration — common.txt (gobuster, HTTPS+HTTP fallback, redirect follow)
- [x] Webserver information gathering (whatweb — framework, CMS, CDN, version)
- [x] Full DNS records (A, AAAA, MX, NS, TXT, CNAME, CAA)
- [x] URL/IP reputation via VirusTotal API
- [x] ZAP Proxy API — passive/baseline scan (depth 2, max 50 URLs, 3min timeout)

**Additional (built)**
- [x] Nikto baseline checks (OWASP)
- [x] SSL/TLS analysis (TLS 1.0/1.1/1.2/1.3, cert expiry, self-signed)
- [x] Security headers (HSTS, CSP, X-Frame, X-Content, Referrer, Permissions)
- [x] Streaming scan UI with real-time per-module results
- [x] NL/EN language toggle for PDF reports
- [x] VPS deployment (Ubuntu, nginx, systemd, Let's Encrypt HTTPS)
- [x] Bilingual PDF report (WeasyPrint + Jinja2)
- [x] CVSS score mapping per finding

**Limits (Starter):**
- Max 1000 ports, 30 req/s, 10 min total scan time
- No active exploitation, no deep crawling
- 1 domein, 3 scans/mnd
- Input: one domain per scan, scope-validated

---

### Phase 3 — Full Scan / Pro Plan (NEXT)

Goal: full attack surface mapping + controlled vulnerability testing.

**Deep Discovery**
- [ ] Full TCP scan (1–65535) + UDP
- [ ] Advanced DNS + subdomain enumeration (capped)
- [ ] Full web crawling via ZAP Proxy API (depth 5, max 500 URLs, 15min timeout)
- [ ] Endpoint + parameter discovery
- [ ] SSL/TLS deep analysis (cipher suites, protocol versions)
- [ ] Version-based vulnerability detection (CVE mapping)
- [ ] Common misconfiguration detection netwerk + applicatie niveau

**Active Testing**
- [ ] SQL Injection — SQLMap basis (BEUSTQ technieken, 5min timeout)
- [ ] XSS testing — ZAP active scan
- [ ] SSRF detection
- [ ] Server-Side Template Injection (SSTI)
- [ ] Client-Side Prototype Pollution
- [ ] Code injection checks (Python / JS / PHP patterns)
- [ ] ZAP API active scan + full crawl

**Intelligence**
- [ ] VirusTotal domain/IP/URL reputation (expanded)
- [ ] Shodan enrichment (ports, CVEs, banners)

**Limits (Pro):**
- Max 65535 ports, 50 req/s, 45 min total scan time
- 5 domeinen, onbeperkte scans
- Hard caps: max 500 URLs gecrawld, max 10 subdomains

---

### Phase 4 — Enterprise Plan (AFTER PRO)

**Extra features bovenop Full Scan:**
- [ ] IP ranges ondersteuning (max /24 per scan)
- [ ] SQLMap volledig (alle technieken + tamper scripts, onbeperkt timeout)
- [ ] Browser-based testing workflow (Playwright voor interactieve webanalyse)
- [ ] Exploit validation pipeline — tool chaining: ZAP → SQLMap → custom scripts
- [ ] Network-level config issues — firewall rules, exposed management interfaces
- [ ] API toegang met eigen API key
- [ ] Custom PDF rapport met eigen branding
- [ ] 10 gelijktijdige scans
- [ ] Dedicated support

---

### Phase 5 — Output & Reporting
- [ ] PDF rapport — client-ready, Zenkai branded, met logo
- [ ] JSON output voor API consumers
- [ ] Risk score 0–100 met severity breakdown
- [ ] Executive summary in plain Nederlands
- [ ] CVE + CVSS score per finding
- [ ] Top findings + actionable fixes + evidence per issue
- [ ] Rapport bewaren per plan (30 dagen / 1 jaar / onbeperkt)

---

### Phase 6 — Infrastructure
- [ ] Deploy tool stack op Ubuntu VPS (nmap, ZAP, sqlmap, playwright)
- [ ] Async job queue (scan runs isolated per job)
- [ ] Module isolation (subprocess per tool)
- [ ] Plan-based limiet enforcement in API
- [ ] GitHub CI/CD naar VPS
- [ ] SaaS-ready rate limiting & queue management
- [ ] Lemon Squeezy abonnement koppeling per plan
- [ ] Gebruiker dashboard — scan geschiedenis, rapport downloads

---

### Architecture Rules
- One domain per scan — geen IP ranges in Starter of Pro
- All scans async via job queue
- Modules run isolated — één failure stopt nooit de hele scan
- ZAP: altijd crawl depth, URL cap, request rate, en scan timeout instellen
- Active testing alleen op bevestigd attack surface — nooit full aggression mode
- Target safety principe: scanner mag nooit target overbelasten of crashen
- Plan limieten worden afgedwongen in Flask API voor elke tool aanroep

---

### Tool Stack
| Tool | Role | Plans |
|---|---|---|
| nmap | Port scanning + service detection | Alle plans |
| ZAP Proxy API | Crawling + passive/active web testing | Starter+ |
| SQLMap | Targeted SQL injection validation | Pro+ |
| Playwright | Browser-based interactieve testing | Enterprise |
| VirusTotal API | URL/IP reputation | Starter+ |
| Shodan API | External exposure intelligence | Starter+ |
| urlscan.io API | Screenshot + web reputation | Free+ |
| gobuster | Directory enumeration | Alle plans |
| nikto | OWASP baseline checks | Alle plans |
| whatweb | Tech fingerprinting | Alle plans |
| sslyze | SSL/TLS deep analysis | Pro+ |
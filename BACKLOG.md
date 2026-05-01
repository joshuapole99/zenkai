## Zenkai Product Backlog

---

## Zenkai Tools — zenkai.nl (1 live · 7 in backlog)

| # | Tool | Status | Beschrijving |
|---|---|---|---|
| 01 | Scan | ✅ LIVE | Quick Scan + Full Scan, PDF rapport |
| 02 | SSL Monitor | TODO | Cert monitoring + alerts — vervaldatum, weak ciphers, mismatch, self-signed |
| 03 | Email Header Analyzer | TODO | SPF/DKIM/DMARC check — plak header, zie direct resultaat + spoofing tekenen |
| 04 | Password Breach Checker | TODO | HaveIBeenPwned integratie — k-Anonymity, data verlaat nooit de browser |
| 05 | DNS Lookup | TODO | A, AAAA, MX, TXT, SPF, DMARC, CAA — inclusief SPF-validatie + reverse DNS |
| 06 | PDF Protect | TODO | Wachtwoord + permissies op PDF — volledig client-side, geen upload |
| 07 | Password Generator | TODO | Instelbare lengte/symbolen/cijfers, entropie-indicator, bulk genereren |
| 08 | Hash Generator | TODO | MD5/SHA-1/SHA-256/SHA-512 in browser — HMAC-varianten + hash vergelijking |

---

## Website (zenkai.nl — apps/web)

### Pages — TODO
- [ ] **Blog** — security artikelen, tool writeups, hacking tips (SEO + autoriteit opbouwen)
- [ ] **Homepage** — geen leugens/misleidende claims; vervang placeholders met echte features + echte screenshots
- [ ] **Pricing** — afmaken: per plan tabel, features, CTA naar checkout/scan
- [ ] **Store** — losse scan pakketten, rapport credits, eventueel merchandise
- [ ] **About** — afmaken: missie, OSCP achtergrond, waarom Zenkai, contact

### Design / UX
- [ ] Mobile nav afmaken
- [ ] Consistent hero CTA op alle pagina's → "Start Free Scan"
- [ ] Social proof section (testimonials of case studies — als die er zijn)

---

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

### Phase 3 — Full Scan / Pro Plan ✓ (COMPLETE - April 2026)

Goal: full attack surface mapping + controlled vulnerability testing.

**Deep Discovery**
- [x] Full TCP scan (1–65535) + UDP
- [x] Advanced DNS + subdomain enumeration — SecLists top-5000 wordlist, parallel (xargs -P 40)
- [x] SSL/TLS deep analysis — cipher suites, RC4, 3DES (sslyze)
- [x] Version-based vulnerability detection via Shodan CVEs
- [x] Directory enum — feroxbuster + SecLists raft-large (119k wordlist)
- [x] feroxbuster output parser fix (correct field count: STATUS METHOD LINES WORDS BYTES URL)
- [x] Shodan API credits cache — 24h file cache, skips re-query for same IP — DEPLOYED
- [x] urlscan.io — search existing scans first; poll timeout 30s → 60s — DEPLOYED
- [x] ZAP active scan + full crawl (depth 5, 500 URLs) — DEPLOYED (automation YAML: spider depth 5 + activeScan 8min)

**Active Testing**
- [x] SQL Injection — SQLMap BEUSTQ, level 2, risk 1 — forms (crawl=3) + URL params (?id,cat,q,search)
- [x] Server-Side Template Injection (SSTI) — Jinja2/Twig/Freemarker payloads
- [x] Open Redirect detection — 7 common parameters
- [x] Host Header Injection
- [x] XSS testing — ZAP active scan — DEPLOYED (included in ZAP activeScan automation)
- [ ] SSRF met callback — requires OOB server — FUTURE
- [ ] Client-Side Prototype Pollution — FUTURE

**Report fixes**
- [x] gobuster/feroxbuster: 403s no longer in report — blacklisted at tool level + parser level
- [x] gobuster: sensitive paths → individual HIGH findings (max 15), all other 200s → 1 summary finding
- [x] PDF bar chart overflow fix — switched from px to % widths
- [x] Shodan 403 (CDN IP) → graceful warn; 404 → graceful pass
- [x] PDF report: risk gauge SVG + severity bar chart confirmed rendering correctly

**Advanced Tool Arsenal — Enumeration (Pro + Enterprise)**
- [x] ffuf — LFI detection (LFI-Jhaddix.txt) + API endpoint discovery (/api/FUZZ) — DEPLOYED
- [ ] gobuster DNS mode — DNS recon + vhost discovery (naast bestaande dir mode)
- [x] wfuzz — parameter fuzzing + SQL injection fuzzing via URL params — DEPLOYED
- [x] WPScan — WordPress vulnerability scanning, plugin/theme enumeration (WordPress-only) — DEPLOYED
- [ ] enum4linux-ng — SMB/LDAP enumeration (Enterprise IP range scans)
- [ ] ldapsearch — LDAP directory enumeration (Enterprise)

**Advanced Tool Arsenal — Injection Testing (Pro + Enterprise)**
- [ ] wfuzz SQL module — SQL injection fuzzing via parameters
- [ ] XXE payloads via ZAP — XML External Entity injection
- [ ] SSTI detection via ffuf/wfuzz — template injection fuzzing (aanvulling op huidige curl-based SSTI)
- [ ] LFI detection via ffuf — local file inclusion path fuzzing (SecLists LFI-Jhaddix wordlist)
- [ ] Upload vulnerability checks via ZAP — file upload bypass testing

**Advanced Tool Arsenal — Brute Force (Enterprise only — opt-in)**
- [ ] wfuzz login fuzzing — credential bruteforce op login endpoints
- [ ] netexec — SMB/SSH/WinRM/MSSQL/FTP credential spraying (Enterprise IP range scans)
- [ ] Kerbrute — Kerberos username enumeration (Enterprise)
- [ ] Custom wordlist support — gebruiker kan eigen wordlist uploaden
- [ ] Rate limiting configureerbaar — default 10 req/s, max 100 req/s
- [ ] Expliciete opt-in vereist — checkbox: "Ik bevestig dat ik eigenaar ben van dit target en toestemming heb voor deze test"
- [ ] Bevindingen: weak credentials, username enumeration, account lockout beleid ontbreekt
- [ ] Brute force resultaten apart gemarkeerd in rapport als "Authorized Testing"

**Intelligence**
- [x] urlscan.io domain/IP/URL reputation
- [x] Shodan enrichment (ports, CVEs, banners)

**Limits (Pro):**
- Max 65535 ports, 50 req/s, max 20 min total scan time
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
- [x] PDF rapport — client-ready, Zenkai branded, met logo
- [x] Risk score 0–100 met severity breakdown
- [x] "Scan Overzicht" module grid — open ports, subdomains, ZAP details, injections in PDF
- [x] Section numbering dynamisch op basis van aanwezige secties
- [ ] JSON output voor API consumers
- [ ] Executive summary in plain Nederlands (nu generiek — verbeteren)
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
- Brute force tools alleen beschikbaar in Enterprise plan
- Brute force vereist expliciete opt-in checkbox: "Ik bevestig dat ik eigenaar ben van dit target en toestemming heb voor deze test"
- Rate limiting default op 10 req/s voor brute force, gebruiker kan verhogen tot 100 req/s
- Brute force resultaten worden apart gemarkeerd in het rapport als "Authorized Testing"

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
| ffuf | Directory/file fuzzing, LFI, API endpoints, vhost discovery | Pro+ |
| wfuzz | Parameter fuzzing, login fuzzing, SQLi fuzzing, subdomain enum | Pro+ |
| WPScan | WordPress vulnerability scanning, plugin/theme enum | Pro+ (WordPress only) |
| feroxbuster | Fast recursive directory enumeration | Pro+ |
| enum4linux-ng | SMB/LDAP enumeration | Enterprise |
| ldapsearch | LDAP directory enumeration | Enterprise |
| netexec | SMB/SSH/WinRM/MSSQL/FTP credential spraying | Enterprise |
| Kerbrute | Kerberos username enumeration | Enterprise |
| Hydra | Web/FTP/SSH/RDP login brute force | Enterprise |
| GitDumper | Git repo dump als /.git gevonden wordt | Pro+ |
| sslscan | SSL/TLS cipher suite analyse | Pro+ |
| shcheck.py | Security headers checker | Starter+ |
| snmpwalk | SNMP enumeration | Pro+ |
| dnsenum | DNS enumeration (zone transfer, brute force) | Starter+ |
| nslookup | DNS lookup | Alle plans |
| metasploit | Exploit validation (pentest service only) | Enterprise+ |
| theHarvester | OSINT — emails, usernames, subdomains via public bronnen | Starter+ |
| amass | Passieve subdomain enumeration (certificate logs, APIs) | Pro+ |
| subfinder | Snelle passieve subdomain discovery | Pro+ |
| nuclei | Template-based vulnerability scanning (CVEs, misconfigs) | Pro+ |
| waybackurls | Historische URL discovery via Wayback Machine | Pro+ |

---

### Phase 7 — Scanner Intelligence & Reporting Improvements (TODO)

**Reporting — Tabellen per module**
- [ ] Poortscan resultaten → tabel: IP address, hostname, port, service, details
- [ ] DNS records → tabel: domain, record type, value, policy (incl. SPF, DKIM, DMARC)
- [ ] Response headers → tabel: domain, header, value
- [ ] Missing security headers → tabel: domain, ontbrekende header
- [ ] SSL misconfiguraties → tabel: domain, issue (bijv. TLSv1.0 enabled — alleen 1.2/1.3 is secure)
- [ ] Network discovery → tabel: IP address, hostname, OS, domain, Signing, SMBv1
- [ ] Gevonden accounts → tabel: source, username, type
- [ ] Elke finding krijgt: uitleg wat het is + aanbeveling/recommendation voor de klant
- [ ] Security headers uitleg — wat doet elke header (HSTS, CSP, X-Frame, etc.)

**Tool verbeteringen**
- [ ] feroxbuster/gobuster: herken Cloudflare CDN paden (`/cdn-cgi/`) → filter of markeer als "CDN intern, geen risico"
- [ ] SQLMap: scan alle input velden (forms/POST) via .req file, niet alleen URL params
- [ ] Alle gevonden subdomains: automatisch poortscan (nmap) + nikto → Pro / beperkt in Free
- [ ] nmap flags: `-p-` (alle poorten), `-sV` (service), `-sU` (UDP), `-Pn` (host unreachable), `-A` (aggressive)
- [ ] DNSDumpster integratie voor subdomain discovery (web scraper of API)
- [ ] DNSSEC scanning — check of DNSSEC correct geconfigureerd is
- [ ] snmpwalk — SNMP community string enumeration (public/private)
- [ ] shcheck.py — security headers analyse als aanvulling op huidige check
- [ ] sslscan — aanvulling op sslyze voor cipher suite details

**Brute force verbeteringen (Enterprise)**
- [ ] Hydra — wachtwoord brute force op web login, FTP, SSH, RDP
- [ ] NetExec met FTP/SMB/SSH/RDP brute force + enum
- [ ] Login portals, routers, printers, switches → test admin:admin + top credentials
- [ ] GitDumper — als `.git` directory gevonden (200 response) → dump repo automatisch
- [ ] Nederlandse wordlist support (~/Tools/zenkai/wordlists/) voor enum + brute force

**Enterprise extras**
- [ ] Metasploit exploit validation pipeline (pentest service — aparte offering naast scanner)
- [ ] Subdomains: elk ontdekt subdomain krijgt volledige poortscan + nikto + headers
- [ ] IP ranges ondersteuning: alle subdomains/IPs in eigen subnet-tabel met reverse DNS

**Pentest-as-a-Service (apart product — TODO)**
- [ ] Handmatige pentest service op basis van OSCP kennis
- [ ] Mooi rapport template (PDF) met executive summary + technische bevindingen
- [ ] Research: is dit legaal in NL met alleen OSCP (zonder CREST/RE&D certificering)?
- [ ] Pricing model: per domein / per dag / per rapport

---

## Content & Distribution (BACKLOG — niet oppakken)

> Volgorde: News Page eerst → API daarna (pas als news page traffic heeft).

### Security News Page — zenkai.nl/news

- [ ] Dagelijkse scraper: CVE Mitre (NVD API), The Hacker News (RSS), Bleeping Computer (RSS)
- [ ] Pagina toont recente CVEs, breaches en security nieuws
- [ ] CVE detail view: CVSS score, affected products, published date, description
- [ ] Filter op categorie (CVE / breach / news) en severity
- [ ] SEO-geoptimaliseerd: dynamische meta titles per CVE/artikel
- [ ] Doel: organisch verkeer + autoriteit opbouwen als security platform
- [ ] Bouwen vóór de API — traffic eerst bewijzen

### Security News API — api.zenkai.nl

- [ ] REST API: CVE data + news feeds opvragen via API key
- [ ] Endpoints: `GET /cves`, `GET /cves/{id}`, `GET /news`, `GET /news/{source}`
- [ ] API key auth — uitgeven op Pro/Enterprise plan
- [ ] Rate limiting per plan tier
- [ ] Monetisatie: gratis tier (beperkt) → Pro/Enterprise onbeperkt
- [ ] Pas bouwen nadat news page aantoonbaar organisch verkeer heeft
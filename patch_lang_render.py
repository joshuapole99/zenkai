"""
Patch render.py:
1. Add intro_dns/ssl/headers/sub + f_risk_label to LABELS (NL + EN)
2. Replace _ZAP_RECS + _FINDING_COPY with bilingual version (desc/risk/rec per language)
3. Application loop sets f["risk"] per language
"""

with open('/root/zenkai/render.py', 'r') as f:
    src = f.read()

# ── 1. Add new LABELS entries (NL) ──────────────────────────────────────────
old_nl_end = (
    '        "hdr_present_title":   "Aanwezige headers",\n'
    '        "hdr_missing_title":   "Ontbrekende headers",\n'
    '    },'
)
new_nl_end = (
    '        "hdr_present_title":   "Aanwezige headers",\n'
    '        "hdr_missing_title":   "Ontbrekende headers",\n'
    '        "f_risk_label":        "Risico voor uw bedrijf",\n'
    '        "intro_dns":           "SPF, DMARC en CAA zijn e-mailbeveiligingsrecords die voorkomen dat uw domeinnaam wordt misbruikt voor valse e-mails. Een ontbrekende of zwakke instelling vergroot het risico op phishing vanuit uw naam.",\n'
    '        "intro_ssl":           "TLS is het versleutelingsprotocol dat de verbinding tussen uw website en bezoekers beveiligt. Verouderde versies (ouder dan TLS 1.2) bevatten bekende zwakheden en moeten uitgeschakeld worden.",\n'
    '        "intro_headers":       "HTTP-beveiligingsheaders zijn instructies die uw webserver meegeeft aan browsers om bepaalde aanvallen te voorkomen. Ontbrekende headers maken uw bezoekers kwetsbaar voor clickjacking, scriptinjectie en andere aanvallen.",\n'
    '        "intro_sub":           "Subdomeinen zijn adressen zoals mail.uwbedrijf.nl of test.uwbedrijf.nl. Gevoelige subdomeinen die publiek bereikbaar zijn, kunnen een ingang bieden voor aanvallers.",\n'
    '    },'
)
src = src.replace(old_nl_end, new_nl_end)
print('[1a] NL labels:', 'ok' if 'f_risk_label' in src else 'FAIL')

# ── 1. Add new LABELS entries (EN) ──────────────────────────────────────────
old_en_end = (
    '        "hdr_present_title":   "Present headers",\n'
    '        "hdr_missing_title":   "Missing headers",\n'
    '    },'
)
new_en_end = (
    '        "hdr_present_title":   "Present headers",\n'
    '        "hdr_missing_title":   "Missing headers",\n'
    '        "f_risk_label":        "Risk for your business",\n'
    '        "intro_dns":           "SPF, DMARC, and CAA are email security records that prevent your domain name from being misused for fake emails. A missing or weak setting increases the risk of phishing in your name.",\n'
    '        "intro_ssl":           "TLS is the encryption protocol that secures the connection between your website and visitors. Outdated versions (older than TLS 1.2) contain known weaknesses and must be disabled.",\n'
    '        "intro_headers":       "HTTP security headers are instructions your web server sends to browsers to prevent certain attacks. Missing headers leave your visitors vulnerable to clickjacking, script injection, and other attacks.",\n'
    '        "intro_sub":           "Subdomains are addresses such as mail.yourbusiness.com or test.yourbusiness.com. Sensitive subdomains that are publicly accessible may provide an entry point for attackers.",\n'
    '    },'
)
src = src.replace(old_en_end, new_en_end)
print('[1b] EN labels:', 'ok' if '"Risk for your business"' in src else 'FAIL')

# ── 2. Build the new combined block ─────────────────────────────────────────
NEW_BLOCK = r'''
# ── Bilingual finding copy (description / risk / recommendation) ─────────────
# Each entry: "title fragment" -> {lang: (description, risk, recommendation)}
_FINDING_COPY = {
    "Missing SPF Record": {
        "nl": (
            "Uw domein heeft geen SPF-beveiligingsregel voor e-mail.",
            "Criminelen kunnen e-mails versturen die er uitzien alsof ze van uw bedrijf komen en zo klanten of medewerkers oplichten.",
            "Dit kunt u oplossen door een SPF-record toe te voegen aan uw domeininstellingen. Voeg een DNS TXT-record toe met de waarde: v=spf1 include:[uw e-mailprovider] ~all",
        ),
        "en": (
            "Your domain has no SPF security rule for email.",
            "Criminals can send emails that appear to come from your company, deceiving customers or employees.",
            "You can fix this by adding an SPF record to your domain settings. Add a DNS TXT record with: v=spf1 include:[your-mail-provider] ~all",
        ),
    },
    "Missing DMARC Record": {
        "nl": (
            "Uw domein heeft geen DMARC-beveiliging voor e-mail.",
            "Aanvallers kunnen uw domeinnaam misbruiken in valse e-mails en u ontvangt geen melding wanneer dit gebeurt.",
            "Dit kunt u oplossen door DMARC in te stellen op uw domein. Voeg een DNS TXT-record toe op _dmarc.[uwdomein] met de waarde: v=DMARC1; p=reject; rua=mailto:dmarc@[uwdomein]",
        ),
        "en": (
            "Your domain has no DMARC email protection.",
            "Attackers can use your domain name in fake emails and you will not be notified when this happens.",
            "You can fix this by setting up DMARC on your domain. Add a DNS TXT record at _dmarc.[yourdomain] with: v=DMARC1; p=reject; rua=mailto:dmarc@[yourdomain]",
        ),
    },
    "Weak DMARC": {
        "nl": (
            "Uw DMARC-instelling staat op monitoren maar blokkeert geen valse e-mails.",
            "Nepberichten die uw bedrijfsnaam gebruiken worden niet tegengehouden en kunnen schade toebrengen aan uw klanten.",
            "Dit kunt u oplossen door het DMARC-beleid te wijzigen van bewaking naar blokkeren. Pas uw DMARC DNS-record aan: wijzig p=none naar p=reject",
        ),
        "en": (
            "Your DMARC setting is in monitor-only mode and does not block fake emails.",
            "Fraudulent emails using your company name are not stopped and may harm your customers.",
            "You can fix this by changing your DMARC policy from monitoring to blocking. Update your DMARC DNS record: change p=none to p=reject",
        ),
    },
    "No CAA Record": {
        "nl": (
            "Er is geen CAA-beveiliging ingesteld voor uw domeinnaam.",
            "Elk certificaatbedrijf ter wereld kan een SSL-certificaat voor uw website uitgeven zonder uw toestemming.",
            "Dit kunt u oplossen door een CAA-record toe te voegen aan uw domeininstellingen. Voeg een DNS CAA-record toe met de waarde: 0 issue \"letsencrypt.org\"",
        ),
        "en": (
            "There is no CAA security record set for your domain name.",
            "Any certificate authority in the world can issue an SSL certificate for your website without your permission.",
            "You can fix this by adding a CAA record to your domain settings. Add a DNS CAA record with: 0 issue \"letsencrypt.org\"",
        ),
    },
    "Missing HSTS": {
        "nl": (
            "Uw website dwingt bezoekers niet altijd de beveiligde versie (https) te gebruiken.",
            "Op openbare wifi-netwerken kunnen aanvallers bezoekers omleiden naar een onbeveiligde verbinding en gegevens stelen.",
            "Dit kunt u oplossen door HSTS in te schakelen op uw webserver. Voeg de volgende instelling toe aan uw serverconfiguratie: Strict-Transport-Security: max-age=31536000; includeSubDomains",
        ),
        "en": (
            "Your website does not force visitors to always use the secure (https) version.",
            "On public Wi-Fi networks, attackers can redirect visitors to an insecure connection and steal their data.",
            "You can fix this by enabling HSTS on your web server. Add the following to your server configuration: Strict-Transport-Security: max-age=31536000; includeSubDomains",
        ),
    },
    "Missing CSP": {
        "nl": (
            "Uw website heeft geen Content Security Policy, een bewakingslaag die bepaalt welke scripts mogen laden.",
            "Kwaadaardige scripts van externe websites kunnen ongemerkt worden geladen op uw site en gegevens van bezoekers stelen.",
            "Dit kunt u oplossen door een Content Security Policy in te stellen. Voeg de volgende instelling toe aan uw serverconfiguratie: Content-Security-Policy: default-src 'self'",
        ),
        "en": (
            "Your website has no Content Security Policy, a security layer that controls which scripts may load.",
            "Malicious scripts from external websites can silently load on your site and steal visitor data.",
            "You can fix this by setting a Content Security Policy. Add the following to your server configuration: Content-Security-Policy: default-src 'self'",
        ),
    },
    "Missing X-Frame-Options": {
        "nl": (
            "Uw website kan door andere websites worden ingesloten en onzichtbaar worden getoond.",
            "Aanvallers kunnen uw website verborgen over een fraudepagina leggen zodat bezoekers onbedoeld knoppen van uw site aanklikken.",
            "Dit kunt u oplossen door de volgende instelling toe te voegen aan uw serverconfiguratie: X-Frame-Options: SAMEORIGIN",
        ),
        "en": (
            "Your website can be embedded and shown invisibly by other websites.",
            "Attackers can overlay your website on a fraudulent page, causing visitors to unknowingly click buttons on your site.",
            "You can fix this by adding the following to your server configuration: X-Frame-Options: SAMEORIGIN",
        ),
    },
    "Missing X-Content-Type-Options": {
        "nl": (
            "Uw website stuurt browsers geen instructie om bestanden strikt te interpreteren.",
            "Browsers kunnen kwaadaardige bestanden verkeerd interpreteren en als uitvoerbare code behandelen.",
            "Dit kunt u oplossen door de volgende instelling toe te voegen aan uw serverconfiguratie: X-Content-Type-Options: nosniff",
        ),
        "en": (
            "Your website does not instruct browsers to strictly interpret file types.",
            "Browsers may misinterpret malicious files and execute them as code.",
            "You can fix this by adding the following to your server configuration: X-Content-Type-Options: nosniff",
        ),
    },
    "Missing Referrer-Policy": {
        "nl": (
            "Uw website deelt meer informatie over bezoekers met externe websites dan nodig is.",
            "Gevoelige URL's van uw site kunnen uitlekken naar derde partijen wanneer een bezoeker op een externe link klikt.",
            "Dit kunt u oplossen door een Referrer-Policy in te stellen. Voeg de volgende instelling toe aan uw serverconfiguratie: Referrer-Policy: strict-origin-when-cross-origin",
        ),
        "en": (
            "Your website shares more information about visitors with external websites than necessary.",
            "Sensitive URLs from your site may leak to third parties when a visitor clicks an external link.",
            "You can fix this by setting a Referrer-Policy. Add the following to your server configuration: Referrer-Policy: strict-origin-when-cross-origin",
        ),
    },
    "Missing Permissions-Policy": {
        "nl": (
            "Uw website heeft geen beleid voor gevoelige browserfuncties zoals camera en locatie.",
            "Externe scripts die via uw site laden, kunnen ongewenst toegang vragen tot camera, microfoon of locatiegegevens van bezoekers.",
            "Dit kunt u oplossen door de volgende instelling toe te voegen aan uw serverconfiguratie: Permissions-Policy: camera=(), microphone=(), geolocation=()",
        ),
        "en": (
            "Your website has no policy for sensitive browser features such as camera and location.",
            "External scripts loading through your site may request unauthorized access to visitors' camera, microphone, or location.",
            "You can fix this by adding the following to your server configuration: Permissions-Policy: camera=(), microphone=(), geolocation=()",
        ),
    },
    "Missing COOP": {
        "nl": (
            "Uw website mist een isolatiemaatregel die beschermt tegen aanvallen vanuit andere browsertabbladen.",
            "Een kwaadaardige website die tegelijk openstaat in de browser kan proberen informatie uit uw site te lezen.",
            "Dit kunt u oplossen door de volgende instelling toe te voegen aan uw serverconfiguratie: Cross-Origin-Opener-Policy: same-origin",
        ),
        "en": (
            "Your website lacks an isolation measure that protects against attacks from other browser tabs.",
            "A malicious website open simultaneously in the browser may attempt to read information from your site.",
            "You can fix this by adding the following to your server configuration: Cross-Origin-Opener-Policy: same-origin",
        ),
    },
    "Missing CORP": {
        "nl": (
            "Uw website staat toe dat andere websites uw inhoud kunnen opvragen.",
            "Kwaadaardige sites kunnen uw afbeeldingen of data laden om informatie over uw ingelogde bezoekers te verzamelen.",
            "Dit kunt u oplossen door de volgende instelling toe te voegen aan uw serverconfiguratie: Cross-Origin-Resource-Policy: same-origin",
        ),
        "en": (
            "Your website allows other websites to load your content.",
            "Malicious sites can load your images or data to collect information about your logged-in visitors.",
            "You can fix this by adding the following to your server configuration: Cross-Origin-Resource-Policy: same-origin",
        ),
    },
    "Server Version Disclosure": {
        "nl": (
            "Uw webserver onthult publiekelijk welk softwarepakket en versienummer hij gebruikt.",
            "Aanvallers zoeken gericht naar bekende kwetsbaarheden in die specifieke versie en kunnen zo gerichte aanvallen voorbereiden.",
            "Dit kunt u oplossen door versie-informatie te verbergen in uw serverconfiguratie. Stel in: ServerTokens Prod (Apache) of server_tokens off (nginx)",
        ),
        "en": (
            "Your web server publicly reveals which software package and version number it uses.",
            "Attackers can look up known vulnerabilities for that specific version and prepare targeted attacks.",
            "You can fix this by hiding version information in your server configuration. Set: ServerTokens Prod (Apache) or server_tokens off (nginx)",
        ),
    },
    "TLS 1.0": {
        "nl": (
            "Uw website ondersteunt TLS 1.0, een verouderd beveiligingsprotocol dat al jarenlang als onveilig wordt beschouwd.",
            "Aanvallers kunnen via dit protocol versleutelde verbindingen van bezoekers afluisteren en gegevens stelen.",
            "Dit kunt u oplossen door TLS 1.0 uit te schakelen op uw webserver. Schakel TLS 1.0 en TLS 1.1 uit en sta alleen TLS 1.2 en TLS 1.3 toe in uw SSL-configuratie.",
        ),
        "en": (
            "Your website supports TLS 1.0, an outdated security protocol that has been considered insecure for years.",
            "Attackers can intercept encrypted visitor connections through this protocol and steal data.",
            "You can fix this by disabling TLS 1.0 on your web server. Disable TLS 1.0 and TLS 1.1 and allow only TLS 1.2 and TLS 1.3 in your SSL configuration.",
        ),
    },
    "TLS 1.1": {
        "nl": (
            "Uw website ondersteunt TLS 1.1, een verouderd protocol dat door alle grote browsers is afgeschreven.",
            "Verbindingen via dit protocol bieden minder bescherming en zijn vatbaar voor bepaalde aanvallen op de versleuteling.",
            "Dit kunt u oplossen door TLS 1.1 uit te schakelen op uw webserver. Schakel TLS 1.0 en TLS 1.1 uit en sta alleen TLS 1.2 en TLS 1.3 toe in uw SSL-configuratie.",
        ),
        "en": (
            "Your website supports TLS 1.1, an outdated protocol deprecated by all major browsers.",
            "Connections using this protocol offer weaker protection and are vulnerable to certain encryption attacks.",
            "You can fix this by disabling TLS 1.1 on your web server. Disable TLS 1.0 and TLS 1.1 and allow only TLS 1.2 and TLS 1.3 in your SSL configuration.",
        ),
    },
    "Self-Signed Certificate": {
        "nl": (
            "Uw website gebruikt een SSL-certificaat dat zonder onafhankelijke controle is aangemaakt.",
            "Bezoekers krijgen een beveiligingswaarschuwing in hun browser en zullen uw site wantrouwen of verlaten.",
            "Dit kunt u oplossen door een erkend SSL-certificaat te installeren. Installeer een certificaat van Let's Encrypt (gratis) of een commerciële certificaatautoriteit op uw webserver.",
        ),
        "en": (
            "Your website uses an SSL certificate created without independent verification.",
            "Visitors receive a security warning in their browser and may distrust or abandon your site.",
            "You can fix this by installing a recognized SSL certificate. Install a certificate from Let's Encrypt (free) or a commercial certificate authority on your web server.",
        ),
    },
    "Expired SSL Certificate": {
        "nl": (
            "Het SSL-certificaat van uw website is verlopen en biedt geen geldige beveiliging meer.",
            "Bezoekers zien een beveiligingswaarschuwing, vertrouwen uw site niet en zullen weggaan; de versleuteling van gegevens is niet meer gegarandeerd.",
            "Dit kunt u oplossen door het SSL-certificaat direct te vernieuwen. Vernieuw het certificaat via uw hoster en activeer automatische vernieuwing via certbot om dit in de toekomst te voorkomen.",
        ),
        "en": (
            "Your website's SSL certificate has expired and no longer provides valid security.",
            "Visitors see a security warning, lose trust in your site, and will leave; data encryption is no longer guaranteed.",
            "You can fix this by renewing your SSL certificate immediately. Renew the certificate through your hosting provider and activate automatic renewal via certbot.",
        ),
    },
    "RC4": {
        "nl": (
            "Uw server gebruikt RC4-versleuteling, een algoritme dat als volledig gebroken wordt beschouwd.",
            "Aanvallers kunnen versleuteld verkeer van uw site decoderen en gevoelige gegevens van bezoekers lezen.",
            "Dit kunt u oplossen door RC4 uit te schakelen in uw SSL-configuratie. Verwijder RC4 uit de cipher suite configuratie van uw webserver.",
        ),
        "en": (
            "Your server uses RC4 encryption, an algorithm that is considered completely broken.",
            "Attackers can decrypt encrypted traffic from your site and read sensitive visitor data.",
            "You can fix this by disabling RC4 in your SSL configuration. Remove RC4 from the cipher suite configuration of your web server.",
        ),
    },
    "3DES": {
        "nl": (
            "Uw server gebruikt 3DES-versleuteling die vatbaar is voor de SWEET32-aanval.",
            "Bij langdurige verbindingen kunnen aanvallers via statistisch onderzoek versleutelde communicatie decoderen.",
            "Dit kunt u oplossen door 3DES uit te schakelen in uw SSL-configuratie. Verwijder 3DES uit de cipher suite configuratie van uw webserver.",
        ),
        "en": (
            "Your server uses 3DES encryption, which is vulnerable to the SWEET32 attack.",
            "During long-running connections, attackers can use statistical analysis to decode encrypted communications.",
            "You can fix this by disabling 3DES in your SSL configuration. Remove 3DES from the cipher suite configuration of your web server.",
        ),
    },
    "FTP Open": {
        "nl": (
            "Uw server heeft een openstaande FTP-poort voor bestandsoverdracht.",
            "FTP stuurt bestanden en wachtwoorden volledig onversleuteld over het internet — iedereen op hetzelfde netwerk kan meelezen.",
            "Dit kunt u oplossen door FTP te vervangen door een veilig alternatief. Schakel FTP (poort 21) uit in uw firewall en gebruik SFTP voor beveiligde bestandsoverdracht.",
        ),
        "en": (
            "Your server has an open FTP port for file transfers.",
            "FTP sends files and passwords completely unencrypted over the internet — anyone on the same network can read them.",
            "You can fix this by replacing FTP with a secure alternative. Disable FTP (port 21) in your firewall and use SFTP for secure file transfers.",
        ),
    },
    "SSH Open": {
        "nl": (
            "Uw server is bereikbaar via SSH, een technische beheertoegang op afstand.",
            "Als het wachtwoord zwak is of de configuratie niet goed, kunnen aanvallers geautomatiseerd proberen in te breken op uw server.",
            "Dit kunt u oplossen door SSH-toegang te beperken tot specifieke, bekende IP-adressen. Stel een firewallregel in die SSH (poort 22) alleen toestaat vanuit uw beheer-IP en schakel wachtwoord-login uit ten gunste van SSH-sleutels.",
        ),
        "en": (
            "Your server is reachable via SSH, a remote technical management access.",
            "If the password is weak or the configuration is poor, attackers can automatically attempt to break into your server.",
            "You can fix this by restricting SSH access to specific, known IP addresses. Set a firewall rule to allow SSH (port 22) only from your management IP and disable password login in favor of SSH keys.",
        ),
    },
    "Telnet Open": {
        "nl": (
            "Uw server heeft Telnet aanstaan, een extreem verouderd beheerprotocol.",
            "Telnet stuurt alles inclusief wachtwoorden volledig leesbaar over het netwerk — dit is een kritieke kwetsbaarheid.",
            "Dit kunt u oplossen door Telnet direct uit te schakelen. Zet de Telnet-service stop op uw server en sluit poort 23 in uw firewall.",
        ),
        "en": (
            "Your server has Telnet enabled, an extremely outdated management protocol.",
            "Telnet transmits everything including passwords in plain text over the network — this is a critical vulnerability.",
            "You can fix this by disabling Telnet immediately. Stop the Telnet service on your server and close port 23 in your firewall.",
        ),
    },
    "SMTP Open": {
        "nl": (
            "Uw server heeft een openstaande SMTP-poort voor e-mailverzending.",
            "Als dit niet bedoeld is, kan uw server worden misbruikt als doorgeefluik voor spam of phishingmails.",
            "Dit kunt u oplossen door SMTP te beperken tot geautoriseerde afzenders. Configureer relay-restrictie op uw SMTP-server en sluit poort 25 als de server geen mailserver is.",
        ),
        "en": (
            "Your server has an open SMTP port for email sending.",
            "If unintentional, your server may be abused as a relay for spam or phishing emails.",
            "You can fix this by restricting SMTP to authorized senders. Configure relay restrictions on your SMTP server and close port 25 if the server is not a mail server.",
        ),
    },
    "POP3 Open": {
        "nl": (
            "Uw server biedt e-mailtoegang via het onversleutelde POP3-protocol.",
            "E-mailwachtwoorden en berichten die via POP3 worden verstuurd, zijn leesbaar voor iedereen op hetzelfde netwerk.",
            "Dit kunt u oplossen door POP3 te vervangen door de beveiligde variant. Schakel POP3 (poort 110) uit en gebruik alleen POP3S (poort 995).",
        ),
        "en": (
            "Your server provides email access via the unencrypted POP3 protocol.",
            "Email passwords and messages sent via POP3 are readable by anyone on the same network.",
            "You can fix this by replacing POP3 with the secure variant. Disable POP3 (port 110) and use only POP3S (port 995).",
        ),
    },
    "IMAP Open": {
        "nl": (
            "Uw server biedt e-mailtoegang via het onversleutelde IMAP-protocol.",
            "E-mailwachtwoorden die via IMAP worden doorgegeven, zijn leesbaar voor iedereen op hetzelfde netwerk.",
            "Dit kunt u oplossen door IMAP te vervangen door de beveiligde variant. Schakel IMAP (poort 143) uit en gebruik alleen IMAPS (poort 993).",
        ),
        "en": (
            "Your server provides email access via the unencrypted IMAP protocol.",
            "Email passwords sent via IMAP are readable by anyone on the same network.",
            "You can fix this by replacing IMAP with the secure variant. Disable IMAP (port 143) and use only IMAPS (port 993).",
        ),
    },
    "MySQL Exposed": {
        "nl": (
            "Uw MySQL-database is rechtstreeks bereikbaar via het openbare internet.",
            "Databases bevatten al uw klantgegevens, bestellingen en wachtwoorden — directe toegang via het internet mag nooit.",
            "Dit kunt u oplossen door de databasepoort direct te blokkeren in uw firewall. Blokkeer poort 3306 zodat alleen verbindingen van localhost of een specifiek beheer-IP zijn toegestaan.",
        ),
        "en": (
            "Your MySQL database is directly reachable via the public internet.",
            "Databases contain all your customer data, orders, and passwords — direct internet access is never acceptable.",
            "You can fix this by blocking the database port immediately in your firewall. Block port 3306 so only connections from localhost or a specific management IP are allowed.",
        ),
    },
    "PostgreSQL Exposed": {
        "nl": (
            "Uw PostgreSQL-database is bereikbaar via het openbare internet.",
            "Aanvallers hebben directe toegang tot al uw bedrijfsgegevens — directe toegang via het internet mag nooit.",
            "Dit kunt u oplossen door de databasepoort direct te blokkeren in uw firewall. Blokkeer poort 5432 zodat alleen verbindingen van localhost of een specifiek beheer-IP zijn toegestaan.",
        ),
        "en": (
            "Your PostgreSQL database is reachable via the public internet.",
            "Attackers have direct access to all your business data — direct internet access is never acceptable.",
            "You can fix this by blocking the database port immediately in your firewall. Block port 5432 so only connections from localhost or a specific management IP are allowed.",
        ),
    },
    "Redis Exposed": {
        "nl": (
            "Redis, een systeem om tijdelijke data snel op te slaan, is bereikbaar via het openbare internet.",
            "Redis heeft standaard geen wachtwoord — aanvallers kunnen data lezen, verwijderen of uw server volledig overnemen.",
            "Dit kunt u oplossen door Redis af te sluiten van het internet. Blokkeer poort 6379 in uw firewall en stel verplichte authenticatie in via de Redis-configuratie.",
        ),
        "en": (
            "Redis, a fast data storage system, is reachable via the public internet.",
            "Redis has no password by default — attackers can read or delete data or take full control of your server.",
            "You can fix this by isolating Redis from the internet. Block port 6379 in your firewall and enable mandatory authentication in the Redis configuration.",
        ),
    },
    "MongoDB Exposed": {
        "nl": (
            "Uw MongoDB-database is bereikbaar via het openbare internet.",
            "Onbeveiligde MongoDB-databases zijn regelmatig doelwit van automatische aanvallen waarbij alle data wordt gestolen of gewist.",
            "Dit kunt u oplossen door de database te isoleren van het internet. Blokkeer poort 27017 in uw firewall en schakel authenticatie in voor MongoDB.",
        ),
        "en": (
            "Your MongoDB database is reachable via the public internet.",
            "Unsecured MongoDB databases are frequently targeted by automated attacks that steal or wipe all data.",
            "You can fix this by isolating the database from the internet. Block port 27017 in your firewall and enable authentication for MongoDB.",
        ),
    },
    "Elasticsearch Open": {
        "nl": (
            "Uw Elasticsearch-zoekserver is publiek bereikbaar via het internet.",
            "Elasticsearch bevat vaak grote hoeveelheden klant- of bedrijfsgegevens en heeft standaard geen toegangscontrole.",
            "Dit kunt u oplossen door Elasticsearch te isoleren van het internet. Blokkeer poort 9200 in uw firewall en schakel authenticatie en TLS in voor Elasticsearch.",
        ),
        "en": (
            "Your Elasticsearch search server is publicly reachable via the internet.",
            "Elasticsearch often contains large amounts of customer or business data and has no access control by default.",
            "You can fix this by isolating Elasticsearch from the internet. Block port 9200 in your firewall and enable authentication and TLS for Elasticsearch.",
        ),
    },
    "CouchDB Open": {
        "nl": (
            "Uw CouchDB-database is bereikbaar via het internet.",
            "CouchDB heeft een webinterface die zonder beveiliging volledige toegang geeft tot alle opgeslagen data.",
            "Dit kunt u oplossen door CouchDB te isoleren van het internet. Blokkeer poort 5984 in uw firewall en stel een sterk beheerderswachtwoord in.",
        ),
        "en": (
            "Your CouchDB database is reachable via the internet.",
            "CouchDB has a web interface that grants full access to all stored data without security.",
            "You can fix this by isolating CouchDB from the internet. Block port 5984 in your firewall and set a strong administrator password.",
        ),
    },
    "Jupyter Notebook": {
        "nl": (
            "Er draait een Jupyter Notebook-omgeving die bereikbaar is via het internet.",
            "Jupyter kan willekeurige opdrachten uitvoeren op uw server — zonder beveiliging geeft dit aanvallers volledige servercontrole.",
            "Dit kunt u oplossen door Jupyter te beveiligen of uit te schakelen. Blokkeer poort 8888 in uw firewall en beveilig Jupyter met een sterk wachtwoord, of schakel hem uit als hij niet in gebruik is.",
        ),
        "en": (
            "A Jupyter Notebook environment is running and reachable via the internet.",
            "Jupyter can execute arbitrary commands on your server — without security this gives attackers full server control.",
            "You can fix this by securing or disabling Jupyter. Block port 8888 in your firewall and secure Jupyter with a strong password, or disable it when not in use.",
        ),
    },
    "GlassFish Admin": {
        "nl": (
            "Het beheerpaneel van GlassFish is bereikbaar via het internet.",
            "Via dit paneel kan een aanvaller de volledige serveromgeving beheren en kwaadaardige software installeren.",
            "Dit kunt u oplossen door het beheerpaneel te isoleren van het internet. Beperk toegang tot de GlassFish admin console (poort 4848) tot localhost of een beveiligd beheernetwerk.",
        ),
        "en": (
            "The GlassFish administration panel is reachable via the internet.",
            "Through this panel, an attacker can manage the complete server environment and install malicious software.",
            "You can fix this by isolating the admin panel from the internet. Restrict access to the GlassFish admin console (port 4848) to localhost or a secured management network.",
        ),
    },
    "Alt HTTP Port": {
        "nl": (
            "Poort 8080 op uw server staat open en is bereikbaar via het internet.",
            "Op deze poort draait mogelijk een beheertool of onbeveiligde dienst die niet bedoeld is voor publiek gebruik.",
            "Dit kunt u oplossen door te controleren wat op poort 8080 draait en dit indien niet nodig te blokkeren. Sluit poort 8080 in uw firewall als de dienst niet publiek beschikbaar hoeft te zijn.",
        ),
        "en": (
            "Port 8080 on your server is open and reachable via the internet.",
            "This port may host a management tool or unsecured service not intended for public use.",
            "You can fix this by checking what is running on port 8080 and blocking it if not needed. Close port 8080 in your firewall if the service does not need to be publicly accessible.",
        ),
    },
    "Alt HTTPS Port": {
        "nl": (
            "Poort 8443 op uw server staat open en is bereikbaar via het internet.",
            "Op deze poort draait mogelijk een tweede webdienst of beheerpaneel met een lagere beveiligingsstandaard dan uw hoofdwebsite.",
            "Dit kunt u oplossen door te controleren wat op poort 8443 draait en dit indien niet nodig te blokkeren. Sluit poort 8443 in uw firewall als de dienst niet publiek beschikbaar hoeft te zijn.",
        ),
        "en": (
            "Port 8443 on your server is open and reachable via the internet.",
            "This port may host a secondary web service or admin panel with lower security standards than your main website.",
            "You can fix this by checking what is running on port 8443 and blocking it if not needed. Close port 8443 in your firewall if the service does not need to be publicly accessible.",
        ),
    },
    "Gevoelig subdomein": {
        "nl": (
            "Een intern of beperkt bedoeld subdomein van uw website is publiek zichtbaar en bereikbaar.",
            "Test-, beheer- of ontwikkelomgevingen zijn minder goed beveiligd en bieden aanvallers een makkelijker ingang tot uw systemen.",
            "Dit kunt u oplossen door het subdomein te beveiligen of te verbergen voor het publiek. Stel een IP-whitelist of verplichte login in voor dit subdomein, of verwijder het als het niet meer in gebruik is.",
        ),
        "en": (
            "An internal or restricted subdomain of your website is publicly visible and accessible.",
            "Test, management, or development environments are less well secured and offer attackers an easier entry point.",
            "You can fix this by securing or hiding the subdomain from the public. Set up an IP whitelist or mandatory login for this subdomain, or remove it if no longer in use.",
        ),
    },
    "Clickjacking": {
        "nl": (
            "Uw website heeft geen bescherming tegen clickjacking.",
            "Aanvallers kunnen uw website onzichtbaar over een fraudepagina leggen zodat bezoekers onbedoeld knoppen van uw site aanklikken.",
            "Dit kunt u oplossen door de volgende instelling toe te voegen aan uw webserver: X-Frame-Options: SAMEORIGIN",
        ),
        "en": (
            "Your website has no protection against clickjacking.",
            "Attackers can overlay your website invisibly on a fraudulent page, causing visitors to unknowingly click buttons on your site.",
            "You can fix this by adding the following to your web server: X-Frame-Options: SAMEORIGIN",
        ),
    },
    "Open Redirect": {
        "nl": (
            "Uw website heeft een functie waarmee aanvallers bezoekers automatisch kunnen doorsturen naar een andere website.",
            "Criminelen misbruiken dit voor phishing: een bezoeker klikt op een betrouwbare link van uw domein maar belandt op een fraudesite.",
            "Dit kunt u oplossen door alle doorstuurlinks te valideren. Accepteer in de omleidingsfunctie alleen URLs die in een vaste whitelist staan en weiger alle externe doorstuurlinks.",
        ),
        "en": (
            "Your website has a feature that allows attackers to automatically redirect visitors to another website.",
            "Criminals use this for phishing: a visitor clicks a trusted link on your domain but ends up on a fraud site.",
            "You can fix this by validating all redirect links. Accept only URLs from a fixed whitelist in the redirect function and reject all external redirect links.",
        ),
    },
    "SQL Injection": {
        "nl": (
            "Uw website is kwetsbaar voor SQL-injectie, waarbij aanvallers via een invoerveld opdrachten naar uw database sturen.",
            "Een aanvaller kan alle klantgegevens, wachtwoorden en bestellingen stelen, aanpassen of permanent verwijderen.",
            "Dit kunt u oplossen door alle databasevragen te herschrijven met parameterized queries. Gebruik prepared statements voor elke databasequery en combineer nooit gebruikersinput direct met SQL-code.",
        ),
        "en": (
            "Your website is vulnerable to SQL injection, where attackers send commands to your database via an input field.",
            "An attacker can steal, modify, or permanently delete all customer data, passwords, and orders.",
            "You can fix this by rewriting all database queries using parameterized queries. Use prepared statements for every database query and never combine user input directly with SQL code.",
        ),
    },
    "SSTI": {
        "nl": (
            "Uw website heeft een kritieke kwetsbaarheid waarbij aanvallers via een invoerveld programmacode op uw server kunnen uitvoeren.",
            "Dit geeft een aanvaller in het ergste geval volledige controle over uw server inclusief alle bestanden en gegevens.",
            "Dit kunt u oplossen door gebruikersinput nooit direct als template te verwerken. Gebruik sandbox-modus of strikte escaping in uw template-engine en valideer alle invoer voor verwerking.",
        ),
        "en": (
            "Your website has a critical vulnerability where attackers can execute program code on your server via an input field.",
            "In the worst case, this gives an attacker complete control over your server including all files and data.",
            "You can fix this by never processing user input directly as a template. Use sandbox mode or strict escaping in your template engine and validate all input before processing.",
        ),
    },
    "Host Header": {
        "nl": (
            "Uw webserver herhaalt de hostnaam uit inkomende verzoeken ongecontroleerd in zijn reacties.",
            "Aanvallers kunnen dit misbruiken voor cache-vergiftiging of het manipuleren van wachtwoord-reset-e-mails, waardoor slachtoffers op fraudelinks klikken.",
            "Dit kunt u oplossen door de hostnaam server-side te valideren. Stel een expliciete server_name (nginx) of ServerName (Apache) in en wijs verzoeken met onbekende hostnamen af.",
        ),
        "en": (
            "Your web server repeats the hostname from incoming requests unvalidated in its responses.",
            "Attackers can exploit this for cache poisoning or manipulating password reset emails, causing victims to click fraudulent links.",
            "You can fix this by validating the hostname server-side. Set an explicit server_name (nginx) or ServerName (Apache) and reject requests with unknown hostnames.",
        ),
    },
    "LFI": {
        "nl": (
            "Uw website heeft een kwetsbaarheid waarbij een aanvaller via een URL-parameter bestanden op uw server kan openen.",
            "Gevoelige bestanden zoals configuratiebestanden met wachtwoorden of systeembestanden kunnen zo worden uitgelezen.",
            "Dit kunt u oplossen door bestandspad-invoer strikt te valideren. Sta alleen bekende bestandsnamen toe via een whitelist en controleer via realpath() dat het pad binnen de toegestane map blijft.",
        ),
        "en": (
            "Your website has a vulnerability where an attacker can open files on your server via a URL parameter.",
            "Sensitive files such as configuration files containing passwords or system files may be read this way.",
            "You can fix this by strictly validating file path input. Allow only known file names via a whitelist and verify using realpath() that the path stays within the permitted directory.",
        ),
    },
    "Outdated PHP": {
        "nl": (
            "Uw website draait op een verouderde PHP-versie die geen beveiligingsupdates meer ontvangt.",
            "Bekende kwetsbaarheden in verouderde PHP-versies worden actief misbruikt bij geautomatiseerde aanvallen.",
            "Dit kunt u oplossen door PHP bij te werken naar een actuele versie. Vraag uw hoster om uw website te upgraden naar PHP 8.2 of hoger en test de website na de upgrade op compatibiliteit.",
        ),
        "en": (
            "Your website runs on an outdated PHP version that no longer receives security updates.",
            "Known vulnerabilities in outdated PHP versions are actively exploited in automated attacks.",
            "You can fix this by updating PHP to a current version. Ask your hosting provider to upgrade your website to PHP 8.2 or higher and test the website for compatibility after the upgrade.",
        ),
    },
    "WordPress": {
        "nl": (
            "Uw website gebruikt WordPress met mogelijk verouderde onderdelen.",
            "Verouderde WordPress-installaties en plugins zijn een veelvoorkomend doelwit voor geautomatiseerde aanvallen die uw website kunnen overnemen.",
            "Dit kunt u oplossen door WordPress, alle plugins en thema's bij te werken naar de nieuwste versie. Schakel automatische updates in via het WordPress-dashboard zodat updates voortaan automatisch worden geinstalleerd.",
        ),
        "en": (
            "Your website uses WordPress with potentially outdated components.",
            "Outdated WordPress installations and plugins are a frequent target for automated attacks that can take over your website.",
            "You can fix this by updating WordPress, all plugins, and themes to the latest version. Enable automatic updates via the WordPress dashboard so updates are installed automatically in future.",
        ),
    },
    "CVE-": {
        "nl": (
            "Op uw server is een bekende beveiligingskwetsbaarheid gevonden die staat geregistreerd in een publieke database voor aanvallers.",
            "Aanvallers raadplegen deze database actief om kwetsbare servers te vinden en voeren geautomatiseerde aanvallen uit.",
            "Dit kunt u oplossen door de betrokken software onmiddellijk bij te werken. Installeer de beveiligingsupdate voor de vermelde kwetsbaarheid via uw hoster of systeembeheerder.",
        ),
        "en": (
            "A known security vulnerability has been found on your server, registered in a public database used by attackers.",
            "Attackers actively consult this database to find vulnerable servers and run automated attacks.",
            "You can fix this by immediately updating the affected software. Install the security patch for the listed vulnerability via your hosting provider or system administrator.",
        ),
    },
    "malicious": {
        "nl": (
            "Uw domein is aangemerkt als kwaadaardig door een externe beveiligingsdienst.",
            "Uw website staat op zwarte lijsten, klanten zien beveiligingswaarschuwingen en zoekmachines kunnen uw site blokkeren.",
            "Dit kunt u oplossen door uw website te laten controleren op malware en de melding aan te vechten. Laat uw hoster een volledige malware-scan uitvoeren op de server en dien daarna een verzoek in bij urlscan.io om de markering te verwijderen.",
        ),
        "en": (
            "Your domain has been flagged as malicious by an external security service.",
            "Your website is on blacklists, customers see security warnings, and search engines may block your site.",
            "You can fix this by having your website scanned for malware and disputing the flagging. Have your hosting provider run a full malware scan on the server and then submit a removal request to urlscan.io.",
        ),
    },
    "suspicious": {
        "nl": (
            "Uw domein heeft een lage vertrouwensscore bij een externe beveiligingsdienst.",
            "Klanten kunnen beveiligingswaarschuwingen zien of uw site kan worden geblokkeerd door beveiligingssoftware.",
            "Dit kunt u oplossen door de reputatie van uw domein te laten onderzoeken. Controleer de domeinstatus via urlscan.io en Google Safe Browsing en los eventuele meldingen op.",
        ),
        "en": (
            "Your domain has a low trust score with an external security service.",
            "Customers may see security warnings or your site may be blocked by security software.",
            "You can fix this by having your domain reputation investigated. Check the domain status via urlscan.io and Google Safe Browsing and resolve any flagged issues.",
        ),
    },
    "Content Security Policy (CSP) Header Not Set": {
        "nl": (
            "Uw website heeft geen Content Security Policy, een beveiligingslaag die bepaalt welke scripts mogen worden uitgevoerd.",
            "Kwaadaardige scripts van externe websites kunnen ongehinderd laden op uw site en gegevens van bezoekers stelen.",
            "Dit kunt u oplossen door een Content Security Policy in te stellen op uw webserver. Voeg de volgende instelling toe aan uw serverconfiguratie: Content-Security-Policy: default-src 'self'",
        ),
        "en": (
            "Your website has no Content Security Policy, a security layer that controls which scripts may run.",
            "Malicious scripts from external websites can silently load on your site and steal visitor data.",
            "You can fix this by setting a Content Security Policy on your web server. Add the following to your server configuration: Content-Security-Policy: default-src 'self'",
        ),
    },
    "Missing Anti-clickjacking Header": {
        "nl": (
            "Uw website mist een beveiligingsinstructie die voorkomt dat uw site door anderen wordt ingesloten.",
            "Aanvallers kunnen uw website onzichtbaar over een fraudepagina leggen zodat bezoekers onbedoeld knoppen van uw site aanklikken.",
            "Dit kunt u oplossen door de volgende instelling toe te voegen aan uw serverconfiguratie: X-Frame-Options: SAMEORIGIN",
        ),
        "en": (
            "Your website lacks a security instruction that prevents your site from being embedded by others.",
            "Attackers can overlay your website invisibly on a fraudulent page, causing visitors to unknowingly click buttons on your site.",
            "You can fix this by adding the following to your server configuration: X-Frame-Options: SAMEORIGIN",
        ),
    },
    "Sub Resource Integrity": {
        "nl": (
            "Uw website laadt externe bestanden zonder te controleren of ze zijn gewijzigd.",
            "Als een externe server wordt gehackt, kunnen er ongemerkt kwaadaardige scripts via uw website worden verspreid.",
            "Dit kunt u oplossen door integriteitscontroles toe te voegen aan externe bestanden. Voeg integrity= en crossorigin=\"anonymous\" attributen toe aan alle externe <script> en <link> tags.",
        ),
        "en": (
            "Your website loads external files without verifying they have not been modified.",
            "If an external server is hacked, malicious scripts may silently be distributed through your website.",
            "You can fix this by adding integrity checks to external files. Add integrity= and crossorigin=\"anonymous\" attributes to all external <script> and <link> tags.",
        ),
    },
    "Cross-Domain JavaScript": {
        "nl": (
            "Uw website laadt JavaScript-bestanden van externe domeinen.",
            "Als een van die externe domeinen wordt gehackt, kan er kwaadaardige code op uw website worden geplaatst die gegevens van bezoekers steelt.",
            "Dit kunt u oplossen door externe scripts te vervangen door lokale kopieeen of integriteitscontroles in te stellen. Host kritieke scripts lokaal of voeg integrity=-attributen toe aan alle externe script-tags.",
        ),
        "en": (
            "Your website loads JavaScript files from external domains.",
            "If one of those external domains is hacked, malicious code may be placed on your website that steals visitor data.",
            "You can fix this by replacing external scripts with local copies or adding integrity checks. Host critical scripts locally or add integrity= attributes to all external script tags.",
        ),
    },
    "Cookie Without Secure Flag": {
        "nl": (
            "Inlogcookies op uw website worden ook via onbeveiligde verbindingen verstuurd.",
            "Op openbare wifi kan een aanvaller de inlogsessie van een bezoeker stelen en zich voordoen als die persoon.",
            "Dit kunt u oplossen door de cookie-beveiliging aan te scherpen. Voeg Secure; HttpOnly; SameSite=Strict toe aan alle cookie-definities in uw webapplicatie.",
        ),
        "en": (
            "Login cookies on your website are also sent over unsecured connections.",
            "On public Wi-Fi, an attacker can steal a visitor's login session and impersonate that person.",
            "You can fix this by tightening cookie security. Add Secure; HttpOnly; SameSite=Strict to all cookie definitions in your web application.",
        ),
    },
    "Cookie No HttpOnly": {
        "nl": (
            "Inlogcookies zijn toegankelijk voor scripts die op uw website draaien.",
            "Als er een scriptinjectie-aanval plaatsvindt, kunnen aanvallers direct de inlogsessies van uw bezoekers stelen.",
            "Dit kunt u oplossen door het HttpOnly-attribuut toe te voegen aan alle cookies in uw webapplicatie.",
        ),
        "en": (
            "Login cookies are accessible to scripts running on your website.",
            "If a script injection attack occurs, attackers can directly steal your visitors' login sessions.",
            "You can fix this by adding the HttpOnly attribute to all cookies in your web application.",
        ),
    },
    "Application Error Disclosure": {
        "nl": (
            "Uw website toont gedetailleerde technische foutmeldingen aan bezoekers.",
            "Foutmeldingen bevatten soms bestandspaden, softwareversies of databasestructuur die aanvallers gebruiken voor gerichte aanvallen.",
            "Dit kunt u oplossen door gedetailleerde foutmeldingen uit te schakelen in uw productieomgeving. Stel uw applicatie in om generieke foutpagina's te tonen aan gebruikers en technische details alleen op de server te loggen.",
        ),
        "en": (
            "Your website displays detailed technical error messages to visitors.",
            "Error messages sometimes contain file paths, software versions, or database structure that attackers use for targeted attacks.",
            "You can fix this by disabling detailed error messages in your production environment. Configure your application to show generic error pages to users and only log technical details on the server.",
        ),
    },
    "Suspicious Comments": {
        "nl": (
            "In de broncode van uw website zijn interne opmerkingen gevonden die informatie over de werking bevatten.",
            "Aanvallers lezen broncode en gebruiken interne opmerkingen om kwetsbaarheden sneller te vinden.",
            "Dit kunt u oplossen door alle interne opmerkingen te verwijderen uit de live website. Verwijder alle TODO, FIXME en debug-commentaar uit HTML en JavaScript voor deployment naar productie.",
        ),
        "en": (
            "Internal comments have been found in your website's source code that contain information about how it works.",
            "Attackers read source code and use internal comments to find vulnerabilities more quickly.",
            "You can fix this by removing all internal comments from the live website. Remove all TODO, FIXME, and debug comments from HTML and JavaScript before deploying to production.",
        ),
    },
    "Timestamp Disclosure": {
        "nl": (
            "Uw webserver stuurt datum- en tijdstempels mee die informatie geven over uw software.",
            "Aanvallers kunnen dit gebruiken om uw softwareversie te achterhalen en te zoeken naar bekende kwetsbaarheden.",
            "Dit kunt u oplossen door tijdstempels te verbergen in uw serverconfiguratie. Verwijder de Last-Modified en X-Powered-By headers uit uw serverconfiguratie.",
        ),
        "en": (
            "Your web server sends timestamps that reveal information about your software.",
            "Attackers can use this to determine your software version and search for known vulnerabilities.",
            "You can fix this by hiding timestamps in your server configuration. Remove the Last-Modified and X-Powered-By headers from your server configuration.",
        ),
    },
    "Server Leaks Version Information": {
        "nl": (
            "Uw webserver vertelt bezoekers welk softwarepakket en versie hij gebruikt.",
            "Aanvallers zoeken gericht naar bekende kwetsbaarheden in die specifieke versie en kunnen zo gerichte aanvallen voorbereiden.",
            "Dit kunt u oplossen door versie-informatie te verbergen. Stel in ServerTokens Prod (Apache) of server_tokens off (nginx) in uw serverconfiguratie.",
        ),
        "en": (
            "Your web server tells visitors which software package and version it uses.",
            "Attackers look up known vulnerabilities for that specific version and can prepare targeted attacks.",
            "You can fix this by hiding version information. Set ServerTokens Prod (Apache) or server_tokens off (nginx) in your server configuration.",
        ),
    },
    "Loosely Scoped Cookie": {
        "nl": (
            "Cookies op uw website zijn ingesteld voor een te breed domein.",
            "Subdomeinen van uw organisatie die minder goed beveiligd zijn, kunnen dezelfde cookies uitlezen.",
            "Dit kunt u oplossen door de cookie-scope te beperken tot het exacte hostname. Stel het Domain-attribuut in cookies in op het exacte hostname in plaats van het bovenliggende domein.",
        ),
        "en": (
            "Cookies on your website are set for too broad a domain.",
            "Subdomains of your organization that are less well secured can read the same cookies.",
            "You can fix this by restricting cookie scope to the exact hostname. Set the Domain attribute in cookies to the exact hostname rather than the parent domain.",
        ),
    },
    "Cross-Domain Misconfiguration": {
        "nl": (
            "Uw website staat toe dat willekeurige andere websites uw inhoud mogen opvragen.",
            "Kwaadaardige websites kunnen uw data opvragen en gevoelige informatie van ingelogde gebruikers onderscheppen.",
            "Dit kunt u oplossen door CORS te beperken tot vertrouwde websites. Vervang Access-Control-Allow-Origin: * door een whitelist van specifiek vertrouwde domeinen in uw serverconfiguratie.",
        ),
        "en": (
            "Your website allows arbitrary other websites to request your content.",
            "Malicious websites can request your data and intercept sensitive information from logged-in users.",
            "You can fix this by restricting CORS to trusted websites. Replace Access-Control-Allow-Origin: * with a whitelist of specifically trusted domains in your server configuration.",
        ),
    },
    "Vulnerable JS Library": {
        "nl": (
            "Uw website gebruikt een JavaScript-bibliotheek met een bekende beveiligingskwetsbaarheid.",
            "Aanvallers kunnen deze kwetsbaarheid actief misbruiken om aanvallen uit te voeren op uw bezoekers.",
            "Dit kunt u oplossen door de bibliotheek bij te werken naar de nieuwste versie. Vervang de verouderde JavaScript-bibliotheek door de nieuwste stabiele versie en controleer bekende kwetsbaarheden via snyk.io.",
        ),
        "en": (
            "Your website uses a JavaScript library with a known security vulnerability.",
            "Attackers can actively exploit this vulnerability to carry out attacks on your visitors.",
            "You can fix this by updating the library to the latest version. Replace the outdated JavaScript library with the latest stable version and check for known vulnerabilities via snyk.io.",
        ),
    },
    "Permissions-Policy Header Not Set": {
        "nl": (
            "Uw website heeft geen beleid voor het gebruik van gevoelige browserfuncties.",
            "Externe scripts die via uw site laden, kunnen ongewenst toegang vragen tot camera, microfoon of locatie van uw bezoekers.",
            "Dit kunt u oplossen door de volgende instelling toe te voegen aan uw serverconfiguratie: Permissions-Policy: camera=(), microphone=(), geolocation=()",
        ),
        "en": (
            "Your website has no policy for the use of sensitive browser features.",
            "External scripts loading through your site may request unauthorized access to visitors' camera, microphone, or location.",
            "You can fix this by adding the following to your server configuration: Permissions-Policy: camera=(), microphone=(), geolocation=()",
        ),
    },
    "Referrer-Policy": {
        "nl": (
            "Uw website geeft te veel informatie door over hoe bezoekers op uw site zijn terechtgekomen.",
            "Gevoelige URL's kunnen uitlekken naar derde partijen wanneer bezoekers op externe links klikken.",
            "Dit kunt u oplossen door de volgende instelling toe te voegen aan uw serverconfiguratie: Referrer-Policy: strict-origin-when-cross-origin",
        ),
        "en": (
            "Your website shares too much information about how visitors arrived at your site.",
            "Sensitive URLs may leak to third parties when visitors click external links.",
            "You can fix this by adding the following to your server configuration: Referrer-Policy: strict-origin-when-cross-origin",
        ),
    },
}

for _f in data["findings"]:
    _f["risk"] = ""
    for _frag, _langs in _FINDING_COPY.items():
        if _frag.lower() in _f["title"].lower():
            _lc = _langs.get(language, _langs.get("nl"))
            _f["description"]    = _lc[0]
            _f["risk"]           = _lc[1]
            _f["recommendation"] = _lc[2]
            break

'''

# ── 2. Find the block to replace: from _ZAP_RECS through the old application loop ──
# Anchor: starts at "_ZAP_RECS = {" and ends just before "# ── Port scan table"
start_marker = '\n# ── Override generic ZAP recommendations with concrete fix instructions ────────────────\n_ZAP_RECS = {'
end_marker   = '\n# ── Port scan table'

start_idx = src.find(start_marker)
end_idx   = src.find(end_marker)
print(f'[2] block start at char {start_idx}, end at char {end_idx}')
assert start_idx != -1, 'start_marker not found'
assert end_idx   != -1, 'end_marker not found'

src = src[:start_idx] + NEW_BLOCK + src[end_idx:]
print('[2] block replaced: ok')
print('[2] _FINDING_COPY in src:', '_FINDING_COPY' in src)
print('[2] _ZAP_RECS NOT in src:', '_ZAP_RECS' not in src)

with open('/root/zenkai/render.py', 'w') as f:
    f.write(src)
print('render.py saved.')

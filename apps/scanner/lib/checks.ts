import * as tls from "node:tls";

export type CheckStatus = "pass" | "warn" | "fail" | "error";

export interface CheckResult {
  status: CheckStatus;
  score: number;
  summary: string;
  details: string[];
  meta?: Record<string, unknown>;
}

function grade(score: number): CheckStatus {
  if (score >= 80) return "pass";
  if (score >= 50) return "warn";
  return "fail";
}

// ── Security headers ─────────────────────────────────────────────────────────

export async function checkHeaders(domain: string): Promise<CheckResult> {
  try {
    const res = await fetch(`https://${domain}`, {
      method: "HEAD",
      headers: { "User-Agent": "ZenkaiScanner/1.0" },
      signal: AbortSignal.timeout(10_000),
      redirect: "follow",
    });

    const h = Object.fromEntries([...res.headers.entries()]);
    const CHECKS = [
      { name: "Strict-Transport-Security", key: "strict-transport-security", w: 20 },
      { name: "Content-Security-Policy",   key: "content-security-policy",   w: 25 },
      { name: "X-Frame-Options",           key: "x-frame-options",           w: 15 },
      { name: "X-Content-Type-Options",    key: "x-content-type-options",    w: 15 },
      { name: "Referrer-Policy",           key: "referrer-policy",           w: 10 },
      { name: "Permissions-Policy",        key: "permissions-policy",        w: 15 },
    ];

    let score = 100;
    const details: string[] = [];
    const missing: string[] = [];

    for (const c of CHECKS) {
      if (h[c.key]) {
        details.push(`✓ ${c.name}`);
      } else {
        score -= c.w;
        missing.push(c.name);
        details.push(`✗ ${c.name}`);
      }
    }

    score = Math.max(0, score);
    return {
      status: grade(score), score,
      summary: missing.length === 0 ? "Alle headers aanwezig" : `${missing.length}/6 ontbreken`,
      details,
    };
  } catch (e) {
    return { status: "error", score: 0, summary: "Niet bereikbaar", details: [(e as Error).message] };
  }
}

// ── SSL / TLS ─────────────────────────────────────────────────────────────────

export async function checkSSL(domain: string): Promise<CheckResult> {
  return new Promise((resolve) => {
    const timer = setTimeout(
      () => resolve({ status: "error", score: 0, summary: "Timeout", details: [] }),
      10_000,
    );

    const socket = tls.connect(
      { host: domain, port: 443, servername: domain, rejectUnauthorized: false },
      () => {
        clearTimeout(timer);
        const cert = socket.getPeerCertificate();
        const proto = socket.getProtocol() ?? "unknown";
        socket.destroy();

        if (!cert?.valid_to) {
          return resolve({ status: "fail", score: 0, summary: "Geen certificaat", details: [] });
        }

        const expiry = new Date(cert.valid_to);
        const daysLeft = Math.floor((expiry.getTime() - Date.now()) / 86_400_000);
        const details: string[] = [];
        let score = 100;

        if (daysLeft < 0) {
          score = 0;
          details.push(`✗ Verlopen op ${expiry.toLocaleDateString("nl")}`);
        } else if (daysLeft < 14) {
          score = 30;
          details.push(`⚠ Verloopt over ${daysLeft} dagen — direct vernieuwen`);
        } else if (daysLeft < 30) {
          score = 65;
          details.push(`~ Verloopt over ${daysLeft} dagen`);
        } else {
          details.push(`✓ Geldig t/m ${expiry.toLocaleDateString("nl")} (${daysLeft} dagen)`);
        }

        details.push(`TLS: ${proto}`);
        details.push(`Uitgever: ${cert.issuer?.O ?? "onbekend"}`);

        if (proto === "TLSv1" || proto === "TLSv1.1") {
          score = Math.min(score, 40);
          details.push("✗ Verouderde TLS versie — upgrade naar TLS 1.2+");
        }

        resolve({
          status: grade(score), score,
          summary: daysLeft < 0 ? "Certificaat verlopen" : `Geldig, ${daysLeft} dagen resterend`,
          details,
        });
      },
    );

    socket.on("error", (e) => {
      clearTimeout(timer);
      resolve({ status: "fail", score: 0, summary: "SSL verbinding mislukt", details: [e.message] });
    });
  });
}

// ── SPF / DMARC ───────────────────────────────────────────────────────────────

export async function checkDNS(domain: string): Promise<CheckResult> {
  const details: string[] = [];
  let score = 100;

  try {
    const [spfRes, dmarcRes] = await Promise.all([
      fetch(`https://dns.google/resolve?name=${domain}&type=TXT`, { signal: AbortSignal.timeout(8_000) }),
      fetch(`https://dns.google/resolve?name=_dmarc.${domain}&type=TXT`, { signal: AbortSignal.timeout(8_000) }),
    ]);

    const spfData = await spfRes.json() as { Answer?: Array<{ data: string }> };
    const dmarcData = await dmarcRes.json() as { Answer?: Array<{ data: string }> };

    const spf = spfData.Answer?.find((r) => r.data.includes("v=spf1"));
    if (spf) {
      details.push(`✓ SPF aanwezig`);
    } else {
      score -= 35;
      details.push("✗ SPF ontbreekt — e-mail spoofing mogelijk");
    }

    const dmarc = dmarcData.Answer?.find((r) => r.data.includes("v=DMARC1"));
    if (dmarc) {
      const policy = dmarc.data.match(/p=(\w+)/)?.[1] ?? "none";
      if (policy === "reject") {
        details.push(`✓ DMARC p=reject`);
      } else if (policy === "quarantine") {
        score -= 10;
        details.push(`~ DMARC p=quarantine`);
      } else {
        score -= 25;
        details.push(`⚠ DMARC p=none — geen bescherming`);
      }
    } else {
      score -= 35;
      details.push("✗ DMARC ontbreekt");
    }

    score = Math.max(0, score);
    return {
      status: grade(score), score,
      summary: `SPF ${spf ? "✓" : "✗"} · DMARC ${dmarc ? "✓" : "✗"}`,
      details,
    };
  } catch (e) {
    return { status: "error", score: 0, summary: "DNS lookup mislukt", details: [(e as Error).message] };
  }
}

// ── OWASP indicators ─────────────────────────────────────────────────────────

export async function checkOWASP(domain: string): Promise<CheckResult> {
  try {
    const res = await fetch(`https://${domain}`, {
      headers: { "User-Agent": "ZenkaiScanner/1.0" },
      signal: AbortSignal.timeout(12_000),
      redirect: "follow",
    });

    const h = Object.fromEntries([...res.headers.entries()]);
    let score = 100;
    const details: string[] = [];

    if (!res.url.startsWith("https://")) {
      score -= 25;
      details.push("✗ Geen HTTPS redirect");
    }

    // Server version disclosure
    if (h["server"] && /[/0-9]/.test(h["server"])) {
      score -= 15;
      details.push(`⚠ Server header lekt versie: ${h["server"]}`);
    }

    if (h["x-powered-by"]) {
      score -= 10;
      details.push(`⚠ X-Powered-By exposed: ${h["x-powered-by"]}`);
    }

    if (h["x-aspnet-version"]) {
      score -= 10;
      details.push(`⚠ ASP.NET versie exposed: ${h["x-aspnet-version"]}`);
    }

    const cookie = h["set-cookie"] ?? "";
    if (cookie) {
      if (!cookie.toLowerCase().includes("secure")) {
        score -= 10;
        details.push("⚠ Cookie mist Secure flag");
      }
      if (!cookie.toLowerCase().includes("httponly")) {
        score -= 10;
        details.push("⚠ Cookie mist HttpOnly flag");
      }
    }

    if (details.length === 0) details.push("✓ Geen indicatoren gevonden");

    score = Math.max(0, score);
    const findings = details.filter((d) => !d.startsWith("✓")).length;
    return {
      status: grade(score), score,
      summary: findings === 0 ? "Geen indicatoren" : `${findings} indicator${findings === 1 ? "" : "en"}`,
      details,
    };
  } catch (e) {
    return { status: "error", score: 0, summary: "Niet bereikbaar", details: [(e as Error).message] };
  }
}

// ── Shodan ───────────────────────────────────────────────────────────────────

const HIGH_RISK_PORTS = [21, 23, 25, 1433, 3306, 3389, 4444, 5432, 6379, 8080, 27017, 11211];

export async function checkShodan(domain: string): Promise<CheckResult> {
  const key = process.env.SHODAN_API_KEY;
  if (!key) return { status: "error", score: 0, summary: "API key ontbreekt", details: [] };

  try {
    const dnsData = await fetch(`https://dns.google/resolve?name=${domain}&type=A`, {
      signal: AbortSignal.timeout(8_000),
    }).then((r) => r.json()) as { Answer?: Array<{ data: string }> };

    const ip = dnsData.Answer?.[0]?.data;
    if (!ip) return { status: "error", score: 0, summary: "IP niet opgelost", details: [] };

    const shodanRes = await fetch(`https://api.shodan.io/shodan/host/${ip}?key=${key}`, {
      signal: AbortSignal.timeout(10_000),
    });

    if (shodanRes.status === 404) {
      return {
        status: "pass", score: 100,
        summary: "Niet in Shodan index",
        details: [`IP: ${ip}`, "Geen publiek bekende services"],
      };
    }

    if (!shodanRes.ok) {
      return { status: "error", score: 0, summary: `Shodan API fout (${shodanRes.status})`, details: [] };
    }

    const data = await shodanRes.json() as { ports?: number[]; vulns?: Record<string, unknown> };
    const ports = data.ports ?? [];
    const vulns = data.vulns ? Object.keys(data.vulns) : [];
    const risky = ports.filter((p) => HIGH_RISK_PORTS.includes(p));

    let score = 100;
    const details = [`IP: ${ip}`, `Poorten: ${ports.length > 0 ? ports.join(", ") : "geen"}`];

    if (vulns.length > 0) {
      score -= Math.min(60, vulns.length * 20);
      details.push(`⚠ CVE's gevonden: ${vulns.slice(0, 3).join(", ")}`);
    }
    for (const p of risky) {
      score -= 10;
      details.push(`⚠ Risico poort open: ${p}`);
    }

    score = Math.max(0, score);
    return {
      status: grade(score), score,
      summary: `${ports.length} poorten · ${vulns.length} CVE's`,
      details,
    };
  } catch (e) {
    return { status: "error", score: 0, summary: "Shodan fout", details: [(e as Error).message] };
  }
}

// ── urlscan.io ───────────────────────────────────────────────────────────────

export async function checkUrlscan(domain: string): Promise<CheckResult> {
  const key = process.env.URLSCAN_API_KEY;
  if (!key) return { status: "error", score: 0, summary: "API key ontbreekt", details: [] };

  try {
    const submit = await fetch("https://urlscan.io/api/v1/scan/", {
      method: "POST",
      headers: { "API-Key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ url: `https://${domain}`, visibility: "public" }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!submit.ok) {
      const body = await submit.text();
      return { status: "error", score: 0, summary: `urlscan fout (${submit.status})`, details: [body.slice(0, 120)] };
    }

    const { uuid } = await submit.json() as { uuid: string };

    // Poll for results up to 30s (6 × 5s)
    for (let i = 0; i < 6; i++) {
      await new Promise((r) => setTimeout(r, 5_000));
      try {
        const res = await fetch(`https://urlscan.io/api/v1/result/${uuid}/`, {
          signal: AbortSignal.timeout(8_000),
        });
        if (!res.ok) continue;
        const result = await res.json() as { verdicts?: { overall?: { malicious?: boolean; categories?: string[] } } };
        const malicious = result.verdicts?.overall?.malicious ?? false;
        const categories = result.verdicts?.overall?.categories ?? [];
        return {
          status: malicious ? "fail" : "pass",
          score: malicious ? 0 : 100,
          summary: malicious ? "Malware / phishing gedetecteerd" : "Schoon",
          details: [
            malicious ? "✗ Malicious: ja" : "✓ Geen malware of phishing",
            ...(categories.length ? [`Categorieën: ${categories.join(", ")}`] : []),
            `Resultaat: https://urlscan.io/result/${uuid}/`,
          ],
          meta: { screenshotUrl: `https://urlscan.io/screenshots/${uuid}.png` },
        };
      } catch {
        continue;
      }
    }

    return {
      status: "pass", score: 80,
      summary: "Scan ingediend (resultaten volgen)",
      details: [`https://urlscan.io/result/${uuid}/`],
    };
  } catch (e) {
    return { status: "error", score: 0, summary: "urlscan fout", details: [(e as Error).message] };
  }
}

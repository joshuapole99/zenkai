import { NextRequest } from "next/server";
import {
  checkHeaders,
  checkSSL,
  checkDNS,
  checkOWASP,
  checkShodan,
  checkUrlscan,
  type CheckResult,
} from "@/lib/checks";

export const maxDuration = 60;

function cleanDomain(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .toLowerCase();
}

function calcScore(checks: Record<string, CheckResult>): number {
  const weights: Record<string, number> = {
    headers: 20, ssl: 25, dns: 15, owasp: 15, shodan: 15, urlscan: 10,
  };
  let total = 0, totalW = 0;
  for (const [key, w] of Object.entries(weights)) {
    const c = checks[key];
    if (c && c.status !== "error") {
      total += c.score * w;
      totalW += w;
    }
  }
  return totalW ? Math.round(total / totalW) : 0;
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { domain?: string };
  if (!body.domain) {
    return new Response(JSON.stringify({ error: "Domein vereist" }), { status: 400 });
  }

  const domain = cleanDomain(body.domain);
  const collected: Record<string, CheckResult> = {};

  const enc = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (check: string, result: CheckResult) => {
        collected[check] = result;
        controller.enqueue(enc.encode(JSON.stringify({ check, result }) + "\n"));
      };

      await Promise.all([
        checkHeaders(domain).then((r) => emit("headers", r)),
        checkSSL(domain).then((r) => emit("ssl", r)),
        checkDNS(domain).then((r) => emit("dns", r)),
        checkOWASP(domain).then((r) => emit("owasp", r)),
        checkShodan(domain).then((r) => emit("shodan", r)),
        checkUrlscan(domain).then((r) => emit("urlscan", r)),
      ]);

      const score = calcScore(collected);
      const g = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 45 ? "D" : "F";
      controller.enqueue(enc.encode(JSON.stringify({ done: true, score, grade: g }) + "\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}

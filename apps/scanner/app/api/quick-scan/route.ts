import { NextRequest } from "next/server";

export const maxDuration = 120;

const SCANNER_URL = process.env.SCANNER_API_URL ?? "https://vmi3112892.contaboserver.net";
const SCANNER_KEY = process.env.SCANNER_API_KEY ?? "verander-dit";

function cleanDomain(input: string): string {
  return input.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { domain?: string; language?: string };
  if (!body.domain) {
    return new Response(JSON.stringify({ error: "Domein vereist" }), { status: 400 });
  }

  const domain   = cleanDomain(body.domain);
  const language = body.language === "en" ? "en" : "nl";

  let upstream: Response;
  try {
    upstream = await fetch(`${SCANNER_URL}/quick-scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": SCANNER_KEY,
      },
      body: JSON.stringify({ domain, language }),
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: `Scanner backend niet bereikbaar (${SCANNER_URL})` }),
      { status: 503 }
    );
  }

  if (!upstream.ok) {
    const err = await upstream.text();
    return new Response(err, { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}

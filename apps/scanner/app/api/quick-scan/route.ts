import { NextRequest } from "next/server";

export const maxDuration = 120;

const SCANNER_URL = process.env.SCANNER_API_URL ?? "http://192.168.178.36:5000";
const SCANNER_KEY = process.env.SCANNER_API_KEY ?? "verander-dit";

function cleanDomain(input: string): string {
  return input.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { domain?: string };
  if (!body.domain) {
    return new Response(JSON.stringify({ error: "Domein vereist" }), { status: 400 });
  }

  const domain = cleanDomain(body.domain);

  let upstream: Response;
  try {
    upstream = await fetch(`${SCANNER_URL}/quick-scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": SCANNER_KEY,
      },
      body: JSON.stringify({ domain }),
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Scanner backend niet bereikbaar. Start de Flask API op de Kali VM." }),
      { status: 503 }
    );
  }

  if (!upstream.ok) {
    const err = await upstream.text();
    return new Response(err, { status: upstream.status });
  }

  // Proxy the stream directly
  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}

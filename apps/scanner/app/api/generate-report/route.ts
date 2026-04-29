import { NextRequest } from "next/server";

export const maxDuration = 60;

const SCANNER_URL = process.env.SCANNER_API_URL ?? "https://vmi3112892.contaboserver.net";
const SCANNER_KEY = process.env.SCANNER_API_KEY ?? "verander-dit";

export async function POST(req: NextRequest) {
  const body = await req.json() as { domain?: string; language?: string; type?: string; email?: string };
  if (!body.domain || !body.email) {
    return new Response(JSON.stringify({ error: "Domein en email vereist" }), { status: 400 });
  }

  const domain   = body.domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
  const language = body.language === "en" ? "en" : "nl";
  const type     = body.type === "full" ? "full" : "quick";
  const email    = body.email.trim();

  let upstream: Response;
  try {
    upstream = await fetch(`${SCANNER_URL}/generate-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": SCANNER_KEY,
      },
      body: JSON.stringify({ domain, language, type, email }),
    });
  } catch {
    return new Response(JSON.stringify({ error: "Scanner niet bereikbaar" }), { status: 503 });
  }

  if (!upstream.ok) {
    const err = await upstream.text();
    return new Response(err, { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: { "Content-Type": "application/json" },
  });
}

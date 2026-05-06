import { NextRequest } from "next/server";

const SCANNER_URL = process.env.SCANNER_API_URL ?? "https://vmi3112892.contaboserver.net";
const SCANNER_KEY = process.env.SCANNER_API_KEY ?? "verander-dit";

// Calls Flask /quick-scan for example.com and returns the raw first 5 lines
export async function GET(_req: NextRequest) {
  let upstream: Response;
  try {
    upstream = await fetch(`${SCANNER_URL}/quick-scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": SCANNER_KEY },
      body: JSON.stringify({ domain: "example.com", language: "nl" }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (e) {
    return Response.json({ error: "fetch_threw", message: (e as Error).message });
  }

  if (!upstream.ok) {
    const text = await upstream.text();
    return Response.json({ error: "upstream_not_ok", status: upstream.status, body: text.slice(0, 500) });
  }

  const reader = upstream.body!.getReader();
  const dec = new TextDecoder();
  const lines: string[] = [];
  let buf = "";

  while (lines.length < 5) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const parts = buf.split("\n");
    buf = parts.pop() ?? "";
    for (const l of parts) {
      if (l.trim()) lines.push(l.trim());
      if (lines.length >= 5) break;
    }
  }

  reader.cancel();
  return Response.json({ ok: true, lines });
}

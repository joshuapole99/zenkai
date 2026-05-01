import { type NextRequest } from "next/server";
import { getServerClient } from "@/lib/supabase-server";

export const maxDuration = 30;

const SCANNER_URL = process.env.SCANNER_API_URL ?? "https://vmi3112892.contaboserver.net";
const SCANNER_KEY = process.env.SCANNER_API_KEY ?? "verander-dit";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  const sb = await getServerClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { domain } = await params;

  let upstream: Response;
  try {
    upstream = await fetch(`${SCANNER_URL}/report/${domain}`, {
      headers: { "X-API-Key": SCANNER_KEY },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Scanner niet bereikbaar", detail: String(e) }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!upstream.ok) {
    const body = await upstream.text();
    return new Response(
      JSON.stringify({ error: "Rapport niet gevonden", status: upstream.status, detail: body }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  // Use arrayBuffer for reliable serverless PDF delivery
  const buffer = await upstream.arrayBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${domain}-rapport.pdf"`,
      "Content-Length": String(buffer.byteLength),
    },
  });
}

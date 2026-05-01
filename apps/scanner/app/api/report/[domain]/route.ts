import { type NextRequest } from "next/server";
import { getServerClient } from "@/lib/supabase-server";

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
  } catch {
    return new Response("Scanner niet bereikbaar", { status: 503 });
  }

  if (!upstream.ok) return new Response("Rapport niet gevonden", { status: 404 });

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${domain}-rapport.pdf"`,
    },
  });
}

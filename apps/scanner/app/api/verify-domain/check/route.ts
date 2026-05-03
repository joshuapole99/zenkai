import { NextRequest } from "next/server";
import { getServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { promises as dns } from "dns";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function cleanDomain(input: string): string {
  return input.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
}

async function checkDNS(domain: string, token: string): Promise<boolean> {
  try {
    const records = await dns.resolveTxt(`_zenkai-verify.${domain}`);
    return records.flat().some((r) => r === token);
  } catch {
    return false;
  }
}

async function checkWellKnown(domain: string, token: string): Promise<boolean> {
  try {
    const res = await fetch(`https://${domain}/.well-known/zenkai-verify`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return false;
    const data = await res.json() as { token?: string };
    return data.token === token;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const sb = await getServerClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return json({ error: "Niet ingelogd" }, 401);

  const body = await req.json() as { domain?: string };
  if (!body.domain) return json({ error: "Domein vereist" }, 400);

  const domain = cleanDomain(body.domain);

  const { data: record } = await supabaseAdmin
    .from("domain_verifications")
    .select("*")
    .eq("user_email", user.email)
    .eq("domain", domain)
    .eq("verified", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!record) return json({ error: "Geen verificatie aangevraagd voor dit domein." }, 404);

  if (new Date(record.expires_at) < new Date()) {
    return json({ error: "Verificatietoken is verlopen. Vraag een nieuwe aan." }, 410);
  }

  const token: string = record.token;

  const [dnsPassed, wellKnownPassed] = await Promise.all([
    checkDNS(domain, token),
    checkWellKnown(domain, token),
  ]);

  if (dnsPassed || wellKnownPassed) {
    await supabaseAdmin
      .from("domain_verifications")
      .update({ verified: true, method: dnsPassed ? "dns" : "well-known" })
      .eq("id", record.id);

    return json({ verified: true, method: dnsPassed ? "dns" : "well-known" });
  }

  return json({ verified: false, dns: dnsPassed, well_known: wellKnownPassed });
}

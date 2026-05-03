import { NextRequest } from "next/server";
import { getServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { randomBytes } from "crypto";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function cleanDomain(input: string): string {
  return input.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
}

export async function POST(req: NextRequest) {
  const sb = await getServerClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return json({ error: "Niet ingelogd" }, 401);

  // Only Starter and Pro
  const { data: row } = await supabaseAdmin
    .from("users")
    .select("plan")
    .eq("email", user.email)
    .single();
  const plan = (row?.plan as string) ?? "free";
  if (plan === "free") return json({ error: "Domeinverificatie is beschikbaar voor Starter en Pro." }, 403);

  const body = await req.json() as { domain?: string };
  if (!body.domain) return json({ error: "Domein vereist" }, 400);

  const domain = cleanDomain(body.domain);
  const token  = `zenkai-verify=${randomBytes(16).toString("hex")}`;
  const expires_at = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  // Delete any previous pending verification for this domain + user
  await supabaseAdmin
    .from("domain_verifications")
    .delete()
    .eq("user_email", user.email)
    .eq("domain", domain)
    .eq("verified", false);

  const { error } = await supabaseAdmin.from("domain_verifications").insert({
    user_email: user.email,
    domain,
    token,
    expires_at,
  });

  if (error) return json({ error: "Database fout" }, 500);

  return json({
    domain,
    token,
    expires_at,
    dns_record: `TXT  _zenkai-verify.${domain}  "${token}"`,
    well_known_url: `https://${domain}/.well-known/zenkai-verify`,
    well_known_content: JSON.stringify({ token }),
  });
}

import { getServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  // 1. Auth user via cookie
  const sb = await getServerClient();
  const { data: { user }, error: userError } = await sb.auth.getUser();

  if (!user) {
    return Response.json({ error: "Niet ingelogd", userError: userError?.message });
  }

  // 2. Row in public.users
  const { data: row, error: rowError } = await supabaseAdmin
    .from("users")
    .select("email, plan, scan_count_month, scan_reset_at, ls_subscription_id, ls_customer_id")
    .eq("email", user.email!)
    .single();

  // 3. All rows with similar email (case mismatch check)
  const { data: allRows } = await supabaseAdmin
    .from("users")
    .select("email, plan")
    .ilike("email", user.email!)
    .limit(5);

  return Response.json({
    auth: {
      id: user.id,
      email: user.email,
      provider: user.app_metadata?.provider,
    },
    usersRow: row ?? null,
    rowError: rowError?.message ?? null,
    rowErrorCode: rowError?.code ?? null,
    emailMatches: allRows ?? [],
  });
}

import { getServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { PLAN_LIMITS } from "@/lib/supabase-server";

const SCANNER_URL = process.env.SCANNER_API_URL ?? "https://vmi3112892.contaboserver.net";
const SCANNER_KEY = process.env.SCANNER_API_KEY ?? "verander-dit";

export async function GET() {
  // 1. Auth
  const sb = await getServerClient();
  const { data: { user }, error: userError } = await sb.auth.getUser();
  if (!user) {
    return Response.json({ step: "auth", error: "Niet ingelogd", userError: userError?.message });
  }

  // 2. Plan lookup
  const { data: row, error: rowError } = await supabaseAdmin
    .from("users")
    .select("plan, scan_count_month, scan_reset_at")
    .eq("email", user.email!)
    .single();

  const plan = (row?.plan ?? "free") as string;
  const limits = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

  const resetAt = new Date(row?.scan_reset_at ?? 0);
  const now = new Date();
  const newMonth = now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear();
  const count = newMonth ? 0 : (row?.scan_count_month ?? 0);

  const wouldBlock = limits.scansPerMonth !== -1 && count >= limits.scansPerMonth;

  // 3. Flask backend reachability
  let flaskStatus: number | null = null;
  let flaskError: string | null = null;
  let flaskReachable = false;
  try {
    const res = await fetch(`${SCANNER_URL}/health`, {
      method: "GET",
      headers: { "X-API-Key": SCANNER_KEY },
      signal: AbortSignal.timeout(5000),
    });
    flaskStatus = res.status;
    flaskReachable = res.ok;
  } catch (e) {
    flaskError = (e as Error).message;
  }

  return Response.json({
    step: "ok",
    auth: { email: user.email, id: user.id },
    plan: { plan, limits, count, newMonth, wouldBlock },
    planRow: row ?? null,
    planRowError: rowError?.message ?? null,
    flask: {
      url: SCANNER_URL,
      keySet: SCANNER_KEY !== "verander-dit",
      reachable: flaskReachable,
      status: flaskStatus,
      error: flaskError,
    },
  });
}

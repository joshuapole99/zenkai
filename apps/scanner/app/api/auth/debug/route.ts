import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const supabaseCookies = allCookies.filter(c => c.name.includes("sb-") || c.name.includes("supabase"));

  const sb = await getServerClient();
  const { data: { session }, error: sessionError } = await sb.auth.getSession();
  const { data: { user }, error: userError } = await sb.auth.getUser();

  const authHeader = req.headers.get("authorization");
  let bearerUser = null;
  let bearerError = null;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    bearerUser = data.user?.email ?? null;
    bearerError = error?.message ?? null;
  }

  return Response.json({
    cookieCount: allCookies.length,
    supabaseCookieNames: supabaseCookies.map(c => c.name),
    session: session ? { user: session.user.email, expires: session.expires_at } : null,
    sessionError: sessionError?.message ?? null,
    user: user?.email ?? null,
    userError: userError?.message ?? null,
    bearerPresent: !!authHeader,
    bearerUser,
    bearerError,
  });
}

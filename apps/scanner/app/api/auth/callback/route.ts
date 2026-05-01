import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const next = req.nextUrl.searchParams.get("next") ?? "/scan";

  if (code) {
    const sb = await getServerClient();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, req.url));
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth", req.url));
}

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "./supabase";
import type { NextRequest } from "next/server";

/** Resolves the user from Authorization header (Bearer token) or session cookie. */
export async function getUserFromRequest(req: NextRequest) {
  // Try Bearer token first
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7);
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    if (user) return user;
    // Fall through to cookie auth if token validation failed
  }
  // Cookie-based session — getUser() validates server-side (same as dashboard)
  const sb = await getServerClient();
  const { data: { user } } = await sb.auth.getUser();
  return user;
}

export async function getServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet: { name: string; value: string; options?: Record<string, unknown> }[]) => {
          try {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
            );
          } catch {}
        },
      },
    }
  );
}

// Plan limits
export const PLAN_LIMITS: Record<string, { scansPerMonth: number; fullScan: boolean }> = {
  free:       { scansPerMonth: 1,  fullScan: false },
  starter:    { scansPerMonth: 3,  fullScan: false },
  pro:        { scansPerMonth: -1, fullScan: true  }, // -1 = unlimited
  enterprise: { scansPerMonth: -1, fullScan: true  },
};

export type Plan = keyof typeof PLAN_LIMITS;

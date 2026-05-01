import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

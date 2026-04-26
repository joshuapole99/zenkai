export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import OnboardingClient from "./OnboardingClient";

export default async function OnboardingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) redirect("/login");

  let session;
  try {
    session = await verifyToken(token);
  } catch {
    redirect("/login");
  }

  const sql = getDb();

  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_founding_member BOOLEAN DEFAULT FALSE`;

  const [user] = (await sql`
    SELECT onboarding_complete, is_founding_member FROM users WHERE id = ${session.userId}
  `) as { onboarding_complete: boolean | null; is_founding_member: boolean | null }[];

  if (!user) redirect("/login");
  if (user.onboarding_complete) redirect("/dashboard");

  return <OnboardingClient isFoundingMember={user.is_founding_member ?? false} />;
}

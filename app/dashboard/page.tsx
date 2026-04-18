export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getDailyQuests } from "@/lib/quests";
import LogoutButton from "./LogoutButton";
import DashboardClient from "./DashboardClient";

type UserRow = {
  id: number;
  username: string;
  character_name: string | null;
  character_class: string | null;
  xp: number | null;
  streak: number | null;
  onboarding_complete: boolean | null;
};

type QuestCompletion = { quest_id: number };
type FoodLog = { ate_enough: boolean };

export default async function DashboardPage() {
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

  // Ensure new columns exist (idempotent)
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS character_class TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS character_name TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_streak_date DATE`;

  const [user] = (await sql`
    SELECT id, username, character_name, character_class, xp, streak, onboarding_complete
    FROM users WHERE id = ${session.userId}
  `) as UserRow[];

  if (!user) redirect("/login");
  if (!user.onboarding_complete) redirect("/onboarding");

  const today = new Date().toISOString().slice(0, 10);

  await sql`
    CREATE TABLE IF NOT EXISTS quest_completions (
      id             SERIAL PRIMARY KEY,
      user_id        INTEGER NOT NULL,
      quest_id       INTEGER NOT NULL,
      completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
      UNIQUE(user_id, quest_id, completed_date)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS food_logs (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL,
      log_date   DATE NOT NULL DEFAULT CURRENT_DATE,
      ate_enough BOOLEAN NOT NULL,
      UNIQUE(user_id, log_date)
    )
  `;

  const completions = (await sql`
    SELECT quest_id FROM quest_completions
    WHERE user_id = ${user.id} AND completed_date = ${today}::date
  `) as QuestCompletion[];

  const foodRows = (await sql`
    SELECT ate_enough FROM food_logs
    WHERE user_id = ${user.id} AND log_date = ${today}::date
  `) as FoodLog[];

  // Coerce to number — Neon can return integer columns as strings
  const completedIds = completions.map((r) => Number(r.quest_id));
  const foodLog = foodRows[0] ?? null;
  const quests = getDailyQuests(today);

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <header
        className="flex items-center justify-between px-4 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <span className="font-black text-lg tracking-tight gradient-text">ZENKAI</span>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-600">{user.username}</span>
          <LogoutButton />
        </div>
      </header>

      <DashboardClient
        characterName={user.character_name ?? user.username}
        characterClass={user.character_class ?? "saiyan"}
        xp={user.xp ?? 0}
        streak={user.streak ?? 0}
        quests={quests}
        initialCompletedIds={completedIds}
        initialFoodLogged={!!foodLog}
        initialAteEnough={foodLog?.ate_enough ?? null}
      />

      <footer
        className="border-t py-6 px-4 mt-4"
        style={{ borderColor: "rgba(255,255,255,0.04)" }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <p className="text-xs text-gray-800">© 2026 Zenkai</p>
          <div className="flex gap-4 text-xs text-gray-700">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getDailyQuests } from "@/lib/quests";
import { story } from "@/lib/story";
import LogoutButton from "./LogoutButton";
import DashboardClient from "./DashboardClient";

type UserRow = {
  id: number;
  username: string;
  character_name: string | null;
  character_class: string | null;
  fitness_level: string | null;
  xp: number | null;
  streak: number | null;
  hp: number | null;
  protein_goal: number | null;
  onboarding_complete: boolean | null;
  is_founding_member: boolean | null;
  story_day: number | null;
  last_story_date: string | null;
  last_streak_date: string | null;
};

export type StoryData = {
  day: number;
  title: string;
  intro: string;
  completion: string;
  isZenkaiBoost: boolean;
  nextChapterTitle: string | null;
  background: string;
  npc: string;
};

type QuestCompletion = { quest_id: number };
type FoodLog = {
  protein: boolean | null;
  vegetables: boolean | null;
  carbs: boolean | null;
  fruits: boolean | null;
  water: boolean | null;
  meals_count: number | null;
  custom_input: string | null;
  hp_gained: number | null;
};
type SwapRow = {
  original_quest_id: number;
  exercise_id: number;
  exercise_name: string;
  sets_reps: string | null;
  duration: string | null;
};

export type SwapEntry = {
  original_quest_id: number;
  exercise_id: number;
  exercise_name: string;
  exercise_detail: string;
};

function DashboardError() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0a0a0a" }}>
      <div className="text-center max-w-sm">
        <p className="text-lg font-black text-white mb-2">Something went wrong.</p>
        <p className="text-sm text-gray-500 mb-6">We&apos;re fixing it. Try again in a moment.</p>
        <a
          href="/dashboard"
          className="inline-block px-6 py-3 rounded-xl text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
        >
          Retry
        </a>
      </div>
    </div>
  );
}

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

  try {
    // Ensure all users columns exist (idempotent)
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS character_class TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS character_name TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_streak_date DATE`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS fitness_level TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_founding_member BOOLEAN DEFAULT FALSE`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS founding_member_since TIMESTAMPTZ`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS story_day INTEGER DEFAULT 1`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_story_date DATE`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS hp INTEGER DEFAULT 100`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active DATE`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(5,1)`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS height_cm INTEGER`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS protein_goal INTEGER`;
  } catch (e) {
    console.error("[dashboard] users migration error:", e);
  }

  let user: UserRow;
  try {
    const rows = (await sql`
      SELECT id, username, character_name, character_class, fitness_level, xp, streak, hp, protein_goal,
             onboarding_complete, is_founding_member, story_day, last_story_date, last_streak_date
      FROM users WHERE id = ${session.userId}
    `) as UserRow[];
    if (!rows[0]) redirect("/login");
    user = rows[0];
  } catch (e) {
    console.error("[dashboard] user fetch error:", e);
    return <DashboardError />;
  }

  if (!user.onboarding_complete) redirect("/onboarding");

  const today = new Date().toISOString().slice(0, 10);

  try {
  // Core tables
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
      ate_enough BOOLEAN DEFAULT FALSE,
      UNIQUE(user_id, log_date)
    )
  `;
  await sql`ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS protein BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS vegetables BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS carbs BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS fruits BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS water BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS meals_count INTEGER DEFAULT 0`;
  await sql`ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS custom_input TEXT`;
  await sql`ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS hp_gained INTEGER DEFAULT 0`;

  // Exercise library
  await sql`
    CREATE TABLE IF NOT EXISTS exercises (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL UNIQUE,
      sets_reps  TEXT,
      duration   TEXT,
      difficulty TEXT NOT NULL,
      category   TEXT NOT NULL
    )
  `;

  const [{ count }] = (await sql`SELECT COUNT(*)::int AS count FROM exercises`) as { count: number }[];

  if (Number(count) === 0) {
    await Promise.all([
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Push-ups', '3 × 15 reps', null, 'beginner', 'push') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Wide Push-ups', '3 × 12 reps', null, 'beginner', 'push') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Diamond Push-ups', '3 × 10 reps', null, 'intermediate', 'push') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Decline Push-ups', '3 × 12 reps', null, 'intermediate', 'push') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Pike Push-ups', '3 × 10 reps', null, 'intermediate', 'push') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Tricep Dips', '3 × 15 reps', null, 'intermediate', 'push') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Archer Push-ups', '3 × 8 reps each side', null, 'advanced', 'push') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Squats', '3 × 20 reps', null, 'beginner', 'legs') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Lunges', '3 × 15 reps each leg', null, 'beginner', 'legs') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Glute Bridges', '3 × 20 reps', null, 'beginner', 'legs') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Wall Sit', null, '3 × 45 seconds', 'beginner', 'legs') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Jump Squats', '3 × 15 reps', null, 'intermediate', 'legs') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Bulgarian Split Squats', '3 × 10 reps each leg', null, 'intermediate', 'legs') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Reverse Lunges', '3 × 12 reps each leg', null, 'intermediate', 'legs') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Pistol Squat Assist', '3 × 6 reps each leg', null, 'advanced', 'legs') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Plank', null, '3 × 45 seconds', 'beginner', 'core') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Sit-ups', '3 × 20 reps', null, 'beginner', 'core') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Bicycle Crunches', '3 × 20 reps', null, 'beginner', 'core') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Mountain Climbers', null, '3 × 30 seconds', 'intermediate', 'core') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Leg Raises', '3 × 15 reps', null, 'intermediate', 'core') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Hollow Body Hold', null, '3 × 30 seconds', 'intermediate', 'core') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Ab Wheel Rollout', '3 × 8 reps', null, 'advanced', 'core') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('High Knees', null, '3 × 30 seconds', 'beginner', 'cardio') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Star Jumps', '3 × 20 reps', null, 'beginner', 'cardio') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Burpees', '3 × 10 reps', null, 'intermediate', 'cardio') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Box Jumps', '3 × 10 reps', null, 'intermediate', 'cardio') ON CONFLICT (name) DO NOTHING`,
      sql`INSERT INTO exercises (name, sets_reps, duration, difficulty, category) VALUES ('Sprint Intervals', null, '6 × 20 seconds on / 10 off', 'advanced', 'cardio') ON CONFLICT (name) DO NOTHING`,
    ]);
  }

  // Quest swaps table
  await sql`
    CREATE TABLE IF NOT EXISTS quest_swaps (
      id                SERIAL PRIMARY KEY,
      user_id           INTEGER NOT NULL,
      date              DATE NOT NULL,
      original_quest_id INTEGER NOT NULL,
      exercise_id       INTEGER NOT NULL,
      UNIQUE(user_id, date, original_quest_id)
    )
  `;

  const completions = (await sql`
    SELECT quest_id FROM quest_completions
    WHERE user_id = ${user.id} AND completed_date = ${today}::date
  `) as QuestCompletion[];

  const foodRows = (await sql`
    SELECT protein, vegetables, carbs, fruits, water, meals_count, custom_input, hp_gained
    FROM food_logs
    WHERE user_id = ${user.id} AND log_date = ${today}::date
  `) as FoodLog[];

  const swapRows = (await sql`
    SELECT qs.original_quest_id, qs.exercise_id, e.name AS exercise_name, e.sets_reps, e.duration
    FROM quest_swaps qs
    JOIN exercises e ON e.id = qs.exercise_id
    WHERE qs.user_id = ${user.id} AND qs.date = ${today}::date
  `) as SwapRow[];

  const completedIds = completions.map((r) => Number(r.quest_id));
  const rawFoodLog = foodRows[0] ?? null;
  const foodLog = rawFoodLog
    ? {
        protein: !!rawFoodLog.protein,
        vegetables: !!rawFoodLog.vegetables,
        carbs: !!rawFoodLog.carbs,
        fruits: !!rawFoodLog.fruits,
        water: !!rawFoodLog.water,
        meals_count: Number(rawFoodLog.meals_count) || 0,
        custom_input: rawFoodLog.custom_input ?? null,
        hp_gained: Number(rawFoodLog.hp_gained) || 0,
      }
    : null;
  const swaps: SwapEntry[] = swapRows.map((r) => ({
    original_quest_id: Number(r.original_quest_id),
    exercise_id: Number(r.exercise_id),
    exercise_name: r.exercise_name,
    exercise_detail: r.sets_reps ?? r.duration ?? "",
  }));

  const quests = getDailyQuests(today);

  // Story engine
  const storyDay = Math.min(Math.max(user.story_day ?? 1, 1), 7);
  const lastStoryDate = user.last_story_date
    ? String(user.last_story_date).slice(0, 10)
    : null;
  const storyNotReadToday = lastStoryDate !== today;

  // Zenkai Boost: user has trained before AND missed 7+ consecutive days
  let isZenkaiBoost = false;
  if (storyDay > 1 && user.last_streak_date) {
    const diffMs = new Date(today).getTime() - new Date(String(user.last_streak_date).slice(0, 10)).getTime();
    if (Math.floor(diffMs / 86400000) >= 7) isZenkaiBoost = true;
  }

  const dayEntry = story.days.find((d) => d.day === storyDay) ?? story.days[0];
  const nextDayNum = storyDay < 7 ? storyDay + 1 : null;
  const nextEntry = nextDayNum ? story.days.find((d) => d.day === nextDayNum) : null;

  const storyData: StoryData = {
    day: isZenkaiBoost ? 0 : storyDay,
    title: isZenkaiBoost ? story.zenkaiBoost.title : dayEntry.title,
    intro: isZenkaiBoost ? story.zenkaiBoost.intro : dayEntry.intro,
    completion: isZenkaiBoost ? story.zenkaiBoost.completion : dayEntry.completion,
    isZenkaiBoost,
    nextChapterTitle: isZenkaiBoost
      ? `Day ${storyDay} — ${dayEntry.title}`
      : nextEntry
      ? `Day ${nextDayNum} — ${nextEntry.title}`
      : null,
    background: isZenkaiBoost ? story.zenkaiBoost.background : dayEntry.background,
    npc: isZenkaiBoost ? story.zenkaiBoost.npc : dayEntry.npc,
  };

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
        fitnessLevel={user.fitness_level ?? "beginner"}
        xp={user.xp ?? 0}
        streak={user.streak ?? 0}
        quests={quests}
        today={today}
        initialCompletedIds={completedIds}
        initialFoodLog={foodLog}
        initialHp={Number(user.hp) || 100}
        proteinGoal={user.protein_goal ? Number(user.protein_goal) : null}
        initialSwaps={swaps}
        isFoundingMember={user.is_founding_member ?? false}
        storyNotReadToday={storyNotReadToday}
        storyData={storyData}
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
  } catch (e) {
    console.error("[dashboard] render error:", e);
    return <DashboardError />;
  }
}

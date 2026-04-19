import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";

const VALID_CLASSES = ["saiyan", "shadow", "guardian"];
const VALID_GOALS = ["stronger", "weight", "consistent"];
const VALID_LEVELS = ["beginner", "intermediate", "advanced"];

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let user;
  try {
    user = await verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const body = await req.json();
  const { characterClass, goal, fitnessLevel, characterName, weightKg, heightCm, age } = body;

  if (!characterClass || !goal || !fitnessLevel || !characterName?.trim()) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  if (
    !VALID_CLASSES.includes(characterClass) ||
    !VALID_GOALS.includes(goal) ||
    !VALID_LEVELS.includes(fitnessLevel)
  ) {
    return NextResponse.json({ error: "Invalid values" }, { status: 400 });
  }

  const parsedWeight = weightKg != null && !isNaN(Number(weightKg)) && Number(weightKg) > 0
    ? Number(weightKg)
    : null;
  const parsedHeight = heightCm != null && !isNaN(Number(heightCm)) && Number(heightCm) > 0
    ? Number(heightCm)
    : null;
  const parsedAge = age != null && !isNaN(Number(age)) && Number(age) > 0
    ? Number(age)
    : null;
  const proteinGoal = parsedWeight != null ? Math.round(parsedWeight * 1.8) : null;

  const sql = getDb();

  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS character_class TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS goal TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS fitness_level TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS character_name TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_streak_date DATE`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(5,1)`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS height_cm INTEGER`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS protein_goal INTEGER`;

  await sql`
    UPDATE users
    SET character_class     = ${characterClass},
        goal                = ${goal},
        fitness_level       = ${fitnessLevel},
        character_name      = ${characterName.trim()},
        onboarding_complete = TRUE,
        weight_kg           = ${parsedWeight},
        height_cm           = ${parsedHeight},
        age                 = ${parsedAge},
        protein_goal        = ${proteinGoal}
    WHERE id = ${user.userId}
  `;

  return NextResponse.json({ success: true, proteinGoal });
}

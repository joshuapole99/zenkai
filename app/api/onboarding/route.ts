import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";

const VALID_CLASSES = ["saiyan", "shadow", "guardian"];
const VALID_GOALS = ["stronger", "weight", "consistent"];
const VALID_LEVELS = ["beginner", "intermediate", "advanced"];
const VALID_WEAK_SPOTS = ["busy_weeks", "motivation_dips", "travel", "injury"];

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
  const {
    characterClass,
    characterName,
    weightKg, heightCm, age,
    // goal and fitnessLevel are optional — collected later in the app
    goal: rawGoal,
    fitnessLevel: rawLevel,
    weakSpot: rawWeakSpot,
  } = body;

  const goal        = VALID_GOALS.includes(rawGoal)  ? rawGoal  : "consistent";
  const fitnessLevel = VALID_LEVELS.includes(rawLevel) ? rawLevel : "beginner";
  const weakSpot    = VALID_WEAK_SPOTS.includes(rawWeakSpot) ? rawWeakSpot : null;

  if (!characterClass || !characterName?.trim()) {
    return NextResponse.json({ error: "Class and character name are required" }, { status: 400 });
  }
  if (!VALID_CLASSES.includes(characterClass)) {
    return NextResponse.json({ error: "Invalid class" }, { status: 400 });
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
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS weak_spot TEXT`;

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
        protein_goal        = ${proteinGoal},
        weak_spot           = ${weakSpot}
    WHERE id = ${user.userId}
  `;

  return NextResponse.json({ success: true, proteinGoal });
}

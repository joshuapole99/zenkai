import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";

function calcHp(
  protein: boolean,
  vegetables: boolean,
  carbs: boolean,
  fruits: boolean,
  water: boolean,
  mealsCount: number
): number {
  let hp = 0;
  if (protein) hp += 40;
  if (vegetables) hp += 20;
  if (carbs) hp += 20;
  if (fruits) hp += 10;
  if (water) hp += 10;
  if (mealsCount >= 3) hp += 20;
  return Math.min(hp, 100);
}

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

  const { protein, vegetables, carbs, fruits, water, mealsCount, customInput } = await req.json();

  const today = new Date().toISOString().slice(0, 10);
  const sql = getDb();

  // Migrate food_logs to new schema
  await sql`
    CREATE TABLE IF NOT EXISTS food_logs (
      id           SERIAL PRIMARY KEY,
      user_id      INTEGER NOT NULL,
      log_date     DATE NOT NULL DEFAULT CURRENT_DATE,
      ate_enough   BOOLEAN DEFAULT FALSE,
      UNIQUE(user_id, log_date)
    )
  `;
  await sql`ALTER TABLE food_logs ALTER COLUMN ate_enough SET DEFAULT false`;
  await sql`ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS protein BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS vegetables BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS carbs BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS fruits BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS water BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS meals_count INTEGER DEFAULT 0`;
  await sql`ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS custom_input TEXT`;
  await sql`ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS hp_gained INTEGER DEFAULT 0`;

  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS hp INTEGER DEFAULT 100`;

  const hpGained = calcHp(
    Boolean(protein),
    Boolean(vegetables),
    Boolean(carbs),
    Boolean(fruits),
    Boolean(water),
    Number(mealsCount) || 0
  );

  await sql`
    INSERT INTO food_logs (user_id, log_date, ate_enough, protein, vegetables, carbs, fruits, water, meals_count, custom_input, hp_gained)
    VALUES (
      ${user.userId}, ${today}::date, ${Boolean(protein) || Boolean(vegetables) || Boolean(carbs) || Boolean(fruits) || Boolean(water)},
      ${Boolean(protein)}, ${Boolean(vegetables)}, ${Boolean(carbs)}, ${Boolean(fruits)}, ${Boolean(water)},
      ${Number(mealsCount) || 0}, ${customInput ?? null}, ${hpGained}
    )
    ON CONFLICT (user_id, log_date) DO UPDATE SET
      ate_enough    = EXCLUDED.ate_enough,
      protein       = EXCLUDED.protein,
      vegetables    = EXCLUDED.vegetables,
      carbs         = EXCLUDED.carbs,
      fruits        = EXCLUDED.fruits,
      water         = EXCLUDED.water,
      meals_count   = EXCLUDED.meals_count,
      custom_input  = EXCLUDED.custom_input,
      hp_gained     = EXCLUDED.hp_gained
  `;

  await sql`UPDATE users SET hp = ${hpGained} WHERE id = ${user.userId}`;

  return NextResponse.json({ success: true, hpGained });
}

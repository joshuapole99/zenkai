import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";

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
  const { hairStyle, hairColor, skinTone, eyeColor } = body;

  if (
    typeof hairStyle !== "number" || hairStyle < 1 || hairStyle > 5 ||
    typeof hairColor !== "string" ||
    typeof skinTone !== "string" ||
    typeof eyeColor !== "string"
  ) {
    return NextResponse.json({ error: "Invalid avatar config" }, { status: 400 });
  }

  const config = { hairStyle, hairColor, skinTone, eyeColor };
  const sql = getDb();

  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_config JSONB`;
  await sql`UPDATE users SET avatar_config = ${JSON.stringify(config)} WHERE id = ${user.userId}`;

  return NextResponse.json({ success: true });
}

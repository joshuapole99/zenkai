export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import CharacterCreatorClient from "./CharacterCreatorClient";
import { type AvatarConfig, DEFAULT_AVATAR } from "@/components/AvatarSVG";

export default async function CharacterPage() {
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
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_config JSONB`;

  const rows = (await sql`
    SELECT character_name, character_class, avatar_config
    FROM users WHERE id = ${session.userId}
  `) as { character_name: string | null; character_class: string | null; avatar_config: AvatarConfig | null }[];

  const user = rows[0];
  if (!user) redirect("/login");

  const avatarConfig: AvatarConfig = user.avatar_config
    ? { ...DEFAULT_AVATAR, ...(user.avatar_config as object) }
    : DEFAULT_AVATAR;

  return (
    <CharacterCreatorClient
      initialConfig={avatarConfig}
      characterClass={user.character_class ?? "saiyan"}
      characterName={user.character_name ?? ""}
    />
  );
}

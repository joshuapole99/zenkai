import { getServerClient } from "@/lib/supabase-server";

export async function GET() {
  const sb = await getServerClient();
  const { data: { user } } = await sb.auth.getUser();
  return Response.json({ loggedIn: !!user });
}

import { getServerClient } from "@/lib/supabase-server";
import ScanClient from "./ScanClient";

export default async function ScanPage() {
  const sb = await getServerClient();
  const { data: { user } } = await sb.auth.getUser();
  return <ScanClient initialLoggedIn={!!user} />;
}

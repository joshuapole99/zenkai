import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) redirect("/login");

  let user;
  try {
    user = await verifyToken(token);
  } catch {
    redirect("/login");
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>

      {/* Top bar */}
      <header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <span className="font-black text-lg tracking-tight gradient-text">ZENKAI</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.username}</span>
          <LogoutButton />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-medium text-gray-500 mb-1">Welcome back</p>
          <h1 className="text-3xl font-black text-white">{user.username}</h1>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
          {[
            { label: "Power Level", value: "0" },
            { label: "Streak", value: "0 days" },
            { label: "Quests Done", value: "0" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl p-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className="text-2xl font-black text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Coming soon */}
        <div
          className="rounded-2xl px-8 py-12 text-center"
          style={{ background: "rgba(255,215,0,0.03)", border: "1px solid rgba(255,215,0,0.1)" }}
        >
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#FFD700" }}>
            Coming soon
          </p>
          <h2 className="text-xl font-black text-white mb-2">Your dashboard is being built</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Daily quests, XP, character creation, and your Zenkai Boost are on the way.
          </p>
        </div>
      </main>
    </div>
  );
}

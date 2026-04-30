import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b bg-white px-4 sm:px-6 py-3 flex items-center justify-between text-sm">
        <div className="flex gap-4">
          <Link href="/dashboard" className="font-medium hover:underline">Overzicht</Link>
          <Link href="/dashboard/doelen" className="hover:underline">Doelen</Link>
          <Link href="/dashboard/vermogen" className="hover:underline">Vermogen</Link>
          <Link href="/dashboard/account" className="hover:underline">Account</Link>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="text-gray-500 hover:text-gray-900">Uitloggen</button>
        </form>
      </nav>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}

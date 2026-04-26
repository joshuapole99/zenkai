import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import MobileMenu from "@/components/MobileMenu";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dashboard nav */}
      <nav className="sticky top-0 z-50 border-b border-border backdrop-blur-md bg-background/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-2">
          <Link href="/" className="text-base font-bold text-foreground tracking-tight shrink-0">
            Financios
          </Link>

          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-1">
            <Link href="/dashboard" className="text-sm text-muted hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-card">Overzicht</Link>
            <Link href="/dashboard/spaardoelen" className="text-sm text-muted hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-card">Doelen</Link>
            <Link href="/dashboard/assets" className="text-sm text-muted hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-card">Vermogen</Link>
            <Link href="/dashboard/account" className="text-sm text-muted hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-card">Account</Link>
            <Link href="/scan" className="text-sm font-semibold bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-accent/20 ml-2">Scan starten</Link>
            <form action="/api/auth/logout" method="POST" className="ml-1">
              <button type="submit" className="text-sm text-muted hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-card">Uitloggen</button>
            </form>
          </div>

          {/* Mobile */}
          <div className="flex sm:hidden items-center gap-2 relative">
            <Link href="/scan" className="text-sm font-semibold bg-accent hover:bg-accent-hover text-white px-3 py-2 rounded-xl transition-all shadow-lg shadow-accent/20">
              Scan
            </Link>
            <MobileMenu
              items={[
                { href: "/dashboard", label: "Overzicht" },
                { href: "/dashboard/spaardoelen", label: "Doelen" },
                { href: "/dashboard/assets", label: "Vermogen" },
                { href: "/dashboard/account", label: "Account" },
              ]}
              logoutAction
            />
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}

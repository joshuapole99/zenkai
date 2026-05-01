import type { Metadata } from "next";
import { ZenkaiNav, ZenkaiFooter } from "@zenkai/ui";
import { getServerClient } from "@/lib/supabase-server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zenkai Scanner — Automated security audit",
  description:
    "Enter your domain. Get a professional security report in minutes. Shodan, SSL, OWASP, port scan, injection testing and more.",
  icons: {
    icon: "/zenkai-logo.png",
    apple: "/zenkai-logo.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const sb = await getServerClient();
  const { data: { user } } = await sb.auth.getUser();

  return (
    <html lang="nl">
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <ZenkaiNav currentApp="scan" showDashboard={!!user} />
        <main style={{ flex: 1 }}>{children}</main>
        <ZenkaiFooter />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { ZenkaiNav, ZenkaiFooter } from "@zenkai/ui";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <ZenkaiNav currentApp="scan" />
        <main style={{ flex: 1 }}>{children}</main>
        <ZenkaiFooter />
      </body>
    </html>
  );
}

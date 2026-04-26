import type { Metadata } from "next";
import { ZenkaiNav, ZenkaiFooter } from "@zenkai/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scan — Automated domain security audit",
  description:
    "Enter your domain. Get a professional security report in minutes. Shodan, HIBP, SSL, OWASP indicators and more.",
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

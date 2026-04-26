import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scan — Automated domain security audit",
  description:
    "Enter your domain. Get a professional security report in minutes. Shodan, HIBP, SSL, OWASP indicators and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

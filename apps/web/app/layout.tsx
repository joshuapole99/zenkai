import type { Metadata, Viewport } from "next";
import { Geist, Orbitron, Rajdhani, Syne } from "next/font/google";
import { CookieBanner } from "./components/CookieBanner";
import "./globals.css";

const geist    = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const orbitron = Orbitron({ variable: "--font-orbitron", subsets: ["latin"], weight: ["400","600","700","900"] });
const rajdhani = Rajdhani({ variable: "--font-rajdhani", subsets: ["latin"], weight: ["300","400","500","600","700"] });
const syne     = Syne({ variable: "--font-syne", subsets: ["latin"], weight: ["400","500","600","700","800"] });

export const metadata: Metadata = {
  title: "Zenkai — Security platform",
  description:
    "Zenkai is a security platform for automated vulnerability scanning, reporting, and penetration testing tools.",
  manifest: "/manifest.json",
  icons: {
    icon: "/zenkai-logo.png",
    apple: "/zenkai-logo.png",
  },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Zenkai" },
  openGraph: {
    title: "Zenkai — Security platform",
    description:
      "Automated security scanning, PDF reports, and vulnerability intelligence for developers and pentesters.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${orbitron.variable} ${rajdhani.variable} ${syne.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}

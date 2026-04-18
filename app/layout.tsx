import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zenkai — Train. Fall. Come Back Stronger.",
  description:
    "The anime fitness app where every setback makes you stronger. Daily quests, XP system, and Zenkai Boost for when you fall off track.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Zenkai" },
  openGraph: {
    title: "Zenkai — Train. Fall. Come Back Stronger.",
    description:
      "The anime fitness app where every setback makes you stronger. Daily quests, XP system, and Zenkai Boost for when you fall off track.",
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
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">{children}</body>
    </html>
  );
}

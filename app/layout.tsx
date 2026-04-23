import type { Metadata, Viewport } from "next";
import { Geist, Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";

const geist    = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const orbitron = Orbitron({ variable: "--font-orbitron", subsets: ["latin"], weight: ["400","600","700","900"] });
const rajdhani = Rajdhani({ variable: "--font-rajdhani", subsets: ["latin"], weight: ["300","400","500","600","700"] });

export const metadata: Metadata = {
  title: "Zenkai — Your custom workout coach for consistency.",
  description:
    "Design your own workouts. Pick your training days. Zenkai keeps you consistent — and gives you a comeback workout when life gets in the way.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Zenkai" },
  openGraph: {
    title: "Zenkai — Your custom workout coach for consistency.",
    description:
      "Design your own workouts. Pick your training days. Zenkai keeps you consistent — and gives you a comeback workout when life gets in the way.",
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
    <html lang="en" className={`${geist.variable} ${orbitron.variable} ${rajdhani.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">{children}</body>
    </html>
  );
}

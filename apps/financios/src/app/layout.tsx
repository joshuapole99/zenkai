import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ZenkaiNav, ZenkaiFooter } from "@zenkai/ui";
import PostHogProvider from "./PostHogProvider";
import InstallBanner from "@/components/InstallBanner";
import GoalsAppBar from "@/components/GoalsAppBar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://financios.nl"),
  title: {
    default: "Goals — Financiële duidelijkheid voor studenten en Gen Z",
    template: "%s — Zenkai Goals",
  },
  description:
    "Ontdek in 60 seconden waar jouw geld naartoe gaat en fix je spaardoel met een persoonlijk plan.",
  openGraph: {
    siteName: "Zenkai Goals",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    google: "szoX8xp7lF1liB9uBRq4spT-Du1A3vaOzBgkDWnPNKA",
  },
  alternates: {
    canonical: "https://financios.nl",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Financios",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ZenkaiNav currentApp="goals" />
        <GoalsAppBar />
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="gradient-orb gradient-orb-1" />
          <div className="gradient-orb gradient-orb-2" />
        </div>
        <PostHogProvider>
          <main style={{ flex: 1 }}>{children}</main>
        </PostHogProvider>
        <InstallBanner />
        <ZenkaiFooter />
      </body>
    </html>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jouw spaarfix plan",
  description: "Jouw persoonlijk weekplan, bezuinigingstips en afrondingsdatum.",
  robots: { index: false, follow: false },
};

export default function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

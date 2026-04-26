import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bevestig aankoop",
  description: "Bevestig je aankoop van het persoonlijk spaarfix plan.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

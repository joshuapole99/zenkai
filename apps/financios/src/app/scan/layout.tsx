import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financiële scan",
  description:
    "Vul je inkomsten en uitgaven in. We berekenen direct je spaarruimte en of jouw spaardoel haalbaar is. Gratis, geen account.",
};

export default function ScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

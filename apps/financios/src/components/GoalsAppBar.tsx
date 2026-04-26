"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Spaar Scan", href: "/scan" },
  { label: "Blog", href: "/blog" },
  { label: "Prijzen", href: "/upgrade" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function GoalsAppBar() {
  const pathname = usePathname();

  return (
    <div style={{
      position: "sticky",
      top: "60px",
      zIndex: 100,
      background: "#ffffff",
      borderBottom: "1px solid rgba(15,14,14,0.08)",
      display: "flex",
      alignItems: "center",
      gap: "0",
      padding: "0 clamp(16px, 4vw, 40px)",
      height: "44px",
      overflowX: "auto",
    }}>
      {LINKS.map((link) => {
        const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.04em",
              color: active ? "#16A34A" : "rgba(15,14,14,0.45)",
              textDecoration: "none",
              padding: "0 16px",
              height: "44px",
              display: "inline-flex",
              alignItems: "center",
              borderBottom: active ? "2px solid #16A34A" : "2px solid transparent",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "color 0.15s ease",
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

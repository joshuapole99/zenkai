"use client";

import { useState } from "react";
import Link from "next/link";

type NavItem = { href: string; label: string; accent?: boolean };

export default function MobileMenu({
  items,
  logoutAction,
}: {
  items: NavItem[];
  logoutAction?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card"
        aria-label="Menu"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border z-50 px-4 py-3 flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={
                item.accent
                  ? "text-sm font-semibold bg-accent text-white px-4 py-3 rounded-xl text-center mt-1"
                  : "text-sm text-muted hover:text-foreground transition-colors px-3 py-2.5 rounded-lg hover:bg-card"
              }
            >
              {item.label}
            </Link>
          ))}
          {logoutAction && (
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="w-full text-left text-sm text-muted hover:text-foreground transition-colors px-3 py-2.5 rounded-lg hover:bg-card"
              >
                Uitloggen
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

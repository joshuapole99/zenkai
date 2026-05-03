"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "zenkai_cookies_accepted";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: "#0F0E0E", borderTop: "1px solid rgba(245,243,236,0.1)",
      padding: "16px 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: "12px",
      fontFamily: "'IBM Plex Mono', monospace",
    }}>
      <p style={{ fontSize: "12px", color: "rgba(245,243,236,0.55)", margin: 0, maxWidth: "680px", lineHeight: 1.6 }}>
        Zenkai gebruikt functionele cookies voor inlogbeheer. Geen tracking.{" "}
        <a href="https://zenkai.nl/cookies" style={{ color: "rgba(245,243,236,0.4)", textDecoration: "underline" }}>
          Cookiebeleid
        </a>
      </p>
      <button
        onClick={accept}
        style={{
          padding: "8px 20px",
          background: "#0284C7", color: "#fff",
          border: "none", cursor: "pointer",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "11px", fontWeight: 600,
          letterSpacing: "0.06em", whiteSpace: "nowrap",
        }}
      >
        Accepteren
      </button>
    </div>
  );
}

"use client";
export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "11px", fontWeight: 600,
        letterSpacing: "0.12em", textTransform: "uppercase",
        background: "#0F0E0E", color: "#ffffff",
        border: "none", padding: "12px 24px",
        cursor: "pointer",
      }}
    >
      Print / PDF ↓
    </button>
  );
}

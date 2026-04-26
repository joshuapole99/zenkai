// Shared design primitives for Zenkai UI components.
// All colours use CSS custom properties set in globals.css.

import React from "react";

// ─── Design tokens (mirrors CSS vars, used in inline styles) ─────────────────

export const Z = {
  bg:          "var(--z-bg)",
  surface:     "var(--z-surface)",
  surface2:    "var(--z-surface2)",
  surface3:    "var(--z-surface3)",
  border:      "var(--z-border)",
  border2:     "var(--z-border2)",
  orange:      "var(--z-orange)",
  orangeDim:   "var(--z-orange-dim)",
  orangeGlow:  "var(--z-orange-glow)",
  purple:      "var(--z-purple)",
  purpleDim:   "var(--z-purple-dim)",
  purpleGlow:  "var(--z-purple-glow)",
  green:       "var(--z-green)",
  red:         "var(--z-red)",
  text:        "var(--z-text)",
  textDim:     "var(--z-text-dim)",
  textMuted:   "var(--z-text-muted)",
  fontHud:     "var(--z-font-hud)",
  fontBody:    "var(--z-font-body)",
} as const;

// ─── Panel ────────────────────────────────────────────────────────────────────

interface PanelProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: "orange" | "purple";
  noBrackets?: boolean;
  glow?: boolean;
  className?: string;
}

export function Panel({ children, style, accent = "orange", noBrackets, glow, className }: PanelProps) {
  const accentColor  = accent === "purple" ? Z.purple : Z.orange;
  const glowColor    = accent === "purple" ? Z.purpleGlow : Z.orangeGlow;
  const bracketBase: React.CSSProperties = {
    position: "absolute", width: 10, height: 10,
    border: `1.5px solid ${accentColor}`,
  };
  return (
    <div
      className={className}
      style={{
        position: "relative",
        background: Z.surface,
        border: `1px solid ${Z.border}`,
        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
        boxShadow: glow
          ? `0 0 24px ${glowColor}, inset 0 1px 0 ${Z.border2}`
          : `inset 0 1px 0 ${Z.border2}`,
        ...style,
      }}
    >
      {!noBrackets && (
        <>
          <div style={{ ...bracketBase, top: -1, left: -1, borderRight: "none", borderBottom: "none" }} />
          <div style={{ ...bracketBase, top: -1, right: -1, borderLeft: "none", borderBottom: "none", clipPath: "polygon(0 0,100% 0,100% 100%)" }} />
          <div style={{ ...bracketBase, bottom: -1, left: -1, borderRight: "none", borderTop: "none", clipPath: "polygon(0 0,0 100%,100% 100%)" }} />
          <div style={{ ...bracketBase, bottom: -1, right: -1, borderLeft: "none", borderTop: "none" }} />
        </>
      )}
      {children}
    </div>
  );
}

// ─── Bar ──────────────────────────────────────────────────────────────────────

interface BarProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  showVal?: boolean;
  height?: number;
  glowColor?: string;
}

export function Bar({ value, max = 100, color = Z.orange, label, showVal = true, height = 10, glowColor }: BarProps) {
  const pct  = Math.max(0, Math.min(100, (value / max) * 100));
  const glow = glowColor ?? color;
  return (
    <div>
      {(label || showVal) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          {label   && <span style={{ fontFamily: Z.fontHud, fontSize: 9, letterSpacing: 2, color: Z.textDim, textTransform: "uppercase" }}>{label}</span>}
          {showVal && <span style={{ fontFamily: Z.fontHud, fontSize: 9, color }}>{value}<span style={{ color: Z.textMuted }}>/{max}</span></span>}
        </div>
      )}
      <div style={{
        height, background: Z.surface3,
        clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}cc, ${color})`,
          boxShadow: `4px 0 12px ${glow}`,
          transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
          clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)",
        }} />
        {[25, 50, 75].map(t => (
          <div key={t} style={{ position: "absolute", left: `${t}%`, top: 0, bottom: 0, width: 1, background: "rgba(0,0,0,0.4)" }} />
        ))}
      </div>
    </div>
  );
}

// ─── SpriteBox ────────────────────────────────────────────────────────────────

interface SpriteBoxProps {
  width?: number;
  height?: number;
  label?: string;
  style?: React.CSSProperties;
  src?: string;
}

export function SpriteBox({ width = 120, height = 140, label = "sprite", style, src }: SpriteBoxProps) {
  const patId = `stripe-${label.replace(/\s+/g, "-")}`;
  if (src) {
    return (
      <div style={{
        width, height, flexShrink: 0,
        clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
        overflow: "hidden", ...style,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div style={{
      width, height, flexShrink: 0,
      background: Z.surface2,
      border: `1px solid ${Z.border2}`,
      clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", ...style,
    }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07 }}>
        <defs>
          <pattern id={patId} patternUnits="userSpaceOnUse" width="12" height="12" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="12" stroke="#888" strokeWidth="4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patId})`} />
      </svg>
      <span style={{ fontFamily: Z.fontHud, fontSize: 8, color: Z.textMuted, letterSpacing: 1, textTransform: "uppercase", position: "relative", textAlign: "center", padding: "0 8px" }}>
        {label}
      </span>
    </div>
  );
}

// ─── Tag ──────────────────────────────────────────────────────────────────────

export function Tag({ children, color = Z.orange }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      fontFamily: Z.fontHud, fontSize: 9, letterSpacing: 2,
      color, background: `${color}18`,
      border: `1px solid ${color}44`,
      padding: "2px 8px",
      clipPath: "polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)",
      textTransform: "uppercase",
      display: "inline-block",
    }}>{children}</span>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function Divider({ accent }: { accent?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0" }}>
      <div style={{ flex: 1, height: 1, background: accent ? `linear-gradient(90deg, ${Z.orange}66, transparent)` : Z.border }} />
      {accent && <div style={{ width: 4, height: 4, background: Z.orange, transform: "rotate(45deg)" }} />}
      {accent && <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${Z.orange}66)` }} />}
    </div>
  );
}

// ─── HUDLabel ─────────────────────────────────────────────────────────────────

export function HUDLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{ fontFamily: Z.fontHud, fontSize: 9, letterSpacing: 2, color: Z.textDim, textTransform: "uppercase", ...style }}>
      {children}
    </span>
  );
}

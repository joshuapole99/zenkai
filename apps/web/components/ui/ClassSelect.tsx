"use client";

import { useState } from "react";
import { Z, Panel, Bar, SpriteBox, Tag, Divider, HUDLabel } from "./_primitives";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CLASSES = [
  {
    id: "striker",
    name: "Striker",
    title: "Iron Fist",
    tag: "STR",
    color: Z.orange,
    desc: "Overwhelm enemies with raw power. High damage, heavy endurance.",
    stats: { STR: 90, AGI: 50, WIS: 30, END: 75 },
    ability: "Dragon Smash",
    passive: "Iron Will",
  },
  {
    id: "ninja",
    name: "Ninja",
    title: "Shadow Step",
    tag: "AGI",
    color: Z.purple,
    desc: "Strike fast, vanish faster. Evasion-based with burst combos.",
    stats: { STR: 45, AGI: 95, WIS: 55, END: 40 },
    ability: "Void Slash",
    passive: "Phase Step",
  },
  {
    id: "monk",
    name: "Monk",
    title: "Stillwater",
    tag: "WIS",
    color: Z.green,
    desc: "Disciplined balance of mind and body. Versatile healer-fighter.",
    stats: { STR: 60, AGI: 65, WIS: 85, END: 65 },
    ability: "Inner Light",
    passive: "Ki Flow",
  },
] as const;

type ClassId = typeof CLASSES[number]["id"];

// ─── StatBar ──────────────────────────────────────────────────────────────────

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <HUDLabel>{label}</HUDLabel>
        <span style={{ fontFamily: Z.fontHud, fontSize: 9, color }}>{value}</span>
      </div>
      <div style={{ height: 3, background: Z.surface3, position: "relative" }}>
        <div style={{ height: "100%", width: `${value}%`, background: color, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
    </div>
  );
}

// ─── ClassCard ────────────────────────────────────────────────────────────────

function ClassCard({ cls, selected, onClick }: { cls: typeof CLASSES[number]; selected: ClassId; onClick: () => void }) {
  const isSelected = selected === cls.id;
  return (
    <button
      onClick={onClick}
      style={{
        position: "relative", cursor: "pointer", flex: 1,
        background: isSelected ? `linear-gradient(160deg, ${cls.color}12, ${Z.surface})` : Z.surface,
        border: `1px solid ${isSelected ? cls.color + "88" : Z.border}`,
        clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
        boxShadow: isSelected ? `0 0 32px ${cls.color}30, 0 0 64px ${cls.color}15` : "none",
        transition: "all 0.3s",
        padding: 24,
        display: "flex", flexDirection: "column", gap: 16,
        textAlign: "left",
        animation: isSelected ? "z-slide-up 0.3s ease" : "none",
        minHeight: 0, overflow: "hidden",
      }}
    >
      {/* Corner accent */}
      {isSelected && (
        <div style={{
          position: "absolute", top: 0, left: 0, width: 40, height: 40,
          background: `linear-gradient(135deg, ${cls.color}60 0%, transparent 60%)`,
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
        }} />
      )}
      {/* Selection dot */}
      {isSelected && (
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <div style={{ width: 8, height: 8, background: cls.color, transform: "rotate(45deg)", boxShadow: `0 0 8px ${cls.color}` }} />
        </div>
      )}

      {/* Sprite */}
      <SpriteBox
        width={160} height={180}
        label={`${cls.name} sprite`}
        style={{ alignSelf: "center", borderColor: isSelected ? cls.color + "55" : Z.border2 }}
      />

      {/* Name block */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontFamily: Z.fontHud, fontSize: 18, fontWeight: 700, color: isSelected ? cls.color : Z.text, letterSpacing: 2 }}>
            {cls.name.toUpperCase()}
          </span>
          <Tag color={cls.color}>{cls.tag}</Tag>
        </div>
        <div style={{ fontFamily: Z.fontHud, fontSize: 9, color: cls.color, letterSpacing: 3, marginBottom: 8 }}>
          {cls.title.toUpperCase()}
        </div>
        <p style={{ fontSize: 13, color: Z.textDim, lineHeight: 1.5, fontFamily: Z.fontBody }}>{cls.desc}</p>
      </div>

      <Divider />

      {/* Stats */}
      <div>
        {Object.entries(cls.stats).map(([k, v]) => (
          <StatBar key={k} label={k} value={v} color={isSelected ? cls.color : Z.textMuted} />
        ))}
      </div>

      <Divider />

      {/* Abilities */}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1, background: Z.surface2, border: `1px solid ${Z.border}`, padding: "8px 10px" }}>
          <HUDLabel style={{ display: "block", marginBottom: 3 }}>Active</HUDLabel>
          <span style={{ fontSize: 12, fontWeight: 600, color: isSelected ? cls.color : Z.text, fontFamily: Z.fontBody }}>{cls.ability}</span>
        </div>
        <div style={{ flex: 1, background: Z.surface2, border: `1px solid ${Z.border}`, padding: "8px 10px" }}>
          <HUDLabel style={{ display: "block", marginBottom: 3 }}>Passive</HUDLabel>
          <span style={{ fontSize: 12, fontWeight: 600, color: Z.textDim, fontFamily: Z.fontBody }}>{cls.passive}</span>
        </div>
      </div>
    </button>
  );
}

// ─── ClassSelect ──────────────────────────────────────────────────────────────

interface ClassSelectProps {
  onSelect: (classId: string) => void;
  defaultSelected?: string;
}

export default function ClassSelect({ onSelect, defaultSelected = "striker" }: ClassSelectProps) {
  const [selected, setSelected] = useState<ClassId>(defaultSelected as ClassId);

  return (
    <div style={{
      width: "100%", minHeight: "100%",
      background: Z.bg,
      display: "flex", flexDirection: "column",
      padding: "24px 24px 32px",
      gap: 24,
    }}>
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <HUDLabel style={{ display: "block", marginBottom: 8, letterSpacing: 6 }}>Phase 01 — Origin</HUDLabel>
        <h1 style={{ fontFamily: Z.fontHud, fontSize: "clamp(18px, 4vw, 28px)", fontWeight: 900, letterSpacing: 6, color: Z.text }}>
          SELECT YOUR CLASS
        </h1>
        <Divider accent />
      </div>

      {/* Cards — stack on mobile, row on md+ */}
      <div style={{ display: "flex", flexDirection: "row", gap: 16, flex: 1, flexWrap: "wrap" }}
        className="flex-col sm:flex-row">
        {CLASSES.map(cls => (
          <ClassCard
            key={cls.id}
            cls={cls}
            selected={selected}
            onClick={() => setSelected(cls.id)}
          />
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => onSelect(selected)}
          style={{
            fontFamily: Z.fontHud, fontSize: 13, letterSpacing: 4, fontWeight: 700,
            padding: "14px 48px", cursor: "pointer",
            background: `linear-gradient(90deg, ${Z.orange}22, ${Z.orange}44)`,
            border: `1px solid ${Z.orange}`,
            color: Z.orange,
            clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)",
            boxShadow: `0 0 24px ${Z.orangeDim}`,
            transition: "all 0.2s",
            animation: "z-pulse-orange 3s ease-in-out infinite",
          }}
        >
          BEGIN JOURNEY
        </button>
      </div>
    </div>
  );
}

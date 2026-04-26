"use client";

import { useState } from "react";
import { Z, Panel, Bar, SpriteBox, Tag, Divider, HUDLabel } from "./_primitives";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CLASS_MAP: Record<string, { name: string; color: string; stats: Record<string, number> }> = {
  striker: { name: "Striker", color: Z.orange,  stats: { STR: 90, AGI: 50, WIS: 30, END: 75 } },
  ninja:   { name: "Ninja",   color: Z.purple,  stats: { STR: 45, AGI: 95, WIS: 55, END: 40 } },
  monk:    { name: "Monk",    color: Z.green,   stats: { STR: 60, AGI: 65, WIS: 85, END: 65 } },
  // legacy DB names
  saiyan:   { name: "Striker", color: Z.orange, stats: { STR: 90, AGI: 50, WIS: 30, END: 75 } },
  shadow:   { name: "Ninja",   color: Z.purple, stats: { STR: 45, AGI: 95, WIS: 55, END: 40 } },
  guardian: { name: "Monk",    color: Z.green,  stats: { STR: 60, AGI: 65, WIS: 85, END: 65 } },
};

const DEFAULT_QUESTS = [
  { id: 1, label: "Complete 50 Push-Ups",     xp: 120, done: true  },
  { id: 2, label: "Run 5km Under 28 Min",      xp: 200, done: false },
  { id: 3, label: "Hold Plank for 2 Min",      xp: 80,  done: false },
  { id: 4, label: "20 Pull-Ups",               xp: 150, done: false },
];

// ─── QuestItem ────────────────────────────────────────────────────────────────

function QuestItem({ quest, onToggle }: { quest: typeof DEFAULT_QUESTS[number]; onToggle: (id: number) => void }) {
  return (
    <button
      onClick={() => onToggle(quest.id)}
      style={{
        display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
        background: quest.done ? `${Z.orange}08` : Z.surface2,
        border: `1px solid ${quest.done ? Z.orange + "33" : Z.border}`,
        cursor: "pointer", transition: "all 0.2s",
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)",
        width: "100%", textAlign: "left",
      }}
    >
      {/* Checkbox */}
      <div style={{
        width: 16, height: 16, flexShrink: 0,
        border: `1.5px solid ${quest.done ? Z.orange : Z.border2}`,
        background: quest.done ? Z.orange : "transparent",
        clipPath: "polygon(2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%, 0 2px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
      }}>
        {quest.done && <span style={{ color: Z.bg, fontSize: 10, fontWeight: 900, lineHeight: 1 }}>✓</span>}
      </div>
      <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: quest.done ? Z.textDim : Z.text, textDecoration: quest.done ? "line-through" : "none", fontFamily: Z.fontBody }}>
        {quest.label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontFamily: Z.fontHud, fontSize: 9, color: quest.done ? Z.orange : Z.textMuted }}>+{quest.xp}</span>
        <HUDLabel style={{ color: quest.done ? Z.orange : Z.textMuted }}>XP</HUDLabel>
      </div>
    </button>
  );
}

// ─── DashboardHUD ─────────────────────────────────────────────────────────────

interface DashboardHUDProps {
  charId?: string;
  characterName?: string;
  level?: number;
  hp?: number;
  maxHp?: number;
  xp?: number;
  maxXp?: number;
  quests?: typeof DEFAULT_QUESTS;
  onBattle?: () => void;
}

export default function DashboardHUD({
  charId = "striker",
  characterName = "RYUU KATO",
  level = 14,
  hp = 340,
  maxHp = 500,
  xp = 2840,
  maxXp = 4000,
  quests: questsProp,
  onBattle,
}: DashboardHUDProps) {
  const cls    = CLASS_MAP[charId] ?? CLASS_MAP.striker;
  const [quests, setQuests] = useState(questsProp ?? DEFAULT_QUESTS);
  const doneCount = quests.filter(q => q.done).length;

  const toggleQuest = (id: number) =>
    setQuests(q => q.map(item => item.id === id ? { ...item, done: !item.done } : item));

  return (
    <div style={{ width: "100%", minHeight: "100%", background: Z.bg, color: Z.text }}>
      {/* Mobile: stacked / Desktop: 3-column grid */}
      <div
        style={{ padding: "16px", display: "grid", gap: 16 }}
        className="grid-cols-1 md:grid-cols-[260px_1fr_220px]"
      >
        {/* ── Left: Character ──────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Panel style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }} glow accent={cls.name === "Ninja" ? "purple" : "orange"}>
            <div style={{ textAlign: "center" }}>
              <HUDLabel style={{ display: "block", marginBottom: 2 }}>Active Class</HUDLabel>
              <div style={{ fontFamily: Z.fontHud, fontSize: 16, fontWeight: 700, color: cls.color, letterSpacing: 3 }}>
                {cls.name.toUpperCase()}
              </div>
            </div>
            <SpriteBox width={160} height={190} label={`${cls.name} avatar`} />
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <div>
                  <div style={{ fontFamily: Z.fontHud, fontSize: 11, fontWeight: 700, letterSpacing: 2, color: Z.text }}>{characterName}</div>
                  <HUDLabel>Warrior</HUDLabel>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: Z.fontHud, fontSize: 18, fontWeight: 900, color: cls.color }}>{level}</div>
                  <HUDLabel>LEVEL</HUDLabel>
                </div>
              </div>
              <Bar value={hp}  max={maxHp}  color={Z.red}      label="HP" height={8} />
              <div style={{ height: 8 }} />
              <Bar value={xp}  max={maxXp}  color={cls.color}  label="XP" height={8} />
            </div>
          </Panel>

          {/* Attributes */}
          <Panel style={{ padding: 16 }}>
            <HUDLabel style={{ display: "block", marginBottom: 12, letterSpacing: 3 }}>ATTRIBUTES</HUDLabel>
            {Object.entries(cls.stats).map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <HUDLabel>{k}</HUDLabel>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 80, height: 2, background: Z.surface3, position: "relative" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${v}%`, background: cls.color }} />
                  </div>
                  <span style={{ fontFamily: Z.fontHud, fontSize: 10, color: cls.color, width: 24, textAlign: "right" }}>{v}</span>
                </div>
              </div>
            ))}
          </Panel>
        </div>

        {/* ── Center: Quests + Enemy ────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Quests */}
          <Panel style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <HUDLabel style={{ display: "block", letterSpacing: 3, marginBottom: 2 }}>Daily Quests</HUDLabel>
                <div style={{ fontFamily: Z.fontHud, fontSize: 11, color: Z.orange }}>
                  {doneCount}/{quests.length}{" "}
                  <span style={{ color: Z.textDim, fontSize: 9 }}>COMPLETE</span>
                </div>
              </div>
              <div style={{ background: `${Z.orange}18`, border: `1px solid ${Z.orange}33`, padding: "4px 12px", clipPath: "polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)" }}>
                <span style={{ fontFamily: Z.fontHud, fontSize: 9, color: Z.orange, letterSpacing: 1 }}>DAY 12</span>
              </div>
            </div>
            <Bar value={doneCount} max={quests.length} color={Z.orange} showVal={false} height={3} />
            <div style={{ height: 14 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {quests.map(q => <QuestItem key={q.id} quest={q} onToggle={toggleQuest} />)}
            </div>
          </Panel>

          {/* Enemy */}
          <Panel style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }} accent="purple">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <HUDLabel style={{ display: "block", letterSpacing: 3, marginBottom: 2 }}>Current Enemy</HUDLabel>
                <div style={{ fontFamily: Z.fontHud, fontSize: 14, fontWeight: 700, color: Z.purple, letterSpacing: 2 }}>SHADOW WOLF</div>
              </div>
              <Tag color={Z.purple}>Rank B</Tag>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
              <SpriteBox width={140} height={160} label="enemy sprite" style={{ borderColor: `${Z.purple}44` }} />
              <div style={{ flex: 1, minWidth: 140 }}>
                <Bar value={620} max={1000} color={Z.purple} label="Enemy HP" height={10} />
                <div style={{ height: 16 }} />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Fast", "Shadow", "Pack"].map(t => <Tag key={t} color={Z.purple}>{t}</Tag>)}
                </div>
                <div style={{ marginTop: 16 }}>
                  <HUDLabel style={{ display: "block", marginBottom: 6 }}>Weakness</HUDLabel>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["Fire", "Light"].map(t => <Tag key={t} color={Z.orange}>{t}</Tag>)}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onBattle}
              style={{
                fontFamily: Z.fontHud, fontSize: 10, letterSpacing: 3,
                padding: "10px 0", cursor: "pointer", width: "100%",
                background: `${Z.purple}22`, border: `1px solid ${Z.purple}66`,
                color: Z.purple,
                clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)",
              }}
            >
              ENGAGE BATTLE →
            </button>
          </Panel>
        </div>

        {/* ── Right: Status ─────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Season */}
          <Panel style={{ padding: 16 }}>
            <HUDLabel style={{ display: "block", letterSpacing: 3, marginBottom: 12 }}>Season Pass</HUDLabel>
            <div style={{ fontFamily: Z.fontHud, fontSize: 28, fontWeight: 900, color: Z.orange, lineHeight: 1 }}>S4</div>
            <HUDLabel style={{ display: "block", marginTop: 2, marginBottom: 12 }}>ARC OF IRON</HUDLabel>
            <Bar value={68} max={100} color={Z.orange} label="Season XP" showVal={false} height={6} />
            <div style={{ marginTop: 8, fontFamily: Z.fontHud, fontSize: 9, color: Z.textDim }}>68% — 3 days left</div>
          </Panel>

          {/* Streak */}
          <Panel style={{ padding: 16 }}>
            <HUDLabel style={{ display: "block", letterSpacing: 3, marginBottom: 12 }}>Streak</HUDLabel>
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
              {[1, 2, 3, 4, 5, 6, 7].map(d => (
                <div key={d} style={{
                  flex: 1, height: 28,
                  background: d <= 5 ? `${Z.orange}55` : Z.surface3,
                  border: `1px solid ${d <= 5 ? Z.orange + "55" : Z.border}`,
                  clipPath: "polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)",
                }} />
              ))}
            </div>
            <div style={{ fontFamily: Z.fontHud, fontSize: 24, fontWeight: 900, color: Z.orange }}>
              5 <span style={{ fontSize: 10, color: Z.textDim, letterSpacing: 2 }}>DAYS</span>
            </div>
          </Panel>

          {/* Recent Gains */}
          <Panel style={{ padding: 16 }}>
            <HUDLabel style={{ display: "block", letterSpacing: 3, marginBottom: 12 }}>Recent Gains</HUDLabel>
            {[
              { label: "Push-Up PR",    val: "+12 reps", color: Z.orange  },
              { label: "5km Time",      val: "−1:23 min", color: Z.green  },
              { label: "Body Weight",   val: "−0.8 kg",  color: Z.purple },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: Z.textDim, fontFamily: Z.fontBody }}>{item.label}</span>
                <span style={{ fontFamily: Z.fontHud, fontSize: 11, color: item.color }}>{item.val}</span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}

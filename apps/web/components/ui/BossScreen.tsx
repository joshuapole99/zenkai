"use client";

import { useState, useEffect, useRef } from "react";
import { Z, Panel, Bar, SpriteBox, Tag, Divider, HUDLabel } from "./_primitives";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CLASS_MAP: Record<string, { name: string; color: string }> = {
  striker:  { name: "Striker", color: Z.orange  },
  ninja:    { name: "Ninja",   color: Z.purple  },
  monk:     { name: "Monk",    color: Z.green   },
  saiyan:   { name: "Striker", color: Z.orange  },
  shadow:   { name: "Ninja",   color: Z.purple  },
  guardian: { name: "Monk",    color: Z.green   },
};

const ATTACKS = [
  { id: "strike",   label: "Dragon Strike",  cost: 0,  color: Z.orange, dmg: [85,  140] as [number,number], ult: false },
  { id: "combo",    label: "Rush Combo",      cost: 20, color: Z.purple, dmg: [120, 200] as [number,number], ult: false },
  { id: "heal",     label: "Recover",         cost: 30, color: Z.green,  dmg: [-80, -40] as [number,number], ult: false },
  { id: "ultimate", label: "ZENKAI BREAK",    cost: 50, color: Z.orange, dmg: [250, 400] as [number,number], ult: true  },
] as const;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface BossScreenProps {
  charId?: string;
  characterName?: string;
  bossName?: string;
  bossSprite?: string;
  bossMaxHp?: number;
  playerMaxHp?: number;
  onVictory?: () => void;
  onDefeat?: () => void;
}

// ─── BossScreen ───────────────────────────────────────────────────────────────

export default function BossScreen({
  charId = "striker",
  characterName = "RYUU KATO",
  bossName = "SHADOW OVERLORD",
  bossSprite,
  bossMaxHp = 4000,
  playerMaxHp = 500,
  onVictory,
  onDefeat,
}: BossScreenProps) {
  const cls = CLASS_MAP[charId] ?? CLASS_MAP.striker;

  const [bossHp,     setBossHp]     = useState(Math.floor(bossMaxHp * 0.8));
  const [playerHp,   setPlayerHp]   = useState(Math.floor(playerMaxHp * 0.96));
  const [energy,     setEnergy]     = useState(60);
  const [turn,       setTurn]       = useState<"player" | "boss">("player");
  const [dmgPopup,   setDmgPopup]   = useState<{ val: number; color: string } | null>(null);
  const [bossShake,  setBossShake]  = useState(false);
  const [flash,      setFlash]      = useState<"orange" | "red" | "green" | null>(null);
  const [log,        setLog]        = useState(["The boss awakens…", "Battle begins!"]);
  const [chargePct,  setChargePct]  = useState(0);

  const bossHpPct  = (bossHp / bossMaxHp) * 100;
  const bossPhase  = bossHpPct > 60 ? 1 : bossHpPct > 25 ? 2 : 3;

  // Charge bar ticks up passively
  useEffect(() => {
    const iv = setInterval(() => setChargePct(p => Math.min(100, p + 0.8)), 100);
    return () => clearInterval(iv);
  }, []);

  // Win / lose detection
  useEffect(() => {
    if (bossHp   <= 0) onVictory?.();
    if (playerHp <= 0) onDefeat?.();
  }, [bossHp, playerHp, onVictory, onDefeat]);

  const addLog = (msg: string) => setLog(l => [msg, ...l.slice(0, 4)]);

  const doAttack = (atk: typeof ATTACKS[number]) => {
    if (turn !== "player") return;
    if (energy < atk.cost) { addLog("Not enough energy!"); return; }

    const dmg    = Math.floor(Math.random() * (atk.dmg[1] - atk.dmg[0]) + atk.dmg[0]);
    const isHeal = dmg < 0;

    setEnergy(e => Math.max(0, e - atk.cost));

    if (isHeal) {
      setPlayerHp(h => Math.min(playerMaxHp, h + Math.abs(dmg)));
      setFlash("green");
      addLog(`Recovered ${Math.abs(dmg)} HP!`);
    } else {
      setBossHp(h => Math.max(0, h - dmg));
      setBossShake(true);
      setDmgPopup({ val: dmg, color: atk.ult ? Z.orange : Z.text });
      setFlash("orange");
      addLog(`${atk.label}: ${dmg} damage!`);
    }

    setTimeout(() => { setBossShake(false); setDmgPopup(null); setFlash(null); }, 800);

    // Boss counter-attack
    setTimeout(() => {
      setTurn("boss");
      setTimeout(() => {
        const bossDmg = Math.floor(Math.random() * 60 + 40);
        setPlayerHp(h => Math.max(0, h - bossDmg));
        setFlash("red");
        addLog(`${bossName}: ${bossDmg} damage!`);
        setEnergy(e => Math.min(100, e + 15));
        setTimeout(() => { setFlash(null); setTurn("player"); }, 600);
      }, 900);
    }, 800);
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", background: Z.bg }}>

      {/* Screen flash overlay */}
      {flash && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 50, pointerEvents: "none",
          background: flash === "orange" ? `${Z.orange}22` : flash === "red" ? `${Z.red}22` : `${Z.green}22`,
          animation: "z-screen-flash 0.6s ease forwards",
        }} />
      )}

      {/* Background */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0a0308 0%, #08050f 100%)" }}>
        {/* Perspective grid floor */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
          backgroundImage: `linear-gradient(${Z.purple}15 1px, transparent 1px), linear-gradient(90deg, ${Z.purple}15 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(0deg, rgba(0,0,0,0.6), transparent)",
        }} />
      </div>

      {/* ── Boss HP bar ──────────────────────────────────────────────────────── */}
      <div style={{ padding: "12px clamp(16px, 4vw, 40px)", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div>
              <div style={{ fontFamily: Z.fontHud, fontSize: 16, fontWeight: 700, color: Z.red, letterSpacing: 3 }}>{bossName}</div>
              <Tag color={Z.purple}>Phase {bossPhase}{bossPhase === 3 ? " — ENRAGED" : ""}</Tag>
            </div>
            <div style={{ fontFamily: Z.fontHud, fontSize: 22, fontWeight: 900, color: Z.red }}>{bossHp.toLocaleString()}</div>
          </div>
          <Bar value={bossHp} max={bossMaxHp} color={bossPhase === 3 ? Z.orange : Z.red} glowColor={Z.red} showVal={false} height={14} />
        </div>
      </div>

      {/* ── Boss sprite ──────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 10 }}>
        {/* Damage popup */}
        {dmgPopup && (
          <div style={{
            position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
            fontFamily: Z.fontHud, fontSize: 48, fontWeight: 900, color: dmgPopup.color,
            textShadow: `0 0 20px ${dmgPopup.color}`,
            animation: "z-damage-float 0.8s ease forwards",
            pointerEvents: "none", zIndex: 20,
          }}>
            −{dmgPopup.val}
          </div>
        )}
        <div style={{ animation: bossShake ? "z-shake 0.5s ease" : "z-boss-idle 4s ease-in-out infinite", display: "inline-block" }}>
          {bossSprite
            ? <img src={bossSprite} alt={bossName} style={{ width: 220, height: 280, objectFit: "contain" }} />
            : <SpriteBox
                width={220} height={280}
                label="boss sprite"
                style={{
                  borderColor: bossPhase === 3 ? Z.orange + "88" : Z.purple + "55",
                  boxShadow: bossPhase === 3 ? `0 0 60px ${Z.orange}44, 0 0 120px ${Z.orange}22` : `0 0 40px ${Z.purple}33`,
                }}
              />
          }
        </div>
      </div>

      {/* ── Battle log ───────────────────────────────────────────────────────── */}
      <div style={{ padding: "0 clamp(16px, 4vw, 40px)", position: "relative", zIndex: 10, marginBottom: 8 }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          {log.slice(0, 3).map((msg, i) => (
            <div key={i} style={{ fontFamily: Z.fontBody, fontSize: 12, color: i === 0 ? Z.textDim : Z.textMuted, marginBottom: 2, transition: "all 0.3s" }}>
              {i === 0 ? "▶ " : "  "}{msg}
            </div>
          ))}
        </div>
      </div>

      {/* ── Player HUD + actions ─────────────────────────────────────────────── */}
      <div style={{ padding: "0 clamp(16px, 4vw, 40px) 24px", position: "relative", zIndex: 10 }}>
        <Panel style={{ padding: "20px 24px", maxWidth: 700, margin: "0 auto" }}>
          {/* Top accent line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${cls.color}88, transparent)` }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16 }} className="grid-cols-1 sm:grid-cols-2">
            {/* Player stats */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <div style={{ fontFamily: Z.fontHud, fontSize: 11, fontWeight: 700, color: Z.text, letterSpacing: 2 }}>{characterName}</div>
                <Tag color={cls.color}>{cls.name}</Tag>
              </div>
              <Bar value={playerHp} max={playerMaxHp} color={playerHp < 150 ? Z.red : Z.green} label="HP" height={10} />
              <div style={{ height: 8 }} />
              <Bar value={energy} max={100} color={cls.color} label="Energy" height={6} />
            </div>

            {/* Charge + turn indicator */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <HUDLabel style={{ letterSpacing: 2 }}>Battle Charge</HUDLabel>
                <span style={{ fontFamily: Z.fontHud, fontSize: 9, color: cls.color }}>{Math.floor(chargePct)}%</span>
              </div>
              <Bar value={chargePct} max={100} color={cls.color} showVal={false} height={8} />
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                <div style={{ fontFamily: Z.fontHud, fontSize: 9, letterSpacing: 1, color: turn === "player" ? Z.orange : Z.textMuted, background: `${turn === "player" ? Z.orange : Z.border}18`, border: `1px solid ${turn === "player" ? Z.orange + "55" : Z.border}`, padding: "4px 10px" }}>YOUR TURN</div>
                <div style={{ fontFamily: Z.fontHud, fontSize: 9, letterSpacing: 1, color: turn === "boss"   ? Z.red    : Z.textMuted, background: `${turn === "boss"   ? Z.red    : Z.border}18`, border: `1px solid ${turn === "boss"   ? Z.red    + "55" : Z.border}`, padding: "4px 10px" }}>BOSS TURN</div>
              </div>
            </div>
          </div>

          <Divider />

          {/* Attack buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            {ATTACKS.map(atk => {
              const canUse = turn === "player" && energy >= atk.cost;
              return (
                <button
                  key={atk.id}
                  onClick={() => doAttack(atk)}
                  disabled={!canUse}
                  style={{
                    flex: atk.ult ? 1.5 : 1, minWidth: 80,
                    fontFamily: Z.fontHud, fontSize: atk.ult ? 10 : 9,
                    letterSpacing: atk.ult ? 2 : 1,
                    padding: atk.ult ? "12px 8px" : "10px 8px",
                    cursor: canUse ? "pointer" : "not-allowed",
                    background: atk.ult ? `linear-gradient(90deg, ${Z.orange}33, ${Z.purple}33)` : `${atk.color}15`,
                    border: `1px solid ${canUse ? atk.color + "88" : Z.border}`,
                    color: canUse ? atk.color : Z.textMuted,
                    clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)",
                    boxShadow: atk.ult && canUse ? `0 0 20px ${Z.orange}33` : "none",
                    transition: "all 0.15s",
                    opacity: canUse ? 1 : 0.4,
                  }}
                >
                  {atk.label}
                  {atk.cost > 0 && <div style={{ fontSize: 8, color: Z.textDim, marginTop: 2 }}>{atk.cost} EN</div>}
                </button>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Z, Panel, SpriteBox, HUDLabel } from "./_primitives";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DialogueLine {
  npc: string;
  text: string;
  portrait?: string;
  npcImage?: string;
  backgroundImage?: string;
}

// ─── Default dialogue ─────────────────────────────────────────────────────────

const DEFAULT_DIALOGUE: DialogueLine[] = [
  {
    npc: "Master Kairon",
    text: "You have grown stronger, young warrior. But the darkness beyond the Iron Gate… it does not sleep.",
    portrait: "elder npc portrait",
  },
  {
    npc: "Master Kairon",
    text: "Train your body. Forge your will. The Shadow Realm will test every fibre of your being.",
    portrait: "elder npc portrait",
  },
  {
    npc: "Mysterious Voice",
    text: "Heh… the old man knows nothing of what truly lurks ahead. Are you ready to face your limits?",
    portrait: "unknown npc portrait",
  },
];

// ─── StoryScreen ──────────────────────────────────────────────────────────────

interface StoryScreenProps {
  dialogue?: DialogueLine[];
  onComplete?: () => void;
}

export default function StoryScreen({ dialogue = DEFAULT_DIALOGUE, onComplete }: StoryScreenProps) {
  const [lineIdx,   setLineIdx]   = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [done,      setDone]      = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const line = dialogue[lineIdx];

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setDisplayed(line.text.slice(0, i));
      if (i >= line.text.length) {
        clearInterval(timerRef.current!);
        setDone(true);
      }
    }, 28);
    return () => clearInterval(timerRef.current!);
  }, [lineIdx, line.text]);

  const handleNext = () => {
    if (!done) {
      clearInterval(timerRef.current!);
      setDisplayed(line.text);
      setDone(true);
      return;
    }
    if (lineIdx < dialogue.length - 1) {
      setLineIdx(i => i + 1);
    } else {
      onComplete?.();
      setLineIdx(0);
    }
  };

  const isLast = lineIdx === dialogue.length - 1;

  return (
    <div style={{ width: "100%", minHeight: "100vh", position: "relative", overflow: "hidden", background: Z.bg }}>

      {/* Background layer */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0a0614 0%, #080b18 40%, #0a0614 100%)" }} />

      {/* BG art / image */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {line.backgroundImage
          ? <img src={line.backgroundImage} alt="scene background" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} />
          : <SpriteBox
              width={900} height={500} label="scene background"
              style={{ opacity: 0.35, width: "100%", height: "100%", clipPath: "none", border: "none", maxWidth: "none", maxHeight: "none" }}
            />
        }
      </div>

      {/* Atmosphere overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(9,9,15,0.98) 0%, rgba(9,9,15,0.6) 40%, rgba(9,9,15,0.3) 100%)" }} />

      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left:  `${10 + (i * 7.3)  % 80}%`,
          top:   `${20 + (i * 11.7) % 60}%`,
          width: 2, height: 2,
          background: i % 3 === 0 ? Z.orange : Z.purple,
          borderRadius: "50%",
          opacity: 0.3 + i * 0.05,
          animation: `z-boss-idle ${3 + i * 0.4}s ease-in-out infinite`,
          animationDelay: `${i * 0.3}s`,
          pointerEvents: "none",
        }} />
      ))}

      {/* NPC portrait */}
      <div style={{ position: "absolute", left: "clamp(20px, 5vw, 80px)", bottom: 220, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, zIndex: 10 }}>
        {line.npcImage
          ? <img src={line.npcImage} alt={line.npc} style={{ width: 160, height: 220, objectFit: "cover", clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)", boxShadow: `0 0 40px ${Z.orangeGlow}` }} />
          : <SpriteBox width={160} height={220} label={line.portrait ?? "npc portrait"} style={{ borderColor: `${Z.orange}44`, boxShadow: `0 0 40px ${Z.orangeGlow}` }} />
        }
        <div style={{ fontFamily: Z.fontHud, fontSize: 9, color: Z.orange, letterSpacing: 2 }}>
          {line.npc.toUpperCase()}
        </div>
      </div>

      {/* Dialogue box */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 clamp(16px, 4vw, 40px) 32px", zIndex: 10 }}>
        <Panel style={{ padding: "24px 32px 28px", background: "rgba(9,9,15,0.96)" }} noBrackets>
          {/* Top accent line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${Z.orange}88, ${Z.purple}66, transparent)` }} />

          {/* Speaker name tab */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "inline-block", background: `${Z.orange}18`, border: `1px solid ${Z.orange}55`, padding: "6px 16px", clipPath: "polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%)" }}>
              <span style={{ fontFamily: Z.fontHud, fontSize: 11, letterSpacing: 3, color: Z.orange }}>
                {line.npc.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Typewriter text */}
          <div style={{ position: "relative", minHeight: 60 }}>
            <p style={{ fontFamily: Z.fontBody, fontSize: "clamp(15px, 2.5vw, 18px)", lineHeight: 1.7, color: Z.text, fontWeight: 400, maxWidth: 800 }}>
              {displayed}
              {!done && (
                <span style={{
                  borderRight: `2px solid ${Z.orange}`,
                  marginLeft: 1,
                  animation: "z-cursor 0.7s step-end infinite",
                }} />
              )}
            </p>
          </div>

          {/* Progress dots + Next button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {dialogue.map((_, i) => (
                <div key={i} style={{ width: 20, height: 3, background: i === lineIdx ? Z.orange : Z.border2 }} />
              ))}
            </div>
            <button
              onClick={handleNext}
              style={{
                fontFamily: Z.fontHud, fontSize: 10, letterSpacing: 3,
                padding: "10px 24px", cursor: "pointer",
                background: done ? `${Z.orange}22` : Z.surface3,
                border: `1px solid ${done ? Z.orange : Z.border}`,
                color: done ? Z.orange : Z.textDim,
                clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)",
                animation: done ? "z-pulse-orange 2s infinite" : "none",
                transition: "all 0.2s",
              }}
            >
              {!done ? "SKIP ▸▸" : isLast ? "CONTINUE ▶" : "NEXT ▶"}
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

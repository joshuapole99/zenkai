"use client";

import { useState, useEffect } from "react";

type Props = {
  completionText: string;
  xpGained: number;
  newLevel: number;
  nextChapterTitle: string | null;
  isZenkaiBoost: boolean;
  onContinue: () => void;
};

export default function CompletionScreen({
  completionText,
  xpGained,
  newLevel,
  nextChapterTitle,
  isZenkaiBoost,
  onContinue,
}: Props) {
  const [displayedXp, setDisplayedXp] = useState(0);
  const [visible, setVisible] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    // Small mount delay for entrance feel
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    let current = 0;
    const step = Math.ceil(xpGained / 25);
    const interval = setInterval(() => {
      current = Math.min(current + step, xpGained);
      setDisplayedXp(current);
      if (current >= xpGained) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [visible, xpGained]);

  async function handleContinue() {
    if (advancing) return;
    setAdvancing(true);
    if (!isZenkaiBoost) {
      await fetch("/api/story/advance", { method: "POST" });
    }
    onContinue();
  }

  const radialGlow = isZenkaiBoost
    ? "radial-gradient(ellipse at 50% 20%, rgba(255,215,0,0.12) 0%, transparent 65%)"
    : "radial-gradient(ellipse at 50% 20%, rgba(124,58,237,0.15) 0%, transparent 65%)";

  const xpColor = isZenkaiBoost ? "#FFD700" : "#FF6B35";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{
        background: "#0a0a0a",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: radialGlow }} />

      <div className="relative text-center max-w-sm w-full">

        {/* XP counter */}
        <div className="mb-6">
          <p
            className="font-black mb-1"
            style={{
              color: xpColor,
              fontSize: "clamp(3rem, 15vw, 5rem)",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
              transition: "transform 0.1s",
            }}
          >
            +{displayedXp}
          </p>
          <p className="text-sm font-bold text-gray-500 tracking-widest uppercase">XP Earned</p>
        </div>

        {/* Power level badge */}
        <div
          className="inline-block px-4 py-2 rounded-full mb-8"
          style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)" }}
        >
          <p className="text-sm font-black text-white">Power Level {newLevel}</p>
        </div>

        {/* Master Kael completion quote */}
        <p className="text-gray-400 text-sm leading-relaxed mb-8 italic">
          &ldquo;{completionText}&rdquo;
        </p>

        {/* Next chapter teaser */}
        {nextChapterTitle ? (
          <div
            className="rounded-xl px-4 py-3 mb-8"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs text-gray-600 mb-1 tracking-widest uppercase">Next chapter</p>
            <p className="text-sm font-bold text-white">{nextChapterTitle}</p>
          </div>
        ) : (
          <div className="mb-8">
            <p className="text-xs text-gray-600">Arc 1 complete. More story coming.</p>
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={advancing}
          className="w-full py-3.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
        >
          {advancing ? "..." : "Continue"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

type Props = {
  day: number;
  title: string;
  intro: string;
  isZenkaiBoost: boolean;
  onAccept: () => void;
};

export default function StoryScreen({ day, title, intro, isZenkaiBoost, onAccept }: Props) {
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < intro.length) {
        setTypedText(intro.slice(0, i + 1));
        i++;
      } else {
        setTypingDone(true);
        clearInterval(interval);
      }
    }, 22);
    return () => clearInterval(interval);
  }, [intro]);

  function revealAll() {
    if (!typingDone) {
      setTypedText(intro);
      setTypingDone(true);
    }
  }

  async function handleAccept() {
    if (accepting) return;
    setAccepting(true);
    await fetch("/api/story/read", { method: "POST" });
    onAccept();
  }

  const accent = isZenkaiBoost ? "#FFD700" : "#FF6B35";
  const gradientBg = isZenkaiBoost
    ? "linear-gradient(180deg, rgba(255,215,0,0.15) 0%, transparent 55%)"
    : "linear-gradient(180deg, rgba(255,107,53,0.15) 0%, transparent 55%)";
  const borderColor = isZenkaiBoost ? "rgba(255,215,0,0.2)" : "rgba(255,107,53,0.2)";
  const chipBg = isZenkaiBoost ? "rgba(255,215,0,0.08)" : "rgba(255,107,53,0.08)";
  const chapterLabel = isZenkaiBoost ? "Zenkai Boost" : `Day ${day}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#0a0a0a" }}>
      {/* Top gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: gradientBg }} />

      {/* Top area — chapter info */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 text-center">
        <span
          className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-5"
          style={{ background: chipBg, color: accent, border: `1px solid ${borderColor}` }}
        >
          {chapterLabel}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight max-w-xs">
          {title}
        </h1>
        {isZenkaiBoost && (
          <p className="text-xs text-gray-600 mt-3 tracking-wide">You fell. Now rise harder.</p>
        )}
      </div>

      {/* RPG dialogue box */}
      <div className="relative mx-4 mb-6">
        <div
          className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${borderColor}` }}
        >
          {/* Speaker chip */}
          <div
            className="absolute -top-3.5 left-5 px-3 py-1 rounded-full text-xs font-black"
            style={{ background: "#0a0a0a", border: `1px solid ${borderColor}`, color: accent }}
          >
            Master Kael
          </div>

          {/* Typewriter text */}
          <button
            className="w-full text-left mt-2 mb-5"
            onClick={revealAll}
            style={{ minHeight: "88px" }}
          >
            <p className="text-sm text-gray-300 leading-relaxed">
              {typedText}
              {!typingDone && (
                <span
                  className="inline-block w-0.5 h-4 ml-0.5 align-middle cursor-blink"
                  style={{ background: accent }}
                />
              )}
            </p>
            {!typingDone && (
              <p className="text-xs text-gray-700 mt-3">tap to reveal</p>
            )}
          </button>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="flex-1 py-3.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{
                background: isZenkaiBoost
                  ? "linear-gradient(135deg, #FFD700, #FF6B35)"
                  : "linear-gradient(135deg, #FF6B35, #7C3AED)",
              }}
            >
              {accepting ? "..." : "Accept Quest"}
            </button>
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="text-xs text-gray-700 hover:text-gray-500 transition-colors px-2 py-2 disabled:opacity-40"
            >
              skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

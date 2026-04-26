"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AvatarSVG,
  type AvatarConfig,
  SKIN_TONES,
  HAIR_COLORS,
  EYE_COLORS,
  HAIR_STYLE_LABELS,
} from "@/components/AvatarSVG";

type Props = {
  initialConfig: AvatarConfig;
  characterClass: string;
  characterName: string;
};

export default function CharacterCreatorClient({ initialConfig, characterClass, characterName }: Props) {
  const router = useRouter();
  const [config, setConfig] = useState<AvatarConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => router.push("/dashboard"), 800);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-xl font-black text-white">Character Creator</h1>
        </div>

        {/* Preview */}
        <div
          className="rounded-2xl p-6 mb-6 flex flex-col items-center"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="w-32 h-44 mb-3">
            <AvatarSVG config={config} characterClass={characterClass} />
          </div>
          <p className="text-sm font-black text-white">{characterName}</p>
          <p className="text-xs text-gray-600 mt-1">{HAIR_STYLE_LABELS[config.hairStyle - 1]} · {characterClass}</p>
        </div>

        {/* Hair style */}
        <Section title="Hair Style">
          <div className="flex gap-2 flex-wrap">
            {HAIR_STYLE_LABELS.map((label, i) => {
              const active = config.hairStyle === i + 1;
              return (
                <button
                  key={i}
                  onClick={() => set("hairStyle", i + 1)}
                  className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: active ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.03)",
                    border: active ? "1px solid rgba(255,107,53,0.5)" : "1px solid rgba(255,255,255,0.06)",
                    color: active ? "#FF6B35" : "#6b7280",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Hair color */}
        <Section title="Hair Color">
          <div className="flex gap-2 flex-wrap">
            {HAIR_COLORS.map((color) => (
              <ColorDot
                key={color}
                color={color}
                active={config.hairColor === color}
                onClick={() => set("hairColor", color)}
              />
            ))}
          </div>
        </Section>

        {/* Skin tone */}
        <Section title="Skin Tone">
          <div className="flex gap-2 flex-wrap">
            {SKIN_TONES.map((color) => (
              <ColorDot
                key={color}
                color={color}
                active={config.skinTone === color}
                onClick={() => set("skinTone", color)}
              />
            ))}
          </div>
        </Section>

        {/* Eye color */}
        <Section title="Eye Color">
          <div className="flex gap-2 flex-wrap">
            {EYE_COLORS.map((color) => (
              <ColorDot
                key={color}
                color={color}
                active={config.eyeColor === color}
                onClick={() => set("eyeColor", color)}
              />
            ))}
          </div>
        </Section>

        {/* Save */}
        <button
          onClick={save}
          disabled={saving || saved}
          className="w-full py-4 rounded-xl text-sm font-black transition-all active:scale-[0.98] mt-2"
          style={{
            background: saved ? "rgba(34,197,94,0.15)" : "linear-gradient(135deg, #FF6B35, #7C3AED)",
            color: saved ? "#22c55e" : "#fff",
            opacity: saving ? 0.6 : 1,
            border: saved ? "1px solid rgba(34,197,94,0.3)" : "none",
          }}
        >
          {saved ? "Saved — returning to dashboard..." : saving ? "Saving..." : "Save Character"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5 mb-4"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">{title}</p>
      {children}
    </div>
  );
}

function ColorDot({ color, active, onClick }: { color: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full transition-all"
      style={{
        width: "32px",
        height: "32px",
        background: color,
        border: active ? "3px solid #FF6B35" : "2px solid rgba(255,255,255,0.1)",
        boxShadow: active ? "0 0 0 1px #FF6B35" : "none",
        transform: active ? "scale(1.15)" : "scale(1)",
      }}
    />
  );
}

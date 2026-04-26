"use client";

import { useEffect, useRef, useState } from "react";
import type { EnemyData, EnemyType } from "@/lib/enemies";

type Props = {
  enemy: EnemyData;
  questsTotal: number;
  questsDone: number;
};

export default function EnemyCard({ enemy, questsTotal, questsDone }: Props) {
  const defeated = questsDone >= questsTotal;
  const prevDoneRef = useRef(questsDone);
  const [hit, setHit] = useState(false);
  const [showVanquished, setShowVanquished] = useState(defeated);

  useEffect(() => {
    if (questsDone > prevDoneRef.current) {
      setHit(true);
      setTimeout(() => setHit(false), 400);
    }
    prevDoneRef.current = questsDone;
  }, [questsDone]);

  useEffect(() => {
    if (defeated && !showVanquished) {
      const t = setTimeout(() => setShowVanquished(true), 500);
      return () => clearTimeout(t);
    }
  }, [defeated]);

  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(10,10,10,0.95), ${enemy.color}08)`,
        border: `1px solid ${enemy.color}25`,
        filter: defeated ? "grayscale(0.7)" : "none",
        transition: "filter 0.6s ease",
        animation: hit ? "enemyHit 0.4s ease" : "none",
      }}
    >
      {/* Faint glow top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${enemy.color}60, transparent)` }}
      />

      <div className="flex items-center gap-4">
        {/* Enemy portrait */}
        <div
          className="relative flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
          style={{
            width: "64px",
            height: "84px",
            background: `${enemy.color}10`,
            border: `1px solid ${enemy.color}30`,
          }}
        >
          <EnemySVG type={enemy.type} color={enemy.color} defeated={defeated} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: enemy.color }}>
              {enemy.title}
            </p>
          </div>
          <p className="text-base font-black text-white leading-tight mb-1">{enemy.name}</p>
          <p className="text-xs text-gray-600 leading-snug mb-3">{enemy.flavor}</p>

          {/* HP bar — segments */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-700 mr-1">HP</span>
            {Array.from({ length: questsTotal }).map((_, i) => {
              const depleted = i < questsDone;
              return (
                <div
                  key={i}
                  className="rounded-sm transition-all duration-500"
                  style={{
                    width: "28px",
                    height: "6px",
                    background: depleted ? "rgba(255,255,255,0.06)" : enemy.color,
                    boxShadow: depleted ? "none" : `0 0 6px ${enemy.color}80`,
                    transform: depleted ? "scaleX(0.85)" : "scaleX(1)",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Vanquished overlay */}
      {showVanquished && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl"
          style={{
            background: "rgba(0,0,0,0.55)",
            animation: "vanquishedIn 0.4s ease",
          }}
        >
          <div className="text-center">
            <p
              className="text-lg font-black tracking-widest uppercase"
              style={{ color: enemy.color, textShadow: `0 0 20px ${enemy.color}` }}
            >
              Vanquished
            </p>
            <p className="text-xs text-gray-500 mt-0.5">+100 XP earned</p>
          </div>
        </div>
      )}
    </div>
  );
}

function EnemySVG({ type, color, defeated }: { type: EnemyType; color: string; defeated: boolean }) {
  const opacity = defeated ? 0.35 : 1;
  return (
    <svg
      viewBox="0 0 64 84"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", display: "block", opacity, transition: "opacity 0.6s" }}
    >
      {type === "grunt" && <GruntShape color={color} />}
      {type === "shadow_warrior" && <ShadowWarriorShape color={color} />}
      {type === "corrupt_monk" && <CorruptMonkShape color={color} />}
    </svg>
  );
}

function GruntShape({ color }: { color: string }) {
  return (
    <g>
      {/* Body armor */}
      <path d="M18,50 L14,84 L50,84 L46,50 Z" fill="#111827" />
      {/* Chest plate */}
      <rect x="20" y="48" width="24" height="22" rx="2" fill="#1f2937" />
      {/* Chest ridge */}
      <rect x="30" y="50" width="4" height="18" rx="1" fill={color} opacity="0.5" />
      {/* Shoulders (spiked) */}
      <polygon points="8,56 18,48 18,64" fill="#1f2937" />
      <polygon points="56,56 46,48 46,64" fill="#1f2937" />
      <circle cx="8" cy="54" r="3" fill={color} opacity="0.7" />
      <circle cx="56" cy="54" r="3" fill={color} opacity="0.7" />
      {/* Neck */}
      <rect x="26" y="38" width="12" height="13" fill="#111827" />
      {/* Head (angular helmet) */}
      <rect x="16" y="14" width="32" height="28" rx="3" fill="#111827" />
      {/* Helmet top ridge */}
      <path d="M20,14 L32,6 L44,14" fill="#1f2937" />
      {/* Visor slit */}
      <rect x="19" y="25" width="26" height="5" rx="2" fill={color} opacity="0.9"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      {/* Chin guard */}
      <rect x="22" y="38" width="20" height="5" rx="2" fill="#1f2937" />
    </g>
  );
}

function ShadowWarriorShape({ color }: { color: string }) {
  return (
    <g>
      {/* Cloak / shadow mass */}
      <path d="M32,20 L4,84 L60,84 Z" fill="#0d0d1a" opacity="0.9" />
      {/* Body core */}
      <path d="M22,38 L18,84 L46,84 L42,38 Z" fill="#111827" />
      {/* Energy tendrils */}
      <path d="M14,70 Q6,55 12,40" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      <path d="M50,72 Q58,56 54,38" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      {/* Head void */}
      <ellipse cx="32" cy="22" rx="16" ry="18" fill="#0d0d1a" />
      {/* Aura ring */}
      <ellipse cx="32" cy="22" rx="18" ry="20" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      {/* Glowing eyes */}
      <ellipse cx="26" cy="20" rx="4.5" ry="5.5" fill={color} opacity="0.95"
        style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
      <ellipse cx="38" cy="20" rx="4.5" ry="5.5" fill={color} opacity="0.95"
        style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
      {/* Pupils */}
      <ellipse cx="26" cy="20" rx="2" ry="2.5" fill="#0d0d1a" />
      <ellipse cx="38" cy="20" rx="2" ry="2.5" fill="#0d0d1a" />
    </g>
  );
}

function CorruptMonkShape({ color }: { color: string }) {
  return (
    <g>
      {/* Robe */}
      <path d="M20,46 L10,84 L54,84 L48,46 Z" fill="#0f1f0f" />
      {/* Robe layers */}
      <path d="M24,52 L16,84 L48,84 L44,52 Z" fill="#162116" />
      {/* Staff */}
      <rect x="52" y="18" width="4" height="66" rx="2" fill="#1f2f1f" />
      {/* Staff orb */}
      <circle cx="54" cy="18" r="7" fill="none" stroke={color} strokeWidth="1.5"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      <circle cx="54" cy="18" r="3" fill={color} opacity="0.8"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      {/* Hood */}
      <ellipse cx="30" cy="28" rx="18" ry="21" fill="#0f1f0f" />
      {/* Face shadow */}
      <ellipse cx="30" cy="30" rx="12" ry="14" fill="#080808" />
      {/* Eyes — sunken glow */}
      <circle cx="25" cy="28" r="4" fill={color} opacity="0.85"
        style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
      <circle cx="35" cy="28" r="4" fill={color} opacity="0.85"
        style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
      <circle cx="25" cy="28" r="1.8" fill="#080808" />
      <circle cx="35" cy="28" r="1.8" fill="#080808" />
      {/* Neck/collar */}
      <rect x="24" y="44" width="14" height="6" rx="1" fill="#0f1f0f" />
    </g>
  );
}

export type AvatarConfig = {
  hairStyle: number; // 1–5
  hairColor: string;
  skinTone: string;
  eyeColor: string;
};

export const SKIN_TONES = ["#FDDCB5", "#F5C08A", "#D4935E", "#A0642B", "#6B3B1C"];
export const HAIR_COLORS = ["#1A1A1A", "#4A2C10", "#FF6B35", "#7C3AED", "#E8E8E8", "#1A6BD4", "#FF69B4", "#C8A020"];
export const EYE_COLORS = ["#1A1A1A", "#1E5FAD", "#2E8B57", "#8B4513", "#9B30FF", "#CC3333"];

export const HAIR_STYLE_LABELS = ["Spiky", "Clean Cut", "Long", "Wild", "Side Swept"];

export const DEFAULT_AVATAR: AvatarConfig = {
  hairStyle: 1,
  hairColor: "#1A1A1A",
  skinTone: "#FDDCB5",
  eyeColor: "#1A1A1A",
};

const CLASS_OUTFIT: Record<string, string> = {
  saiyan: "#FF6B35",
  shadow: "#7C3AED",
  guardian: "#4B5563",
};

function HairBack({ style, color }: { style: number; color: string }) {
  if (style === 1) return <ellipse cx="50" cy="34" rx="23" ry="15" fill={color} />;

  if (style === 2)
    return (
      <g fill={color}>
        <path d="M26,46 Q26,22 50,20 Q74,22 74,46 Q62,32 50,32 Q38,32 26,46Z" />
      </g>
    );

  if (style === 3)
    return (
      <g fill={color}>
        <path d="M26,46 Q26,22 50,20 Q74,22 74,46 Q62,32 50,32 Q38,32 26,46Z" />
        <rect x="22" y="44" width="10" height="72" rx="4" />
        <rect x="68" y="44" width="10" height="72" rx="4" />
      </g>
    );

  if (style === 4)
    return (
      <g fill={color}>
        <ellipse cx="50" cy="28" rx="30" ry="20" />
        <ellipse cx="24" cy="52" rx="12" ry="22" />
        <ellipse cx="76" cy="52" rx="12" ry="22" />
      </g>
    );

  if (style === 5)
    return (
      <g fill={color}>
        <path d="M26,46 Q28,22 50,20 Q72,22 74,44 Q62,32 50,32 Q38,34 26,46Z" />
        <ellipse cx="74" cy="58" rx="12" ry="30" />
      </g>
    );

  return null;
}

function HairFront({ style, color }: { style: number; color: string }) {
  if (style === 1)
    return (
      <g fill={color}>
        <polygon points="26,46 20,20 36,40" />
        <polygon points="38,38 35,12 52,34" />
        <polygon points="54,34 56,10 66,30" />
        <polygon points="66,34 72,16 78,34" />
        <ellipse cx="50" cy="40" rx="24" ry="10" />
        <path d="M28,50 L32,56 L36,50 L40,57 L44,51 L48,57 L52,52" fill={color} />
      </g>
    );

  if (style === 2)
    return (
      <g fill={color}>
        <path d="M26,46 Q26,22 50,20 Q74,22 74,46 Q62,32 50,32 Q38,32 26,46Z" />
        <path d="M28,52 L32,58 L36,52 L40,58 L44,52 L48,58 L52,54" fill={color} />
      </g>
    );

  if (style === 3)
    return (
      <g fill={color}>
        <path d="M26,46 Q26,22 50,20 Q74,22 74,46 Q62,32 50,32 Q38,32 26,46Z" />
        <rect x="30" y="48" width="5" height="12" rx="2" />
        <rect x="38" y="48" width="5" height="14" rx="2" />
        <rect x="46" y="48" width="5" height="14" rx="2" />
      </g>
    );

  if (style === 4)
    return (
      <g fill={color}>
        <polygon points="24,48 16,18 36,42" />
        <polygon points="38,40 34,10 52,36" />
        <polygon points="56,36 60,8 70,30" />
        <polygon points="68,36 76,18 82,38" />
        <ellipse cx="50" cy="40" rx="26" ry="14" />
      </g>
    );

  if (style === 5)
    return (
      <g fill={color}>
        <path d="M26,46 Q28,22 52,20 Q72,22 74,40 Q62,30 52,30 Q38,34 26,46Z" />
        <path d="M26,50 Q44,42 68,50 L62,48 Q46,44 28,54Z" fill={color} />
      </g>
    );

  return null;
}

export function AvatarSVG({
  config,
  characterClass,
}: {
  config: AvatarConfig;
  characterClass: string;
}) {
  const { hairStyle, hairColor, skinTone, eyeColor } = config;
  const outfitColor = CLASS_OUTFIT[characterClass] ?? "#FF6B35";
  const outfitDark = outfitColor + "cc";

  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
      {/* Body */}
      <path d={`M34,88 L18,130 L82,130 L66,88 Z`} fill={outfitColor} opacity="0.95" />
      {/* Collar detail */}
      <path d="M42,88 L50,102 L58,88" fill="none" stroke={outfitDark} strokeWidth="1.5" strokeLinecap="round" />

      {/* Hair back */}
      <HairBack style={hairStyle} color={hairColor} />

      {/* Ears */}
      <ellipse cx="26" cy="52" rx="4" ry="5" fill={skinTone} />
      <ellipse cx="74" cy="52" rx="4" ry="5" fill={skinTone} />

      {/* Neck */}
      <rect x="43" y="77" width="14" height="13" fill={skinTone} />

      {/* Head */}
      <ellipse cx="50" cy="51" rx="24" ry="27" fill={skinTone} />

      {/* Hair front */}
      <HairFront style={hairStyle} color={hairColor} />

      {/* Eyebrows */}
      <rect x="32" y="40" width="11" height="2" rx="1" fill={hairColor} opacity="0.9" />
      <rect x="57" y="40" width="11" height="2" rx="1" fill={hairColor} opacity="0.9" />

      {/* Left eye */}
      <ellipse cx="38" cy="51" rx="7.5" ry="9" fill="white" />
      <ellipse cx="38" cy="52" rx="5.5" ry="7" fill={eyeColor} />
      <ellipse cx="38" cy="52" rx="3" ry="4.5" fill="#0a0a0a" />
      <circle cx="40.5" cy="48.5" r="1.8" fill="white" />
      {/* Eyelid */}
      <path d="M30.5,47 Q38,42 45.5,47" fill="none" stroke="#0a0a0a" strokeWidth="1.2" />

      {/* Right eye */}
      <ellipse cx="62" cy="51" rx="7.5" ry="9" fill="white" />
      <ellipse cx="62" cy="52" rx="5.5" ry="7" fill={eyeColor} />
      <ellipse cx="62" cy="52" rx="3" ry="4.5" fill="#0a0a0a" />
      <circle cx="64.5" cy="48.5" r="1.8" fill="white" />
      {/* Eyelid */}
      <path d="M54.5,47 Q62,42 69.5,47" fill="none" stroke="#0a0a0a" strokeWidth="1.2" />

      {/* Nose */}
      <path d="M48,64 Q50,67 52,64" fill="none" stroke={skinTone} strokeWidth="1" style={{ filter: "brightness(0.75)" }} />

      {/* Mouth */}
      <path d="M44,71 Q50,76 56,71" fill="none" stroke="#c07a70" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

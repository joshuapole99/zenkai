// ─── Character sprites ────────────────────────────────────────────────────────

type CharacterPoses = {
  idle:    string;
  attack:  string;
  victory: string;
  hit:     string;
};

type CharacterStages = {
  weak:   CharacterPoses;
  normal: CharacterPoses;
  strong: CharacterPoses;
};

function charSprites(cls: string): CharacterStages {
  const base = `/assets/characters/${cls}`;
  return {
    weak:   { idle: `${base}_weak_idle.png`,   attack: `${base}_weak_attack.png`,   victory: `${base}_weak_victory.png`,   hit: `${base}_weak_hit.png`   },
    normal: { idle: `${base}_normal_idle.png`, attack: `${base}_normal_attack.png`, victory: `${base}_normal_victory.png`, hit: `${base}_normal_hit.png` },
    strong: { idle: `${base}_strong_idle.png`, attack: `${base}_strong_attack.png`, victory: `${base}_strong_victory.png`, hit: `${base}_strong_hit.png` },
  };
}

// ─── Enemy sprites ────────────────────────────────────────────────────────────

type EnemyPoses = { idle: string; hit: string; defeat: string };

function enemySprites(id: string): EnemyPoses {
  const base = `/assets/enemies/${id}`;
  return { idle: `${base}_idle.png`, hit: `${base}_hit.png`, defeat: `${base}_defeat.png` };
}

// ─── NPC sprites ──────────────────────────────────────────────────────────────

type NpcPoses = { idle: string; talk: string; action: string; victory: string };

function npcSprites(id: string): NpcPoses {
  const base = `/assets/npc/${id}`;
  return { idle: `${base}_idle.png`, talk: `${base}_talk.png`, action: `${base}_action.png`, victory: `${base}_victory.png` };
}

// ─── Boss sprites ─────────────────────────────────────────────────────────────

type BossPoses = { idle: string; attack: string; special: string; rage: string; defeat: string };

function bossSprites(id: string): BossPoses {
  const base = `/assets/bosses/${id}`;
  return {
    idle:    `${base}_idle.png`,
    attack:  `${base}_attack.png`,
    special: `${base}_special.png`,
    rage:    `${base}_rage.png`,
    defeat:  `${base}_defeat.png`,
  };
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const assets = {
  characters: {
    striker: charSprites("striker"),
    ninja:   charSprites("ninja"),
    monk:    charSprites("monk"),
  },

  enemies: {
    lazy_slime:    enemySprites("lazy_slime"),
    excuse_goblin: enemySprites("excuse_goblin"),
    tired_blob:    enemySprites("tired_blob"),
    mini_shadow:   enemySprites("mini_shadow"),
  },

  npc: {
    master_kael: npcSprites("master_kael"),
    rival_ryo:   npcSprites("rival_ryo"),
  },

  bosses: {
    shadow_general: bossSprites("shadow_general"),
  },

  ui: {
    xp_bar_empty:      "/assets/ui/xp_bar_empty.png",
    xp_bar_filled:     "/assets/ui/xp_bar_filled.png",
    level_up_flash:    "/assets/ui/level_up_flash.png",
    hp_bar:            "/assets/ui/hp_bar.png",
    hp_bar_low:        "/assets/ui/hp_bar_low.png",
    power_level_badge: "/assets/ui/power_level_badge.png",
    scan_overlay:      "/assets/ui/scan_overlay.png",
  },

  backgrounds: {
    training_room: "/assets/backgrounds/training_room.png",
    city_rooftop:  "/assets/backgrounds/city_rooftop.png",
    night_street:  "/assets/backgrounds/night_street.png",
    temple:        "/assets/backgrounds/temple.png",
    arena:         "/assets/backgrounds/arena.png",
    mountain:      "/assets/backgrounds/mountain.png",
    boss_arena:    "/assets/backgrounds/boss_arena.png",
  },

  effects: {
    zenkai_boost:      "/assets/effects/zenkai_boost.png",
    level_up_flash:    "/assets/effects/level_up_flash.png",
    hit_spark:         "/assets/effects/hit_spark.png",
    defeat_explosion:  "/assets/effects/defeat_explosion.png",
    power_charge:      "/assets/effects/power_charge.png",
  },

  icons: Object.fromEntries(
    Array.from({ length: 27 }, (_, i) => {
      const n = String(i + 1).padStart(2, "0");
      return [`exercise_${n}`, `/assets/icons/exercise_${n}.png`];
    })
  ) as Record<`exercise_${string}`, string>,

  items: {
    protein_shake:   "/assets/items/protein_shake.png",
    energy_bar:      "/assets/items/energy_bar.png",
    training_scroll: "/assets/items/training_scroll.png",
    xp_orb:          "/assets/items/xp_orb.png",
  },
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export type CharacterClass  = keyof typeof assets.characters;
export type CharacterStage  = keyof CharacterStages;
export type CharacterPose   = keyof CharacterPoses;
export type EnemyId         = keyof typeof assets.enemies;
export type NpcId           = keyof typeof assets.npc;
export type BossId          = keyof typeof assets.bosses;
export type BackgroundKey   = keyof typeof assets.backgrounds;
export type EffectKey       = keyof typeof assets.effects;
export type ItemKey         = keyof typeof assets.items;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Level 1–4 → weak | 5–9 → normal | 10+ → strong */
export function getCharacterStage(level: number): CharacterStage {
  if (level >= 10) return "strong";
  if (level >= 5)  return "normal";
  return "weak";
}

export function getCharacterSprite(
  className: CharacterClass,
  stage: CharacterStage,
  pose: CharacterPose,
): string {
  return assets.characters[className][stage][pose];
}

/** Convenience: resolve stage from level automatically */
export function getCharacterSpriteByLevel(
  className: CharacterClass,
  level: number,
  pose: CharacterPose,
): string {
  return getCharacterSprite(className, getCharacterStage(level), pose);
}

// Map existing class names used in the DB to new asset class names
const CLASS_MAP: Record<string, CharacterClass> = {
  saiyan:   "striker",
  shadow:   "ninja",
  guardian: "monk",
  striker:  "striker",
  ninja:    "ninja",
  monk:     "monk",
};

export function resolveCharacterClass(dbClass: string): CharacterClass {
  return CLASS_MAP[dbClass] ?? "striker";
}

export const visuals = {
  characters: {
    saiyan: {
      level1: "/images/characters/saiyan-1.png",
      level2: "/images/characters/saiyan-2.png",
      level3: "/images/characters/saiyan-3.png",
    },
    assassin: {
      level1: "/images/characters/assassin-1.png",
      level2: "/images/characters/assassin-2.png",
      level3: "/images/characters/assassin-3.png",
    },
    guardian: {
      level1: "/images/characters/guardian-1.png",
      level2: "/images/characters/guardian-2.png",
      level3: "/images/characters/guardian-3.png",
    },
  },
  npc: {
    kael:           "/images/master-kael-avatar.png",
    kaelProud:      "/images/master-kael-avatar.png",
    kaelSurprised:  "/images/master-kael-avatar.png",
    ryo:            "/images/npc/ryo.png",
    ryoShocked:     "/images/npc/ryo-shocked.png",
  },
  backgrounds: {
    dojo:           "/images/bg/dojo.png",
    trainingGround: "/images/bg/training-ground.png",
    nightCity:      "/images/bg/night-city.png",
    storm:          "/images/bg/storm.png",
    mountain:       "/images/bg/mountain.png",
    zenkai:         "/images/zenkai-boost-bg.png",
    void:           "/images/bg/void.png",
  },
  enemies: {
    grunt1:            "/images/enemies/enemy-grunt-1.png",
    grunt2:            "/images/enemies/enemy-grunt-2.png",
    grunt3:            "/images/enemies/enemy-grunt-3.png",
    grunt4:            "/images/enemies/enemy-grunt-4.png",
    grunt5:            "/images/enemies/enemy-grunt-5.png",
    bossShadowGeneral: "/images/enemies/boss-shadow-general.png",
    bossRyo:           "/images/enemies/boss-ryo.png",
    bossDarkSelf:      "/images/enemies/boss-dark-self.png",
  },
} as const;

export type CharacterClass = keyof typeof visuals.characters;
export type NpcKey = keyof typeof visuals.npc;
export type BackgroundKey = keyof typeof visuals.backgrounds;
export type EnemyKey = keyof typeof visuals.enemies;

export const NPC_NAMES: Record<NpcKey, string> = {
  kael:          "Master Kael",
  kaelProud:     "Master Kael",
  kaelSurprised: "Master Kael",
  ryo:           "Ryo",
  ryoShocked:    "Ryo",
};

export const NPC_COLORS: Record<NpcKey, string> = {
  kael:          "#7C3AED",
  kaelProud:     "#FF6B35",
  kaelSurprised: "#FF6B35",
  ryo:           "#DC2626",
  ryoShocked:    "#DC2626",
};

export const CLASS_COLORS: Record<string, string> = {
  saiyan:   "#FF6B35",
  shadow:   "#7C3AED",
  guardian: "#6b7280",
};

export function getCharacterImage(characterClass: string, level: number): string {
  const classKey = characterClass === "shadow"
    ? "assassin"
    : characterClass === "saiyan"
    ? "saiyan"
    : "guardian";
  const stage = level >= 16 ? "level3" : level >= 6 ? "level2" : "level1";
  return visuals.characters[classKey as CharacterClass][stage];
}

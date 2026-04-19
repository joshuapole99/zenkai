export type EnemyType = "grunt" | "shadow_warrior" | "corrupt_monk";

export type EnemyData = {
  name: string;
  type: EnemyType;
  title: string;
  flavor: string;
  color: string;
};

export const STORY_ENEMIES: Record<number, EnemyData> = {
  0: {
    name: "The Dark Self",
    type: "shadow_warrior",
    title: "Inner Demon",
    flavor: "The voice that said you couldn't come back. Prove it wrong.",
    color: "#FFD700",
  },
  1: {
    name: "Kuro",
    type: "grunt",
    title: "Shadow Grunt",
    flavor: "Weak. But every warrior starts here.",
    color: "#6b7280",
  },
  2: {
    name: "Vex",
    type: "grunt",
    title: "Dark Soldier",
    flavor: "Trained harder than you. Today, that ends.",
    color: "#7C3AED",
  },
  3: {
    name: "Mira",
    type: "shadow_warrior",
    title: "Ryo's Scout",
    flavor: "Ryo sent her to test your resolve. Don't fail.",
    color: "#3b82f6",
  },
  4: {
    name: "Raze",
    type: "shadow_warrior",
    title: "Storm Blade",
    flavor: "Strikes without warning. Stay sharp.",
    color: "#6366f1",
  },
  5: {
    name: "Gorun",
    type: "corrupt_monk",
    title: "Corrupt Monk",
    flavor: "Once devoted to discipline. Now a weapon of shadow.",
    color: "#10b981",
  },
  6: {
    name: "Varak",
    type: "shadow_warrior",
    title: "Shadow Elite",
    flavor: "The General's chosen. One of his best.",
    color: "#8b5cf6",
  },
  7: {
    name: "The Shadow General",
    type: "corrupt_monk",
    title: "Arc Boss",
    flavor: "The source of everything that held you back.",
    color: "#FF6B35",
  },
};

export function getEnemy(storyDay: number, isZenkaiBoost: boolean): EnemyData {
  if (isZenkaiBoost) return STORY_ENEMIES[0];
  return STORY_ENEMIES[storyDay] ?? STORY_ENEMIES[1];
}

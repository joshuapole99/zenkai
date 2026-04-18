export type Quest = {
  id: number;
  name: string;
  detail: string;
};

const QUEST_POOL: Quest[] = [
  { id: 1, name: "Push-ups", detail: "20 reps" },
  { id: 2, name: "Squats", detail: "30 reps" },
  { id: 3, name: "Plank", detail: "60 seconds" },
  { id: 4, name: "Burpees", detail: "15 reps" },
  { id: 5, name: "Mountain Climbers", detail: "40 reps" },
  { id: 6, name: "Lunges", detail: "20 reps each leg" },
  { id: 7, name: "Wall Sit", detail: "45 seconds x 3" },
  { id: 8, name: "Sit-ups", detail: "25 reps" },
  { id: 9, name: "High Knees", detail: "45 seconds" },
  { id: 10, name: "Jump Squats", detail: "20 reps" },
  { id: 11, name: "Diamond Push-ups", detail: "15 reps" },
  { id: 12, name: "Glute Bridges", detail: "30 reps" },
];

export function getDailyQuests(date: string): Quest[] {
  const seed = date
    .replace(/-/g, "")
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const indices: number[] = [];
  let n = seed;
  while (indices.length < 3) {
    n = (n * 1664525 + 1013904223) & 0x7fffffff;
    const idx = n % QUEST_POOL.length;
    if (!indices.includes(idx)) indices.push(idx);
  }
  return indices.map((i) => QUEST_POOL[i]);
}

export function calcLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function xpProgress(xp: number): { xpIntoLevel: number; xpRequired: number; level: number } {
  return {
    level: Math.floor(xp / 100) + 1,
    xpIntoLevel: xp % 100,
    xpRequired: 100,
  };
}

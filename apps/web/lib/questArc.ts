const ARC_NAMES: Record<string, string> = {
  "Push-ups":         "Iron Foundation",
  "Wide Push-ups":    "Iron Foundation",
  "Diamond Push-ups": "Precision Strike",
  "Decline Push-ups": "Elevated Power",
  "Pike Push-ups":    "Shoulder Tempering",
  "Tricep Dips":      "Arm of Steel",
  "Archer Push-ups":  "Sniper's Drill",
  "Squats":           "Warrior's Base",
  "Lunges":           "Ground Training",
  "Glute Bridges":    "Foundation Build",
  "Wall Sit":         "Endurance Test",
  "Jump Squats":      "Explosive Power",
  "Bulgarian Split Squats": "Single-Leg Forge",
  "Reverse Lunges":   "Balance Trial",
  "Pistol Squat Assist": "One-Leg Ascent",
  "Plank":            "Iron Will",
  "Sit-ups":          "Core Tempering",
  "Bicycle Crunches": "Rotation Drill",
  "Mountain Climbers":"Speed Ascent",
  "Leg Raises":       "Lower Core Trial",
  "Hollow Body Hold": "Ki Compression",
  "Ab Wheel Rollout": "Full Extension",
  "High Knees":       "Agility Trial",
  "Star Jumps":       "Power Burst",
  "Burpees":          "Full Power Trial",
  "Box Jumps":        "Launch Training",
  "Sprint Intervals": "Lightning Dash",
};

export function getArcName(exerciseName: string): string {
  return ARC_NAMES[exerciseName] ?? "Training Trial";
}

export const story = {
  days: [
    {
      day: 1,
      background: "dojo" as const,
      npc: "kael" as const,
      title: "The Awakening",
      intro: "You're sitting at home. Nothing special. Then a mysterious figure appears — Master Kael — an old trainer who can see people with hidden power. He looks at you and says: 'I've been watching you. You have something most people don't. But it's buried deep. The only way to unlock it is to move. Right now.'",
      quest: {
        exercises: [
          { name: "Push-ups", reps: 10 },
          { name: "Squats", reps: 20 },
          { name: "Plank", duration: "30 seconds" }
        ]
      },
      completion: "Good. That's the first spark. Come back tomorrow — or it dies.",
      xp: 100
    },
    {
      day: 2,
      background: "trainingGround" as const,
      npc: "kael" as const,
      title: "The First Power",
      intro: "You feel different from yesterday. Something in your body feels stronger. Master Kael appears again: 'You came back. Most don't. That alone puts you ahead of 90% of people. But one day means nothing. Show me you're serious.' He shows you your first Power Level — Level 2. Power: 150.",
      quest: {
        exercises: [
          { name: "Push-ups", reps: 15 },
          { name: "Squats", reps: 25 },
          { name: "High Knees", reps: 10 }
        ]
      },
      completion: "Your power grows. But consistency is everything. Return tomorrow.",
      xp: 120
    },
    {
      day: 3,
      background: "nightCity" as const,
      npc: "ryo" as const,
      title: "The Rival Appears",
      intro: "After your workout someone else appears — Ryo — a guy your age with a power level of 890. He looks down at you: 'Power Level 200? That is nothing. I have been training since I was 8. You will never catch up.' Master Kael whispers: 'Don't listen to him. Ryo trained for years but he never faced a real setback. You will — and when you do, you will come back stronger than he ever could.'",
      quest: {
        exercises: [
          { name: "Push-ups", reps: 20 },
          { name: "Squats", reps: 30 },
          { name: "Jump Squats", reps: 15 }
        ]
      },
      completion: "Ryo watches. He expected you to quit. You didn't.",
      xp: 140
    },
    {
      day: 4,
      background: "storm" as const,
      npc: "kael" as const,
      title: "The First Doubt",
      intro: "You're tired. Your body hurts. You think: is this worth it? Master Kael says nothing. He only puts down an old photo — a young fighter training in the rain, alone, nobody watching. 'He didn't train because it was easy. He trained because he refused to stay weak.'",
      quest: {
        exercises: [
          { name: "Push-ups", reps: 20 },
          { name: "Squats", reps: 40 },
          { name: "Plank", duration: "1 minute" }
        ]
      },
      completion: "The doubt is still there. But you trained anyway. That's what separates warriors from everyone else.",
      xp: 150
    },
    {
      day: 5,
      background: "mountain" as const,
      npc: "kael" as const,
      title: "Unlocking Ki",
      intro: "Master Kael explains what Ki is — the life energy every human has but almost nobody uses: 'Every workout you do channels Ki through your body. It's invisible but real. Ryo has high Ki because he trained for years. But Ki can spike — dramatically — after a setback. We call that a Zenkai.' He looks at you: 'You will understand soon enough.'",
      quest: {
        exercises: [
          { name: "Push-ups", reps: 25 },
          { name: "Squats", reps: 30 },
          { name: "High Knees", reps: 20 },
          { name: "Plank", duration: "30 seconds" }
        ]
      },
      completion: "Your Ki is growing. You can almost feel it now.",
      xp: 160
    },
    {
      day: 6,
      background: "trainingGround" as const,
      npc: "kael" as const,
      title: "Side Quest Unlocked",
      intro: "Master Kael introduces side quests: 'Your main quest keeps your power growing. But side quests unlock abilities. Speed. Endurance. Focus. They are optional — but warriors who skip them stay average.'",
      quest: {
        exercises: [
          { name: "Push-ups", reps: 30 },
          { name: "Squats", reps: 40 },
          { name: "Jump Squats", reps: 20 }
        ]
      },
      sideQuest: {
        name: "Speed Training",
        exercise: { name: "Walk or Run", duration: "5 minutes" },
        reward: "Unlocks Speed stat",
        xp: 50
      },
      completion: "Main quest complete. Side quest available — train your speed or rest. Your choice.",
      xp: 180
    },
    {
      day: 7,
      background: "mountain" as const,
      npc: "kaelProud" as const,
      title: "The First Arc Complete",
      intro: "Ryo comes back. He looks at your power level — it rose from 100 to 580 in one week. He says nothing. But you see it in his eyes — he didn't expect this. Master Kael smiles: 'One week ago you were nobody. Now you have a foundation. The real training starts tomorrow.'",
      quest: {
        exercises: [
          { name: "Push-ups", reps: 35 },
          { name: "Squats", reps: 50 },
          { name: "Jump Squats", reps: 20 },
          { name: "Plank", duration: "1 minute" }
        ]
      },
      completion: "Arc 1 complete. Saiyan Warrior Arc unlocked. You are no longer a beginner.",
      xp: 200,
      arcComplete: true
    }
  ],
  zenkaiBoost: {
    background: "zenkai" as const,
    npc: "kael" as const,
    title: "Zenkai Boost",
    intro: "You fell. Good. Master Kael is already there — he doesn't look angry, he looks satisfied. 'You know what a Zenkai is? In the old texts, it is written that Saiyan warriors grow most after their greatest defeats. Not despite the fall — because of it. You just fell. That means your next rise will be the biggest yet.'",
    quest: {
      exercises: [
        { name: "Push-ups", reps: 25 },
        { name: "Squats", reps: 50 },
        { name: "Jump Squats", reps: 20 },
        { name: "Plank", duration: "1 minute" }
      ]
    },
    completion: "Your power level just spiked. That's a Zenkai. Remember this feeling — every time you fall, this is waiting for you on the other side.",
    xp: 300
  }
}

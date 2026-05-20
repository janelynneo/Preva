import { CheckIn } from "./storage";

interface InsightContext {
  ethnicity?: string;
  familyHistoryT2D?: boolean;
  wearableConnected?: boolean;
  recentCheckIns?: CheckIn[];
  daysSinceSignup?: number;
}

const SLEEP_TIPS = [
  "Quality sleep is the foundation of metabolic health — aim for consistent sleep-wake times, even on weekends.",
  "Blue light exposure before bed can suppress melatonin. Consider dimming screens 30 minutes before sleep.",
  "Singapore's humidity can affect sleep quality. Keep your bedroom well-ventilated and around 24°C.",
  "Even 15 minutes of morning sunlight helps regulate your circadian rhythm and improves sleep quality.",
  "Late-night hawker meals can disrupt sleep. Try finishing dinner at least 2-3 hours before bed.",
];

const RECOVERY_TIPS = [
  "Recovery isn't just about sleep — hydration, stress management, and movement all play a role.",
  "Active recovery like walking or gentle stretching promotes blood flow without taxing your system.",
  "Chronic stress elevates cortisol, which directly impacts metabolic health. Even 5 minutes of deep breathing helps.",
  "Rest days aren't lazy — they're when your body actually adapts and grows stronger from exercise.",
  "Adequate protein (0.8-1g per kg bodyweight) supports muscle recovery and metabolic function.",
];

const HAWKER_TIPS = [
  "Choose brown rice over white rice at hawker centres — higher fibre means slower glucose absorption.",
  "Tough to avoid MSG?均衡饮食 (balanced diet) over a week matters more than any single meal.",
  "Fish soup (sotong/kembung) is a great low-GI protein source at any hawker centre.",
  "Ask for less oil (少油) — hawker stalls are usually happy to accommodate.",
  "Mix your vegetables! Many hawker dishes skimp on greens — add a side of kangkung or chye sim.",
];

const ACTIVITY_TIPS = [
  "Desk-bound all day? Set a timer to stand and stretch every 30 minutes.",
  "Walking to the MRT station instead of the bus? That's 10-15 minutes of incidental exercise.",
  "Singapore's humidity makes outdoor exercise tough. Try indoor options like shopping malls or a gym.",
  "Consistency beats intensity — a 20-minute daily walk is better than one intense workout per week.",
  "Even household chores count! Mopping, gardening, and carrying groceries all add to your daily movement.",
];

const STRESS_TIPS = [
  "Breathing exercises activate your parasympathetic nervous system. Try 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s.",
  "Social connection is a proven stress buffer — reach out to a friend or colleague today.",
  "Chronic stress affects metabolic health directly. Small daily wins (a walk, a good meal, a laugh) compound.",
  "Mindfulness doesn't have to be meditation — it can be as simple as eating one meal without your phone.",
  "Sleep and stress are deeply linked — improving one often improves the other.",
];

// ─── Desk Worker Wellness (back pain, posture, seated time) ─────────────────

const DESK_STRETCHES = [
  {
    id: "cat_cow",
    name: "Cat-Cow Stretch",
    duration: "2 min",
    emoji: "🐱",
    instructions:
      "Hands and knees. Inhale: arch back, look up (Cow). Exhale: round spine, chin to chest (Cat). Repeat 8 times.",
    when: "Morning or after long seated periods",
  },
  {
    id: "seated_spinal_twist",
    name: "Seated Spinal Twist",
    duration: "2 min",
    emoji: "🔄",
    instructions:
      "Sit tall, right ankle over left knee. Twist right, left elbow to right knee. Hold 30s each side.",
    when: "After lunch, before afternoon meetings",
  },
  {
    id: "chest_opener",
    name: "Chest Opener",
    duration: "1 min",
    emoji: "🙆",
    instructions:
      "Clasp hands behind back, squeeze shoulder blades. Lift chest, hold 20s. Opens shoulders tight from typing.",
    when: "Mid-morning or after meetings",
  },
  {
    id: "hip_flexor_stretch",
    name: "Hip Flexor Stretch",
    duration: "2 min",
    emoji: "🦵",
    instructions:
      "Kneel on right knee, left foot forward. Push hips forward, hold 30s each side. Counteracts seated hip flexion.",
    when: "Evening wind-down",
  },
  {
    id: "neck_release",
    name: "Neck Release",
    duration: "1 min",
    emoji: "🧘",
    instructions:
      "Right ear to right shoulder. Hold 20s. Switch. Then chin to chest, hold 20s. Stretches traps from screen time.",
    when: "Any time, especially after calls",
  },
  {
    id: "standing_forward_fold",
    name: "Standing Forward Fold",
    duration: "1 min",
    emoji: "🙇",
    instructions:
      "Stand, hinge at hips, let head hang. Hold 30s. Relieves lower back tension from prolonged sitting.",
    when: "Post-lunch or before leaving desk",
  },
  {
    id: "desk_calf_raise",
    name: "Desk Calf Raise",
    duration: "1 min",
    emoji: "🦶",
    instructions:
      "Stand at desk. Rise onto toes, hold 2s, lower. Repeat 15x. Boosts circulation in legs after sitting.",
    when: "Every 60–90 min of seated time",
  },
  {
    id: "wrist_circles",
    name: "Wrist Circles",
    duration: "30 sec",
    emoji: "🤲",
    instructions:
      "Extend arms, make fists. Circle wrists 10x each direction. Prevents RSI from typing and mouse use.",
    when: "Morning start and after long typing sessions",
  },
];

const DESK_POSTURE_TIPS = [
  "Screen at eye level — raise your monitor or laptop with a stack of books. Looking down at your screen strains your neck.",
  "Feet flat on floor, knees at 90°. If your chair is too high, use a footrest or box.",
  "Shoulders back, ears over shoulders. Roll them back and down — not hunched forward.",
  "Keyboard at elbow height or slightly below. Elbows at 90–110° when typing.",
  "20-20-20 rule: Every 20 min, look at something 20 feet away for 20 seconds. Reduces eye strain.",
  "The 90-degree rule: hip, knee, and ankle at roughly 90° when seated. Adjust your chair height first.",
  "Place your mouse as close to your keyboard as possible — reaching stretches your shoulder.",
  "Use a headset or speakerphone instead of cradling your phone between ear and shoulder.",
];

const DESK_BREAK_TIPS = [
  "Harvard study: Standing up for 5 min every 30 min reduces blood sugar spikes by 34%. Your MWI will thank you.",
  "Meeting walk: Suggest a walking standup. 10 min of walking post-lunch cuts postprandial glucose by 22%.",
  "Take the stairs to the next floor, then walk back up. 3 flights of stairs = ~1 min of cardio.",
  "Set a phone alarm: 'Desk break' every 60 min. 2 minutes of stretching resets your nervous system.",
  "Walk to a colleague instead of messaging them. Social connection + movement in one.",
  "Water cooler trip counts. Every trip = 1–2 min of movement and a hydration reminder.",
  "Do a lap around your office floor every time you finish a pomodoro. Timer + movement = productivity hack.",
];

const BACK_PAIN_TIPS = [
  "Back pain from sitting? Your hip flexors are probably tight. Try the kneeling hip flexor stretch — hold 30s each side.",
  "If your lower back hurts after sitting: sit on the edge of your chair, both feet flat, lean forward slightly. Re-engages your core.",
  "Strengthen your core = less back pain. Plank for 30 seconds when you wake up. It compounds.",
  "Singapore humidity makes muscles feel stiffer. Gentle stretching before bed improves sleep quality AND reduces morning stiffness.",
  "A lumbar support cushion (£20 from Shopee) changes sitting posture completely. Your lower back will notice.",
  "Back pain that travels down your leg? Don't ignore it. Check in with your GP — early intervention matters.",
];

function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function getContextualStretch(): {
  stretch: (typeof DESK_STRETCHES)[number];
  tip: string;
} {
  const time = getTimeOfDay();
  const stretch =
    DESK_STRETCHES[Math.floor(Math.random() * DESK_STRETCHES.length)];

  let tip: string;
  if (time === "morning") {
    tip =
      DESK_STRETCHES.find((s) => s.id === "cat_cow")?.instructions ??
      stretch.instructions;
  } else if (time === "afternoon") {
    tip =
      DESK_STRETCHES.find((s) => s.id === "seated_spinal_twist")
        ?.instructions ?? stretch.instructions;
  } else if (time === "evening") {
    tip =
      DESK_STRETCHES.find((s) => s.id === "hip_flexor_stretch")?.instructions ??
      stretch.instructions;
  } else {
    tip =
      DESK_STRETCHES.find((s) => s.id === "standing_forward_fold")
        ?.instructions ?? stretch.instructions;
  }

  return { stretch, tip };
}

export function getAllStretches(): typeof DESK_STRETCHES {
  return DESK_STRETCHES;
}

const T2D_FAMILY_TIPS = [
  "With a family history of Type 2 diabetes, regular monitoring of metabolic markers is especially valuable.",
  "Small lifestyle changes have outsized impact when you have T2D family history — early action matters most.",
  "Your baseline data helps identify your personal patterns, which is powerful for prevention.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getDailyInsight(ctx: InsightContext): string {
  const tips: string[] = [];
  const hour = new Date().getHours();

  if (ctx.recentCheckIns && ctx.recentCheckIns.length > 0) {
    const recent = ctx.recentCheckIns.slice(-7);
    const avgSleep =
      recent.reduce((s, c) => s + c.sleepQuality, 0) / recent.length;
    const avgStress = recent.reduce((s, c) => s + c.stress, 0) / recent.length;

    if (avgSleep < 3) tips.push(pickRandom(SLEEP_TIPS));
    if (avgStress > 3.5) tips.push(pickRandom(STRESS_TIPS));
    if (recent.length < 5)
      tips.push(
        "Logging your daily check-ins builds a picture of your metabolic patterns. Try to check in every day!",
      );
  }

  // Desk worker contextual tips based on time of day
  if (hour >= 9 && hour < 12) {
    tips.push(pickRandom(DESK_POSTURE_TIPS));
  } else if (hour >= 12 && hour < 14) {
    tips.push(pickRandom(DESK_BREAK_TIPS));
  } else if (hour >= 14 && hour < 17) {
    tips.push(pickRandom(BACK_PAIN_TIPS));
  } else if (hour >= 17 && hour < 21) {
    tips.push(
      pickRandom(
        DESK_STRETCHES.map((s) => `${s.emoji} ${s.name}: ${s.instructions}`),
      ),
    );
  }

  if (tips.length === 0) tips.push(pickRandom(SLEEP_TIPS));

  if (ctx.familyHistoryT2D && Math.random() < 0.4) {
    tips.push(pickRandom(T2D_FAMILY_TIPS));
  }

  if (ctx.wearableConnected === false && Math.random() < 0.3) {
    tips.push(
      "Connecting a fitness tracker (Fitbit, Apple Health, Garmin) gives you richer data for your MWI.",
    );
  }

  return tips[0];
}

export function getPersonalisedInsights(ctx: InsightContext): string[] {
  const pool: string[] = [];
  pool.push(
    ...SLEEP_TIPS,
    ...RECOVERY_TIPS,
    ...HAWKER_TIPS,
    ...ACTIVITY_TIPS,
    ...STRESS_TIPS,
    ...DESK_POSTURE_TIPS,
    ...DESK_BREAK_TIPS,
    ...BACK_PAIN_TIPS,
  );

  if (ctx.familyHistoryT2D) pool.push(...T2D_FAMILY_TIPS);

  const shuffled = shuffle(pool);
  return shuffled.slice(0, 3);
}

export function getDailyQuote(): string {
  const quotes = [
    "Health is not a destination — it's a daily practice.",
    "Small consistent actions beat dramatic once-off changes.",
    "Your body is capable of remarkable things when you give it the right inputs.",
    "Metabolic health is the foundation of overall wellbeing.",
    "Progress, not perfection — show up, check in, repeat.",
    "You don't have to be perfect. You just have to start.",
    "The best time to care for your body was yesterday. The second best time is now.",
    "Your spine doesn't forgive sitting. Neither does your MWI.",
    "A 5-min walk after lunch resets more than your posture.",
    "Every stretch is a vote for the body you want.",
    "The chair is trying to hurt you. Stand up.",
    "Desk workers who move daily report 40% less afternoon fatigue.",
    "Your baseline is built in the ordinary days, not the perfect ones.",
    "Back pain is the body asking for a conversation. Are you listening?",
    "You are one stretch away from a better afternoon.",
  ];
  return pickRandom(quotes);
}

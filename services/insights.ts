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
  ];
  return pickRandom(quotes);
}

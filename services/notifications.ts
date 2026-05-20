import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { StorageService } from "./storage";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReminderTime = "morning" | "evening" | "night";

export interface ReminderConfig {
  enabled: boolean;
  time: ReminderTime;
  customHour?: number; // 0–23, overrides time preset
  snoozedUntil?: string; // ISO date string
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const SUGGESTED_TIMES: Record<ReminderTime, { hour: number; label: string }> = {
  morning: { hour: 7, label: "7:00 AM" },
  evening: { hour: 19, label: "7:00 PM" },
  night: { hour: 21, label: "9:00 PM" },
};

// ─── Permission ──────────────────────────────────────────────────────────────

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

// ─── Storage ────────────────────────────────────────────────────────────────

const REMINDER_KEY = "metabo_reminder_config";

export async function getReminderConfig(): Promise<ReminderConfig> {
  try {
    const raw = await AsyncStorage.getItem(REMINDER_KEY);
    return raw ? JSON.parse(raw) : { enabled: true, time: "evening" };
  } catch {
    return { enabled: true, time: "evening" };
  }
}

export async function saveReminderConfig(
  config: ReminderConfig,
): Promise<void> {
  await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify(config));
}

// ─── Core scheduler ────────────────────────────────────────────────────────

async function _scheduleCheckInReminder(
  hour: number,
  minute: number = 0,
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (hour < 0 || hour > 23) return;

  const trigger: Notifications.NotificationTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour,
    minute,
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to check in! 🌙",
      body: "How was your day? Log your evening check-in — takes 30 seconds.",
      data: { type: "checkin_reminder" },
      sound: true,
    },
    trigger,
  });
}

async function _scheduleSlumpNudge(): Promise<void> {
  // 2:30 PM nudge — historically when energy dips
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Afternoon slump? 🧘",
      body: "Step away from the desk — a 5-min walk boosts metabolism and focus.",
      data: { type: "slump_nudge" },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 14,
      minute: 30,
    },
  });
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Enables smart check-in reminders based on the user's preferred time.
 * Also schedules the afternoon slump nudge.
 */
export async function enableReminders(config: ReminderConfig): Promise<void> {
  if (!config.enabled) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return;
  }

  const hour = config.customHour ?? SUGGESTED_TIMES[config.time].hour;

  await _scheduleCheckInReminder(hour, 0);
  await _scheduleSlumpNudge();
}

/**
 * Called after a check-in is submitted.
 * Snoozes the next reminder by 30 minutes to avoid spamming.
 */
export async function snoozeNextReminder(minutes: number = 30): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const [existing] = await Notifications.getPresentedNotificationsAsync();
  if (existing) return; // already visible, don't re-schedule

  const trigger: Notifications.NotificationTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: minutes * 60,
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Don't forget! 🌙",
      body: "Your evening check-in is waiting.",
      data: { type: "checkin_reminder" },
      sound: true,
    },
    trigger,
  });
}

/**
 * Returns the suggested reminder times for display in a settings UI.
 */
export function getSuggestedTimes(): {
  value: ReminderTime;
  label: string;
  description: string;
}[] {
  return [
    {
      value: "morning",
      label: "Morning",
      description: "Reminder at 7:00 AM",
    },
    {
      value: "evening",
      label: "Evening",
      description: "Reminder at 7:00 PM",
    },
    {
      value: "night",
      label: "Night",
      description: "Reminder at 9:00 PM",
    },
  ];
}

// ─── Re-engagement hooks ─────────────────────────────────────────────────────

const REENGAGEMENT_KEY = "metabo_last_reengagement_date";

interface ReEngagementTier {
  minDays: number;
  maxDays: number;
  title: string;
  body: string;
  dataType: string;
}

const REENGAGEMENT_TIERS: ReEngagementTier[] = [
  {
    minDays: 3,
    maxDays: 6,
    title: "Your streak is at risk! 🏃",
    body: "Just 1 check-in tonight saves it. 30 seconds — that's it.",
    dataType: "reengagement_3day",
  },
  {
    minDays: 7,
    maxDays: 13,
    title: "Hey, we miss you 👋",
    body: "It's been a week. Your MWI baseline is waiting for you.",
    dataType: "reengagement_7day",
  },
  {
    minDays: 14,
    maxDays: 29,
    title: "Your AI Coach is worried 😟",
    body: "Two weeks without a check-in. Your energy trends were looking up — don't lose momentum.",
    dataType: "reengagement_14day",
  },
  {
    minDays: 30,
    maxDays: Infinity,
    title: "Let's start fresh 🌱",
    body: "Your baseline has expired. Ready to rebuild your MWI? Takes 2 minutes.",
    dataType: "reengagement_30day",
  },
];

/**
 * Checks days since last check-in and fires a re-engagement notification
 * if one hasn't been sent for this tier today.
 * Call this on app launch (WelcomeScreen useEffect).
 */
export async function fireReEngagementHook(): Promise<void> {
  if (!Device.isDevice) return;

  const daysSince = await StorageService.getDaysSinceLastCheckIn();
  if (daysSince < 0 || daysSince < 3) return; // never checked in, or still active

  const tier = REENGAGEMENT_TIERS.find(
    (t) => daysSince >= t.minDays && daysSince <= t.maxDays,
  );
  if (!tier) return;

  // Avoid spamming: only fire once per tier per user
  try {
    const lastFired = await AsyncStorage.getItem(REENGAGEMENT_KEY);
    if (lastFired) {
      const { tier: lastTier, date } = JSON.parse(lastFired);
      const firedToday =
        new Date(date).toDateString() === new Date().toDateString();
      if (firedToday && lastTier === tier.dataType) return;
    }
  } catch {
    // first time, proceed
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: tier.title,
      body: tier.body,
      data: { type: tier.dataType },
      sound: true,
    },
    trigger: null, // fires immediately
  });

  await AsyncStorage.setItem(
    REENGAGEMENT_KEY,
    JSON.stringify({ tier: tier.dataType, date: new Date().toISOString() }),
  );
}

/**
 * Resets re-engagement tracking when user checks in.
 * Call this after a successful check-in submission.
 */
export async function resetReEngagementTracking(): Promise<void> {
  try {
    await AsyncStorage.removeItem(REENGAGEMENT_KEY);
  } catch {
    // ignore
  }
}

// ─── Asian contextual hooks ────────────────────────────────────────────────────

const ASIAN_HOOKS_KEY = "metabo_last_asian_hook_date";

interface AsianContextHook {
  triggerHour: number;
  triggerMinute: number;
  title: string;
  body: string;
  dataType: string;
}

// Weekend — market food nudge
const ASIAN_HOOKS: AsianContextHook[] = [
  {
    triggerHour: 18,
    triggerMinute: 0,
    title: "Weekend market mode? 🍜",
    body: "Logging your weekend meals helps your MWI stay accurate. Check in after your meal!",
    dataType: "asian_weekend_food",
  },
  {
    triggerHour: 9,
    triggerMinute: 0,
    title: "Fresh week, fresh baseline 💪",
    body: "Monday morning check-in sets the tone. How'd you sleep?",
    dataType: "asian_monday_morning",
  },
];

/**
 * Schedules Asian-contextual notifications (weekend market food, Monday kickoff).
 * Call once on app launch to set up recurring contextual hooks.
 */
export async function scheduleAsianContextHooks(): Promise<void> {
  if (!Device.isDevice) return;

  // Cancel existing contextual hooks before rescheduling
  const existing = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of existing) {
    if (
      n.content.data &&
      typeof n.content.data === "object" &&
      "type" in n.content.data
    ) {
      const t = (n.content.data as any).type as string;
      if (t.startsWith("asian_")) {
        await Notifications.cancelScheduledNotificationAsync(n.identifier);
      }
    }
  }

  for (const hook of ASIAN_HOOKS) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: hook.title,
        body: hook.body,
        data: { type: hook.dataType },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: hook.dataType === "asian_weekend_food" ? 6 : 1, // Saturday=6, Monday=1
        hour: hook.triggerHour,
        minute: hook.triggerMinute,
      },
    });
  }
}

// ─── Seated-nudge hook ───────────────────────────────────────────────────────

const SEATED_NUDGE_KEY = "metabo_last_seated_nudge";

interface SeatedNudgeTier {
  triggerHour: number;
  triggerMinute: number;
  title: string;
  body: string;
  dataType: string;
}

const SEATED_NUDGES: SeatedNudgeTier[] = [
  {
    triggerHour: 10,
    triggerMinute: 30,
    title: "You've been seated 90 min 🪑",
    body: "Neck feeling tight? Try the neck release stretch — 30 seconds, right at your desk.",
    dataType: "seated_morning",
  },
  {
    triggerHour: 14,
    triggerMinute: 0,
    title: "Post-lunch slump? Stand up 💪",
    body: "Harvard study: 5 min standing every 30 min cuts blood sugar spikes by 34%. Try a lap around the office.",
    dataType: "seated_afternoon",
  },
  {
    triggerHour: 16,
    triggerMinute: 0,
    title: "Last stretch before home 🙆",
    body: "Hip flexors getting tight from sitting? Try a 2-min standing forward fold before you leave.",
    dataType: "seated_late_afternoon",
  },
];

/**
 * Schedules recurring seated-nudge notifications on weekdays at times when
 * desk workers are most sedentary (mid-morning, post-lunch, late afternoon).
 * Call on app launch alongside scheduleAsianContextHooks().
 */
export async function scheduleSeatedNudges(): Promise<void> {
  if (!Device.isDevice) return;

  // Cancel existing seated nudges before rescheduling
  const existing = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of existing) {
    if (
      n.content.data &&
      typeof n.content.data === "object" &&
      "type" in n.content.data
    ) {
      const t = (n.content.data as any).type as string;
      if (t.startsWith("seated_")) {
        await Notifications.cancelScheduledNotificationAsync(n.identifier);
      }
    }
  }

  // Fire Mon–Fri (weekday 1–5). Each nudge gets a different day so
  // there's at least one reminder every working day.
  const weekdayMap: Record<number, (typeof SEATED_NUDGES)[number][]> = {
    1: [SEATED_NUDGES[0]], // Monday:    morning 10:30
    2: [SEATED_NUDGES[1]], // Tuesday:   afternoon 14:00
    3: [SEATED_NUDGES[0]], // Wednesday: morning 10:30
    4: [SEATED_NUDGES[1]], // Thursday:  afternoon 14:00
    5: [SEATED_NUDGES[2]], // Friday:    late-afternoon 16:00
  };

  for (const [weekday, nudges] of Object.entries(weekdayMap)) {
    for (const nudge of nudges) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: nudge.title,
          body: nudge.body,
          data: { type: nudge.dataType },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: Number(weekday),
          hour: nudge.triggerHour,
          minute: nudge.triggerMinute,
        },
      });
    }
  }
}

/**
 * Fires a one-off seated nudge for users showing low-activity patterns.
 * Call from Coach or WelcomeScreen when check-in data shows high stress / no movement.
 */
export async function fireSeatedNudge(): Promise<void> {
  if (!Device.isDevice) return;

  try {
    const last = await AsyncStorage.getItem(SEATED_NUDGE_KEY);
    if (last) {
      const { date } = JSON.parse(last);
      if (new Date(date).toDateString() === new Date().toDateString()) return;
    }
  } catch {
    // proceed
  }

  const pick = SEATED_NUDGES[Math.floor(Math.random() * SEATED_NUDGES.length)];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: pick.title,
      body: pick.body,
      data: { type: pick.dataType },
      sound: true,
    },
    trigger: null,
  });

  await AsyncStorage.setItem(
    SEATED_NUDGE_KEY,
    JSON.stringify({ date: new Date().toISOString() }),
  );
}

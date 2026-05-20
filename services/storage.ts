import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CheckIn {
  date: string;
  sleepQuality: number;
  energy: number;
  stress: number;
  soreness: string;
  hawkerMeals?: number;
  waterIntake?: number;
  activity?: string;
  notes?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  sex: string;
  height: number;
  weight: number;
  ethnicity: string;
  familyHistoryT2D: boolean;
  wearableConnected: boolean;
  avatar?: string;
}

const KEYS = {
  PROFILE: "metabo_profile",
  CHECKINS: "metabo_checkins",
  STREAK: "metabo_streak",
  DAYS_SINCE_SIGNUP: "metabo_days_since_signup",
  TEAM: "metabo_team",
  AI_HISTORY: "metabo_ai_history",
};

export const StorageService = {
  async getProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  async getCheckIns(): Promise<CheckIn[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CHECKINS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveCheckIn(checkIn: CheckIn): Promise<void> {
    const checkIns = await this.getCheckIns();
    const existing = checkIns.findIndex((c) => c.date === checkIn.date);
    if (existing >= 0) checkIns[existing] = checkIn;
    else checkIns.push(checkIn);
    await AsyncStorage.setItem(KEYS.CHECKINS, JSON.stringify(checkIns));
  },

  async getStreak(): Promise<number> {
    try {
      const val = await AsyncStorage.getItem(KEYS.STREAK);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  },

  async saveStreak(streak: number): Promise<void> {
    await AsyncStorage.setItem(KEYS.STREAK, String(streak));
  },

  async getDaysSinceSignup(): Promise<number> {
    try {
      const val = await AsyncStorage.getItem(KEYS.DAYS_SINCE_SIGNUP);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  },

  async getSignupDate(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem("metabo_signup_date");
    } catch {
      return null;
    }
  },

  async setSignupDate(date: string): Promise<void> {
    await AsyncStorage.setItem("metabo_signup_date", date);
  },

  async clearAll(): Promise<void> {
    const keys = Object.values(KEYS);
    await Promise.all(keys.map((k) => AsyncStorage.removeItem(k)));
  },

  async getLastCheckInDate(): Promise<string | null> {
    try {
      const checkIns = await this.getCheckIns();
      if (checkIns.length === 0) return null;
      // Check-ins are stored most-recent-last, so grab the last entry
      return checkIns[checkIns.length - 1]?.date ?? null;
    } catch {
      return null;
    }
  },

  async getDaysSinceLastCheckIn(): Promise<number> {
    const lastDate = await this.getLastCheckInDate();
    if (!lastDate) return -1; // never checked in
    const last = new Date(lastDate);
    last.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.floor(
      (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
    );
  },
};

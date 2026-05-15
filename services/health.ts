import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeModules, Platform } from "react-native";

/**
 * Apple HealthKit / Apple Watch integration service.
 *
 * Data we read from Apple Watch:
 *   - Heart Rate Variability (SDNN)   → recovery scoring
 *   - Resting Heart Rate               → cardiovascular baseline
 *   - Step Count                      → team challenge progress
 *   - Sleep Analysis                  → baseline building
 *
 * Architecture:
 *   1. Native iOS module (Local CocoaPod) bridges HealthKit to JS via bridge.
 *   2. This service handles authorization, caching, and date-range queries.
 *   3. Exposes simple getters used by WelcomeScreen / Coach / MWI screens.
 *
 * Native setup (after `npx expo prebuild`):
 *   1. Add local pod to ios/Podfile: pod 'MetaboHealthKit', path: '../ios/LocalPods/MetaboHealthKit'
 *   2. Run `pod install` in ios/ directory
 *   3. The module will auto-wire via the bridge
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeartRateVariability {
  date: string; // "YYYY-MM-DD"
  sdnnMs: number; // SDNN in milliseconds (higher = more recovered)
  timestamp: number; // Unix ms of sample
}

export interface StepCount {
  date: string;
  count: number;
  goal: number;
}

export interface SleepAnalysis {
  date: string; // night of sleep (YYYY-MM-DD)
  durationMinutes: number;
  stages: {
    deep: number;
    core: number;
    rem: number;
    awake: number;
  };
}

export interface RestingHeartRate {
  date: string;
  bpm: number;
}

export interface HealthStats {
  hrv: HeartRateVariability[];
  steps: StepCount[];
  sleep: SleepAnalysis[];
  restingHeartRate: RestingHeartRate[];
  lastSynced: string | null; // ISO date string
}

// ─── Authorization ────────────────────────────────────────────────────────────

export type AuthorizationStatus = "notDetermined" | "denied" | "authorized";

let _authStatus: AuthorizationStatus = "notDetermined";

export async function requestHealthKitAuthorization(): Promise<AuthorizationStatus> {
  if (Platform.OS !== "ios") {
    _authStatus = "denied";
    return _authStatus;
  }
  try {
    const granted = await Native.requestAuthorization();
    _authStatus = granted ? "authorized" : "denied";
  } catch (err) {
    console.warn("HealthKit authorization failed:", err);
    _authStatus = "denied";
  }
  return _authStatus;
}

export function getAuthorizationStatus(): AuthorizationStatus {
  return _authStatus;
}

// ─── Cached read (hybrid approach: native when available, storage fallback) ──

export async function getCachedSteps(): Promise<StepCount[]> {
  try {
    const raw = await AsyncStorage.getItem("metabo_health_steps");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function _saveStepsToCache(steps: StepCount[]): Promise<void> {
  const cache = { steps, lastSynced: new Date().toISOString() };
  await AsyncStorage.setItem("metabo_health_steps", JSON.stringify(cache));
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the last 7 days of step counts from Apple Watch.
 * Falls back to cached data if HealthKit is unavailable.
 */
export async function getWeeklySteps(): Promise<StepCount[]> {
  const { start, end } = dateRange(7);
  const result = await callNative<StepCount[]>("getSteps", start, end, []);
  if (result.length > 0) {
    await _saveStepsToCache(result);
  }
  return result.length > 0 ? result : await getCachedSteps();
}

/**
 * Returns HRV (SDNN) samples for the last 14 days.
 * Used by Coach and MWI screen to compute recovery scores.
 */
export async function getHRVSamples(): Promise<HeartRateVariability[]> {
  const { start, end } = dateRange(14);
  return callNative<HeartRateVariability[]>("getHRVSamples", start, end, []);
}

/**
 * Returns sleep analysis for the last 7 nights.
 */
export async function getSleepAnalysis(): Promise<SleepAnalysis[]> {
  const { start, end } = dateRange(7);
  return callNative<SleepAnalysis[]>("getSleepAnalysis", start, end, []);
}

/**
 * Returns resting heart rate for the last 30 days.
 */
export async function getRestingHeartRate(): Promise<RestingHeartRate[]> {
  const { start, end } = dateRange(30);
  return callNative<RestingHeartRate[]>("getRestingHeartRate", start, end, []);
}

/**
 * Saves step data received from native module to local cache.
 * Called by the native module's JS event handler after a background delivery.
 */
export async function saveStepData(steps: StepCount[]): Promise<void> {
  await _saveStepsToCache(steps);
  // Also update the team progress
  const todaySteps = steps.find(
    (s) => s.date === new Date().toISOString().split("T")[0],
  );
  if (todaySteps) {
    const { TeamService } = await import("./team");
    await TeamService.updateMySteps(todaySteps.count);
  }
}

/**
 * Computes a recovery score (0–100) from today's HRV relative to your 14-day baseline.
 * Higher HRV = better recovery.
 */
export async function computeRecoveryScore(): Promise<number> {
  const samples = await getHRVSamples();
  const today = new Date().toISOString().split("T")[0];
  const todaySample = samples.find((s) => s.date === today);
  const todayHrv = todaySample?.sdnnMs ?? 0;

  if (todayHrv === 0) return 0;

  const recentSamples = samples.filter((s) => s.date !== today).slice(-13);
  if (recentSamples.length === 0) return 50;

  const min = Math.min(...recentSamples.map((s) => s.sdnnMs));
  const max = Math.max(...recentSamples.map((s) => s.sdnnMs));

  if (max === min) return 70;
  const score = ((todayHrv - min) / (max - min)) * 100;
  return Math.round(Math.max(0, Math.min(100, score)));
}

// ─── Native module ────────────────────────────────────────────────────────────

const Native: any =
  Platform.OS === "ios" ? NativeModules.MetaboHealthKit : null;

function dateRange(days: number): { start: number; end: number } {
  const end = Date.now();
  const start = end - days * 24 * 60 * 60 * 1000;
  return { start, end };
}

async function callNative<T>(
  method: string,
  startMs: number,
  endMs: number,
  fallback: T,
): Promise<T> {
  if (!Native) return fallback;
  try {
    return await Native[method](startMs, endMs);
  } catch (err) {
    console.warn(`MetaboHealthKit.${method} failed:`, err);
    return fallback;
  }
}

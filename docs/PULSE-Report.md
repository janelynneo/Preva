# Pulse by MetaboApp — Product Report

**App Repository (pulso branch)**: https://github.com/janelynneo/Preva/tree/pulso
**Analysis & Documentation (main branch)**: https://github.com/janelynneo/Preva/tree/main
**Version**: 1.0.0
**Date**: 2026-05-20
**Audience**: Business Manager · End User · Developer

---

## Executive Summary

Pulse is a daily metabolic wellness companion built for Asian desk workers. It tracks sleep, recovery, meal habits, and stress through a 30-second daily check-in, builds a personalised Metabolic Wellness Index (MWI) over 28 days, delivers an AI coach, and keeps users moving with desk stretch reminders and team challenges.

The app runs entirely on-device — no account, no cloud backend, no third-party data sharing. It is ready for internal testing and beta deployment.

---

## 1. Business Manager: Why Pulse Is Ready to Launch

### The Problem

Asian desk workers face a specific cluster of preventable health risks — Type 2 Diabetes (T2D) prevalence in Singapore alone exceeds 9% of adults, and metabolic decline often begins silently in the 25–40 age range before symptoms appear. Existing wellness apps are generic, calorie-obsessed, and built for gym-goers — not people who sit at desks 8+ hours a day and eat at hawker centres.

### Market Fit

Pulse is not another fitness tracker. It is the only daily wellness app that:

- **Personalises by ethnicity** — Asian metabolic patterns differ from Western norms; the app adjusts insights accordingly
- **References hawker food culture** — tips mention brown rice over white rice, "少油" (less oil), fish soup as a low-GI option — not a Mediterranean diet template
- **Targets desk-bound sedentary risk** — seated-nudge notifications, desk stretch timers, and posture tips address the actual workday risk
- **Builds a preventive baseline** — the 28-day MWI gives users a number that improves with lifestyle, before a doctor would flag anything

### What the App Does (Feature Set)

| Feature                            | Description                                                                                                                               |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Daily Check-In**                 | 6-step evening log: sleep quality, energy, soreness, stress, healthy meals, optional meal photo. Takes 30 seconds.                        |
| **Metabolic Wellness Index (MWI)** | Composite score computed from 28 days of check-in data. Users see their number and tier (1–5).                                            |
| **Metabolic Age**                  | Estimated from HRV baseline, resting heart rate, and sleep quality. Motivational delta shown vs chronological age.                        |
| **Apple Watch Integration**        | HRV (SDNN), resting heart rate, steps, sleep via native HealthKit bridge — no manual entry required.                                      |
| **AI Coach**                       | Conversational wellness advisor powered by Ollama (runs locally or on a home server). Private — no data leaves the device.                |
| **Desk Stretch Timer**             | Interactive stretch cards on the home screen. Tap "Take a stretch break" → random stretch selected → countdown timer → pause/resume/skip. |
| **Smart Notifications**            | Personalised reminder time + afternoon slump nudge (2:30 PM) + seated-nudge reminders Mon–Fri at 10:30 AM, 2 PM, 4 PM.                    |
| **Team Challenges**                | Create or join teams. Collective step goals. Weekly leaderboard.                                                                          |
| **Re-engagement Hooks**            | After 3, 7, 14, or 30 days without a check-in, the app sends escalating "we miss you" nudges to bring users back.                         |
| **Ambient Sound**                  | Built-in background music player for focus or relaxation.                                                                                 |

### Compliance & Privacy

- **All data stored locally** — AsyncStorage on-device. No cloud. No third-party sharing.
- **PDPA-compliant** — no data leaves the device without explicit user consent.
- **No medical device claim** — the app states clearly: "This app is not a medical device. Consult your doctor for medical advice."

### What's Been Built

13 functional commits across the full stack — onboarding, check-in flow, MWI screen, AI coach, notifications, HealthKit bridge, team challenges, desk stretches, ambient music, weekly summary.

### What Remains Before Production

- **Team service is mock** — team challenges work in the UI but the backend is stubbed. A real backend (Firebase, Supabase, or similar) would need to be wired in.
- **HealthKit requires native build** — Expo Go works for development, but a `npx expo run:ios` native build is needed for full HealthKit access on a physical device.
- **AI Coach requires Ollama** — the AI coach runs on a local or remote Ollama server. Default is `localhost:11434`; remote servers are configured via `.env`.

---

## 2. End User: What Pulse Does For You

### Getting Started

1. Download the repo and run `npm install && npx expo start`
2. Open the app → onboarding asks 7 questions (name, age, sex, height/weight, ethnicity, family diabetes history, Apple Watch connection)
3. Set your preferred check-in reminder time
4. You're in — the home screen is your hub

### The Home Screen

Your home screen greets you by name, shows your streak count, and displays:

- **This Week's Summary** — your average sleep, energy, and stress over the last 7 days
- **MWI Banner** — your Metabolic Wellness Index score (appears after 28 days of data)
- **Today's Insight** — a personalised tip based on your check-in history, ethnicity, and time of day
- **Desk Stretches** — tap "Take a stretch break" to get a random desk stretch with a countdown timer
- **Team Challenge** — if you're in a team, see collective progress and this week's leaderboard
- **Morning Briefing / Ask Coach** — two action buttons

### Daily Check-In

The check-in takes 30 seconds. Six questions:

1. How refreshed do you feel? (emoji scale: 😴 → 🔥)
2. Did you beat the 3pm slump? (emoji scale: 😫 → 🚀)
3. Any muscle soreness today? (None / Mild / Moderate / Severe)
4. How's your stress level? (emoji scale: 😌 → 🤯)
5. Healthy meals today? (stepper: 0–9)
6. Optional: snap or choose a photo of your meal

After submitting, you see a success screen with your streak count and a personalised recommendation (e.g., "Based on your check-in, we recommend an early night tonight").

### Desk Stretch Timer

From the home screen, tap "Take a stretch break". A random stretch is picked from 8 options (cat-cow, neck release, hip flexor, wrist circles, and more). A countdown timer starts — pause, resume, or skip. Stretches include:

- **Neck Release** (1 min) — for after long calls
- **Hip Flexor Stretch** (2 min) — counteracts seated hip flexion
- **Desk Calf Raise** (1 min) — boosts leg circulation after sitting
- **Wrist Circles** (30 sec) — prevents RSI from typing

### Notifications You Receive

- **Daily reminder** at your chosen time (default 8 PM)
- **Afternoon slump nudge** at 2:30 PM: "Step away from the desk — a 5-min walk boosts metabolism and focus."
- **Seated nudges Mon–Fri**: 10:30 AM (neck release), 2 PM (post-lunch stand up), 4 PM (hip flexor before home)
- **Weekend market nudge** (Saturday 6 PM): reminds you to log weekend meals
- **Monday kickoff** (Monday 9 AM): fresh week motivation
- **"We miss you"** nudges after 3, 7, 14, 30 days of inactivity

### AI Coach

The chat screen gives you a conversational wellness advisor. Ask anything: "Why am I always tired at 3pm?", "Is brown rice actually better than white?", "I skipped the gym today, should I worry?" The coach has conversation history — it remembers your context across messages.

The AI runs via Ollama, which runs locally on your Mac/PC by default. For remote access (e.g., using your phone away from home), configure `OLLAMA_URL` in `.env` to point to your home server.

### Team Challenges

Create a team and invite friends with a join code. Set a collective step goal. See a weekly leaderboard ranked by steps and streaks. Compete to hit the goal together.

### Data Privacy

Everything stays on your phone. No account. No email. No cloud. You can delete all your data from the Profile screen at any time.

---

## 3. Fellow Developer: Taking Over Pulse

### Repository Structure

```
MetaboApp/
├── App.tsx                      # Navigation root — Stack + Bottom Tab navigators
├── screens/
│   ├── WelcomeScreen.tsx        # Home — greeting, stats, stretches, team, actions
│   ├── OnboardingScreen.tsx     # 7-step profile setup
│   ├── CheckInScreen.tsx        # 6-step evening check-in
│   ├── MWIScreen.tsx            # Metabolic Wellness Index + metabolic age
│   ├── ChatScreen.tsx           # AI Coach via Ollama
│   ├── ProfileScreen.tsx        # User profile + settings
│   ├── WeeklySummaryScreen.tsx  # 7-day trend view
│   ├── CreateTeamScreen.tsx     # Team creation
│   └── JoinTeamScreen.tsx       # Join with code
├── services/
│   ├── storage.ts               # AsyncStorage wrapper — all persistence
│   ├── notifications.ts         # expo-notifications: reminders, nudges, re-engagement
│   ├── insights.ts             # Tips, stretches, quotes, contextual insight logic
│   ├── health.ts               # HealthKit bridge + recovery score + metabolic age
│   ├── aiCoach.ts              # Ollama chat service + conversation history
│   ├── team.ts                 # Team challenge service (mock backend)
│   ├── audio.ts                # expo-av background music service
│   └── config.ts               # Ollama URL/model config
├── components/
│   ├── MusicPlayer.tsx          # Ambient sound UI
│   └── AvatarPicker.tsx        # Profile avatar selection
├── ios/LocalPods/MetaboHealthKit/  # Native HealthKit CocoaPod
└── docs/
    └── PULSE-Report.md         # This document
```

### Key Technical Decisions

**On-device only** — `StorageService` in `services/storage.ts` is the single data layer. Every screen imports from it. It wraps AsyncStorage with typed methods: `getProfile`, `saveCheckIn`, `getStreak`, etc. There is no API client, no fetch, no network call for user data.

**AsyncStorage keys** (from `services/storage.ts`):

```
metabo_profile          → UserProfile JSON
metabo_checkins         → CheckIn[] array
metabo_streak           → number (string)
metabo_days_since_signup → number (string)
metabo_signup_date      → ISO date string
metabo_team             → team JSON
metabo_ai_history       → AIMessage[] array
```

**Navigation** — React Navigation v7. `App.tsx` checks `StorageService.getProfile()` on launch to decide whether to show onboarding or the main tab navigator. The stack navigator holds the tab navigator and modal screens (MWI, WeeklySummary, CreateTeam, JoinTeam).

**Error boundary** — `WelcomeScreen` is wrapped in a `WelcomeScreenBoundary` class component error boundary. If any async render error occurs, users see a clean "Something went wrong — please restart the app" screen instead of a white screen.

**Timeouts everywhere** — `WelcomeScreen` wraps HealthKit calls, team service calls, and AI coach calls in `withTimeout()` helpers (5-second default). If any of these hang, the UI continues to render without blocking.

**Ollama config** — `services/config.ts` holds the Ollama URL and model. Defaults: `http://localhost:11434/v1/chat/completions` with model `mistral:7b`. Override via `.env`:

```
OLLAMA_URL=http://your-server:11434/v1/chat/completions
OLLAMA_MODEL=mistral:7b
```

**AI Coach** (`services/aiCoach.ts`) — sends messages to Ollama's OpenAI-compatible `/v1/chat/completions` endpoint. Conversation history is stored in AsyncStorage and injected into each request as a message array. Has a 20-second timeout via `AbortController`. Welcome prompt personalises the coach's tone based on the user's name and check-in streak.

### Notification Architecture

`services/notifications.ts` manages all notification scheduling:

- **Reminder scheduling** — cancels all and reschedules on each app launch to prevent duplicates
- **Seated nudges** — `scheduleSeatedNudges()` distributes three nudges across Mon–Fri (not a fixed day, but Mon morning, Tue afternoon, Wed morning, Thu afternoon, Fri late-afternoon) so there's one reminder every working day
- **Asian contextual hooks** — Saturday 6 PM (weekend meal reminder) and Monday 9 AM (fresh week kickoff)
- **Re-engagement hooks** — fire once per inactivity tier (3/7/14/30 days) per user, tracked in AsyncStorage to prevent spam

### HealthKit Native Module

`ios/LocalPods/MetaboHealthKit/` is a local CocoaPod. It bridges HealthKit data types to React Native JS:

- `requestAuthorization()` — requests HealthKit read permission
- `getHeartRateVariability(samples)` — returns SDNN data for recovery scoring
- `getStepCount(date)` — returns step count for team challenges
- `getSleepAnalysis(date)` — returns sleep stages (deep/core/REM/awake)

The pod is referenced in `ios/Podfile` as `pod 'MetaboHealthKit', path: '../ios/LocalPods/MetaboHealthKit'`.

### Machine Learning Layer

**Current Stage: Demo / Prototype**

The ML architecture is designed in two layers. At this demo stage, the app uses simulated data and logic to validate the product concept and user engagement loop. The actual ML models will be connected in a subsequent phase.

**Layer 1 — Supervised (10-year metabolic risk):**
Cox PH / Random Survival Forest models trained on NHANES (National Health and Nutrition Examination Survey) data → outputs a "Metabolic Wellness Index" tier (1–5), shown as a personal wellness score, never as a disease diagnosis. This layer runs server-side once the app has an active user base for model training.

**Layer 2 — Unsupervised (daily nudges):**
Personal baseline deviation + anomaly detection on check-in signals (sleep, HRV, energy, stress, meal quality) → generates the daily nudges and personalised insights. This is a per-user model that learns from 28 days of check-in history to detect meaningful deviations from personal norm.

**Data Sources (future integration):**

- **Wearables** — Apple Watch via HealthKit (HRV, resting heart rate, steps, sleep) and Fitbit (HRV, sleep stages) will feed the personal baseline model. The HealthKit bridge is already wired in the app; Fitbit integration is scoped for Year 2.
- **Self-reported check-ins** — daily 30-second log provides the behavioral signal ground truth for model training.
- **NHANES** — US epidemiology dataset used for the population-level risk tier calibration (Layer 1). Asian metabolic norms will be calibrated against Singapore health datasets in Year 2 as local data becomes available.

**Current implementation:**
The app computes a simplified MWI score from check-in data and Apple Watch metrics using rule-based logic. This is functional for the demo and validates the engagement loop. The full ML pipeline will be integrated once:

1. The app architecture is validated with real users
2. A sufficient dataset is collected (minimum ~500 active users for baseline model training)
3. The backend infrastructure is in place for model serving

---

### Known Issues

1. **Team service is mock** — `services/team.ts` returns hardcoded data. A real backend (Firebase/Supabase/custom API) needs to be integrated before team challenges work across users.
2. **No health fetch timeout** — `services/health.ts` lacks a fetch timeout. A 20-second timeout (same pattern as `aiCoach.ts`) should be added.
3. **Package version warnings** — several Expo dependencies (e.g., `async-storage@3.0.2` vs expected `2.2.0`) are ahead of the Expo SDK 54 managed package versions. Run `npm install` and review the warnings before a production build.
4. **Apple Watch requires native build** — HealthKit data only works fully when running via `npx expo run:ios`, not Expo Go.

### Running the App

```bash
cd MetaboApp
cp .env.example .env        # configure OLLAMA_URL if using remote Ollama
npm install
cd ios && pod install       # install native dependencies
npx expo start             # Expo Go (fastest for phone preview)
npx expo run:ios          # native iOS build on simulator
```

### Environment Variables

```env
OLLAMA_URL=http://localhost:11434/v1/chat/completions
OLLAMA_MODEL=mistral:7b
```

### Dependencies

| Package                                   | Version  | Purpose                |
| ----------------------------------------- | -------- | ---------------------- |
| expo                                      | ~54.0.33 | Framework              |
| react-native                              | 0.81.5   | UI framework           |
| @react-navigation/native-stack            | ^7.15.0  | Stack navigation       |
| @react-navigation/bottom-tabs             | ^7.15.13 | Tab navigation         |
| @react-native-async-storage/async-storage | ^3.0.2   | Local data persistence |
| expo-notifications                        | ^55.0.23 | Reminders + nudges     |
| expo-av                                   | ^16.0.8  | Background music       |
| expo-image-picker                         | ^55.0.20 | Meal photos            |
| expo-device                               | ^55.0.17 | Device detection       |

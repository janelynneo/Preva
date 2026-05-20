# MetaboApp Screens

## Overview

MetaboApp is a daily metabolic wellness companion for Singapore desk workers. It tracks sleep, recovery, hawker habits, and stress through daily check-ins and Apple Watch integration.

**Tech stack:** Expo SDK 54, React Native 0.81.5 (New Architecture), TypeScript, AsyncStorage, Ollama (local AI)

---

## Screen Inventory

### 1. WelcomeScreen (`screens/WelcomeScreen.tsx`)

**Purpose:** Home screen for both first-time and returning users.

**First-time users:**

- App logo + tagline
- MWI explanation card (hero card with mock stats)
- "How it works" feature list
- Benefits card (hawker culture, sleep-energy link, T2D prevention, team challenges)
- Motivational quote (navy card `#0D3B3B`)
- CTA: "Start My Baseline"

**Returning users:**

- Header: greeting ("Good morning/afternoon/evening, [name]!"), motivational quote (navy card), day counter ("Day N of 28 baseline")
- Streak badge (fire emoji)
- THIS WEEK: Week-at-a-glance card (avg sleep/energy/stress, 7-day window)
- BASELINE BUILDING or MWI Banner (live MWI score from HealthKit HRV, or check-in-based fallback)
- TODAY'S INSIGHT: personalised tip based on ethnicity + check-in patterns
- TEAM CHALLENGE: progress bar + member avatars
- Quote card (navy `#0D3B3B` background)
- Action buttons: "Morning Briefing" (→ CheckIn) + "Ask Coach" (→ ChatScreen)

**MWI Score:** Computed from HealthKit HRV via `computeRecoveryScore()`. Falls back to a check-in-based formula (sleep×30 + energy×25 + stress-penalty×20 + streak bonus) when HealthKit is unavailable. Displays "—" if no data.

**Key state:** `profile`, `checkIns`, `streak`, `daysSinceSignup`, `team`, `teamProgress`, `dailyInsight`, `quote`, `mwiScore`

---

### 2. OnboardingScreen (`screens/OnboardingScreen.tsx`)

**Purpose:** Collect user profile to personalise the app.

**Steps:**

1. Name + age
2. Sex (male/female)
3. Height + weight
4. Ethnicity (Chinese / Malay / Indian / Others)
5. Family history of T2D (yes/no)
6. Wearable connection (Apple Watch: yes/no)
7. Notification preferences

**Storage:** Saves to `StorageService.saveProfile()` on completion. Sets signup date.

---

### 3. CheckInScreen (`screens/CheckInScreen.tsx`)

**Purpose:** Daily evening check-in — 6 steps, ~30 seconds.

**Steps:**

1. Sleep quality (★ 1–5)
2. Soreness (None / Mild / Moderate / Severe)
3. Energy level (● 1–5 dots)
4. Stress level (● 1–5 dots)
5. Hawker meals today (stepper 0–10) + optional photo
6. Summary + submit

**Success screen:** 🎉 + streak card (live streak count) + personalised message + "Done" → HomeTabs

**Key state:** `sleepQuality`, `soreness`, `energyLevel`, `stressLevel`, `hawkerMeals`, `photoUri`, `saving`, `streak`

**Persistence:** `StorageService.saveCheckIn()` saves to `metabo_checkins` key in AsyncStorage. Streak is calculated on submit (increments for consecutive days, resets if gap > 1 day). Submit button shows "Saving..." while persisting.

---

### 4. HomeScreen (`screens/HomeScreen.tsx`)

**Alias:** Currently mapped to `HomeTabs` in `App.tsx`. The tab bar uses WelcomeScreen as the home tab.

---

### 5. ProfileScreen (`screens/ProfileScreen.tsx`)

**Purpose:** View/edit user profile, manage settings.

**Sections:**

- Avatar picker
- Personal info (name, age, sex, ethnicity)
- Health context (height, weight, BMI, family T2D history)
- Wearable status (Apple Watch connection)
- Notification preferences (morning/evening/night reminder time)
- Data export (JSON)
- Sign out / clear data

---

### 6. MWIScreen (`screens/MWIScreen.tsx`)

**Purpose:** Display the user's Metabolic Wellness Index — a composite score based on 28-day baseline.

**Content:**

- Tier display (Tier 1 🟢 / Tier 2 🟡 / Tier 3 🔴)
- Recovery trend percentage
- Accuracy indicator
- Tier comparison chart (3 tiers with descriptions)
- Recommendation paragraph (wellness-framed)
- FAQ accordion

**Metabolic Age:** Displayed on this screen (from `computeMetabolicAge()` in `services/health.ts`).

---

### 7. WeeklySummaryScreen (`screens/WeeklySummaryScreen.tsx`)

**Purpose:** 7-day trend view — sleep, energy, stress, hawker meals, recovery.

**Content:**

- Week range header
- Bar/trend charts for each metric
- Hawker meal summary
- Most common soreness
- Pattern insight ("Your energy tends to drop mid-week")

---

### 8. ChatScreen (`screens/ChatScreen.tsx`)

**Purpose:** AI Coach chat — metabolic wellness advisor.

**Tech:** Ollama at `OLLAMA_URL` (default: `http://localhost:11434/v1/chat/completions`), model `mistral:7b` (configurable via `OLLAMA_MODEL` env var).

**Context injected into every prompt:**

- User profile (name, age, sex, ethnicity)
- Days since signup + streak
- Last 7 check-in averages (sleep quality, energy, stress)
- Hawker meal pattern

**Messages:** Stored in AsyncStorage (`metabo_ai_history`). Clear history option available.

**Error handling:** Network errors and empty responses are logged to console with URL, model, and error details. User sees same fallback message.

**Error fallback:** "I'm having a little trouble thinking right now — could you try again?" on network/Ollama failure.

---

### 9. CreateTeamScreen (`screens/CreateTeamScreen.tsx`)

**Purpose:** Create a team challenge for collective step goals.

**Fields:** Team name, daily step goal (total), start date.

---

### 10. JoinTeamScreen (`screens/JoinTeamScreen.tsx`)

**Purpose:** Join an existing team by code.

**Fields:** Team code input.

---

## Navigation Structure

```
Stack (Native Stack Navigator)
├── HomeTabs (Bottom Tab Navigator)
│   ├── Welcome (WelcomeScreen)      ← home
│   ├── CheckIn (CheckInScreen)     ← "Morning Briefing" button
│   ├── Profile (ProfileScreen)      ← tab
│   └── Coach (ChatScreen)           ← AI Coach tab
├── Onboarding (OnboardingScreen)
├── MWI (MWIScreen)
├── WeeklySummary (WeeklySummaryScreen)
├── CreateTeam (CreateTeamScreen)
└── JoinTeam (JoinTeamScreen)
```

---

## Services

| File                        | Purpose                                                                    |
| --------------------------- | -------------------------------------------------------------------------- |
| `services/storage.ts`       | AsyncStorage CRUD: profile, check-ins, streak, signup date                 |
| `services/health.ts`        | Apple Watch data (HRV, steps, sleep, RHR) + recovery score + metabolic age |
| `services/insights.ts`      | Daily quote rotation (7 quotes) + daily insight text                       |
| `services/team.ts`          | Team CRUD (in-memory + AsyncStorage)                                       |
| `services/aiCoach.ts`       | Ollama chat integration                                                    |
| `services/notifications.ts` | Smart notification scheduling (check-in reminder + afternoon slump nudge)  |

---

## Native Module

`ios/LocalPods/MetaboHealthKit/` — local CocoaPod bridging Apple HealthKit to React Native.

**Exposed methods:**

- `requestAuthorization()` → Promise<boolean>
- `getAuthorizationStatus()` → Promise<"notDetermined" | "denied" | "authorized">
- `getSteps(startMs, endMs)` → Promise<StepCount[]>
- `getHRVSamples(startMs, endMs)` → Promise<HeartRateVariability[]>
- `getSleepAnalysis(startMs, endMs)` → Promise<SleepAnalysis[]>
- `getRestingHeartRate(startMs, endMs)` → Promise<RestingHeartRate[]>`

---

## Environment Variables

| Variable       | Default                                      | Description            |
| -------------- | -------------------------------------------- | ---------------------- |
| `OLLAMA_URL`   | `http://localhost:11434/v1/chat/completions` | Ollama server endpoint |
| `OLLAMA_MODEL` | `mistral:7b`                                 | Ollama model name      |

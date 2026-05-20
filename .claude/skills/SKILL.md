# MetaboApp Skill

Detailed knowledge for working on MetaboApp — metabolic wellness companion for Singapore desk workers.

## Quick Start

```bash
cd MetaboApp
npx expo start              # Expo Go on phone
npx expo run:ios --no-build-cache  # Native iOS build
npx tsc --noEmit           # Type check
```

## Architecture

**State Management:** React useState + useEffect per screen. No Redux/Zustand.
**Persistence:** AsyncStorage for all data (profile, check-ins, team, AI history).
**AI:** Ollama (not Anthropic). Configurable via `OLLAMA_URL` / `OLLAMA_MODEL` env vars.
**Native Module:** `MetaboHealthKit` — local CocoaPod in `ios/LocalPods/`.

## Key Files

| File                        | Purpose                                                             |
| --------------------------- | ------------------------------------------------------------------- |
| `App.tsx`                   | Navigation (Stack + Tab), launch routing based on profile existence |
| `screens/WelcomeScreen.tsx` | Home — greeting, MWI score, streak, team progress, daily insight    |
| `screens/CheckInScreen.tsx` | 6-step check-in with emoji scales (😴😊🔥)                          |
| `screens/MWIScreen.tsx`     | Metabolic Wellness Index display with tiers                         |
| `services/health.ts`        | computeMetabolicAge(), computeRecoveryScore() — HealthKit bridge    |
| `services/storage.ts`       | StorageService wrapper for AsyncStorage                             |

## Common Tasks

### Add a new check-in question

1. Add state variable in `CheckInScreen.tsx`
2. Add step in the 6-step flow (after step 4, before photo)
3. Update `canProceed()` validation
4. Add to summary step
5. Save in `handleSubmit()` to CheckIn object

### Fix navigation bug

- From Tab navigator to Stack screen: `navigation.getParent?.()?.navigate("ScreenName")`
- From Stack to Tab: navigate to "HomeTabs" then use tabBar ref to switch tabs
- Never use `navigation.replace()` for Tab-level navigation

### Add timeout protection

```typescript
function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  fallback: T,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}
// Usage:
const data = await withTimeout(someAsyncCall(), 5000, fallbackValue);
```

## Design Tokens

| Token         | Value     | Usage                  |
| ------------- | --------- | ---------------------- |
| Primary navy  | `#0D3B3B` | Headers, backgrounds   |
| Accent indigo | `#6366f1` | Buttons, active states |
| Surface bg    | `#f8fafc` | Screen backgrounds     |
| Warning amber | `#eab308` | Tier 2                 |
| Success green | `#22c55e` | Tier 1                 |
| Danger red    | `#ef4444` | Tier 3, errors         |

## Engagement Patterns

### Emoji Scales

Use large circular buttons (56x56px) with emoji:

```typescript
const emojiRow = [
  { val: 1, emoji: "😴" },
  { val: 2, emoji: "😔" },
  { val: 3, emoji: "😐" },
  { val: 4, emoji: "😊" },
  { val: 5, emoji: "🔥" },
];
```

### Streak Display

Show 🔥 emoji + day count. Celebrate milestones (7, 14, 28 days).

### MWI Tiers

- Tier 1 (≥75): Green badge, "Optimal"
- Tier 2 (45-74): Amber badge, "Building"
- Tier 3 (<45): Red badge, "Needs Attention"

## Singapore Context

- Hawker meals: Track frequency, suggest brown rice, less oil options
- Humidity: Affects sleep quality
- Desk workers: Movement reminders, standing breaks
- MRT: Step counting opportunity

## Troubleshooting

| Symptom                      | Check                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| App freezes after onboarding | WelcomeScreen loadData() timeout — add 10s safety timeout                           |
| Button doesn't navigate      | Use `getParent?.()` or check screen name exists in Stack.Navigator                  |
| TypeScript errors            | Run `npx tsc --noEmit`                                                              |
| Bundle fails                 | Run `npx expo install --fix`                                                        |
| HealthKit not working        | Check iOS simulator has Health app; native module requires iOS 16+ for sleep stages |

# 04 — Complete Screen 3: Evening Check-In (with Personalization)

## Context
Screen 3 is the daily check-in. Personalization shows streak + personalized post-submit message.

## Standard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Good evening, Alex! — 30 seconds to wrap up your day.   │
│                                                             │
│  How did you sleep last night?                             │
│  ⭐⭐⭐⭐ ☆                                                   │
│                                                             │
│  Any soreness today?                                        │
│  [ None ] [ Mild ] [ Moderate ] [ Severe ]                 │
│                                                             │
│  Energy level?  ●●●○○                                       │
│                                                             │
│  Stress level?  ●●●●○                                       │
│                                                             │
│  Hawker meals today?  [ 2 ]  (−) [+]  (stepper)          │
│                                                             │
│  [ Submit ✓ ]                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Post-Submit Confirmation (PERSONALIZED)

### First Check-In Ever
```
┌─────────────────────────────────────────────────────────────┐
│  ✓ Check-in complete!                                     │
│                                                             │
│  You're all set for tomorrow.                              │
│  Your baseline is building — Day 1 of 28.                   │
│                                                             │
│  💡 Tip: Your wearable data syncs automatically.           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Streak Display
```
┌─────────────────────────────────────────────────────────────┐
│  ✓ Check-in complete!                                     │
│                                                             │
│  🔥 7 day streak! Your habit is forming.                  │
│                                                             │
│  You checked in 7 days in a row.                          │
│  Most users who reach 14 days keep the habit.            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Re-Engagement (after missing days)
```
┌─────────────────────────────────────────────────────────────┐
│  ✓ Check-in complete!                                     │
│                                                             │
│  Welcome back, Alex! We missed you.                       │
│                                                             │
│  Your streak was 5 days — it's now 1.                     │
│  No worries, you can build it back up!                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Design Requirements
- **Clean, focused** — one question visible at a time OR all 5 shown
- **Large tap targets** — stars, dots, buttons 48px+
- **Streak display** after submit
- **Personalized message** based on streak history
- **Skip option** — small "Skip check-in" text at bottom

## Personalization Elements

| Element | Source | Example |
|---------|--------|---------|
| **Name greeting** | User input | "Good evening, Alex!" |
| **Streak counter** | Check-in history | "🔥 7 day streak!" |
| **First check-in** | Day 1 trigger | "Day 1 of 28 — your baseline is building" |
| **Re-engagement** | Days since last check-in | "Welcome back! We missed you." |
| **Habit encouragement** | Streak milestones | "Most users who reach 14 days keep the habit" |

## Widget Variable Names
- greetingText (with name), sleepQualityStars (1-5), sorenessButtons (None/Mild/Moderate/Severe), energyDots (1-5), stressDots (1-5), hawkerStepper (0-5), submitButton, skipLink, streakBadge, confirmationMessage, reEngagementMessage

## CheckIns Tab Headers
```
day | sleep_quality | soreness | energy | stress | hawker_meals
```

## Implements
- specs/engagement-loop.md §Evening Check-In
- 03-user-flows/user-flow.md §Screen 3 + Personalization Architecture

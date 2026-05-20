# 03 — Complete Screen 2: Morning Briefing (with Personalization)

## Context
Screen 2 is the daily home screen with THREE states based on user's baseline progress. All personalization is key.

## Three States

### State 1: Day 1-6 — Baseline Building

```
┌─────────────────────────────────────────────────────────────┐
│  Good morning, Alex!                                      │
│  Tuesday, 18 March · Day 5 of 28                           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  BUILDING YOUR BASELINE                              │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  We're learning your normal patterns.                │   │
│  │  Your MWI will be ready in 23 days.                  │   │
│  │                                                      │   │
│  │  📊 Baseline progress: [████░░░░░░] 5/28 days       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  TUESDAY INSIGHT                                     │   │
│  │  You tend to be most active on Tuesdays.             │   │
│  │  Your steps are usually 15% higher than average.    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### State 2: Day 7-29 — Active Use (Personalized)

```
┌─────────────────────────────────────────────────────────────┐
│  Good morning, Alex! 👋                                   │
│  Tuesday, 18 March · Day 14 of 28                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  YOUR RECOVERY: 78/100  ↑ +5 this week           │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  ⌚ HRV:  54ms   ↑ 12% vs YOUR baseline      │   │
│  │  💤 Sleep: 6h 48m  85% — 15 min less than usual│   │
│  │  👟 Steps: 7,906  (Tuesday = your workout day!)  │   │
│  │                                                      │   │
│  │  [View My MWI →]                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  TODAY'S RECOMMENDATION 🌧️                        │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  Low HRV detected (12% below your baseline).         │   │
│  │  Your Tuesday workouts are usually outdoors.          │   │
│  │  Consider an indoor stretch instead — rain today.  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### State 3: Day 30+ — Full MWI Active

```
┌─────────────────────────────────────────────────────────────┐
│  Good morning, Alex! 👋                                   │
│  Tuesday, 18 March                                        │
│  Your MWI is updated — Tier 2 🟡                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  YOUR RECOVERY: 78/100  ↑ +5 this week           │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  ⌚ HRV:  54ms   ↑ 12% vs YOUR baseline      │   │
│  │  💤 Sleep: 6h 48m  85% — 15 min less than usual│   │
│  │  👟 Steps: 7,906  (Tuesday = your workout day!)  │   │
│  │                                                      │   │
│  │  [View My MWI →]  ← full tier details shown        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  TODAY'S RECOMMENDATION 🌧️                        │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  Your HRV has been below baseline for 3 days.        │   │
│  │  Tuesday is usually your workout day, but with       │   │
│  │  rain + low HRV: consider yoga instead.             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Personalization Elements

| Element | Source | Example |
|---------|--------|---------|
| **Name greeting** | User input (Step 1) | "Good morning, Alex!" |
| **Day counter** | Days since signup | "Day 14 of 28" |
| **Recovery comparison** | Personal baseline (Layer 2) | "↑ 12% vs YOUR baseline" |
| **Pattern recognition** | Day-of-week trends | "Tuesday = your workout day" |
| **Sleep comparison** | Personal baseline | "15 min less than usual" |
| **Weather-aware** | Weather API (future) | "Rain today — indoor stretch" |
| **MWI status** | Day 30+ trigger | "Your MWI is updated — Tier 2" |

## Design Requirements
- **Dark teal background** (#0D3B3B)
- **White recovery card** — prominent, easy to scan
- **Yellow/gold recommendation card** — draws attention
- **Recovery score is hero element** — largest text
- **Time-based greeting** — Good morning / Good afternoon
- **Numbers have context** — vs personal baseline, not population

## Widget Variable Names
- greetingText (with name), dateText, dayCounter, recoveryScore, recoveryTrend, hrvValue, hrvTrendVsBaseline, sleepValue, sleepComparison, stepsValue, stepsPatternContext, mwiLink, mwiStatusText, recommendationCard, recommendationText, weatherIcon, baselineProgressBar

## Tier Explanation (Modal — accessible from MWI link)

```
┌─────────────────────────────────────────────────────────────┐
│  YOUR METABOLIC WELLNESS INDEX                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  TIER 2 🟡 — MONITORING RECOMMENDED                        │
│                                                              │
│  Your metrics suggest slightly elevated metabolic risk.       │
│  Small changes now can reduce your 10-year risk.            │
│                                                              │
│  Compared to last month: → Stable                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Implements
- specs/engagement-loop.md §Morning Briefing
- specs/ml-architecture.md §Personal Baseline + Anomaly Detection
- 03-user-flows/user-flow.md §Screen 2 + Personalization Architecture

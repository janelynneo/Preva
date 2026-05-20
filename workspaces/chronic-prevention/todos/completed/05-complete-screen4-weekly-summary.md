# 05 — Complete Screen 4: Weekly Summary (Personalized Highlight)

## Context
Screen 4 shows weekly trends. Personalization: highlight is the BIGGEST PERSONAL CHANGE, not generic metrics.

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  YOUR WEEK IN REVIEW                                         │
│  March 10–16, 2025  (Alex's 3rd week)                      │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  🌟 YOUR HIGHLIGHT                                         │
│  Your deep sleep improved 15% this week!                   │
│  (Biggest personal change, not generic)                   │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Recovery     │  │ Sleep        │                        │
│  │ ↑ 12%       │  │ 85% avg      │                        │
│  │ 🟢 Good     │  │ 🟢 On target │                        │
│  └──────────────┘  └──────────────┘                        │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Steps        │  │ Stress       │                        │
│  │ 7,200 avg   │  │ 3.2 avg     │                        │
│  │ 🟡 Below   │  │ 🟢 Manageable│                        │
│  └──────────────┘  └──────────────┘                        │
│                                                             │
│  This week: 5 days met your activity baseline.             │
│  Most active: Tuesday (your pattern!)                     │
│  Keep it up — your body is adapting.                       │
│                                                             │
│  [ View My MWI → ]                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Personalization Elements

| Element | Source | Example |
|---------|--------|---------|
| **Week label** | User's week number | "Alex's 3rd week" |
| **Personal highlight** | Biggest personal change | "YOUR deep sleep improved 15%" |
| **Pattern recognition** | Day-of-week trends | "Most active: Tuesday (your pattern!)" |
| **Personal comparison** | vs YOUR baseline | "5 days met YOUR activity baseline" |
| **Weekly narrative** | Computed summary | "Your body is adapting" |

## Design Requirements
- **Card-based, scannable** — user can scan in 5 seconds
- **Highlight at top** — BIGGEST PERSONAL CHANGE (not generic)
- **2x2 metric grid** — Recovery, Sleep, Steps, Stress
- **Tier color indicators** on each metric (🟢🟡🔴)
- **Pattern insight** — day-of-week recognition
- **Motivational message** at bottom

## Widget Variable Names
- weekDateRange, userWeekLabel, highlightText, personalChangeMetric, personalChangePercent, recoveryTrend, recoveryStatus, sleepAvg, sleepStatus, stepsAvg, stepsStatus, stressAvg, stressStatus, patternInsight, weeklyNarrative, mwiLink

## Data Connection
- Source: Google Sheets `DailyData` tab
- Aggregate: average of last 7 rows per metric
- Personal highlight: metric with largest % change from baseline

## Implements
- specs/engagement-loop.md §Weekly Summary
- 03-user-flows/user-flow.md §Screen 4 + Personalization Architecture

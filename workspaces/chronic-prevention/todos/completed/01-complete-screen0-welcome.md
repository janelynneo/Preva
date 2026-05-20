# 01 — Build Screen 0: Welcome / How It Works (with Personalization)

## Purpose
Cold start for first-time users. **THE HOOK: Show sample MWI result BEFORE asking for any data.** Personalized greeting for returning users.

## Two Versions

### First-Time User Layout

```
┌─────────────────────────────────────────────────────────────┐
│   METABO                                                    │
│   Know your metabolic wellness before it becomes a problem.  │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  YOUR WEEK IN REVIEW (sample)                       │   │
│   │  Recovery:     ↑ 12%        🟢                      │   │
│   │  Sleep:        85%          🟢                      │   │
│   │  Steps:        8,200        🟢                      │   │
│   │  ─────────────────────────────────────────────────  │   │
│   │  Your MWI: Tier 2 🟡                              │   │
│   │  "Monitoring recommended"                          │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   How it works:                                             │
│   💓 Your wearable data → Your daily recovery score         │
│   ⏱️ 30 seconds/day → Morning briefing + evening check-in   │
│   📊 Day 30 → Your personal Metabolic Wellness Index        │
│                                                             │
│   8,200 Singaporeans tracking their metabolic wellness      │
│                                                             │
│   [ Let's Start ]                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Returning User Layout

```
┌─────────────────────────────────────────────────────────────┐
│   Welcome back, Alex! 👋                                   │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  YOUR WEEK IN REVIEW                                  │   │
│   │  March 10–16, 2025                                   │   │
│   │  Recovery:     ↑ 12%        🟢                      │   │
│   │  Sleep:        85%          🟢                      │   │
│   │  Steps:        7,200        🟡                      │   │
│   │  ─────────────────────────────────────────────────  │   │
│   │  Your MWI: Tier 2 🟡                              │   │
│   │  Day 14 of 28 — your baseline is almost ready!     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   🌟 HIGHLIGHT: Your recovery improved 12% this week!    │
│                                                             │
│   [ View My MWI ]  [ Morning Briefing → ]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Design Requirements
- **Light background** (white or very light teal)
- **Sample MWI card** is the hero element for first-time users
- **Personalized greeting** ("Welcome back, Alex!") for returning users
- **One CTA only** — no clutter
- **Social proof** visible

## Personalization Logic
- Check if user has completed onboarding (local state)
- If returning: show personalized greeting + real data
- If first-time: show sample MWI + "Let's Start"
- If Day 1-6: show baseline building state
- If Day 7-29: show "Day X of 28" progress
- If Day 30+: show "Your MWI is updated"

## Widget Variable Names
- appLogo, welcomeGreeting (text), sampleMwiCard, howItWorksBullets, socialProofText, letsStartButton, returningUserCard, weekDateRange, highlightText, viewMwiButton, morningBriefingButton

## Implements
- specs/engagement-loop.md §Habit Formation
- 03-user-flows/user-flow.md §Screen 0 + UI/UX Principles + Personalization Architecture

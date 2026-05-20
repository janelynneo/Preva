# Metabo User Flow — Complete First-Time Experience

## Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FIRST-TIME USER FLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │  Screen 0    │ →  │  Screen 1    │ →  │  Screen 2            │  │
│  │  Welcome     │    │  Onboarding   │    │  Morning Briefing     │  │
│  │              │    │              │    │                      │  │
│  │  SAMPLE MWI  │    │  Profile     │    │  Recovery card       │  │
│  │  How it      │    │  Wearable    │    │  HRV trend           │  │
│  │  works        │    │  Expectation │    │  Sleep / Steps       │  │
│  │  CTA          │    │  Consent     │    │  Today's rec         │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│                                                                     │
│                        REPEAT DAILY                                 │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │  Screen 2    │ ←  │  Screen 3    │ ←  │  Screen 4            │  │
│  │  Morning     │    │  Evening     │    │  Weekly Summary       │  │
│  │  Briefing    │    │  Check-In    │    │  (Sunday)            │  │
│  │  (7–8:30am) │    │  (9:30pm)  │    │                      │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│         ↓                  ↓                                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Screen 5: Metabolic Wellness Index               │  │
│  │         (Day 30+ — accessible from Morning Briefing)         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## UI/UX Design Principles

These principles guide every screen in Metabo:

### 1. Show Value Before Asking for Data
Users who experience the app first are 3x more likely to share sensitive data. Never ask for health data before showing what they'll get.

### 2. One Task Per Screen
Don't ask for 7 things at once. Break into logical groups. User completes one step → next step.

### 3. Skip is Always Available
Never block the user. If they skip, the app still works. Re-ask later when trust is built.

### 4. Plain Language, No Jargon
- ❌ "HRV deviation from personal baseline"
- ✅ "Your recovery is 12% lower than usual"

### 5. Numbers Need Context
A score of 78 means nothing without comparison. Always show: trend (↑↓→), comparison to self (vs last week), or tier (🟢🟡🔴).

### 6. Reduce Visual Noise
One primary action per screen. Secondary information is smaller, muted. White space is your friend.

### 7. Consent is a Conversation, Not a Wall
PDPA consent is satisfied by showing what you collect, why, and giving control. Don't bury it — make it part of the flow.

### 8. Personalization at Every Touchpoint
The app must feel like "MY health companion" not "a health app." Every screen should use the user's name, their data, their patterns. Generic content = generic engagement.

---

## Personalization Architecture

### What Gets Personalized

| Element | Personalization Source | Example |
|---------|----------------------|---------|
| **Name greeting** | User input (Screen 1) | "Good morning, Alex!" |
| **Day in baseline** | Days since signup | "Day 14 of 28" |
| **Recovery comparison** | Personal baseline (Layer 2) | "↑ 12% vs YOUR baseline" |
| **Pattern recognition** | Day-of-week trends | "Tuesday = your workout day" |
| **Weather-aware recommendations** | Location + weather API | "🌧️ Rain today — indoor stretch" |
| **Hawker insights** | Weekly hawker meal log | "4 hawker meals this week — all within range" |
| **Streak display** | Check-in history | "7 day streak — habit forming!" |
| **Highlight of the week** | Biggest personal change | "YOUR deep sleep improved 15% this week" |
| **MWI accuracy messaging** | Data sharing status | "Your MWI is more accurate now that you've shared..." |

### Personalization Rules
- **First-time user**: Show sample/generic data with "This is what you'll see"
- **Returning user (Day 1-6)**: "Building your baseline... Day X of 28"
- **Active user (Day 7+)**: Full personalization with real data
- **Re-engagement**: Acknowledge absence "Welcome back, Alex. We missed you."

---

## Screen 0: Welcome / How It Works

**Trigger:** First launch, no existing session

### UI/UX Design
- Light background (white or very light teal)
- Large, friendly typography
- Minimal visual elements — no clutter
- One primary CTA only
- **Personalized greeting for returning users**

### User Actions
1. User opens app → immediately sees sample MWI result (first-time) or personalized greeting (returning)
2. User reads product explanation (3 bullets)
3. User taps CTA

### First-Time User Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   METABO                                                    │
│   Know your metabolic wellness before it becomes a problem.  │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  YOUR WEEK IN REVIEW (sample)                       │   │
│   │  ─────────────────────────────────────────────────  │   │
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
│   [ Let's Start ]  ← primary CTA, teal, full width          │
│                                                             │
│   Your data stays private. We never share it.             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Returning User Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Welcome back, Alex! 👋                                   │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  YOUR WEEK IN REVIEW                                  │   │
│   │  March 10–16, 2025                                   │   │
│   │  ─────────────────────────────────────────────────  │   │
│   │  Recovery:     ↑ 12%        🟢                      │   │
│   │  Sleep:        85%          🟢                      │   │
│   │  Steps:        7,200        🟡                      │   │
│   │  ─────────────────────────────────────────────────  │   │
│   │  Your MWI: Tier 2 🟡                              │   │
│   │  "Monitoring recommended"                          │   │
│   │  ─────────────────────────────────────────────────  │   │
│   │  Day 14 of 28 — your baseline is almost ready!     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   🌟 HIGHLIGHT: Your recovery improved 12% this week!    │
│                                                             │
│   [ View My MWI ]  [ Morning Briefing → ]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Content
- **Sample MWI result** (first-time) — THIS IS THE HOOK
- **Personalized greeting** (returning users)
- Tagline
- 3 explanation bullets (icon + short text)
- Social proof
- One CTA button

### Trust Elements
- "Your data stays private. We never share it." (small text, bottom)
- Link to Privacy Policy

---

## Screen 1: Onboarding / Profile Setup

**Trigger:** Tap "Let's Start" from Screen 0

### UI/UX Design
- Progress indicator: "Step 1 of 4" (reduces abandonment) — NOW 4 STEPS (added name)
- One primary question per section
- Large tap targets (48px minimum)
- Inline validation (red text below field, not modal)

### Step-by-Step Flow (NOT one big form)

**Step 1 of 4 — Your Name**
```
┌─────────────────────────────────────────────────────────────┐
│  Step 1 of 4                                               │
│                                                             │
│  Let's start with the basics.                               │
│                                                             │
│  What's your name?                                         │
│  [ _______________ ]                                        │
│                                                             │
│  (So we can greet you personally each morning)              │
│                                                             │
│  [ Continue ]                                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Step 2 of 4 — The Basics**
```
┌─────────────────────────────────────────────────────────────┐
│  Step 2 of 4                                               │
│                                                             │
│  Let's start with the basics.                               │
│                                                             │
│  Age: [  35  ] ────────────●────────────  (slider)        │
│                                                             │
│  Sex:                                                       │
│  [ Male ]  [ Female ]                                      │
│                                                             │
│  [ Continue ]                                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Step 3 of 4 — Your Body**
```
┌─────────────────────────────────────────────────────────────┐
│  Step 3 of 4                                               │
│                                                             │
│  Height: [ 170 ] cm  ───●─────────────                     │
│  Weight: [ 75 ] kg  ────●────────────                      │
│                                                             │
│  BMI: 26.0 (Overweight range)  ← contextual feedback      │
│                                                             │
│  [ Continue ]                                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Step 4 of 4 — Health Background**
```
┌─────────────────────────────────────────────────────────────┐
│  Step 4 of 4                                               │
│                                                             │
│  Ethnicity (for risk calibration):                          │
│  [ Chinese ] [ Malay ] [ Indian ] [ Others ]               │
│                                                             │
│  Family history of type 2 diabetes?                          │
│  [ Yes ]  [ No ]                                           │
│                                                             │
│  (Optional — improves accuracy)                             │
│  [ Continue ]                                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Wearable Connection (shown after Step 3, before consent)

```
┌─────────────────────────────────────────────────────────────┐
│  Connect your wearable (optional)                           │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ⌚ HRV — tracks your recovery                              │
│  🌙 Sleep — tracks rest quality                             │
│  👟 Steps — tracks your activity                           │
│                                                             │
│  We'll only read your activity data.                        │
│  We never access messages, contacts, or location.          │
│                                                             │
│  Supports: Apple Health, Google Fit, Fitbit, Garmin        │
│                                                             │
│  [ Connect Wearable → ]  ← primary                         │
│  [ Skip for now ]  ← secondary, muted text                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Consent Block (final step)

```
┌─────────────────────────────────────────────────────────────┐
│  Before we start...                                         │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ☑ I understand how Metabo uses my data:                   │
│    • My wearable and self-reported data                    │
│    • To calculate my Metabolic Wellness Index               │
│    • To give me daily recommendations                      │
│    • I can delete my data anytime                          │
│                                                             │
│  [ View Privacy Policy ]  ← text link                     │
│                                                             │
│  [ Start My Baseline ]  ← primary CTA                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### PDPA Compliance Elements
- Explicit consent checkbox (not pre-ticked)
- Plain-language explanation of data use
- "Delete my data anytime" mentioned
- Privacy Policy link

### Key Principles Applied
- **One task per screen** — 3 steps instead of 1 long form
- **Skip available** — wearable connection is optional
- **Contextual feedback** — BMI shown immediately after height/weight
- **Large tap targets** — buttons are 48px+ height
- **Progress indicator** — reduces abandonment

---

## Screen 2: Morning Briefing (Daily)

**Trigger:** Push notification (7:00–8:30 AM) OR user opens app

### UI/UX Design
- Dark teal background (#0D3B3B) — feels calm, premium
- White cards — easy to scan
- **Personalized greeting with name**
- **Day counter for baseline progress**
- **Pattern recognition (day-of-week context)**
- Recovery score is the hero element (largest)
- Recommendation in yellow/gold card — draws attention
- **Weather-aware recommendations (future)**

### Day 1-6: Baseline Building (No real data yet)

```
┌─────────────────────────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  (dark teal)       │
│  Good morning, Alex!                                      │
│  Tuesday, 18 March · Day 5 of 28                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  BUILDING YOUR BASELINE                              │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │                                                      │   │
│  │  We're learning your normal patterns from your       │   │
│  │  wearable data. Your Metabolic Wellness Index        │   │
│  │  will be ready in 23 days.                         │   │
│  │                                                      │   │
│  │  📊 Baseline progress: [████░░░░░░] 5/28 days      │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  TUESDAY INSIGHT                                     │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  You tend to be most active on Tuesdays.            │   │
│  │  Your step count is usually 15% higher than avg.  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Day 7-29: Active Use (Real data, growing accuracy)

```
┌─────────────────────────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  (dark teal)       │
│  Good morning, Alex! 👋                                   │
│  Tuesday, 18 March · Day 14 of 28                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  YOUR RECOVERY: 78/100  ↑ +5 this week           │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │                                                      │   │
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

### Day 30+: Full MWI Active

```
┌─────────────────────────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  (dark teal)       │
│  Good morning, Alex! 👋                                   │
│  Tuesday, 18 March                                        │
│  Your MWI is updated — Tier 2 🟡                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  YOUR RECOVERY: 78/100  ↑ +5 this week           │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │                                                      │   │
│  │  ⌚ HRV:  54ms   ↑ 12% vs YOUR baseline      │   │
│  │  💤 Sleep: 6h 48m  85% — 15 min less than usual│   │
│  │  👟 Steps: 7,906  (Tuesday = your workout day!)  │   │
│  │                                                      │   │
│  │  [View My MWI →]  ← shows full tier details       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  TODAY'S RECOMMENDATION 🌧️                        │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  Your HRV has been below baseline for 3 days.      │   │
│  │  Tuesday is usually your workout day, but with       │   │
│  │  rain + low HRV: consider a yoga session instead.  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Data Displayed
- **Personalized greeting** with name
- **Day counter** (Day X of 28)
- **Pattern recognition** (day-of-week context)
- Recovery score (0–100) with trend vs personal baseline
- **HRV vs YOUR baseline** (not population)
- **Sleep comparison** ("15 min less than usual")
- **Steps with day-of-week pattern**
- **Weather-aware recommendation**
- Today's recommendation

### Tier Explanation (tap "View My MWI")

```
┌─────────────────────────────────────────────────────────────┐
│  YOUR METABOLIC WELLNESS INDEX                              │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  TIER 2 🟡 — MONITORING RECOMMENDED                        │
│                                                             │
│  Your metrics suggest slightly elevated metabolic risk.       │
│  Small changes now can reduce your 10-year risk.            │
│                                                             │
│  Compared to last month: → Stable                           │
│                                                             │
│  [What this means for you ↓]  (expandable)                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Screen 3: Evening Check-In (Daily)

**Trigger:** Push notification (9:30–10:30 PM) OR user navigates

### UI/UX Design
- Clean, focused — one question at a time optional but 5-at-once is faster
- Large tap targets (stars, dots)
- Progress: "2 of 5" or visual dots
- Submit button disabled until at least 1 answer

### Content Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Good evening — 30 seconds to wrap up your day.            │
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
│  [ Submit ✓ ]  ← primary, teal                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Questions (one-tap answers)
1. Sleep quality: tap stars
2. Soreness: tap one option
3. Energy: tap dots
4. Stress: tap dots
5. Hawker meals: tap stepper +/-

### Skip Option
- Small "Skip check-in" text at bottom
- Tapping it shows: "No worries — see you tomorrow"

---

## Screen 4: Weekly Summary (Sunday)

**Trigger:** Push notification (Sunday 6–8 PM) OR user navigates

### UI/UX Design
- Card-based, scannable
- One highlight at top (biggest positive change)
- Metrics in grid layout
- Motivational message at bottom

### Content Layout

```
┌─────────────────────────────────────────────────────────────┐
│  YOUR WEEK IN REVIEW                                        │
│  March 10–16, 2025                                         │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  🌟 HIGHLIGHT                                               │
│  Your deep sleep improved 15% this week!                    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Recovery     │  │ Sleep        │                        │
│  │ ↑ 12%       │  │ 85% avg      │                        │
│  │ 🟢 Good     │  │ 🟢 On target │                        │
│  └──────────────┘  └──────────────┘                        │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Steps       │  │ Stress       │                        │
│  │ 7,200 avg   │  │ 3.2 avg     │                        │
│  │ 🟡 Below   │  │ 🟢 Manageable│                        │
│  └──────────────┘  └──────────────┘                        │
│                                                             │
│  This week: 5 days met your activity baseline.             │
│  Keep it up — your body is adapting.                        │
│                                                             │
│  [ View My MWI → ]                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Screen 5: Metabolic Wellness Index

**Trigger:** Tap "View My MWI" from Screen 2 OR Screen 4

### UI/UX Design
- Large tier display (hero element)
- Color-coded (🟢🟡🔴)
- Plain-English explanation
- Trend over time

### Content Layout

```
┌─────────────────────────────────────────────────────────────┐
│  YOUR METABOLIC WELLNESS INDEX                              │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│              TIER 2 🟡                                      │
│      MONITORING RECOMMENDED                                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Your metrics suggest slightly elevated metabolic   │    │
│  │  risk. Small changes now can reduce your 10-year  │    │
│  │  risk of developing chronic conditions.            │    │
│  │                                                      │    │
│  │  Compared to last month: → Stable                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  YOUR TREND                                                 │
│  [====●========] Day 14 of 28                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  RECOMMENDATION                                             │
│  "Your HRV has been below baseline for 3 consecutive       │
│  days. Consider a rest day or lighter workout.             │
│  Consistent recovery days compound over time."              │
│                                                             │
│  [ What are the tiers? ↓ ]  (expandable FAQ)              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Re-Engagement Flows

### After Missing 1 Evening Check-In
**Day 2 morning notification:**
"We missed yesterday's check-in — no worries, tap to add it now."
→ Opens Screen 3 with "Add yesterday's check-in" mode

### After Missing 3 Consecutive Days
**Day 4 morning notification:**
"It's been a few days — your streak is safe. Just 3 questions to get back on track."
→ Opens Screen 3 with abbreviated check-in (energy + stress only)

### After Missing 7+ Days
**Day 8:**
"Looks like you've been busy. Want to adjust your notification time?"
→ Opens notification preferences screen

---

## Trust Architecture

### Data Sharing Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    WHAT WE COLLECT                         │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  REQUIRED (for the product to work):                      │
│  • Age, sex, ethnicity — for risk calibration             │
│  • HRV, sleep, steps — from your wearable                │
│  • Evening check-in answers — 5 questions, 30 seconds      │
│                                                             │
│  OPTIONAL (improves accuracy):                             │
│  • Family health history — makes MWI 15% more accurate     │
│  • Blood test results — makes risk model significantly     │
│    more accurate                                          │
│  • Weight updates — track body composition changes         │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  We NEVER share your data with:                           │
│  • Your employer  (unless you explicitly share)            │
│  • Insurance companies                                     │
│  • Third parties for marketing                             │
│                                                             │
│  [ Privacy Policy ]  [ Delete my data ]                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Error States

### Google Sheets Unavailable
- Show cached data if available
- Display banner: "Couldn't sync — working offline"
- Queue check-in for later sync

### No Wearable Data
- Show: "Connect your wearable to see real data" card
- Manual entry option: "Enter data manually" (future)
- Evening check-in still works without wearable data

### ML Model Not Ready (< 7 days baseline)
- Morning Briefing shows: "Day X of 28 — still building your baseline"
- MWI button shows: "Your MWI is being calculated..."

---

## Data Flow Summary

```
User Profile (Screen 1)
    ↓ writes to
Google Sheets: Profile tab
    ↓
ML Notebook reads profile
    ↓ computes
Google Sheets: DailyData tab (HRV, RHR, Sleep, Steps + deviations)
    ↓
FlutterFlow reads DailyData → Morning Briefing display
    ↓
ML Notebook reads DailyData + CheckIns → MWI + Recommendations
    ↓
Google Sheets: MWI tab (tier, message, risk_score, recommendation)
    ↓
FlutterFlow reads MWI tab → Screen 5 display
```

---

## Screen Map

| Screen | Name | Purpose | Data Source |
|--------|------|---------|-------------|
| 0 | Welcome | Show sample MWI + explain product | Static |
| 1 | Onboarding (3 steps) | Collect minimal data + consent | Google Sheets: Profile |
| 2 | Morning Briefing | Daily recovery + recommendation | Google Sheets: DailyData |
| 3 | Evening Check-In | Daily self-report capture | Google Sheets: CheckIns |
| 4 | Weekly Summary | 7-day trend narrative | Google Sheets: DailyData (aggregate) |
| 5 | Metabolic Wellness Index | Risk tier + ML recommendation | Google Sheets: MWI |

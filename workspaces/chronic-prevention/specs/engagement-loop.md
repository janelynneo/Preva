# Engagement Loop — Daily Habit Architecture

## The Problem This Solves

Health apps average <25% retention at 30 days. The failure is almost never insufficient science — it's that the product never becomes a habit. The daily engagement loop is the product's most critical feature. Without it, the ML model and wearable integration are irrelevant.

---

## The Daily Engagement Architecture

### Morning Briefing (7:00–8:30 AM, push notification)
**Purpose:** Give the user a reason to open the app before the day starts.

**Format:** Card layout, <10 seconds to consume.

```
[Recovery Score: 78/100]
HRV: ↑ 12% vs last week — your recovery is improving
Sleep: 6h 48min — slightly below your 7h baseline
Today: Tuesday — your most consistent workout day this month
```

**Why mornings:** Singaporeans check phones within 15 minutes of waking (average). Morning notification lands in the existing morning phone-check habit. The notification must feel like useful information, not an obligation.

**Frequency:** Every day, same time window. Consistency is the habit anchor.

---

### Evening Check-In (9:30–10:30 PM, push notification)
**Purpose:** Capture the daily self-report data AND give a moment of reflection.

**Format:** <30 seconds. Six steps. One-tap answers + optional photo.

```
Good evening — 30 seconds to wrap up your day:

1. How did you sleep last night? ⭐⭐⭐⭐ (4/5)
2. Any soreness today? [Neck/Shoulders ▼] — nothing / mild / moderate / severe
3. Energy level today? ⭐⭐ (2/5)
4. Stress level today? ⭐⭐⭐ (3/5)
5. Hawker meals today? [2] ← number input
6. Optional: Snap or choose a meal photo 📷

[Submit ✓]
```

**Photo attachment:** Optional meal photo via camera or gallery (expo-image-picker). Stored as local URI in AsyncStorage alongside check-in data. Not uploaded or shared — entirely on-device.

**Why evenings:** The evening check-in captures the day's accumulated data before the user sleeps. It also creates a "day closed" ritual — psychologically satisfying.

**Notification copy:** "How'd today go? 30 seconds to log your day." — not "Please complete your health check-in."

---

### Weekly Summary (Sunday 6–8 PM)
**Purpose:** Provide the weekly trend narrative — the meta-view that daily engagement cannot give.

**Format:** 1-page summary, shared as a card.

```
Your week in review:
• Recovery trend: Improving ↑
• Sleep efficiency: +8% vs last week
• Activity: 5 days met your 8,000-step baseline
• Stress load: Moderate (3.2/5 avg)
• Hawker meals: 6 (within healthy range)

Highlight: Your deep sleep % improved 15% this week.
Keep it up — your body is adapting.
```

**Why Sunday evenings:** Psychologically, Sunday evening is when people reflect on the week and plan ahead. It lands as a "week closed + positive reinforcement" moment.

---

## The Habit Loop Mechanics

### Habit Formation Theory (Fogg Behavior Model)
**B = MAT** — Behavior happens when Motivation, Ability, and Trigger are all present simultaneously.

For this product:
- **Trigger:** Morning notification at consistent time
- **Ability:** <10 seconds to consume the briefing (not a task)
- **Motivation:** Relevant, personalized, shows a trend

### Specific Design Decisions

**No gamification badges for core loop.** External rewards (badges, points) work for short-term engagement but undermine intrinsic motivation formation. The engagement hook must be the content itself — "my HRV improved" is intrinsically motivating. Reserve gamification for the periphery (check-in streak, annual milestone).

**Streaks are a double-edged sword.** A broken streak causes users to abandon ("I've already failed, what's the point"). Mitigation: "Streak freeze" feature — allow 1 missed check-in per 14 days without breaking the streak.

**Social proof is the strongest retention driver for Singapore.** Weekly notification: "8,200 Singaporeans improved their Metabolic Wellness Index this week." Social proof at population level (not individual friend comparisons) reduces shame risk.

**The first 4 weeks are survival.** The honeymoon period is when habits form or break. During onboarding, set explicit expectation: "The first 4 weeks are about building your baseline — you'll start seeing your personal Metabolic Wellness Index at day 30." This prevents the "this app isn't doing anything" abandonment.

---

## Retention Failure Mode: The Generic Nudge Trap

**Failure:** After day 14, users report "I already know I should walk more — this app isn't telling me anything new."

**Root cause:** Rule-based recommendations that are too generic ("aim for 8,000 steps") exhaust quickly because they don't require the app.

**Fix:** Make recommendations personal to the individual's baseline. Not "walk 8,000 steps" but "your step count has been 20% below your personal baseline for 3 days — this is unusual for you. Something going on?" This requires the personal baseline to be accurate enough for anomaly detection to feel meaningful.

**Second fix:** Make recommendations contextual to the person's schedule. Not "take a 30-minute walk" but "it's raining tonight — try a 15-minute indoor stretch routine I've customized for your soreness map." This is where the body-map self-report creates personalized value.

---

## Check-In Abandonment Recovery

If user misses 1 evening check-in:
- Next morning: "We missed yesterday's check-in — no worries, tap to add it now." (24-hour recovery window)

If user misses 3 consecutive days:
- Day 4 morning: "It's been a few days — your streak is safe. Just 3 questions to get back on track." (Reduced friction re-engagement)

If user misses 7+ days:
- Day 8: "We noticed you haven't been checking in. Want to adjust your notification time? [Reschedule] [Pause for a week]" (Preference discovery, not abandonment assumption)

---

## Progressive Profiling — Context Collected Over Time

### The Problem With Upfront Context

Long onboarding questionnaires (10+ minutes) have 60% drop-off. But recommendations that require context (labs, conditions, medications) can't work without it. Progressive profiling solves both: collect context gradually, and make each context entry immediately valuable.

### Phase 1: Minimal Viable Profile (Onboarding, Day 1 — 3 minutes)
Collect only what's needed to deliver first value:
- Name + notification time preference
- Age range (5 bands: 25-30, 31-35, 36-40, 41-45, 45+)
- Primary goal (energy / sleep / stress / activity — pick one)
- Wearable connection

**Why these only:** Enough to deliver the Morning Briefing immediately on Day 2. Energy/sleep/stress/activity goal sets the priority for the first anomaly detection.

### Phase 2: Health Context (Day 3-7 — 90 seconds per question, spaced)
Day 3: "Do you have any ongoing health conditions? [Select all: none / high blood pressure / heart condition / diabetes / other]"
Day 5: "Are you on any regular medications? [Yes, will specify / No / Prefer not to say]"
Day 7: "Has a doctor ever told you your HbA1c or fasting glucose was above normal? [Yes / No / Not sure / Skip]"

**Display rule:** These questions appear inside the Evening Check-In, not as a separate screen. They feel like part of the daily habit, not a separate task.

### Phase 3: Baseline Labs (Day 14-21 — optional, 60 seconds)
"Want more accurate recommendations? Upload a recent health check result or enter your latest readings. [Upload photo / Enter manually / Remind me later]"

**Lab values that improve recommendation accuracy:** HbA1c, fasting glucose, blood pressure, HDL cholesterol, BMI.

### Phase 4: Ongoing Refinement (continuous — triggered by behavior)
- User ignores stress recommendations repeatedly → "Do you have any ongoing high-stress periods? [Work deadline / Family / Health concern / Other]"
- User ignores activity recommendations → "Is there a reason regular exercise is difficult right now? [Injury / Time / Motivation / Gym access / Other]"
- User consistently logs high hawker meal count → "Have you seen the lower-GI hawker guide? It's specific to Singapore — [View guide / Already know it / Skip]"

**Design principle:** Each follow-up question is triggered by a real behavioral signal, not a calendar. This makes the question feel relevant, not intrusive.

---

## Additional Daily Features

### Commute-as-Movement
**Purpose:** Surface sedentary commute time as a micro-movement opportunity.

Singapore's MRT/LRT is underutilized as movement infrastructure. The app infers commute timing from calendar and time-of-day patterns. When the user's morning commute exceeds 30 minutes seated before 9am:

> "Your morning commute has you seated for 45 minutes before 9am. Standing on the MRT for 3 stops adds 12 minutes of non-sedentary time. [Log: stood on MRT today ✓]"

**Rules:**
- Trigger: 30+ minute morning commute (seated) with no prior movement logged
- Max once per day (to avoid fatigue)
- Never recommend during peak hours (7:30-8:15am, 5:30-6:30pm) when standing is unsafe
- Logged behavior updates daily movement tally; counts toward non-sedentary minutes

### Weather-Contingent Recommendations
**Purpose:** Prevent exercise plan abandonment on rainy/hazy days.

App pulls NEA 3-hour forecast. Outdoor walk recommendation auto-converts:

| Condition | Auto-convert to |
|---|---|
| Heavy rain (≥7mm/hr) | "15-minute indoor stretch in air-conditioned space" + link to curated indoor routine |
| Light rain (<7mm/hr) | "Rainy outside — a 10-minute sheltered walk under the MRT covered walkway counts" |
| PSI >100 (haze) | "Haze is elevated — indoor movement today. Try this breathing-focused routine." |
| Cool evening (<26°C) | "Weather cleared — outdoor walk re-enabled tonight. Ideal window: 7-8pm." |

**Implementation:** Recommendation engine evaluates weather BEFORE sending evening recommendation. User never sees an outdoor recommendation that becomes inapplicable.

### Hawker GI Guide
**Purpose:** Make glycemic index actionable for Singapore hawker diet without food logging.

Pre-built database of common hawker dishes mapped to GI bands (High / Medium / Low). Not a food logger — the user manually logs hawker meals per day (existing evening check-in: "Hawker meals today: [N]").

When hawker meal count ≥4 in a week AND user's risk profile is elevated (Tier 2-3):
> "You've had 5 hawker meals this week and most were high-GI (white rice, mee pok). Your recovery metrics improve more when GI is lower. Try swapping to brown rice at your usual stall — same price, lower GI. [View lower-GI hawker guide]"

**GI database scope (MVP):** 50 most common hawker dishes across economy rice, noodle stalls, and drink stalls. User can flag "dish not found" to expand database.

**Display:** Never shows GI as a number. Always shows GI as a band + one specific actionable substitution.

### Metabolic Age

Displayed on the MWI screen. Estimated from HRV baseline, resting heart rate, and sleep quality vs population norms by age bracket. A positive delta means metabolically younger than chronological age.

**Inputs:** HRV (SDNN) baseline, resting heart rate, recent average sleep quality, user's chronological age.

**Output:** Metabolic age estimate + delta vs chronological age (e.g., "Metabolic age: 34 — 4 years younger than your chronological age").

**Implementation:** `computeMetabolicAge()` in `MetaboApp/services/health.ts`. Uses population HRV/RHR norms by 5-year age bands as reference anchors.

---

### GP Report Upload
**Purpose:** Bridge annual clinical data with daily wearable data.

User uploads PDF health screening report (HPB health screening, polyclinic results, or private clinic labs). App extracts key values via on-device OCR:
- HbA1c, fasting glucose
- Total cholesterol, HDL, LDL, triglycerides
- Blood pressure (if recorded)
- BMI

**What the user sees:**
> "Your last screening (March 2024) showed HbA1c at 5.8% (prediabetic range). Your wearable data since then shows: HRV trending up 8%, sleep efficiency improved 12%. Here's what population data says about your trajectory."

**Privacy:** PDF is processed on-device; raw PDF is never stored. Extracted values are stored encrypted in user profile.

### Weekly "What Changed" Narrative
**Purpose:** Turn raw data into a causal story users can act on.

Generated every Sunday as part of the Weekly Summary:

> "This week had a pattern:
> - Tuesday: Your stress was high (4/5) and sleep dropped to 5h 20min
> - Wednesday: Your hawker meals were 4 high-GI dishes — HRV dipped
> - Thursday: You swapped to brown rice twice — HRV recovered 6%
> Your best recovery day was Friday (low stress, 3 high-GI meals instead of 5)."

**Generation:** Rule-based + ML sentiment on self-report text. MVP uses rule-based patterns only. The narrative makes the connection between behavior and outcomes visible for the first time.

### Quarterly "State of You" Report
**Purpose:** Give users a reason to return annually and a shareable artifact.

Generated every 90 days (or on-demand):

1-page PDF containing:
- 90-day trends: HRV, sleep efficiency, activity, stress, soreness
- Personal bests and improvements
- "What the data says about your metabolic trajectory"
- One specific recommendation for next 90 days

**Shareability:** Exportable as PDF to share with GP or keep personal records. The report is the app's annual touchpoint and referral tool ("my doctor asked about my health data — I showed her this").

### Monthly Expert Q&A
**Purpose:** Provide "always-on coach" feeling without the cost of a real coach.

One AI-assisted question per month: "Ask anything about your health data."

User types: "Why does my HRV drop on high-stress days?" or "What does my sleep pattern tell me about my recovery?"

AI answers in plain language, using only the user's own data + population research as evidence base. Never diagnoses. Always deflects to a healthcare provider for clinical concerns.

**Limits:** Medical questions deflected. Mental health crises trigger escalation to helpline (Samaritans of Singapore: 1800-221-4444).

### Relapse Recovery Arc
**Purpose:** Prevent churn when users return after a 7+ day gap.

On first re-engagement after 7+ days absence:

> "You were gone 12 days. Welcome back. Your personal baseline has drifted — HRV is 8% below where it was. That's recoverable. Here's your 5-day recovery plan to get back to your baseline: [Day 1: light movement, Day 2-3: rebuild sleep routine, Day 4-5: return to normal activity]. Ready?"

**Why it works:** Converts a gap into a story with a path forward. Users who return after absence see a reset, not a failure. The app acknowledges the gap without shame and provides a clear next step.

**Streak freeze:** 1 missed evening check-in per 14 days does NOT break the streak. Displayed as: "Streak safe — you have 1 freeze remaining."

---

## Smart Notification System

Implemented in `MetaboApp/services/notifications.ts`.

### Notification Architecture

**Two scheduled notifications per user per day:**
1. **Check-in reminder** — daily at user-selected time (morning 7:00 AM / evening 7:00 PM / night 9:00 PM, or custom hour)
2. **Afternoon slump nudge** — daily at 2:30 PM (historically when energy dips)

**Snooze behavior:** After a check-in is submitted, the next reminder is snoozed by 30 minutes to avoid spamming. If a notification is already visible, no snooze is re-scheduled.

### Notification Types

| Type | Title | Body | Trigger |
|------|-------|------|---------|
| `checkin_reminder` | "Time to check in! 🌙" | "How was your day? Log your evening check-in — takes 30 seconds." | Daily at user time |
| `slump_nudge` | "Afternoon slump? 🧘" | "Step away from the desk — a 5-min walk boosts metabolism and focus." | Daily 2:30 PM |

### Notification Preferences (ProfileScreen)

Users choose from three preset times or set a custom hour. Preferences stored in AsyncStorage under `metabo_reminder_config`.

### Re-engagement Notifications

Following the same abandonment recovery arc defined above:
- Day 2 morning: "We missed yesterday's check-in — tap to add it now."
- Day 4 morning: "It's been a few days — your streak is safe. Just 3 questions."
- Day 8+: "We noticed you haven't been checking in. Want to adjust your notification time?"

---

## Context-as-a-Feature — Making Entry Feel Worth It

The reason wrong-context recommendations happen is the same reason users abandon health apps: **context entry feels like work with no immediate payoff.** Context-as-a-feature inverts this — showing the user that their context directly shapes every recommendation they see.

### Immediate Value Display

After any context update, show the user how their recommendation changed:

**Example (Day 1-2, minimal profile):**
```
Recommendation: "Your recovery is moderate today. Consider light activity."
Context: 25-30 age range, goal = energy
```

**Example (Day 7, health context added):**
```
Recommendation: "Your recovery is moderate today. Given your current blood pressure situation, 
a 20-minute walk is better than a HIIT session."
Context: Health conditions — blood pressure flagged ✓
Confidence: High match
```

**The contrast is the payoff.** Users see that the more they tell the app, the more specific and relevant the advice becomes. This is the feedback loop that makes progressive profiling feel like discovery, not paperwork.

### Context Completeness Score

Show a "Context Completeness" indicator on the profile screen:
- Day 1: "Profile: 20% complete — add health context for more accurate advice"
- Day 7: "Profile: 60% complete — add lab results to unlock your Metabolic Wellness Index"
- Day 21: "Profile: 85% complete — your recommendations are highly personalized"

**The score must show what the user gains at each increment**, not just "complete more profile fields." Users must see the connection between context and recommendation quality.

### The First Win Engine

Within the first 14 days, engineer at least one moment where the app knows something the user didn't:
- Day 3: "Your HRV is 8% higher than the Singapore average for your age group."
- Day 7: "You recover 22% faster on days when you eat dinner before 8pm."
- Day 14: "Your stress levels drop most on mornings when you take a 15-minute walk before work."

These insights are only possible with the context the user has provided. This makes context feel like a resource the user is investing, not a form they're filling out.

---

## What NOT To Build (Anti-Patterns)

- ❌ Food logging (any form at daily frequency) — 80% abandonment by day 90
- ❌ Required workout logging — links daily engagement to exercise completion; users who don't work out stop opening the app
- ❌ Daily weight entry — shame factor, weekly is sufficient
- ❌ Leaderboards with visible friend scores — shame risk for Singapore's face-conscious culture
- ❌ Notification blitz (3+ notifications/day) — the single biggest app uninstall trigger
- ❌ Long onboarding questionnaires (>10 minutes) — 60% drop-off at setup completion
- ❌ Context as a form — "Please complete your health profile" separates context entry from immediate value delivery
- ❌ Confidence suppression — never hide the confidence tier to make a recommendation look more authoritative

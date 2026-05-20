# ML Architecture — Two-Layer Model

## Layer 1: Population Risk Model (Survival Analysis)

### Purpose
Predict 10-year metabolic disease risk using demographics + baseline labs + wearable summaries. Outputs a risk tier, not a disease diagnosis.

### Model Choice
**Cox Proportional Hazards (CPH)** — primary MVP choice for interpretability (hazard ratios can be validated by clinicians).
Graduates to **Random Survival Forests (RSF)** as N grows and proportional hazards assumption is tested.

### Training Data
- **Primary:** NHANES (National Health and Nutrition Examination Survey)
- N ≈ 10,000 participants with 10-year mortality follow-up
- Features: age, sex, BMI, ethnicity, HbA1c, blood pressure, smoking, family history, baseline labs
- Proxy label: HbA1c 5.7–6.4% (pre-diabetes range), not diagnosed diabetes incidence
  - Why proxy: pre-diabetes is the reversible window; full diabetes onset requires 10-year follow-up which NHANES provides but user cohorts do not

### Singapore Calibration (Year 2 Priority)
- NHANES is US-based — Malay and Indian Singaporeans have materially different metabolic risk at same BMI/HbA1c
- Year 1 mitigation: ethnicity interaction terms in Cox model
- Year 2 requirement: validation on Singapore cohort (n≥200, polyclinic or corporate screening partnership)

### User-Facing Output
- **Framing:** "Metabolic Wellness Index" — not "diabetes risk score"
- **Format:** Three tiers — Tier 1 (Wellness), Tier 2 (Monitoring Recommended), Tier 3 (Lifestyle Attention)
- **Update frequency:** Re-evaluated annually or when new lab data provided
- **HSA constraint:** No probability statements (no "23% chance of developing diabetes")

---

## Layer 2: Personal Baseline + Anomaly Detection

### Personal Baseline (Days 1–29)
No risk output during first 30 days. Purpose is establishing personal baseline parameters:
- Mean HRV (RMSSD)
- Mean resting heart rate
- Mean sleep efficiency (time asleep / time in bed)
- Mean daily step count
- Self-report means: energy, stress, soreness, hawker meal frequency

Why 30 days: individual HRV baseline requires ~30 days to converge (high day-to-day variability; 30-day mean has SD ≈ 10% of mean in healthy adults).

### Anomaly Detection (Day 30+)
Compares daily values against personal baseline using statistical process control:
- **Isolation Forest** on multivariate daily feature vector
- **CUSUM charts** for sustained directional shifts (HRV declining over 14 days)
- **Threshold:** Personal baseline ± 1.5 SD flags "below baseline"

### Daily Recommendation Logic (Rule-Based MVP)
```
IF risk_tier >= 2 AND HRV_deviation < -1.5 SD → "Your HRV is below your personal baseline. Consider a rest day."
IF risk_tier >= 2 AND steps < baseline * 0.8 → "Your activity is below your usual level. A 20-minute walk is linked to better recovery."
IF hawker_meals_this_week >= 5 → "You've had several hawker meals this week. Try a lower-GI option like brown rice or more vegetables."
IF sleep_efficiency < baseline * 0.85 → "Your sleep efficiency is lower than usual. Consider no screens 30 minutes before bed."
IF risk_tier == 3 AND no_lab_work_6_months → "Consider a routine health check — a GP visit or health screening can give you a complete picture."
```
No disease-specific recommendation language. No "diabetes," "hypertension," "cardiovascular" in user-facing text.

---

## Cold-Start Protocol

| Day | Model State | User Output |
|-----|-------------|-------------|
| Day 1 | Population prior only | "Building your personal baseline. X days until your Metabolic Wellness Index is ready." |
| Days 1–29 | Baseline estimation | Morning briefing (HRV, sleep from wearables) + evening check-in |
| Day 30+ | Personal baseline + Layer 1 risk context | Full Metabolic Wellness Index + anomaly-based recommendations |
| Quarterly | Layer 1 re-evaluation | Risk tier update if new lab data or sufficient longitudinal wearable data |

---

## Feature Engineering

### Wearable-Derived Features (daily aggregation)
- HRV: RMSSD (ms), SDNN (ms), LF/HF ratio (from 5-min resting morning reading)
- Resting heart rate: mean bpm from overnight
- Sleep: total duration (hrs), deep sleep %, REM %, sleep efficiency, sleep onset latency, WASO
- Activity: total steps, active minutes (≥100 steps/min), moderate-vigorous intensity minutes
- HRV during work hours (9am–6pm) vs recovery hours (9pm–7am) — stress vs rest ratio

### Self-Reported Features (daily)
- Sleep quality rating (1–5 Likert)
- Soreness body map (5 regions: neck/shoulders, upper back, lower back, wrists/hands, hips/legs)
- Energy level (1–5 Likert)
- Stress level (1–5 Likert)
- Hawker meals eaten (integer count)

### Demographic Features (one-time)
- Age, sex, ethnicity (Chinese/Malay/Indian/Others)
- Height, weight (BMI computed)
- Family history: first-degree relative with T2D (binary)
- Previous gestational diabetes (female only, binary)
- Current conditions: hypertension diagnosis (binary, self-reported)
- Baseline labs if provided: HbA1c, fasting glucose (optional — boosts model accuracy significantly)

---

## Wrong Context — Detection and Recovery

Wrong context is the primary cause of wrong recommendations. The system must detect when its context is degraded and respond accordingly.

### Three Context Failure Modes

| Failure Mode | Description | Example |
|---|---|---|
| **Stale context** | Key variables were accurate at entry but are now outdated | User started new medication 2 weeks ago; app still optimizing for old baseline |
| **Incomplete context** | User never provided enough context for the recommendation to be valid | No lab data, no baseline labs, onboarding skipped health conditions |
| **Incorrect context** | User provided wrong information (intentionally or not) | Claims no family history; actual T2D in both parents |

### Confidence Scoring

Every recommendation carries a **confidence tier** displayed to the user:

| Tier | Label | Trigger | Behavior |
|---|---|---|---|
| High | "Strong match" | Full context, fresh data, anomaly detected | Full recommendation with specific action |
| Moderate | "Based on partial data" | Some fields missing OR data 7+ days old | General recommendation + "Update your profile for more accurate advice" |
| Low | "Limited context" | <14 days wearable data OR core health conditions missing | Suggest profile completion before acting on recommendation |
| Skip | "Not enough data" | <3 days wearable OR context too incomplete | No recommendation; prompt to complete setup |

**Display rule:** Confidence tier is always visible, adjacent to the recommendation. It is never suppressed to make a recommendation appear more authoritative.

### Context Refresh Triggers

The system prompts a context refresh when:

1. **Time-based:** Core health conditions (medications, diagnoses) reconfirmed every 90 days
2. **Signal-based:** A recommendation was ignored 3+ times consecutively → "Has anything changed? Your context may need updating."
3. **Event-based:** User reports a new diagnosis, new medication, or significant weight change
4. **Anomaly-based:** Layer 2 anomaly detected but Layer 1 context is stale (7+ days) → "Your metrics are unusual. Is your context still current?"

### Context Refresh UX

Context refresh must feel like **profile improvement**, not error correction:
- Do NOT say: "Your data is outdated, please fix it"
- DO say: "Want more personalized advice? Updating your profile takes 60 seconds and makes recommendations more relevant to your current situation."

Refresh asks ONE question per interaction. Do not batch multiple context updates.

### Incorrect Context Recovery

When user behavior contradicts inferred context (e.g., user ignores recommendation that should be relevant to them):
1. Track as negative recommendation signal (see § Recommendation Feedback Loop)
2. After 3 consecutive ignores of same recommendation type → prompt: "This recommendation doesn't seem relevant. Help us understand: [skip / context mismatch / wrong framing / disagree with advice]"
3. If "context mismatch" selected → trigger context refresh flow for that specific dimension
4. Collaborative filtering: find similar users who accepted the recommendation and compare contexts; surface the distinguishing variables to the user ("People who found this useful typically...")

### Recommendation Feedback Loop

```
User receives recommendation
    ↓
[Accept] → Track +1 signal for that context cluster
[Ignore] → Track -1 signal for that context cluster
[Modify] → Track modification; adjust future recommendation
    ↓
After 3 consecutive [Ignore] on same recommendation type:
    → Trigger context refresh prompt
    → De-prioritize that recommendation type for this user
    ↓
After 10+ feedback events:
    → Collaborative filtering: find cohort with similar context who accepted
    → Adjust recommendation weight for user's context cluster
```

### Clinical Escalation for Wrong Context

If Layer 2 anomaly is detected AND context is stale OR incomplete:
- Do NOT make a clinical recommendation based on stale context
- Display anomaly as a **question, not a statement**: "Your HRV has been below baseline for 5 days. Has anything changed in your routine or health?"
- Escalate to human review only if anomaly is sustained (14+ days) AND context is confirmed current

---

## Prohibited ML Practices at MVP

1. **Training chronic disease onset model from own user data** — insufficient follow-up time
2. **Disease-specific prediction** — "predicts diabetes onset" triggers HSA Class B classification
3. **Deep learning on individual time series** — individual N too small for chronic disease prediction
4. **End-to-end supervised recommendation model** — no labelled daily recommendation outcomes at MVP

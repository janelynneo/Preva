# Clinical Safety — Mandatory Safety Checks and Escalation Protocol

## Pre-Launch Safety Requirements

All five checks must be implemented before any user receives a recommendation.

---

## The Most Dangerous Recommendation

```
"Your metrics look stable. No changes recommended."
```

False reassurance during genuine physiological deterioration is the canonical failure mode for all preventive health ML. When a user has undiagnosed diabetes onset, early COVID-19, or myocarditis and receives a reassuring message, they do not seek clinical care. This is the primary clinical risk.

---

## 5 Mandatory Safety Checks

### Check 1: Resting Heart Rate Ceiling

**Trigger:** RHR >100 BPM on any single day (user not reporting fever/illness)

**Action:** Immediate push notification:
> "Your resting heart rate has been elevated today. If you're feeling unwell, please consult a doctor."

**Threshold rationale:** 100 BPM is the sinus tachycardia clinical threshold. This notification is always appropriate regardless of suspected cause.

---

### Check 2: Sustained Elevated Resting HR

**Trigger:** RHR >90 BPM for 7+ consecutive days (user's baseline is <75 BPM)

**Action:** Push notification within 48 hours:
> "Your resting heart rate has been consistently elevated for a week. Please check with a healthcare provider if this is unusual for you."

**Rationale:** Sustained elevated RHR is a validated marker of cardiovascular deconditioning, early infection, or anxiety — all benefiting from clinical evaluation.

---

### Check 3: HRV Below Physiological Floor

**Trigger:** RMSSD <10ms on any single day

**Action:** In-app banner:
> "We couldn't get a reliable heart rate variability reading. Try wearing your device more snugly overnight. If this persists, check with a doctor."

**Rationale:** RMSSD <10ms at rest is physiologically rare in healthy adults. Device error is most likely, but genuine autonomic dysfunction cannot be ruled out.

**Note:** Also flag as potential device malfunction in signal quality monitoring.

---

### Check 4: Irregular Rhythm Flag (Standalone Trigger)

**Trigger:** Wearable reports irregular rhythm (Apple HealthKit `HKCategorySampleTypeIdentifier.ecgIrregularRhythm` or Fitbit `irregular_rhythm`)

**Action:**
1. Immediate push notification to user:
> "We detected an irregular heartbeat pattern. Please consult a doctor for evaluation. This is not a diagnosis but should be reviewed."
2. Human review queue: clinical oversight team reviews within 24 hours

**Critical:** This fires regardless of any other signal. It is a standalone trigger. No other metric can block it. Base rate is ~0.5% of Apple Watch users per year — low frequency but catastrophic consequence of missing it.

---

### Check 5: Unexplained Weight Loss

**Trigger:** User loses >5% of body weight in <30 days without intentional effort

**Action:** Push notification:
> "You've lost [X]% of your body weight in the past month. If this was not intentional, please check with a doctor."

**Rationale:** Unexplained weight loss is a red flag for diabetes, thyroid dysfunction, and malignancy in this age group.

---

## 14-Day Baseline Convergence Gate

**Rule:** No risk tier is displayed before 14 consecutive days of valid HRV data.

During Days 1-13: Display only population-norm percentile bands ("Your HRV is in the 40th percentile for your age/gender cohort") — not a personal risk tier.

**Why 14 days:** HRV has high day-to-day variability. A personal baseline requires ~14 days for the mean to converge within ±10%. Before convergence, any risk tier comparison against personal baseline is structurally incorrect.

---

## Data Gap Protocol

| Gap | System Behavior | Risk Tier |
|-----|----------------|-----------|
| 1 day | Interpolate; flag in confidence score | No change |
| 2-3 days | Interpolate; flag prominently; prompt reconnection | Confidence de-rated; no tier change |
| 3+ days | Stop risk scoring; frozen tier with timestamp | Frozen at last known state |

**Frozen tier display rule:** The frozen tier must be visually distinguished (greyscale badge) with text: "Based on data from [date]. Reconnect your wearable for a current assessment."

**Critical gap scenario:** If a user experiences genuine autonomic degradation (e.g., early COVID suppressing HRV) during a 3+ day gap, the frozen reassuring tier must not display as current. The timestamp prevents false reassurance.

---

## Clinical Escalation Protocol

| Trigger | User Notification | Human Review | Timeline |
|---------|-----------------|--------------|----------|
| Irregular rhythm flag | Immediate: consult doctor | Yes | 24 hours |
| RHR >120 BPM for 2+ days | Immediate: "If chest pain/dizziness/SOB, call 995" | Yes | 12 hours |
| RHR >100 BPM for 7+ days | Push notification | Yes | 48 hours |
| RMSSD <10ms for 3+ days | In-app banner | Yes | 72 hours |
| Unexplained weight loss >5%/30 days | Push notification | Yes | 48 hours |
| User reports chest pain | "Please call 995" | Yes | Immediate |
| User reports diagnosis | Record in profile; suppress false-reassurance outputs in that category | No | — |

---

## Contraindication Database (Required Before Launch)

Must screen against before launch for common Singapore medications and conditions:

- Undisclosed hypertension (exercise intensity limits)
- Undisclosed eating disorders (calorie restriction recommendations)
- Insulin-dependent diabetes (exercise timing for glucose management)
- Cardiac arrhythmias (intense exercise recommendations)
- Pregnancy (exercise and nutrition recommendations)

**Mechanism:** Onboarding health questionnaire with structured contraindications. Self-reported — accuracy depends on user disclosure.

---

## Singapore Clinical Review Team Composition

| Role | Scope | Cadence |
|-------|-------|---------|
| Occupational Health Physician (MOM-certified) | Physical activity, workplace integration recommendations | Initial review + quarterly |
| Sports Medicine Physician | Exercise intensity/modality, injury prevention | Initial review + quarterly |
| Clinical Psychologist (SMC-registered) | Stress, sleep, mental wellness recommendations | Initial review + quarterly |
| Public Health Physician (HPB background) | Nutrition, general wellness, Singapore-specific guidelines | Initial review + annual |

---

## Post-Launch Review Cadence

| Type | Frequency | Scope |
|------|-----------|-------|
| Automated quarantine | Continuous | Recommendations with >0.5% severe negative feedback OR >2% general negative feedback |
| Clinical team review | Weekly | All quarantined recommendations; safety-related feedback within 48 hours |
| Full rule engine audit | Quarterly | End-to-end review; updated MOH/HPB guidelines; demographic bias assessment |
| Event-driven | Triggered | Adverse event, regulatory inquiry, WHO/MOH guideline change, new demographic |

---

## HSA Compliance Boundary

**Class A wellness boundary — every output must answer YES to:**
"Could a consumer wellness app say this?"

**Prohibited permanently:**
- "Predict your risk of diabetes"
- "You have patterns consistent with pre-diabetes"
- "Your HbA1c is likely elevated"
- "You are at high risk of cardiovascular disease"
- Any probability statement (e.g., "23% chance of...")

**Always permitted:**
- "Your HRV is below your personal baseline"
- "Based on population-level research, people with your HRV profile who maintain regular sleep show better metabolic markers"
- "Consider consulting a healthcare provider if you're concerned"

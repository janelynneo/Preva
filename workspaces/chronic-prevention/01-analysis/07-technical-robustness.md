# Technical Robustness Analysis: Metabo Preventive Health ML Product

## Executive Summary

Metabo is a preventive health ML product targeting Singapore desk workers aged 25-45, using Cox proportional hazards (Cox PH) modeling and anomaly detection on wearable HRV data to generate risk-stratified lifestyle recommendations. The product operates in the HSA Class A wellness tier, requiring that all outputs remain non-diagnostic and non-prescriptive. The analysis below identifies concrete failure modes, pipeline reliability risks, compliance boundaries, safety bounds, and a validation path for the Singapore cohort.

**Complexity: Complex** — multiple interacting ML subsystems, regulatory boundary at every accuracy improvement, clinical safety surface across 5 distinct risk categories.

---

## 1. ML Failure Modes

### 1.1 Cox PH Model Failure Modes

#### When Personal Baseline Has Not Converged

The Cox PH model requires a minimum of 14 consecutive days of HRV data to establish a personal baseline before risk scores become meaningful. Before convergence:

- **Output**: The model MUST NOT emit a risk tier change. The system should display "Building your baseline... X days remaining" and suppress all risk-scoring logic.
- **Failure mode**: If the system emits a risk tier in the first 14 days, it is comparing a fresh HRV measurement against population norms rather than personal norms — a structurally incorrect comparison that can falsely elevate or suppress risk.
- **Minimum data requirement**: 14 consecutive days of HRV (RMSSD) + activity (step count) + sleep duration. Gaps of >4 hours in a day invalidate that day's contribution to baseline.
- **Fallback rule**: Until baseline convergence, display only population-norm percentile bands (e.g., "Your HRV is in the 40th percentile for your age/gender cohort") — not a personal risk tier.

#### When HRV Data Is Too Noisy

HRV signal quality degrades with:
- Wearable removal >2 hours during sleep
- Charging interruptions mid-sleep
-腕带 looseness (common in users with low body fat)
- Exercise within 2 hours before measurement (parasympathetic contamination)

**Detection**: The pipeline MUST compute a signal quality score per reading. Quality thresholds:
- RMSSD validity: coefficient of variation across 5-minute RMSSD segments must be <30%
- Minimum valid RMSSD: >10ms (values below this indicate device malfunction or artifact)
- Maximum valid RMSSD: <200ms (values above this indicate R-R interval misdetection)

**Failure mode — silent quality collapse**: If device firmware updates cause systematic RMSSD inflation (documented in Whoop 4.0's 2022 firmware change that inflated RMSSD by ~15%), the model accepts the inflated values as real, producing artificially low risk scores.

**Mitigation**: Daily signal quality report stored per user; if >30% of days in a rolling 14-day window fail quality thresholds, the system must flag "Data quality too low for reliable risk assessment" and suspend risk tier output.

#### When Wearable Data Is Missing for Days

| Gap Duration | System Behavior | Risk Tier Impact |
|---|---|---|
| 1 day | Interpolate from adjacent days; flag "1 day missing" in confidence score | No change; confidence score decreases proportionally |
| 2-3 days | Interpolate; flag prominently; recommend user check wearable connection | Downgrade confidence display but do not change tier |
| 3+ days | Stop risk scoring entirely; display "We haven't received your data since [date]. Your last known risk tier was [X]. Tap to reconnect." | Risk tier frozen at last known state; no new tier output until 7 days of new data arrives |

**Critical failure mode — 3-day gap during true physiological change**: If a user experiences a genuine autonomic degradation (e.g., early COVID-19 infection suppresses HRV 5-7 days before symptoms) during a 3-day data gap, the frozen risk tier falsely reassures the user. This is the most dangerous false-negative scenario.

**Mitigation**: The rule engine must NOT allow the frozen risk tier to display as "current." The frozen tier must be visually distinguished (e.g., greyscale badge, timestamp) and accompanied by explanatory text: "Based on data from [date]. Reconnect your wearable for current assessment."

### 1.2 Anomaly Detection Failure Modes

#### Missing Self-Report Data (Evening Check-In)

The anomaly detection model fuses wearable data (continuous) with self-report data (discrete, user-initiated). Missing self-report data creates asymmetric information:

- **1 missed check-in**: Treat as "no change from baseline mood/stress" — no anomaly flag
- **2 consecutive missed check-ins**: Flag as data gap; weight wearable-only signals more heavily
- **3+ consecutive missed check-ins**: Anomaly detection enters "reduced confidence mode" — anomalies are still detected but confidence scores are de-rated by 40%

**Failure mode — habituation false positives**: Users who consistently skip evening check-ins develop a pattern that looks like a stable baseline. When they finally check in after a genuinely anomalous day, the anomaly score is suppressed because it diverges from their "miss-80%-of-check-ins" pattern. This is structurally wrong — the anomaly is real.

**Mitigation**: The model must learn the user's check-in frequency pattern as a separate signal. A user who misses 80% of check-ins should have their occasional check-in treated as higher information density, not suppressed.

#### Anomaly Detection on Raw HRV Without Sleep Staging

HRV is strongly confounded by sleep stage. Deep sleep produces RMSSD values 2-4x higher than wakefulness. Without sleep staging:

- A user who shifts from 70% deep sleep to 50% deep sleep (same total sleep) shows RMSSD decrease that looks like autonomic degradation
- The anomaly detector flags this as a "concerning HRV drop" when it is actually a sleep architecture change

**Minimum viable wearable dataset**: The pipeline MUST include either:
- Sleep stage classification (from accelerometer + HRV pattern), OR
- Explicit "sleep quality" summary from the wearable (Apple HealthKit `HKCategorySampleType.sleepAnalysis`; Fitbit `SLEEP_STAGES`)

If neither is available, the anomaly detection module must apply a conservative sleep-stage correction factor and flag "Sleep staging unavailable — using population correction."

---

## 2. Data Pipeline Reliability

### 2.1 Apple HealthKit API Failure Modes

**Rate limits**: HealthKit does not publish explicit rate limits but enforces throttling at the OS level. Frequent `HKStatisticsCollectionQuery` calls across multiple data types (HRV, steps, sleep, heart rate) can trigger `HKError.errorCode.notBusy` responses.

**Mitigation**: Batch requests by data type with minimum 30-second intervals. Implement exponential backoff with jitter (base: 30s, max: 5min, max retries: 5).

**API changes**: Apple releases iOS updates that change HealthKit capabilities approximately 2-3x per year. Breaking changes include:
- `HKCategorySampleTypeIdentifier` enum additions/removals (iOS 17 removed `bodyMass`, relabeled `bloodGlucose`)
- Authorization request dialog text changes that alter user consent rates
- Background delivery behavior changes for `HKObserverQuery`

**Fallback architecture**: The pipeline MUST maintain a wearable-agnostic normalization layer. The fallback is NOT "switch to Fitbit" — it is "use normalized data from whichever source is available." Both Apple HealthKit and Fitbit normalize to the same internal schema (`HRV_RMSSD_MSS`, `SLEEP_TOTAL_MINUTES`, `STEPS_DAILY`, `RESTING_HR_BPM`).

**Specific fallback rules**:
- If Apple HealthKit returns `HKError.notAuthorized` (user revoked permissions): immediately surface a permission restoration prompt with step-by-step instructions; do not silently degrade
- If Apple HealthKit returns no data for >2 days despite prior authorization: send push notification "Unable to sync your health data — tap to reconnect"
- If Apple HealthKit returns `HKError.errorCode.notAvailable` (device incompatible): display "Your device isn't supported for [data type]. Consider [alternative wearable]."

### 2.2 Fitbit API Failure Modes

**OAuth token expiration**: Fitbit tokens expire after 1 year. The product must implement token refresh with a 30-day pre-expiration warning to the user ("Your Fitbit connection expires in 30 days — tap to refresh").

**API changes**: Fitbit's Web API changelog shows breaking changes 1-2x per year. The most common:
- `GET /activities/heartrate` field name changes (`value.restingHeartRate` → `value.heartRate.rates.RESTING`)
- Sleep stage API restructuring between `sleep` and `sleep stage` endpoints
- OAuth scopes adding new required scopes with silent failure if not requested

**Mitigation**: Pin Fitbit API versions in the client (not latest). Test against Fitbit's sandbox API quarterly.

**User revokes permissions**: Same behavior as Apple HealthKit — immediate permission restoration flow, no silent degradation.

### 2.3 Wearable-Agnostic Architecture

The core model MUST NOT be coupled to Apple HealthKit or Fitbit as primary data sources. The pipeline architecture:

```
[Apple HealthKit]     [Fitbit API]      [Manual Entry Fallback]
        \                   |                    /
         v                  v                    v
    Normalization Layer (common internal schema)
         |                   |                    |
         v                   v                    v
    Signal Quality Layer  ←  Requires: RMSSD, resting HR, sleep minutes, steps
         |
         v
    Baseline Convergence Checker (14-day rule)
         |
         v
    Cox PH Risk Scorer + Anomaly Detector
         |
         v
    Rule Engine (HSA-compliant output)
```

**Losing Apple HealthKit does not break the core model** — Fitbit provides the same normalized fields. Losing Fitbit does not break the core model — Apple HealthKit provides the same normalized fields. Losing both reduces the system to manual entry mode with explicit confidence de-rating (see Section 2.4).

### 2.4 Minimum Viable Wearable Dataset

For the Cox PH risk model to produce meaningful output, the system requires:

| Data Type | Minimum Quality | Frequency | Missing Behavior |
|---|---|---|---|
| HRV (RMSSD) | ≥10 valid 5-min segments per day | Daily | Cannot compute risk tier |
| Resting heart rate | ≥1 valid reading per day | Daily | Interpolate from adjacent days (max 2 days) |
| Sleep duration | Total minutes from any sleep detection | Daily | Interpolate from 7-day rolling average |
| Step count | Total daily steps | Daily | No direct model impact; activity context only |

**Without HRV**: The system MUST NOT produce a Cox PH risk tier. It may produce a basic activity summary ("You're averaging 4,200 steps/day, below the 8,000-step recommendation"). This is not a risk tier.

**Without resting heart rate**: Interpolate from adjacent days (up to 2 days). Beyond 2 days of missing RHR, flag as data gap and freeze risk tier.

**Manual entry fallback**: Users without wearables can manually enter weight, subjective energy level (1-5 scale), and subjective sleep quality (1-5 scale). This enables the system to remain partially functional but explicitly de-rated to "manual entry mode" with a permanent "Limited accuracy" banner.

---

## 3. HSA Compliance Architecture

### 3.1 HSA Regulatory Framework

Under HSA Singapore, health products fall into:
- **Class A (Wellness)**: General wellness products making no medical claims. Must not diagnose, treat, or prevent disease.
- **Class B (General Health Products)**: Products making health enhancement claims or with some physiological effect.
- **Class C (Therapeutic Products)**: Products with significant pharmacological action or disease modification claims.

Metabo's target classification is **Class A**. The boundary is maintained through the **output layer** (user-facing text), not the model itself.

### 3.2 The Accuracy-Scrutiny Trap

**Critical risk**: As the Cox PH model becomes more accurate, it approaches clinical utility — which is precisely where HSA scrutiny begins. A model with 85% sensitivity for detecting pre-diabetic progression in 30-40 year olds is a diagnostic tool, not a wellness product, regardless of how the output is framed.

**The compliance boundary is NOT about the model — it is about the claims made and the action the user is expected to take based on the output.**

**HSA triggers for Class B / Class C reclassification**:
1. The output uses clinical terminology (pre-diabetic, hypertensive, at-risk for cardiovascular event)
2. The output recommends a specific clinical action (see a doctor, get your HbA1c tested, start medication)
3. The output implies disease detection ("We detected patterns consistent with...")
4. The user is expected to substitute the product's output for a clinical test
5. The product makes a claim about a specific disease outcome

**What does NOT trigger reclassification**:
- "Your HRV is lower than usual — consider a more relaxed evening routine"
- "You've been sleeping less than your personal baseline — try winding down earlier"
- "Your activity level has been below your typical range"
- "Based on your health data, you may benefit from more movement during the day"

### 3.3 Output Layer Design for Accuracy-Proof Compliance

The output layer MUST be structured so that accuracy improvements do not erode the wellness framing. The design principle: **the model is a "habit coach," not a "health monitor."**

```python
# COMPLIANT output (wellness framing, no clinical claim)
"Your 14-day HRV trend is below your personal baseline.
 This can sometimes reflect stress or recovery needs.
 Consider: more consistent sleep, light evening movement, or screen-free wind-down."

# NON-COMPLIANT output (clinical framing — do not implement)
"Your HRV pattern is consistent with early-stage autonomic dysfunction.
 Risk of pre-diabetic progression: 23% elevated.
 Recommend: HbA1c test within 30 days."
```

**Rule**: Every output sentence must answer "yes" to: "Could a consumer wellness app say this?" If the answer is no, the sentence is non-compliant.

**Dynamic ceiling**: As model accuracy improves, the system must resist the temptation to convey that accuracy to the user. A 95% accurate risk prediction is still a wellness observation if framed as "You've been more stressed than usual lately."

### 3.4 Feature Roadmap and HSA Compliance

Adding features creates HSA risk. Each new feature type:

| Feature | HSA Risk | Mitigation |
|---|---|---|
| Blood glucose integration (consumer device) | Medium — glucose is a clinical marker | Must frame as "energy patterns," not "glucose levels" |
| Blood pressure integration | High — BP is a direct cardiovascular risk factor | Output must not use clinical BP thresholds; no "hypertensive" language |
| Diet/food logging | Medium — nutritional claims | Frame as "eating patterns," not "dietary health" |
| Mental health check-ins (PHQ-4 equivalent) | High — clinical mental health screening | Never use clinical cutoffs; frame as "how you're feeling" |
| Medication reminders | Very High — medication is clinical treatment | Out of scope for Class A; do not implement |
| Sleep apnea risk flags | Very High — diagnostic | Out of scope for Class A; do not implement |

**Principle**: Every feature addition requires a compliance review before implementation. The review question is not "does this feature work?" but "could this feature's output be interpreted as a medical claim?"

---

## 4. Clinical Safety Bounds

### 4.1 Most Dangerous Recommendation the Rule Engine Could Produce

The highest-risk output category is **false reassurance followed by inaction**. Specifically:

```
"Your metrics look stable. No changes recommended."
```

When a user actually has a genuine physiological deterioration (early COVID-19, myocarditis, uncontrolled diabetes onset) and the model outputs stability/reassurance, the user does not seek clinical care.

**Concrete scenario**: A 38-year-old user with undiagnosed Type 2 diabetes (fasting glucose consistently elevated, HRV depressed, sleep fragmented) receives: "Your HRV is slightly below average for your age but within normal range. Keep up your current activity level." The user believes they are fine. Their HbA1c continues rising.

**This is the canonical failure mode for all preventive health ML: the false negative that delays clinical presentation.**

### 4.2 Mandatory Safety Checks Before Launch

**Check 1 — Resting Heart Rate Ceiling**
- If resting HR >100 BPM on any single day (not averaged) for a user without reported fever/illness: immediate push notification: "Your resting heart rate has been elevated. If you're feeling unwell, please consult a doctor."
- This is not a diagnosis. It is a data-referential observation with a clinical action (see a doctor) that is always appropriate regardless of cause.
- Threshold: 100 BPM (sinus tachycardia threshold, clinically validated)

**Check 2 — Sustained Elevated Resting HR**
- If resting HR is >90 BPM for 7+ consecutive days (for a user whose baseline is <75 BPM): push notification: "Your resting heart rate has been consistently elevated for a week. Please check with a healthcare provider if this is unusual for you."
- Rationale: sustained elevated resting HR is a validated marker of cardiovascular deconditioning, early infection, or anxiety — all of which benefit from clinical evaluation

**Check 3 — HRV Below Physiological Floor**
- If RMSSD <10ms on any single day: flag as device malfunction OR severe autonomic dysfunction; prompt: "We couldn't get a reliable heart rate variability reading today. Try wearing your device more snugly overnight. If this persists, check with a doctor."
- Rationale: RMSSD <10ms at rest is physiologically rare in otherwise healthy adults; device error is most likely, but genuine dysfunction cannot be ruled out

**Check 4 — Potential Arrhythmia Signal**
- If the wearable reports `irregular rhythm` (Apple HealthKit `HKCategorySampleTypeIdentifier.ecgIrregularRhythm`) or Fitbit `irregular_rhythm`: immediately escalate to human review queue AND send user push notification: "We detected an irregular heartbeat pattern. Please consult a doctor for evaluation. This is not a diagnosis but should be reviewed by a healthcare professional."
- This check MUST fire regardless of any other metric. It is a standalone signal.
- Must be implemented even if the wearable API returns this data with low frequency (e.g., Apple Watch ECG irregular rhythm notification fires for ~0.5% of users per year — the base rate is low, but the consequence of missing it is cardiac arrest).

**Check 5 — Weight Loss Velocity**
- If user loses >5% of body weight in <30 days without intentional effort: push notification: "You've lost [X]% of your body weight in the past month. If this was not intentional, please check with a doctor."
- Rationale: unexplained weight loss is a red flag for diabetes, thyroid dysfunction, and malignancy in this age group

### 4.3 Users Who Are Already Diabetic (Not Pre-Diabetic)

**The system has no diagnostic capability and therefore cannot definitively identify diabetic vs. pre-diabetic users.** This is intentional — the system is not a diabetes screening tool.

**However**, the system MUST detect the pattern that is most consistent with undiagnosed diabetes and NOT reassure the user away from care:

| Observed Pattern | System Output | Rationale |
|---|---|---|
| Consistently elevated fasting glucose (>7.0 mmol/L from connected glucometer) | "Your glucose patterns show some variability. Please discuss with your doctor during your next visit." | Glucose data from consumer devices is unreliable for diagnosis; framing as "discuss with doctor" is always appropriate |
| HRV consistently suppressed (RMSSD <20ms for 30+ days) in absence of other stressors | "Your recovery metrics have been low for an extended period. Consider discussing this with your doctor." | Non-specific; could be diabetes, overtraining, chronic stress — doctor visit is always appropriate |
| Resting HR consistently >95 BPM without explanation | "Your resting heart rate has been elevated. If you're feeling unwell, please consult a doctor." | Always appropriate regardless of suspected cause |

**What the system must NOT say**:
- "Your glucose levels indicate pre-diabetes"
- "You show patterns consistent with diabetic risk"
- "Your HRV suggests metabolic dysfunction"

### 4.4 Clinical Escalation Protocol

**Escalation triggers (any one is sufficient)**:

| Trigger | Notification to User | Human Review Required | External Action |
|---|---|---|---|
| Irregular rhythm flag from wearable | Immediate push notification to see doctor | Yes — within 24 hours | None (user must self-refer) |
| Resting HR >120 BPM for 2+ consecutive days | Immediate push notification — "If you're experiencing chest pain, dizziness, or shortness of breath, call 995." | Yes — within 12 hours | None (emergency self-referral) |
| Resting HR >100 BPM for 7+ consecutive days | Push notification + in-app banner | Yes — within 48 hours | None |
| RMSSD <10ms for 3+ consecutive days | In-app banner suggesting device check and doctor if persistent | Yes — within 72 hours | None |
| Unexplained weight loss >5% in 30 days | Push notification | Yes — within 48 hours | None |
| User self-reports: "I felt chest pain" | Immediate: "Please call 995. If you're in Singapore, dial 995 for emergency services." | Yes — flag for follow-up | None (emergency services is user action) |
| User self-reports: "I was diagnosed with [condition]" | Record in user profile; suppress future false-reassurance outputs in that category | No | Update user health profile; adjust recommendations |

**Human review queue**: A clinical review role (nurse or physician, not ML engineer) must review escalations within the timeframes above. The review confirms the notification was sent and assesses whether additional in-app actions are warranted. This is not a clinical diagnosis — it is a safety audit of the automated system.

---

## 5. Singapore Cohort Validation Path

### 5.1 Minimally Viable Clinical Validation Study

A validation study for the Singapore cohort must establish two things:
1. **Technical validity**: The model's risk stratification correlates with clinically validated health outcomes in Singapore desk workers aged 25-45
2. **Clinical utility**: Users who receive Metabo recommendations show measurable health behavior change vs. control group

**Study Design: Prospective Cohort with Retrospective Calibration**

| Parameter | Minimum Viable | Ideal |
|---|---|---|
| Sample size | n=200 (100 intervention, 100 control) | n=1,200 (600/600) |
| Duration | 6 months | 24 months |
| Population | Sedentary desk workers, Singapore, ages 25-45 | Same + stratification by gender, BMI baseline |
| Primary endpoint | Change in IPAQ physical activity score at 6 months | Change in 10-year cardiovascular risk score (QRISK3-SG) at 24 months |
| Secondary endpoint | Change in self-reported stress (PSS-10) | Change in metabolic markers (waist circumference, HbA1c) at 12 months |
| Recruitment | Corporate wellness program partnerships | Same + polyclinic referrals |

**Why n=200 is the minimum**: Power calculation for a two-sample t-test (alpha=0.05, power=0.80) detecting a medium effect size (d=0.50) on IPAQ score change requires ~64 per arm. Adding 50% for attrition (common in corporate wellness studies) yields ~96 per arm, rounding to n=200 total.

**Why 6 months is the minimum**: HRV-based risk models require 3+ months of data to establish within-user baselines. A 6-month study provides a 3-month baseline period and 3-month intervention period — sufficient to detect whether the model produces actionable change vs. the control group's usual behavior.

### 5.2 Singapore Institutional Partnerships

| Institution | Realistic Role | Engagement Complexity |
|---|---|---|
| **NUHS (National University Health System)** — Healthy Living for Everyone (HYPE) program | Primary research partner; provides clinical validation infrastructure, IRB oversight, access to primary care network | High — requires data governance agreement, ethics approval, 12-18 month setup |
| **SingHealth** — Regional Health System divisional research | Secondary validation; epidemiological validation of risk stratification against EMR data (with consent) | Medium — EMR data access is highly regulated; requires DPO involvement |
| **Polyclinics (National Healthcare Group / SingHealth)** | Recruitment channel for lower-income desk workers; community validation | Low-medium — established corporate wellness MOU templates exist |
| **NTUC Income** | Corporate wellness partnership; insurance co-marketing; potential co-funding of validation study in exchange for risk model access | Low — commercial partner; faster contracting than public institutions |

**Recommended first partnership**: NTUC Income or a corporate wellness platform (e.g., Healthways, Vitality) as the validation co-funder. Corporate partners provide rapid recruitment (3-6 months to n=500) and a direct path to B2B sales pipeline. The trade-off is a less rigorous academic publication, but a Healthways-published validation study is more commercially credible to HR buyers than an academic paper.

### 5.3 Publishable Study Design for B2B Sales

A publishable validation study must:
1. **Pre-register** on ClinicalTrials.gov or Singapore's National Medical Research Register (NMRC) — pre-registration is required for peer-reviewed publication in any major journal
2. **Use a validated comparator**: IPAQ (International Physical Activity Questionnaire) is the minimum validated comparator; QRISK3-SG is the ideal clinical comparator for cardiovascular risk
3. **Include a health economic argument**: Cost-per-QALY (quality-adjusted life year) gained from preventive intervention. Singapore's threshold is ~$60,000-70,000 SGD/QALY.
4. **Publish regardless of results**: A study that shows "Metabo users had statistically significant improvement in physical activity but not in stress markers" is still publishable and still commercially valuable. Null results in a wellness context are not failures — they inform product development.

**Publication target**: Journal of Occupational and Environmental Medicine (JOEM) — high relevance to corporate wellness buyers, peer-reviewed, indexed.

### 5.4 Ethical Considerations for Employee Health Data

**The central ethical risk**: Using employee health data for model validation creates a power imbalance between employer and employee. Employees may feel coerced to participate to maintain employment benefits or to appear health-conscious to supervisors.

**Required ethical safeguards**:

1. **Informed consent must be independent of employment**: Consent must be obtained by a third party (not HR), must state clearly that non-participation has no employment consequence, and must allow withdrawal at any time without penalty.
2. **Data minimization**: The validation study dataset must not include identifiers linking health data to employment records. A separate linkage key must be held by an independent custodian.
3. **No individual results returned to employers**: Aggregate group-level wellness metrics may be reported to employers; individual health data (including Metabo risk tiers) must not be accessible to HR or management.
4. **Data retention limits**: Health data collected for validation must be deleted within 12 months of study completion or upon user withdrawal.
5. **IRB approval**: The study must be approved by Singapore's Domain Specific Review Board (DSRB) or equivalent before any data collection begins. Corporate IRB boards are not acceptable substitutes for an independent ethics committee.

**Singapore-specific consideration**: The Personal Data Protection Act (PDPA) applies to all health data. A Data Protection Impact Assessment (DPIA) is required before study launch. The company's DPO must be involved from study design, not just contract review.

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Model produces false reassurance during genuine physiological deterioration (diabetes onset, early infection) | Medium | Critical | Hard safety floors (RHR ceiling, HRV floor, arrhythmia flag); frozen risk tier visual distinction |
| Apple HealthKit / Fitbit API change breaks HRV ingestion pipeline | Medium | Major | Wearable-agnostic normalization layer; both sources required for full functionality; manual fallback with confidence de-rating |
| Model accuracy improvement erodes HSA wellness framing (approaches diagnostic utility) | Low-Medium | Major | Output layer compliance review gate before any model update; wellness-only framing discipline |
| User revokes health data permissions; system silently degrades to unreliable risk tiers | Medium | Major | Explicit permission restoration flow; no silent degradation; confidence score always visible |
| 3+ day data gap during genuine physiological change produces frozen reassuring risk tier | Medium | Major | Frozen tier must be visually timestamped; "based on data from [date]" disclaimer; reconnection prompt |
| Corporate partner uses individual health data for employment decisions | Low (with safeguards) | Critical | Legal contract prohibiting employer access; technical enforcement of data isolation; DPIA + DRB approval |
| Sleep staging unavailable causes false anomaly detection in HRV signal | Medium | Significant | Sleep-stage correction factor with population baseline; "limited accuracy" banner; explicit flag when sleep staging unavailable |
| Blood glucose integration feature (future) introduces clinical framing risk | Medium | Major | HSA compliance review gate before feature launch; glucose framed as "energy patterns" only |
| Arrhythmia flag missed by system; user experiences cardiac event | Very Low | Critical | Irregular rhythm signal from wearable is a standalone escalation trigger; human review queue within 24 hours |

---

## Cross-Reference Audit

**Related documents to check for consistency**:
- `workspaces/chronic-prevention/01-analysis/` — prior analysis documents for Metabo product concept, market analysis, technical architecture
- `workspaces/chronic-prevention/02-plans/` — implementation plan for Metabo MVP; verify that the 14-day baseline convergence rule is implemented
- `workspaces/chronic-prevention/briefs/` — original product brief for Metabo; verify that HSA compliance framing matches this analysis
- `workspaces/chronic-prevention/todos/completed/` — any completed work that may have implemented the safety checks described in Section 4

**Consistency requirements**:
- Risk tier output language in any implemented rule engine must match the compliant/non-compliant examples in Section 3.3
- 14-day baseline convergence period must be implemented as specified (not 7 days, not 21 days)
- Irregular rhythm escalation must be implemented as a standalone trigger (not gated on any other signal)

---

## Implementation Roadmap

### Phase 1: Safety-Critical Infrastructure (Before Any User Launch)
- Implement all 5 mandatory safety checks (Section 4.2)
- Implement 14-day baseline convergence gate (Section 1.1)
- Implement data gap freezing + visual distinction for risk tiers (Section 1.1)
- Implement wearable-agnostic normalization layer (Section 2.3)
- Implement Apple HealthKit and Fitbit fallback rules (Section 2.1-2.2)

### Phase 2: Core Model Deployment (MVP Launch)
- Cox PH risk scoring with confidence bands (not point-estimate tiers)
- Anomaly detection with reduced-confidence mode for missing self-report data
- HSA-compliant output layer with compliance review gate
- Clinical escalation protocol with human review queue

### Phase 3: Validation Study (Year 1-2)
- IRB/DPIAs filed and approved
- Corporate wellness partner contracted (target: n=500 minimum)
- 6-month interim analysis (baseline vs. 3-month intervention)
- 12-month primary endpoint analysis
- Publication submission (target: JOEM)

### Phase 4: Feature Expansion (Post-Validation)
- Blood glucose integration (if validation supports clinical utility)
- Blood pressure integration (if HSA compliance review approves)
- Singapore cohort-specific model retraining (address ethnic diversity in cardiovascular risk)

---

## Success Criteria

- [ ] Risk tier output is never displayed before 14-day baseline convergence
- [ ] Irregular rhythm flag triggers human review within 24 hours, every time
- [ ] Resting HR >100 BPM sustained 7+ days triggers escalation notification within 48 hours
- [ ] 3+ day data gap produces visually timestamped frozen risk tier with reconnection prompt
- [ ] Losing Apple HealthKit (Fitbit intact) does not interrupt core model functionality
- [ ] Output layer contains no clinical terminology that would trigger HSA Class B reclassification
- [ ] Validation study pre-registration filed before any data collection begins
- [ ] Corporate wellness partner signs DPIA acknowledging employer cannot access individual health data
- [ ] Every model update undergoes output layer compliance review before deployment

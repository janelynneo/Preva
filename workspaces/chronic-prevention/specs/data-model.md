# Data Model — Metabo

**Date:** 2026-05-10
**Status:** Complete

## Scope

This spec defines all data entities, their attributes, relationships, and the Google Sheets schema that serves as the MVP data store. No production database is specified at MVP stage — Google Sheets is the system of record pending scale.

---

## Entity Relationship Diagram

```
User (1) ──────< Profile (1)
    │
    ├─────< DailyAggregate (∞)     ── derives from ──> WearableData (∞)
    │                                            │
    │                                            └─────< SelfReport (∞)
    │
    └─────< CheckIn (∞)
    │
    └─────< MWI (1)
```

---

## Entity Definitions

### 1. User

The primary entity. Created on onboarding completion.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `user_id` | string (UUID) | Yes | Generated on signup; used as primary key across all tabs |
| `name` | string | Yes | First name only |
| `notification_morning_time` | string (HH:MM) | Yes | Default: "07:30" |
| `notification_evening_time` | string (HH:MM) | Yes | Default: "21:30" |
| `primary_goal` | enum | Yes | `energy` / `sleep` / `stress` / `activity` |
| `locale` | string | Yes | `en-SG` (MVP); extensible to `zh-SG`, `ms-SG`, `ta-SG` |
| `created_at` | datetime | Yes | ISO 8601 |
| `onboarding_completed_at` | datetime | Yes | Triggers baseline building period |
| `streak_count` | integer | Yes | Default: 0; incremented on each check-in |
| `streak_frozen` | boolean | Yes | Default: false; set true when 1 missed check-in in 14-day window |
| `status` | enum | Yes | `baseline_building` / `active` / `dormant` / `churned` |

**Status transitions:**
- `baseline_building`: Days 1–29 after onboarding
- `active`: Day 30+ with ≥1 weekly check-in
- `dormant`: 8–30 days without check-in
- `churned`: >30 days without check-in

---

### 2. Profile

Demographic and health context. One row per user. Written once during onboarding; updated on profile edit.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `user_id` | string (FK → User) | Yes | Primary key |
| `age` | integer | Yes | 25–45 for MVP |
| `sex` | enum | Yes | `male` / `female` |
| `ethnicity` | enum | Yes | `chinese` / `malay` / `indian` / `others` |
| `height_cm` | float | Yes | For BMI calculation |
| `weight_kg` | float | Yes | For BMI calculation |
| `bmi` | float | Derived | `weight_kg / (height_cm/100)²` |
| `family_history_t2d` | boolean | Yes | First-degree relative with T2D |
| `gestational_diabetes` | boolean | Yes (female only) | Null/False for males |
| `conditions` | list[string] | No | Self-reported: `hypertension`, `heart_condition`, `none` |
| `medications` | list[string] | No | Free text; not processed by ML at MVP |
| `latest_lab_hba1c` | float | No | % value; boosts Layer 1 accuracy |
| `latest_lab_fasting_glucose` | float | No | mg/dL; boosts Layer 1 accuracy |
| `latest_lab_bp_systolic` | integer | No | mmHg; boosts Layer 1 accuracy |
| `latest_lab_bp_diastolic` | integer | No | mmHg |
| `latest_lab_date` | date | No | Date of most recent lab results |
| `profile_completeness_pct` | integer | Derived | 0–100; based on which optional fields are populated |

**Profile completeness tiers (for confidence scoring):**
- <40%: Low context — Layer 2 recommendations suppressed
- 40–70%: Moderate context — recommendations with "based on partial data" label
- 70–100%: High context — full recommendations with "strong match" label

---

### 3. WearableData

Raw wearable sensor readings. Aggregated daily in `DailyAggregate`. Not stored as individual events at MVP.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| `user_id` | string (FK → User) | — | |
| `date` | date | — | Day of reading |
| `hrv_rmssd_ms` | float | Apple HealthKit / Fitbit | RMSSD in milliseconds |
| `hrv_sdnn_ms` | float | Apple HealthKit / Fitbit | SDNN in milliseconds |
| `hrv_lf_hf_ratio` | float | Apple HealthKit / Fitbit | LF/HF ratio |
| `resting_hr_bpm` | float | Apple HealthKit / Fitbit | Mean overnight resting heart rate |
| `sleep_duration_min` | integer | Apple HealthKit / Fitbit | Total sleep in minutes |
| `sleep_deep_pct` | float | Apple HealthKit / Fitbit | Deep sleep % |
| `sleep_rem_pct` | float | Apple HealthKit / Fitbit | REM sleep % |
| `sleep_efficiency_pct` | float | Apple HealthKit / Fitbit | (Time asleep / Time in bed) × 100 |
| `sleep_onset_latency_min` | integer | Apple HealthKit / Fitbit | Minutes to fall asleep |
| `waso_min` | integer | Apple HealthKit / Fitbit | Wake after sleep onset |
| `steps_total` | integer | Apple HealthKit / Fitbit | Total daily steps |
| `active_min_mvpa` | integer | Apple HealthKit / Fitbit | Moderate-vigorous physical activity minutes |
| `hrv_work_ratio` | float | Derived | HRV during work hours (9am–6pm) / HRV during recovery hours (9pm–7am) |

**MVP note:** Individual wearable events are not stored. Only daily aggregated summaries are written to Google Sheets `DailyData` tab. Raw sensor data remains in Apple HealthKit / Fitbit and is re-read on each daily sync.

---

### 4. SelfReport

Daily self-reported check-in data. One row per user per day.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `user_id` | string (FK → User) | Yes | |
| `date` | date | Yes | Reference date of the check-in |
| `check_in_type` | enum | Yes | `evening` / `morning_backfill` / `abbreviated` |
| `sleep_quality` | integer | Yes | 1–5 Likert |
| `soreness_neck_shoulders` | enum | Yes | `none` / `mild` / `moderate` / `severe` |
| `soreness_upper_back` | enum | Yes | Same scale |
| `soreness_lower_back` | enum | Yes | Same scale |
| `soreness_wrists_hands` | enum | Yes | Same scale |
| `soreness_hips_legs` | enum | Yes | Same scale |
| `energy` | integer | Yes | 1–5 Likert |
| `stress` | integer | Yes | 1–5 Likert |
| `hawker_meals` | integer | Yes | 0–10 |
| `photo_uri` | string | No | Local URI of optional meal photo attachment |
| `water_intake` | integer | No | Glasses of water; not yet surfaced in UI |
| `activity` | string | No | Free text; not yet surfaced in UI |
| `notes` | string | No | Free text notes; not yet surfaced in UI |
| `submitted_at` | datetime | Yes | ISO 8601; for latency tracking |

**Check-in types:**
- `evening`: Standard daily check-in (all fields)
- `morning_backfill`: User missed yesterday's check-in; submitted morning of day after (sleep_quality refers to previous night)
- `abbreviated`: After 3 consecutive missed days; only energy + stress captured

---

### 5. DailyAggregate

Computed daily summary joining WearableData + SelfReport + baseline deviations. One row per user per day.

| Field | Type | Derived From | Notes |
|-------|------|-------------|-------|
| `user_id` | string (FK → User) | — | |
| `date` | date | — | |
| `hrv_rmssd` | float | WearableData | |
| `resting_hr` | float | WearableData | |
| `sleep_efficiency` | float | WearableData | |
| `steps` | integer | WearableData | |
| `sleep_quality` | integer | SelfReport | |
| `energy` | integer | SelfReport | |
| `stress` | integer | SelfReport | |
| `hawker_meals` | integer | SelfReport | |
| `hrv_dev_pct` | float | Derived | `(today_hrv - baseline_hrv) / baseline_hrv × 100` |
| `rhr_dev_pct` | float | Derived | `(today_rhr - baseline_rhr) / baseline_rhr × 100` |
| `sleep_dev_pct` | float | Derived | `(today_sleep_eff - baseline_sleep_eff) / baseline_sleep_eff × 100` |
| `steps_dev_pct` | float | Derived | `(today_steps - baseline_steps) / baseline_steps × 100` |
| `hawker_excess` | boolean | Derived | `hawker_meals > 5` |
| `recovery_score` | integer | Derived | 0–100; computed from HRV_dev_pct + RHR_dev_pct + Sleep_dev_pct weighted composite |
| `anomaly_flag` | boolean | Layer 2 | `true` if Isolation Forest flags anomaly on this day's vector |
| `anomaly_score` | float | Layer 2 | Isolation Forest anomaly score; -1 to 1 |
| `recommendation_text` | string | Layer 2 | Generated recommendation; wellness-framed only |
| `recommendation_accepted` | boolean | User feedback | `null` if not yet shown; `true`/`false` after user feedback |

**Recovery score computation (MVP rule-based):**
```
recovery_score = (
  40  # baseline
  + 20 × clamp(hrv_dev_pct / 15, -1, 1)   # HRV contribution
  + 20 × clamp(-rhr_dev_pct / 10, -1, 1)  # RHR: lower is better
  + 20 × clamp(sleep_dev_pct / 20, -1, 1) # Sleep contribution
  + 20 × clamp(steps_dev_pct / 30, -1, 1) # Activity contribution
)
```

---

### 6. MWI (Metabolic Wellness Index)

Computed at Day 30 (initial) and re-evaluated quarterly or on new lab data.

| Field | Type | Notes |
|-------|------|-------|
| `user_id` | string (FK → User) | Primary key |
| `tier` | integer | 1 / 2 / 3 |
| `tier_label` | string | `Wellness` / `Monitoring Recommended` / `Lifestyle Attention` |
| `tier_color` | string | `green` / `yellow` / `red` |
| `risk_score` | float | Cox PH output; 0–1 probability; not shown to user |
| `anomaly_score` | float | Layer 2 composite anomaly score; not shown to user |
| `final_tier` | integer | 1–3; displayed to user |
| `recommendation` | string | Wellness-framed recommendation |
| `confidence_tier` | enum | `high` / `moderate` / `low` / `insufficient` |
| `context_freshness` | string | ISO 8601 date of oldest stale context field |
| `computed_at` | datetime | ISO 8601 |
| `next_evaluation_at` | datetime | ISO 8601; quarterly or on new lab data |
| `nhanes_model_version` | string | For audit; e.g., `nhanes-v3.5.16` |

**Tier definitions (user-facing labels only — not shown with clinical terminology):**

| Tier | Label | Color | Trigger | User Messaging |
|------|-------|-------|---------|----------------|
| 1 | Wellness | Green | Layer 1 risk in lowest quartile | "Your metabolic markers are in a healthy range for your profile." |
| 2 | Monitoring Recommended | Yellow | Layer 1 risk in middle 50% | "Some markers suggest room for improvement. Small changes can help." |
| 3 | Lifestyle Attention | Red | Layer 1 risk in highest quartile, OR sustained Layer 2 anomaly | "Your daily patterns show room for attention. Here's what tends to help." |

---

### 7. ContextLog

Tracks context freshness and user-override of inferred context. Created on each profile update or context refresh.

| Field | Type | Notes |
|-------|------|-------|
| `user_id` | string (FK → User) | |
| `timestamp` | datetime | |
| `event_type` | enum | `profile_update` / `context_refresh_triggered` / `recommendation_feedback_negative` / `anomaly_context_conflict` |
| `field_changed` | string | Which field was updated, if applicable |
| `old_value` | string | Previous value |
| `new_value` | string | New value |
| `triggered_by` | enum | `user` / `system_time` / `system_signal` / `system_event` |

---

### 8. RecommendationFeedback

Tracks user response to each recommendation for the feedback loop.

| Field | Type | Notes |
|-------|------|-------|
| `user_id` | string (FK → User) | |
| `date` | date | |
| `recommendation_text_hash` | string | SHA-256 of recommendation text; for de-duplication |
| `feedback` | enum | `accept` / `ignore` / `modify` / `dismiss` |
| `modification` | string | Free text; if user modified the recommendation |
| `context_snapshot` | JSON | User's context at time of recommendation; for collaborative filtering |

---

## Google Sheets Schema (MVP Data Store)

### Tab: Profile

```
A: user_id | B: age | C: sex | D: ethnicity | E: height_cm | F: weight_kg |
G: bmi | H: family_history_t2d | I: gestational_diabetes | J: conditions |
K: medications | L: latest_lab_hba1c | M: latest_lab_fasting_glucose |
N: latest_lab_bp_systolic | O: latest_lab_bp_diastolic | P: latest_lab_date
```

### Tab: DailyData

```
A: user_id | B: date | C: hrv_rmssd | D: resting_hr | E: sleep_efficiency |
F: steps | G: sleep_quality | H: energy | I: stress | J: hawker_meals |
K: hrv_dev_pct | L: rhr_dev_pct | M: sleep_dev_pct | N: steps_dev_pct |
O: hawker_excess | P: recovery_score | Q: anomaly_flag | R: anomaly_score |
S: recommendation_text | T: recommendation_accepted
```

### Tab: CheckIns

```
A: user_id | B: date | C: check_in_type | D: sleep_quality |
E: soreness_neck_shoulders | F: soreness_upper_back | G: soreness_lower_back |
H: soreness_wrists_hands | I: soreness_hips_legs | J: energy | K: stress |
L: hawker_meals | M: submitted_at
```

### Tab: MWI

```
A: user_id | B: tier | C: tier_label | D: tier_color | E: risk_score |
F: anomaly_score | G: final_tier | H: recommendation | I: confidence_tier |
J: context_freshness | K: computed_at | L: next_evaluation_at |
M: nhanes_model_version
```

---

## Locale-Configurable Data Architecture

For Asia expansion, these components are locale-specific and must be swappable:

### Food Module

| Locale | Food Database | Source |
|--------|--------------|--------|
| `en-SG` (MVP) | Singapore hawker food GI/macro database | Manual curation; ~200 items |
| `ms-MY` | Malaysian hawker food database | Year 2 |
| `ta-IN` | South Indian food database | Year 3 |
| `zh-CN` | Chinese food database | Year 3 |

**Food item attributes (locale-configurable):**
- `food_name`: Local language + English
- `gi_category`: `low` / `medium` / `high`
- `glycemic_load_per_serving`: number
- `typical_serving_size_g`: number
- `meal_context`: `breakfast` / `lunch` / `dinner` / `snack`

### Self-Report Question Bank

Each self-report question has locale-specific variants:

| Question ID | en-SG | ms-MY | ta-IN |
|-------------|-------|-------|-------|
| `hawker_meals` | "Hawker meals today?" | "Makan di gerai today?" | "இன்று கடைத் தின்பரண்?" |
| `energy` | "Energy level today?" | "Tahap tenaga hari ini?" | "இன்றைய ஆற்றல் நிலை?" |
| `sleep_quality` | "How'd you sleep?" | "Bagaimana tidur tadi malam?" | "நீங்கள் எப்படி தூங்கினீர்கள்?" |

### Notification Templates

| Template ID | en-SG | Trigger |
|-------------|-------|---------|
| `morning_briefing` | "Good morning, {name}. Here's your briefing." | 7:30am daily |
| `evening_checkin` | "How'd today go? 30 seconds to log your day." | 9:30pm daily |
| `reengagement_1day` | "We missed yesterday's check-in — tap to add it now." | Day 2 morning |
| `reengagement_3day` | "It's been a few days — your streak is safe. Just 3 questions." | Day 4 morning |

---

## Privacy and PDPA Compliance

| Requirement | Implementation |
|-------------|---------------|
| **Data minimisation** | Only collect fields listed above; no raw wearable events |
| **User consent** | Explicit consent at onboarding; revocable |
| **Data portability** | Export via profile screen (all user data as JSON) |
| **Right to erasure** | Deleting a user row from Profile tab cascades to DailyData, CheckIns, MWI via user_id |
| **Retention** | Active users: indefinitely; Dormant/churned: anonymised after 12 months |
| **No third-party sharing** | No user data shared with third parties at MVP |
| **Employer aggregate data** | B2B2C: employer sees ONLY aggregate workforce stats (no individual data); implemented as separate read-only aggregation tab |

---

## Implements

- specs/ml-architecture.md §Feature Engineering
- specs/engagement-loop.md §Progressive Profiling + §Context-as-a-Feature
- specs/b2b2c-retention.md §Identity Retention
- specs/wellness-framing.md §HSA Language Constraints
- briefs/03-business-costs.md §MVP Build Architecture

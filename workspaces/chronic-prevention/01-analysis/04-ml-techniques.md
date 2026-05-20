# ML Techniques Analysis: Chronic Disease Risk Prediction

## Executive Summary

This document surveys machine learning approaches for a preventive health product targeting chronic disease risk prediction (diabetes, cardiovascular disease, metabolic syndrome). The product uses self-reported daily signals (sleep, stress, soreness, energy) and wearable data (HRV, steps, heart rate, sleep stages) to generate both long-term risk scores (3-10 year horizon) and daily actionable recommendations.

**Key findings:**
- Supervised ML with proxy labels (elevated HbA1c, pre-diabetes range) is viable without diagnosed outcomes
- Survival analysis models are more appropriate than classification for long-term risk
- One unified model cannot optimally serve both 10-year risk prediction AND daily recommendations — separate architectures are required
- Cold-start problem is solvable via population-level priors from NHANES/UK Biobank
- Singapore HSA regulation is a hard constraint — the wellness/medical device boundary is defined by specific language and claim precision, not the presence of AI

---

## 1. Supervised ML for Risk Prediction

### 1.1 Training Data for Chronic Disease Prediction

**Labeled datasets for chronic disease prediction typically use:**

| Label Type | Source | Time Horizon | Example |
|---|---|---|---|
| Incident diagnosis | EHR, insurance claims | 3-10 year follow-up | ICD-10 E11 (Type 2 diabetes) |
| Lab values (continuous) | Clinical data | Point-in-time | HbA1c >= 6.5% |
| Proxy/soft labels | Lab + self-report | Any | HbA1c 5.7-6.4% (pre-diabetes) |
| Composite risk scores | Clinical algorithms | 10-year | Framingham Risk Score |

**Population-level reference datasets:**
- **NHANES** (National Health and Nutrition Examination Survey) — 30+ years, N~5,000/year, includes lab values and 10-year mortality follow-up
- **UK Biobank** — 500,000 participants, 10-year follow-up, deep phenotyping including wearable accelerometer subsample
- **Singapore Ministry of Health HealthHub data** — access requires institutional agreement

**Data structure for a chronic disease model:**

```
Feature vector per user per time window:
  - Demographics: age, sex, BMI, ethnicity (high-dimensional for Singapore's multi-ethnic population)
  - Lab values: HbA1c, fasting glucose, LDL, HDL, triglycerides (most predictive)
  - Vital signs: systolic/diastolic BP
  - Self-reported: sleep quality, stress, soreness, energy (1-5 Likert scales)
  - Wearable-derived: resting HR, HRV (RMSSD/SDNN), step count, sleep stage distribution
  - Temporal: 7-day, 30-day, 90-day rolling windows of above

Label:
  - Binary: diabetes onset within T years (T = 3, 5, 10)
  - Continuous: time-to-event (survival analysis)
  - Ordinal: no risk / pre-diabetes / diabetes risk tier
```

### 1.2 Predicting Diabetes Without Diagnosed Outcome Labels

**This is a core MVP concern. Answer: Yes, proxy labels enable supervised learning without diagnosed outcomes.**

Proxy labels that are clinically validated and don't require diagnosis codes:

| Proxy Label | Clinical Definition | Advantage | Limitation |
|---|---|---|---|
| HbA1c >= 6.5% | Full diabetes range | Direct diagnostic criterion | Requires blood draw |
| HbA1c 5.7-6.4% | Pre-diabetes range | Larger sample, reversible | Only predicts progression risk |
| Fasting glucose >= 126 mg/dL | Pre-diabetes/diabetes | Simple blood test | Single timepoint, not chronic |
| Elevated 2-hour glucose | Post-OGTT | Catches early dysregulation | Requires clinical visit |
| Composite: BMI + family history + HbA1c | Pre-disease risk score | More robust than single marker | Requires validated composite |

**For MVP without clinical partners:** NHANES provides HbA1c labels for ~10,000 participants with full covariate data. This is sufficient to train a population-level risk model.

**Label availability problem:** You won't have diagnosed outcomes at the individual level for your users. The solution is:
1. Train on population datasets (NHANES) with proxy labels
2. The model learns population-level risk factors, not individual-level diagnoses
3. Apply the trained model to individual users to generate risk scores
4. Over time, if users get diagnosed externally (self-reported), that becomes validation signal

### 1.3 Time-to-Event Models (Survival Analysis) vs Classification

**Survival analysis is strictly superior for chronic disease risk prediction for two reasons:**

1. **Censoring handling:** A user who drops out or hasn't developed diabetes by the end of the study is not a "negative" — classification treats them identically to someone with 10 years of healthy data. Survival models handle this correctly.

2. **Time-varying risk:** The risk of diabetes in year 3 given you survived year 2 is different from unconditional risk. Classification outputs a single probability; survival models output a time-varying hazard curve.

**Appropriate survival models for this use case:**

| Model | Strengths | Limitations |
|---|---|---|
| **Cox Proportional Hazards** | Interpretable (hazard ratios), fast, well-understood by clinicians | Proportional hazards assumption may not hold |
| **Random Survival Forests (RSF)** | No proportional hazards assumption, captures interactions, handles high-dimensional data | Less interpretable, requires larger N |
| **DeepSurv** (Cox + neural networks) | Captures nonlinear relationships, handles complex feature interactions | Needs more data, less interpretable |
| **Multi-task Logistic Regression (MTLR)** | Fine-grained time predictions, learns time-varying coefficients | Computationally heavier |

**Recommended approach for MVP:** Start with Cox PH for its interpretability (clinicians can validate hazard ratios), graduate to RSF or DeepSurv as you accumulate labeled outcomes.

**For the daily recommendation system:** A separate classification/ordinal model is needed — survival models predict 5-year risk, not "what should I do today."

### 1.4 Minimum Labeled Dataset Size

**Minimum viable for population-level risk model (trained on NHANES):**
- N >= 500 with the outcome of interest (diabetes incidence in 10-year window)
- NHANES has ~3,500 diabetes cases per 10-year cycle — not a constraint
- Constraint is covariate completeness: users with full lab + wearable + self-report data

**Minimum viable for personalized model (your users):**
- Per-user personalization requires at minimum 30-90 days of daily observations
- This is not for training — this is for estimating individual-level baseline parameters
- The population-level model provides the prior; personal data updates the posterior

**Hard constraint:** You cannot train a chronic disease onset model from scratch on your user base alone at MVP stage. You MUST use population datasets for the core risk model.

---

## 2. Unsupervised and Semi-Supervised Approaches

### 2.1 Detecting Risk Patterns Without Labelled Outcomes

**Viable approaches that don't require diagnosis labels:**

**Clustering for risk segmentation:**
- K-means, Gaussian Mixture Models (GMM), or hierarchical clustering on feature vectors
- Clusters can be mapped post-hoc to known risk categories using population datasets
- E.g., cluster users by HRV + sleep + activity patterns → identify "high-stress, low-recovery" cluster → map to elevated metabolic risk via NHANES correlation

**Semi-supervised via population labels:**
- Train on NHANES (fully labeled) to get a risk score function
- Apply to your users (unlabeled) to generate pseudo-labels
- Use pseudo-labels to train a model more tailored to your specific feature set (wearable-heavy)
- This is technically "supervised" but leverages unlabeled user data for feature adaptation

**Contrastive learning for health state representation:**
- Learn embeddings of daily health states such that "similar health states" (by outcome) cluster together
- Self-supervised: derive supervisory signal from correlated signals (e.g., if HRV is low AND sleep is poor AND energy is low, these should embed near each other even without a label)
- Pre-train on population data, fine-tune on user data

### 2.2 Clustering Users into Risk Segments

**Recommended clustering features (wearable + self-report):**

```
Core clustering features:
  - 30-day mean HRV (RMSSD)
  - 30-day mean resting heart rate
  - Sleep efficiency (time asleep / time in bed)
  - Sleep stage distribution (deep/light/REM %)
  - Daily step count (mean, variability as CV)
  - Self-reported: stress, soreness, energy (mean, trend)
  - Circadian rhythm stability (SD of sleep onset time)

Derived features:
  - Recovery score: (HRV trend + sleep quality + energy) / 3
  - Activity regularity: coefficient of variation in daily steps
  - Stress load: area under the curve of self-reported stress over 14 days
```

**Mapping clusters to risk tiers:**
1. Cluster on your user population
2. Score each cluster using the NHANES-trained risk model
3. Label clusters as "Tier 1 (low risk) / Tier 2 (elevated) / Tier 3 (high)"
4. Users entering Tier 2+ get more frequent check-ins and stronger recommendations

**This is the most viable unsupervised approach for MVP** — no labeled outcomes required, generates actionable segmentation.

### 2.3 Anomaly Detection for Deviation-from-Baseline

**Applicable to individual-level, not population-level:**

**Approach:** Establish each user's personal baseline during initial data collection period (first 14-30 days), then flag deviations.

**Useful algorithms:**
- **Isolation Forest:** Good for multivariate anomaly detection, handles high-dimensional wearable data
- **One-class SVM:** Simple, interpretable boundary
- **Autoencoder reconstruction error:** Learn "normal" daily pattern → flag days with high reconstruction error
- **CUSUM (cumulative sum) charts:** Detects sustained shifts in a metric (e.g., HRV steadily declining over 2 weeks)

**Clinical use case:** A sustained drop in HRV (more than 1.5 SD from personal baseline for >7 days) correlates with:
- Impending viral illness (infection suppresses HRV)
- Mental health deterioration
- Overtraining in athletes
- Early metabolic dysregulation

**For daily recommendations:** Anomaly detection drives real-time nudges ("Your HRV has been lower than usual — consider an easy day") without requiring any population-level labels.

### 2.4 Self-Supervised Learning from Wearable Data

**Approximate Temporal contastive learning (TNC) or SimSiam on wearable time series:**
- Create two views of the same day: morning window vs evening window
- The model learns to recognize that these are the same person's health state
- The learned representations capture health state without any labels

**Next-Prediction pretext task:**
- Given 7 days of data, predict day 8
- This forces the model to learn what "healthy stability" looks like
- A large prediction error on a new user indicates deviation from expected pattern

**Limitations:** Self-supervised representations must still be mapped to clinical risk. The representation learning is useful but the mapping to "10-year diabetes risk" still requires labeled data.

---

## 3. Deep Learning for Time Series

### 3.1 Extracting Features from Continuous Wearable Data

**What continuous wearable data provides:**

| Wearable Signal | Derived Features | Clinical Relevance |
|---|---|---|
| **Heart Rate (sampled ~1Hz)** | Resting HR, max HR, HRV (RMSSD, SDNN, pNN50), HR recovery after activity | Cardiovascular fitness, autonomic nervous system state |
| **HRV (computed from RR intervals)** | RMSSD (parasympathetic), LF/HF ratio (sympathovagal balance), SDNN (total variability) | Stress resilience, recovery capacity, metabolic health marker |
| **Accelerometer (3-axis)** | Step count, active minutes, exercise intensity (METs estimate), sleep detection | Physical activity level, circadian movement patterns |
| **Sleep stages (algorithm-derived)** | Time in deep/light/REM, sleep efficiency, sleep onset latency, wake after sleep onset (WASO) | Sleep quality, recovery, stress markers |
| **SpO2 (if available)** | Overnight desaturation events | Sleep apnea risk (metabolic syndrome indicator) |

**Feature engineering is critical:** Raw wearable time series is noisy. Pre-processed daily summaries (mean, SD, trend, percentile) are more useful for downstream models than raw sequences.

### 3.2 Transformer-Based Models for Daily Habit Patterns

**Applicable architecture: Temporal Fusion Transformer (TFT)**

TFT handles:
- Static covariates (age, sex, BMI, baseline labs)
- Known future inputs (none for risk, or planned interventions)
- Time-varying covariates (daily HRV, sleep, steps)
- Attention mechanisms to identify which days are most predictive

**Alternative: Informer (Transformer for Long Sequences)**
- Better for very long sequences (years of daily data)
- Lower computational cost than standard Transformer

**Simpler alternative: TabNet or FT-Transformer**
- Good performance on tabular + time-series hybrid
- More interpretable than pure Transformer

**Limitation:** Transformers require substantial data (typically N > 5,000 for time-series variants). For MVP, gradient-boosted trees (XGBoost, LightGBM) on hand-engineered features outperform deep learning on typical preventive health dataset sizes.

### 3.3 Features from Sleep/HRV/Activity Correlating with Metabolic Health

**Evidence-based correlations:**

| Feature | Correlation | Evidence |
|---|---|---|
| Low HRV (RMSSD < 20ms) | 2-3x higher T2D risk | Multiple cohort studies (Meta et al., 2020) |
| Short sleep (< 6 hours) | 30% increased T2D risk | NHANES analysis, Heavens et al. |
| Irregular sleep timing (high SD of sleep onset) | Associated with insulin resistance | Parsons et al., 2015 |
| Low physical activity (< 5,000 steps/day baseline) | Strong predictor of metabolic syndrome | Youth cohort evidence |
| Elevated resting HR | Independent cardiovascular risk factor | Mendelian randomization studies |
| Deep sleep percentage (< 15% of total) | Associated with HbA1c elevation | Sleep clinic studies |

**Important caveat:** These are population-level correlations. Within-individual variation is substantial, and these markers alone are insufficient for individual risk prediction — they must be combined with labs and demographics.

### 3.4 Risk of Overfitting with Small Individual Datasets

**This is a fundamental constraint:**

- A single user's data: 365 days/year of wearable + self-report
- This is a single data point for chronic disease (which unfolds over years)
- You cannot learn individual-level disease onset patterns from one individual's time series

**Mitigation strategies:**
1. **Population model + personal adaptation:** Train on NHANES/UK Biobank, adapt to individual via Bayesian updating or fine-tuning on limited personal data
2. **Hierarchical/mixed-effects models:** Population-level parameters + individual-level random effects
3. **Transfer learning:** Pre-trained representations from large wearable datasets (e.g., UK Biobank accelerometer subsample, N ~ 100,000) fine-tuned on your smaller labeled dataset
4. **Few-shot adaptation:** Use the population model as fixed feature extractor, train only the final layer on individual data

**The model should be treated as a clinical decision support tool, not an autonomous diagnostic.** This framing is also essential for regulatory purposes (see Section 6).

---

## 4. ML Technique Assessment for This Specific Use Case

### 4.1 Two Distinct Objectives Require Two Distinct Models

**These are not the same problem. Attempting to solve both with one model is architecturally wrong.**

| Objective | Time Horizon | Output | Appropriate Model |
|---|---|---|---|
| **Chronic disease risk prediction** | 3-10 years | Risk score (probability of incident disease) | Survival analysis / Cox PH / RSF |
| **Daily actionable recommendations** | Today / this week | Specific behavioral nudge ("take a rest day", "aim for 8,000 steps") | Classification / RL-based recommendation system |

**Why one model fails for both:**

1. The features that predict 10-year diabetes risk (HbA1c trajectory, BMI, family history) are NOT the same features that determine today's optimal recommendation
2. 10-year risk uses population baseline + long-term trends
3. Daily recommendations use deviation from personal baseline + recent trajectory
4. The loss functions are different (calibration vs. immediate utility)

### 4.2 Recommended Architecture

```
Layer 1: Population Risk Model (trained on NHANES)
  Input: demographics, baseline labs, 90-day wearable summaries
  Output: 10-year diabetes risk score (Cox PH or RSF)
  This is static per user; re-evaluated annually or on new lab data

Layer 2: Personal Baseline Estimator (first 30 days per user)
  Input: 30 days of wearable + self-report
  Output: Personal baseline parameters (mean HRV, mean sleep efficiency, etc.)
  This continuously updates as more data arrives

Layer 3: Daily Recommendation Model
  Input: Today's wearable + self-report + personal baseline + Layer 1 risk tier
  Output: Recommendation (rest / maintain / increase activity / seek lab work)
  This runs daily; it uses risk tier as context

  Recommendation logic (simplest viable form):
  - If HRV deviation from baseline < -1.5 SD AND risk tier >= 2: recommend rest
  - If step count < personal baseline - 20% AND risk tier >= 2: recommend activity
  - If risk tier == 3 AND no lab work in 6 months: recommend clinical follow-up
```

### 4.3 Combining Self-Reported and Wearable Data

**Feature fusion strategy:**

```
Early fusion (concatenate all features before model):
  - Simple, works well with tree-based models
  - Risk: wearable and self-report features may have different scales and noise profiles

Late fusion (separate models, combine predictions):
  - Population risk model uses lab + demographic features
  - Daily model uses wearable + self-report features
  - Final output is weighted combination

Intermediate fusion (learned joint embedding):
  - Use a small neural network to project wearable features and self-report features
    into a shared embedding space
  - Joint embedding fed to downstream classifier
  - Requires more data than early fusion
```

**For MVP:** Early fusion with standardized features, using LightGBM (handles mixed feature types well, robust to outliers, fast).

---

## 5. The Cold-Start Problem

### 5.1 Day 0: New User With Zero Data

**The model must produce a risk estimate on day 1, before any personal data is collected.**

**Solution: Population Prior**

```
Day 1 output = Population Risk Score
  - Based solely on: age, sex, BMI, self-reported family history, self-reported current conditions
  - Trained on NHANES population data
  - This is the prior; personal data will update it

The user should understand this is "population average, not your personal risk"
```

**For Singapore context:** Population priors should be trained on Singapore-specific data or validated on Singapore cohorts. Singapore's multi-ethnic population (Chinese, Malay, Indian) has different metabolic risk profiles. Thai/Maiwend and Malay populations have higher T2D prevalence than Chinese.

### 5.2 Days 1-30: Initial Data Collection

**What the model learns:**
- Personal baseline parameters (not risk — baseline)
- Mean HRV, mean resting HR, mean sleep efficiency, mean step count
- Self-reported baselines for energy, stress, soreness
- Personal variability (some people's HRV is naturally low but stable; others is naturally high)

**Output during this period:**
- No chronic disease risk score (insufficient data for meaningful update)
- Yes to daily recommendations (anomaly detection against early baseline is possible after 7 days)
- Framing: "Building your personal baseline — X more days until your risk profile is ready"

### 5.3 Days 30-90: Personalization Phase

**After 30 days, enough personal data exists to:**
1. Compute personal baseline with meaningful precision (SD of mean is small enough)
2. Detect meaningful deviations (7-day rolling window vs. 30-day baseline)
3. Generate actionable anomaly-based recommendations

**The population risk score can now be updated with personal features:**
- If personal HRV is in top 20% of population for age/sex → risk adjusts downward
- If personal sleep efficiency is below population median → risk adjusts upward
- This is Bayesian updating: Posterior = Population Prior + Personal Evidence (weighted by N)

### 5.4 Days 90+: Stable Personalized Model

**After 90 days:**
- Personal baseline is well-calibrated
- 90-day trends are computable (e.g., HRV slowly declining)
- The model can detect meaningful risk trajectory changes (e.g., HRV has dropped 30% over 60 days)

**The model should be re-trained or re-calibrated:**
- Annually with new lab data if available
- Continuously via online learning (CAVIAR algorithm or similar for Bayesian updating)
- Never from scratch — always from the population prior

### 5.5 MVP Model Architecture

**For an MVP without years of labeled follow-up data:**

```
MVP Architecture:

1. OFFLINE (training before launch):
   a. Train Cox PH on NHANES data (N ~ 10,000 with 10-year follow-up)
      Features: age, sex, BMI, ethnicity, HbA1c, blood pressure, smoking, family history
      Outcome: time-to-diabetes or time-to-cardiovascular-event
   b. This gives you a population risk model

2. ONLINE (per user, at runtime):
   a. Day 0: Score = population model output
   b. Day 1-29: Collect data, no risk update
   c. Day 30+: Compute personal HRV/sleep/activity baseline
      Update posterior risk = f(population_prior, personal_baseline, personal_trend)
   d. Daily: Anomaly detection vs. personal baseline → recommendations

3. DAILY RECOMMENDATION MODEL (simplest viable):
   Rule-based + light ML:
   - Rule: if HRV deviation > threshold AND risk_tier >= 2 → "rest day"
   - Rule: if steps < baseline * 0.8 AND risk_tier >= 2 → "increase activity"
   - Rule: if risk_tier == 3 AND no lab work 6 months → "see clinician"
   - ML component (optional): LightGBM trained on which recommendations correlated
     with subsequent metric improvement across your user base (supervised signal
     builds up as you have users who followed recommendations)

This avoids the need for your own labeled outcome data entirely.
```

---

## 6. Singapore HSA Regulatory Constraints

### 6.1 What Constitutes a "Medical Device" in Singapore

**Legal definition (Health Products Act, Cap. 121D):**

A health product that is intended:
- To be used for a therapeutic purpose, OR
- To diagnose, prevent, monitor, treat, or alleviate a disease or injury, OR
- To investigate, replace, or modify the anatomy or a physiological process

**The key operative is "intended use" — defined by:**
1. The manufacturer's claims (packaging, marketing, IFU)
2. The actual function of the product
3. The target user population

**Software as a Medical Device (SaMD):**
- HSA classifies standalone software that performs a medical function as a Class A, B, or C medical device depending on risk
- Classification rule: Class B (moderate risk) for software that provides diagnostic or treatment recommendations
- Class C (high risk) for software that diagnoses or triages life-threatening conditions

### 6.2 When Does a Health App Become Regulated?

**A health app requires HSA registration if it:**

1. Makes specific medical claims (not general wellness)
2. Is intended to diagnose, prevent, monitor, or treat a specific condition
3. Provides individualized health recommendations based on user data

**HSA's wellness vs. medical device boundary:**

| Allowed (Wellness) | Likely Regulated (Medical Device) |
|---|---|
| "Improve your sleep quality" | "Detect early signs of sleep apnea" |
| "Track your steps and stay active" | "Predict your risk of developing diabetes" |
| "Manage your stress levels" | "Identify patterns associated with hypertension risk" |
| "General dietary advice" | "Recommend insulin dosing or medication changes" |
| "Remind you to exercise" | "Alert you to potential cardiac arrhythmia" |

**The specific language that triggers regulation:**
- Words like "predict," "risk," "detect," "diagnose," "early signs," "screen for"
- Providing a probability score (even if framed as "wellness score")
- Claiming to identify patterns associated with clinical outcomes

### 6.3 The Boundary: "Wellness" vs "Medical Advice"

**You can say:**
- "Users who track their sleep and maintain regular sleep schedules report higher energy levels"
- "Physical activity is associated with better metabolic health markers in population studies"
- "This app helps you track your daily habits"
- "Based on population-level research, maintaining HRV above X is associated with better recovery"

**You CANNOT say without HSA registration:**
- "This app predicts your risk of developing Type 2 diabetes"
- "Your HRV pattern suggests elevated cardiovascular risk"
- "Based on your data, you are at high risk for metabolic syndrome"
- "This app detects early signs of [specific disease]"

**Safe harbor approach:**
- Frame outputs as "habit scores" or "wellness indices" (not "risk scores")
- Include disclaimers: "Not a medical device. Not intended to diagnose, treat, or prevent any disease."
- Do not provide disease-specific recommendations (diabetes-specific, CVD-specific)
- Provide general behavioral recommendations (more sleep, more activity, stress reduction)
- Make clear these are population-level associations, not individual predictions

### 6.4 Specific Rules About AI in Health Recommendations

**HSA's AI in Health Products guidance (2023):**

1. **Algorithmic transparency:** HSA requires that AI-based health products disclose the general approach and limitations. Black-box models require additional validation.

2. **Validation requirements:**
   - AI models must be validated on Singapore-relevant populations (or justified on why general population is applicable)
   - Performance metrics must be reported: sensitivity, specificity, positive predictive value
   - For predictive models: calibration (are predicted risks actually observed risks?)

3. **Post-market monitoring:**
   - Real-world performance must be tracked
   - Model drift must be detected and addressed
   - Adverse events (user harm from recommendation) must be reported

4. **Specific to your product:**
   - If you claim the model is "personalized," you must demonstrate that personalization improves outcomes
   - If the model is trained on non-Singapore data, you must validate on Singapore population before claiming it applies to Singapore users

**Recommended regulatory pathway if you cross into Class B:**

```
1. Self-assess against HSA's GN-13 (Guidance on Quality Management System)
2. If Class B: Register with HSA's Medical Device Information and Communication System (MDICS)
3. Implement QMS (ISO 13485:2016) as quality standard
4. Conduct clinical evaluation on Singapore population
5. Prepare IFU (Instructions for Use) with all required disclosures
```

### 6.5 Practical Compliance Strategy for MVP

**MVP posture: Stay in the wellness tier as long as possible.**

Minimum changes to stay wellness-class:

1. **Remove "risk" from all user-facing language.** Use "wellness index" or "habit consistency score" instead of "diabetes risk score"

2. **No disease-specific recommendations.** Instead of "your diabetes risk is elevated," say "your recovery metrics are below your personal baseline — consider prioritizing sleep this week"

3. **No individual probability statements.** Instead of "you have a 23% chance of developing diabetes," say "your HRV trend is below average for your age group based on population data"

4. **Population-level framing.** "In population studies, people with your HRV profile who maintain regular sleep show better metabolic markers" — not "you will develop diabetes"

5. **Explicit disclaimers in-app.** Every screen with a score must include "This is not a medical device. Not intended to diagnose, treat, or prevent any disease."

6. **Clinical escalation threshold.** If personal baseline shows sustained deterioration across multiple metrics, recommend "consult a healthcare provider" — but do not say what condition you suspect.

---

## 7. Summary of Critical Gaps (Flagged for MVP)

| ML Approach | Requires Labeled Diagnosis Data? | Available at MVP? | Recommendation |
|---|---|---|---|
| Cox PH on NHANES (10-year risk) | Yes (incident diagnoses) | NHANES has this | USE for population risk model |
| Direct diabetes onset prediction | Yes | Not from your users | DO NOT ATTEMPT from user data |
| Proxy label model (HbA1c 5.7+) | Partially (lab data) | NHANES has this | USE for model training |
| Daily recommendation (rule-based) | No | Yes | USE for MVP |
| Daily recommendation (ML-enhanced) | Partially (outcome signal from users) | Build over time | DEFER |
| Clustering / segmentation | No | Yes | USE for user stratification |
| Anomaly detection | No | Yes | USE for daily nudges |
| Survival model personal adaptation | Yes (for fine-tuning) | Only from population data | USE with Bayesian updating |
| Deep learning on time series | Yes (large N) | NHANES/UK Biobank | DEFER — overfit risk at MVP scale |

### Approaches requiring labeled diagnosis data you DON'T have at MVP:
1. Any model that predicts "incident diabetes onset" using your user data — you have no 10-year follow-up
2. Any model that requires validated outcome labels at individual level — you have only self-reported conditions
3. Any deep learning model trained end-to-end on user data — dataset size is insufficient

### Approaches that ARE viable at MVP:
1. Population-trained survival models (NHANES) for 10-year risk context
2. Per-user baseline estimation + anomaly detection (no labels required)
3. Clustering for risk stratification (no labels required)
4. Rule-based daily recommendations with population model as context

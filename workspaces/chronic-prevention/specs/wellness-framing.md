# HSA Wellness Tier — Language Rules

## The Regulatory Boundary

Under Singapore's Health Products Act (Cap. 121D), standalone software that performs a health function is classified as a medical device if it:
1. Makes specific medical claims (not general wellness)
2. Is intended to diagnose, prevent, monitor, or treat a specific condition
3. Provides individualized health recommendations based on user data

**Class B (moderate risk):** Diagnostic or treatment recommendations
**Class C (high risk):** Diagnoses or triages life-threatening conditions

**The product as architected must stay in the wellness tier indefinitely.** Crossing into Class B requires ISO 13485 QMS certification, HSA MDICS registration, and Singapore-population clinical validation. This is Year 3+ scope, not Year 1.

---

## Prohibited Language (Always)

| Prohibited phrase | Why prohibited | Replace with |
|-------------------|----------------|--------------|
| "Predict your risk of diabetes" | Disease-specific prediction claim | "See how your metabolic wellness compares to population patterns" |
| "You are at high risk of cardiovascular disease" | Disease-specific risk statement | "Your recovery metrics are below your personal baseline" |
| "Detect early signs of pre-diabetes" | Disease detection claim | "Your HRV trend suggests elevated metabolic stress" |
| "Screen for hypertension" | Screening claim | "Track your blood pressure trends" |
| "This app will help prevent [disease]" | Prevention claim for specific condition | "Supports your overall metabolic wellness" |
| "[X]% chance of developing diabetes in 10 years" | Probability statement | "Your Metabolic Wellness Index is in Tier 2" |
| "Your HbA1c is likely elevated" | Diagnostic implication | "Based on your habits, here's what population research suggests" |

---

## Required Disclaimers

Every screen that displays a score or recommendation must include:
> "This app is not a medical device. It is not intended to diagnose, treat, prevent, or cure any disease or medical condition. Consult a healthcare provider for medical advice."

The disclaimer appears:
- On the onboarding screen (before first data entry)
- On every screen displaying a "Metabolic Wellness Index" or similar score
- On every recommendation screen
- In-app footer (persistent)

---

## Allowed Language

| Allowed phrase | Why allowed | Example context |
|----------------|-------------|-----------------|
| "Based on population-level research" | Transparent about evidence base | "In population studies, people with your HRV profile who maintain regular sleep show better metabolic markers" |
| "Habit consistency score" | Wellness framing, no disease implication | "Your habit consistency score this week: 78/100" |
| "Wellness index" | Generic wellness framing | "Your Metabolic Wellness Index: Moderate" |
| "Personal baseline" | Non-comparative individual framing | "Your HRV is 15% above your personal baseline this week" |
| "Recovery score" | Wellness-oriented metric | "Your recovery score today: 82/100" |
| "Trending up / trending down" | Directional trend without specific disease link | "Your sleep efficiency is trending up over the last 14 days" |
| "Consider consulting a healthcare provider" | Clinical escalation without diagnosis | "If you're concerned about your health metrics, consider a routine health check with your GP" |

---

## Clinical Escalation Rules

When personal baseline shows **sustained deterioration** across multiple metrics (≥3 consecutive days, ≥2 metric categories), recommend clinical follow-up without naming a condition:

**Allowed escalation language:**
- "Your metrics have been below baseline for several days. Consider seeing a healthcare provider for a routine check-up."
- "If you haven't had a health screening in the past 12 months, this might be a good time."

**Prohibited escalation language:**
- ❌ "Your metrics suggest possible pre-diabetes — see a doctor immediately"
- ❌ "Your blood pressure patterns may indicate hypertension"
- ❌ "You should get your HbA1c tested"

---

## Model Validation Disclosure

When presenting the Metabolic Wellness Index:
> "This index is based on the NHANES population dataset and is calibrated for Singapore's multi-ethnic population where research data is available. It reflects population-level patterns, not individual medical diagnoses."

---

## Enforcement

Language compliance is enforced at:
1. **Product spec stage** — all user-facing strings reviewed against this document
2. **Code review stage** — no disease-specific language in any user-facing output
3. **Content review stage** — marketing copy, app store descriptions, onboarding text all reviewed

**Any product decision that introduces disease-specific language requires explicit sign-off and a legal review of HSA classification implications.**

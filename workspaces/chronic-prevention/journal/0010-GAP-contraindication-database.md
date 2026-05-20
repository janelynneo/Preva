---
name: contraindication-database-gap
description: Metabo's rule engine can recommend exercise intensity that is dangerous for users with undisclosed hypertension, eating disorders, or cardiac conditions. A contraindication database is required before launch — not optional
type: GAP
---

**Finding:** The behavioral robustness analysis identified contraindication miss as a Category 2 failure: recommending high-intensity exercise to a user with undiagnosed hypertension (risk: cardiovascular event), recommending intermittent fasting to a user with an undisclosed eating disorder (risk: relapse), recommending sleep extension to a user with clinical insomnia (risk: sleep anxiety).

**Why this is a gap:** The onboarding health questionnaire can screen for some conditions, but depends on user self-reporting accuracy. Many people with hypertension, prediabetes, or eating disorders do not know they have these conditions.

**What is required before launch:**
1. Contraindication database covering top 50 Singapore-prescribed medications and top 10 chronic condition categories
2. Health questionnaire with structured screening for major contraindications
3. A clinical safety review of every exercise recommendation in the rule engine

**Status:** Not yet implemented. Required for clinical safety compliance.

**Sources:** `06-behavioural-robustness.md` § 3.1; `07-technical-robustness.md` § 4.2

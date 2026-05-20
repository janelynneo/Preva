---
name: nhanes-singapore-calibration-gap
description: NHANES-trained model will miscalibrate for Malay/Indian Singaporeans — Year 2 clinical validation is not optional
type: GAP
---

**Finding:** The recommended ML architecture (Cox PH on NHANES) uses US population data. Singapore's Malay and Indian populations have 2–3× higher T2D prevalence than Chinese Singaporeans at equivalent BMI/HbA1c, likely due to genetic and lifestyle factors. Ethnicity interaction terms in the Cox model partially mitigate this but are not a substitute for Singapore-cohort validation.

**Why this is a gap and not a blocker:** MVP can launch with NHANES + ethnicity interaction terms as a defensible "population-level research" framing (stays in HSA wellness tier). Year 2 must include Singapore-cohort validation (n≥200, in partnership with polyclinic or corporate health screening program).

**Verification required:** NUHS or SingHealth published data on Singapore multi-ethnic metabolic risk. Need to identify clinical partner before Year 2 fundraise.

**Sources:** `04-ml-techniques.md` § 1.2; `01-singapore-epidemiology.md` § Ethnic breakdown

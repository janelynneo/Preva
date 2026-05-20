---
name: accuracy-scrutiny-hsa-trap
description: As the Cox PH model becomes more accurate at predicting pre-diabetic progression, it approaches clinical utility — which triggers HSA Class B medical device classification regardless of output framing
type: RISK
---

**Finding:** The accuracy-scrutiny trap: a model with 85% sensitivity for detecting pre-diabetic progression is a diagnostic tool regardless of how the output is framed. The more accurate the model becomes, the closer it is to being reclassified as a Class B medical device requiring ISO 13485 QMS + HSA MDICS registration.

**Why this is a risk for product roadmap:** The instinct as the model improves is to convey that accuracy to the user ("your risk score improved from 23% to 18%"). That instinct must be resisted. The compliance boundary is entirely in the output language, not the model accuracy.

**Mitigation:** The output layer must be engineered so that accuracy improvements do not change the user-facing text. The model can be 95% accurate; the text remains "your recovery metrics are improving" — not "your pre-diabetic progression risk dropped 7 percentage points."

**Sources:** `07-technical-robustness.md` § 3.2

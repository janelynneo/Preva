---
type: RISK
date: 2026-05-06
created_at: 2026-05-06T12:30:00+08:00
author: agent
session_id: chronic-prevention-session-05
session_turn: 1
project: chronic-prevention
topic: PDPA compliance risk for health data collection
phase: analyze
tags: [pdpa, singapore, regulatory, health-data, compliance, risk]
---

## Risk: PDPA Health Data Obligations

### What Is the Risk

Health data is **sensitive personal data** under Singapore's Personal Data Protection Act (PDPA). Metabo collects multiple categories of sensitive health data:

| Data Collected | PDPA Sensitivity | Risk Level |
|----------------|-----------------|------------|
| Family history T2D, gestational diabetes | Sensitive (health) | High |
| HRV, sleep, steps (wearable) | Sensitive (health) | High |
| Self-report: energy, stress, soreness | Sensitive (health) | High |
| HbA1c, fasting glucose (blood test) | Sensitive (health) | Very High |
| Age, sex, ethnicity, height, weight | Personal data | Standard |

### Why This Is a Risk

1. **Sensitive data requires explicit consent** — no pre-ticked boxes. Must explain what, why, how.
2. **Higher security obligations** — must demonstrate reasonable security measures.
3. **Transfer limitations** — Google Sheets/Colab servers may be outside Singapore.
4. **Year 2 clinic integration** — direct hospital/clinic data flows require data sharing agreements and likely PDPC consultation.

### Current Mitigations in Spec

| Spec Element | Mitigation |
|-------------|-----------|
| Wellness framing (wellness-framing.md) | HSA-tier language keeps product "wellness" not "medical" |
| Clinical safety protocol (clinical-safety.md) | Data gap protocol + escalation pathway shows duty of care |
| No clinical partnerships Year 1 | Avoids direct clinical data flows |
| User owns data | No sharing with employers without anonymization |

### What Is NOT Mitigated

- No privacy policy documented
- No data retention policy documented
- No consent flow specified beyond onboarding checkbox
- No data deletion mechanism ("right to be forgotten")

### Consequences if Unmitigated

1. **PDPC complaint** — individuals can complain to Personal Data Protection Commission
2. **Reputational damage** — health data breach = trust destruction
3. **Product shutdown** — PDPC can order collection to stop
4. **Employer B2B2C complication** — employers providing Metabo to employees creates "employee monitoring" obligations under Employment Act

## For Discussion

1. **Counterfactual**: If we framed Metabo as a "fitness and wellness tracker" rather than "metabolic health," would HRV, sleep, and steps fall under lower-sensitivity personal data rather than sensitive health data under PDPA?
2. **Data**: What is the PDPC enforcement record for health apps in Singapore? Has any startup been fined or warned for improper health data collection?
3. **Risk**: Should PDPA compliance (privacy policy, consent flow, data retention, right to delete) be added as a required deliverable for Year 1 launch, not deferred to "we'll handle it later"?

# Product Brief — Metabo: Daily Metabolic Vitality Platform

**Date:** 2026-05-07
**Phase:** MGMT 655 + startup foundation
**Scope:** Singapore beachhead → Asia expansion

## Target User

Singapore desk worker, 25–45, not yet diagnosed with chronic disease.
Accumulating lifestyle risk silently. Has fitness background (founder perspective).

## Hard Constraints

- **Preventive space ONLY** — no diagnostics, no post-diagnosis management, no clinical products
- **No medical licensing required** — behavioural recommendations, not medical advice
- **No Year 1 clinical partnerships or expensive hardware**
- **Must be daily engagement product** — not a one-time assessment
- **Inputs:** self-reported daily signals + wearable data already owned

## In-Scope Conditions

- Type 2 diabetes
- Hypertension
- Musculoskeletal disorders
- Burnout / chronic stress

## Deliverables

1. Single most painful problem (frequency × emotional intensity × willingness to pay)
2. Best ML technique from MGMT 655 (supervised / unsupervised / deep learning / agents)
3. Product architecture (inputs → model → outputs)
4. Three product concepts ranked by feasibility / impact / differentiation
5. Kill risks (regulatory / behavioural / technical / competitive)

## Checks Required

- Flag data collection gaps
- Flag ML label dependency at MVP stage
- Flag existing Singapore startups in this space
- Flag behaviour change without engagement mechanism

---

## Session Additions (2026-05-07)

### SaMD Regulatory Decision

**Question:** Is this product Software as a Medical Device (SaMD)?

**Answer:** Likely NO — if stay in behavioural framing:
- Frame around "Metabolic Wellness Index" (personal deviation), NOT disease risk scores
- Never show condition-specific outputs (no "diabetes risk", no "hypertension score")
- Anchor observations to user's personal baseline, not clinical thresholds
- Recommendations must be behavioural (what to do), never clinical (what to treat)

**Key triggers to avoid:**
- "Your pattern suggests elevated diabetes risk"
- "Based on your HRV, you show prediabetic patterns"
- "Your BP trend suggests hypertension"

**Architecture safe harbour:** Personal baseline deviation engine — tracks each user's own 4-week norm, flags deviations, never compares to clinical cutoffs.

### USP Reframe

- **B2C lead:** "Your personal daily vitality engine" — daily energy, focus, recovery (SaMD-safe)
- **B2B/employer pitch:** Can carry disease prevention claims separately (different compliance path)
- **Core differentiator:** Personal baseline deviation vs population averages (What Oura/Whoop/Fitbit do) vs YOUR OWN norm (what this does)

### Primary Condition Decision (from analysis)

**Entry point: Metabolic vitality** — daily energy, recovery, and hawker habits (wellness framing, SaMD-safe)

Rationale:
- Metabolic health underpins all four conditions (T2D, hypertension, MSD, burnout)
- ~16–18% of 25-44 Singapore adults have pre-diabetes (silent, reversible) — but the hook is "feel more energised," not "avoid diabetes"
- 5–10 year prevention window — the daily engagement loop catches people in this window
- No well-funded Singapore incumbent in this exact wellness position

### Product Concept

**"Metabo"** — Daily Metabolic Vitality Coach

- Daily wearable-driven coaching (HRV, sleep, activity as metabolic stress proxies)
- No food logging (highest friction / dropout driver)
- One-tap daily check-in (<30 sec)
- B2B2C (employer wellness benefit, S$5–12/employee/month) + B2C (S$12–18/month)

### ML Architecture

Two-layer:
1. **Layer 1 (Supervised):** Cox PH / Random Survival Forests on NHANES data → 10-year metabolic risk tier (shown as "Metabolic Wellness Index", not disease risk)
2. **Layer 2 (Unsupervised):** Personal baseline deviation + anomaly detection for daily nudges

### Business Model

- B2B2C primary: employer pays → employee gets free access → upsell to B2C if they change jobs
- Singapore corporate wellness market: S$400–600M, PEPM S$2–50/month
- No Year 1 clinical partnerships required

### Geographic Scope

**Beachhead, not ceiling.**

- **Year 1:** Singapore — 5.9M people, English-speaking, digitally mature, high wearable penetration
- **Year 2–3:** Southeast Asia (Malaysia, Indonesia, Thailand, Vietnam) — shared hawker/SE Asian food context
- **Year 3–5:** India, China — largest addressable markets, highest diabetes burden

**Why Asia is the right market:**
- Asia has the world's highest diabetes prevalence (India: 11%, China: 13%, SEA: 8–10% vs UK/US: 7–10%)
- Western competitors (Oura, Whoop, Omada) are US-centric — no Asia-specific metabolic norms, no Asia food databases
- Singapore as proof-of-concept: small enough to launch fast, digitally mature enough to validate

**Expansion architecture (must be built into MVP):**

| MVP Component | Designed For | Expansion Path |
|---|---|---|
| Food database (hardcoded SG hawker) | Swap-able food module | Indian, Thai, Chinese, Vietnamese food databases per market |
| Self-report questions | Locale-configurable | Language + cultural context + local units |
| ML model (SG + NHANES ethnicity terms) | Re-trainable on local data | Partner with local health systems for local population data |
| Daily nudge language (SG English) | Localisation-ready | Mandarin, Malay, Tamil, Bahasa, Vietnamese |
| Wearables (Fitbit + Apple HealthKit) | Works globally | No change needed |
| B2B2C employer model | Universal | HR departments everywhere care about workforce health |

**Key design rule:** The hawker food angle is a *Year 1 differentiator*, not a permanent lock-in. The engine underneath (personal baseline deviation + daily engagement loop + Asia-specific metabolic context) is universal.

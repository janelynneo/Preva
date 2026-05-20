---
name: hrv-metabolic-proxy-unvalidated
description: HRV is used as metabolic stress proxy but has no prospective validation linking HRV deviations to HbA1c trajectory in pre-diabetic adults
type: GAP
date: 2026-04-27
author: agent
session_id: current
project: chronic-prevention
topic: HRV as metabolic proxy — unvalidated assumption
phase: redteam
tags: [ml-architecture, validation, clinical-gap]
---

**Finding:** The Layer 2 anomaly detection uses HRV (RMSSD) as a proxy for metabolic stress. The analysis asserts this correlation but cites no prospective study showing HRV deviation from personal baseline predicts HbA1c change in healthy adults. The entire anomaly → nudge → metabolic improvement causal chain is assumed.

**Why this is a GAP and not a blocker for MVP:** MVP can launch with the anomaly detection as a wellness engagement mechanic (HRV trending down → rest day recommendation) without clinical validation. The wellness framing makes this permissible. However, if HRV deviations don't actually track metabolic health, the recommendations are functionally identical to generic wellness advice — the ML sophistication adds no clinical value.

**What would resolve it:** Prospective study pairing 30-day HRV deviations with HbA1c at 6 and 12 months in a Singapore pre-diabetic cohort.

**For Discussion:**
1. Is the engagement loop valuable enough WITHOUT clinical validation of the metabolic proxy? (i.e., is the daily briefing worth S$12-18/month on its own, regardless of whether HRV predicts HbA1c?)
2. Could the product pivot to a validated proxy (e.g., HbA1c self-testing kit as optional input) to bridge the validation gap?
3. At what scale of user base does the longitudinal HRV/HbA1c correlation become tractable to answer with observational data?

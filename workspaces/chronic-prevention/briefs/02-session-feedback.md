# Session Feedback — 2026-05-07

## Regulatory Questions Answered

### Q: Is this Software as a Medical Device?
**A:** Likely NO if behavioral framing is maintained throughout.

Key decision: Product stays in HSA wellness tier by using "Metabolic Wellness Index" (personal deviation from own baseline) rather than disease-specific risk scores. Architecture must enforce this at the output layer — not just the disclaimer.

### Q: How to avoid SaMD regulations?
**A:** Three concrete rules:
1. Never mention a clinically-defined condition (diabetes, hypertension) in user-facing output
2. Anchor all observations to user's personal baseline, never to clinical thresholds
3. Recommendations are behavioural (what to do today), never clinical (what to treat)

### Q: Does avoiding disease framing reduce USP?
**A:** Partially, but reframed correctly:
- B2C: "Your personal daily vitality engine" — daily energy, focus, recovery
- B2B: Can separately carry disease-prevention narrative (different compliance track)
- Core moat is the personal baseline deviation engine — genuinely novel even without disease framing

## Decisions Confirmed

- **Entry condition:** Pre-diabetes / metabolic health (confirmed from 05-synthesis.md)
- **Product name:** "Metabo" (from synthesis)
- **ML architecture:** Two-layer confirmed (Cox PH + anomaly detection)
- **No food logging:** Confirmed — highest friction / dropout driver
- **B2B2C model:** Confirmed as primary revenue model
- **Daily engagement loop:** Confirmed as the core product, not a feature

## Open Questions

- Does B2B vs B2C split need explicit user sign-off before /todos?
- Is the epidemiology deep-dive sufficient for MGMT 655, or does it need primary source verification against MOH/HPB?

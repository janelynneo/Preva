---
name: false-reassurance-primary-failure-mode
description: "Your metrics look stable" is the most dangerous output a preventive health ML system can produce — false reassurance during genuine deterioration delays clinical presentation
type: DISCOVERY
---

**Finding:** The canonical failure mode for all preventive health ML is not wrong advice — it is false reassurance. Telling someone their metrics look stable when they have genuine physiological deterioration (undiagnosed diabetes, early COVID-19, myocarditis) causes them to not seek clinical care.

**Why this is non-obvious:** Engineers build recommendation systems to maximize positive outcomes. The failure mode they don't design for is the reassuring wrong answer.

**Metabo-specific design rule:** The rule engine must never produce a generic "your metrics look stable, no changes recommended" output. Every output must either (a) recommend a specific micro-action, or (b) explicitly flag that data is stale/frozen and prompt reconnection.

**Sources:** `07-technical-robustness.md` § 4.1; `06-behavioural-robustness.md` § 3.1

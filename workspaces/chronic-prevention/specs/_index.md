# Specs Index — Metabo Preventive Health Product

| File | Domain | Description |
|------|--------|-------------|
| `data-model.md` | Data | All entities (User, Profile, WearableData, SelfReport, DailyAggregate, MWI, ContextLog, RecommendationFeedback); Google Sheets schema; locale-configurable architecture; PDPA compliance |
| `ml-architecture.md` | ML | Two-layer model: Cox PH survival analysis + anomaly detection; wrong-context detection and recovery; confidence scoring; recommendation feedback loop |
| `wellness-framing.md` | Regulatory | HSA wellness tier language rules, prohibited vs allowed user-facing phrases |
| `engagement-loop.md` | Product | Daily habit loop mechanics, morning briefing, evening check-in, commute-as-movement, weather-contingent recommendations, hawker GI guide, GP report upload, weekly "What Changed" narrative, quarterly "State of You" report, monthly Expert Q&A, relapse recovery arc, progressive profiling (4 phases), context-as-a-feature mechanics, retention triggers |
| `clinical-safety.md` | Safety | 5 mandatory safety checks, data gap protocol, escalation pathways, clinical review team, HSA compliance boundary |
| `b2b2c-retention.md` | Business | Employer as channel not customer, 4-phase employer onboarding, identity retention, Singapore B2B2C specifics, months 3-6 drop-off countermeasures |

**Traceability:** All five deliverables from `05-synthesis.md` map to these spec files. Specs updated with deep-dive findings from `06-behavioural-robustness.md` and `07-technical-robustness.md`.

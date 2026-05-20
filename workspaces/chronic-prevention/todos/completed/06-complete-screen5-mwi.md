# 06 — Complete Screen 5: Metabolic Wellness Index (with Personalization)

## Context
Screen 5 shows the MWI. Personalization: accuracy messaging based on data shared, trend based on their history.

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  YOUR METABOLIC WELLNESS INDEX                              │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│              TIER 2 🟡                                      │
│      MONITORING RECOMMENDED                                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Your metrics suggest slightly elevated metabolic       │    │
│  │  risk. Small changes now can reduce your 10-year   │    │
│  │  risk of developing chronic conditions.            │    │
│  │                                                      │    │
│  │  Compared to last month: → Stable                  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  YOUR TREND                                                 │
│  [============●==========] Day 45                           │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  RECOMMENDATION                                             │
│  "Your HRV has been below baseline for 3 consecutive       │
│  days. Consider a rest day or lighter workout.              │
│  Consistent recovery days compound over time."               │
│                                                             │
│  [ What are the tiers? ↓ ]  (expandable FAQ)               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Accuracy Messaging (PERSONALIZATION — shown below tier)

### User Hasn't Shared Optional Data
```
┌─────────────────────────────────────────────────────────────┐
│  💡 Your MWI is 85% accurate                               │
│  Add family health history to improve to 92%.             │
│  [ Add now → ]  [ Maybe later ]                           │
└─────────────────────────────────────────────────────────────┘
```

### User Has Shared Blood Test Data
```
┌─────────────────────────────────────────────────────────────┐
│  ✅ Your MWI is 95% accurate                               │
│  Blood test data significantly improves prediction.         │
└─────────────────────────────────────────────────────────────┘
```

## Tier Display

| Tier | Color | Meaning | Plain-English |
|------|-------|---------|---------------|
| Tier 1 | 🟢 Green | Wellness | "Your metabolic health is in a good range. Keep up your current habits." |
| Tier 2 | 🟡 Yellow | Monitoring Recommended | "Your metrics suggest slightly elevated risk. Small changes now can reduce your 10-year risk." |
| Tier 3 | 🔴 Red | Attention Needed | "Your metrics suggest higher risk. Consider speaking with a doctor about a health check." |

## Personalization Elements

| Element | Source | Example |
|---------|--------|---------|
| **Accuracy score** | Data shared | "85% accurate — add family history to improve to 92%" |
| **Trend message** | vs last month | "→ Stable" or "↑ Improving" or "↓ Needs attention" |
| **Day counter** | Days since signup | "Day 45" |
| **Recommendation** | ML notebook | Layer 2 anomaly detection output |

## Design Requirements
- **Large tier display** — hero element (biggest text)
- **Color-coded** — 🟢 (green) / 🟡 (yellow) / 🔴 (red)
- **Plain-English explanation** — NOT abstract medical jargon
- **Progress bar** — shows days toward MWI
- **Accuracy messaging** — based on optional data shared
- **Recommendation** — from ML notebook

## Widget Variable Names
- tierBadge, tierMeaning, tierExplanation, trendMessage, trendProgressBar, trendDayCounter, recommendationHeader, recommendationText, tierFaqExpand, accuracyScore, accuracyImprovementCta, dataSharingPrompt

## Data Connection
- Source: Google Sheets `MWI` tab → Row 1
- MWI Tab Headers:
  ```
  tier | tier_message | anomaly_score | risk_score | final_tier | recommendation
  ```

## Accuracy Factors
| Data Shared | Accuracy Boost |
|------------|---------------|
| Age, sex, ethnicity | +15% (baseline) |
| Family history T2D | +7% |
| Wearable (HRV, sleep, steps) | +15% (Layer 2) |
| Blood test (HbA1c) | +20% (Layer 1) |
| Gestational diabetes (female) | +3% |

## Implements
- specs/ml-architecture.md
- 03-user-flows/user-flow.md §Screen 5 + Personalization Architecture

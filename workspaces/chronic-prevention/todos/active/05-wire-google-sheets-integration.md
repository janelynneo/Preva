# 07 — Wire Google Sheets Integration (All Screens)

## Context
CRITICAL: This is the "wire" todo. All screens must connect to real Google Sheets data, not mock data.

## Required Connections

### Read Operations
| Screen | Source Tab | Row/Range |
|--------|-----------|-----------|
| Morning Briefing | DailyData | Last row |
| Weekly Summary | DailyData | Last 7 rows (aggregate) |
| MWI Display | MWI | Row 1 |

### Write Operations
| Screen | Target Tab | Data |
|--------|-----------|------|
| Onboarding (done) | Profile | age, sex, ethnicity, bmi, family_history, gestational_diabetes |
| Evening Check-In | CheckIns | day, sleep_quality, soreness, energy, stress, hawker_meals |

## Verification
- Every screen shows LIVE data from Google Sheets
- No mock/hardcoded values remain
- Run ML notebook STEP 10 to populate initial data

## Implements
- specs/data-model.md §Google Sheets integration
- prototype/SETUP_GUIDE.md §Step 2.4

# 10 — Test Full End-to-End Flow

## Test Sequence
1. Start fresh (clear browser cache or use incognito)
2. Complete Screen 1 (Onboarding) with test profile
3. Verify data writes to Google Sheets Profile tab ✓
4. View Screen 2 (Morning Briefing) with live data ✓
5. Complete Screen 3 (Evening Check-In)
6. Verify data writes to CheckIns tab ✓
7. View Screen 4 (Weekly Summary) with aggregated data ✓
8. Navigate to Screen 5 (MWI) ✓
9. Verify MWI displays tier and recommendation ✓

## Success Criteria
- All 5 screens render correctly
- All data flows from/to Google Sheets
- Navigation works between all screens
- No blank/missing data fields

## Implements
- All spec files: specs/engagement-loop.md, specs/ml-architecture.md, specs/data-model.md

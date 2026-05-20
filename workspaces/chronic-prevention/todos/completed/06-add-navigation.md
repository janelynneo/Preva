# 08 — Add Navigation Between All Screens

## Navigation Flow
```
Screen 1 (Onboarding)
    ↓ [Start My Baseline button]
Screen 2 (Morning Briefing)
    ↓ [Evening Check-In button or auto-navigate at scheduled time]
Screen 3 (Evening Check-In)
    ↓ [Submit → navigates to]
Screen 4 (Weekly Summary)
    ↓ [View My MWI button]
Screen 5 (Metabolic Wellness Index)
```

## Specific Navigation Actions
1. Screen 1 → Screen 2: "Start My Baseline" button writes to Google Sheets, then navigates
2. Screen 2 → Screen 3: "Evening Check-In" button navigates to Screen 3
3. Screen 3 → Screen 4: "Submit" button writes to CheckIns, then navigates to Weekly Summary
4. Screen 4 → Screen 5: "View My MWI" button navigates to MWI screen
5. Screen 5 → Screen 2: "Back to Briefing" returns to Morning Briefing

## Widget Variable Names Required
- All navigation buttons must have Variable Names set
- Actions defined in Widget → Advanced → Actions

## Implements
- prototype/SETUP_GUIDE.md §Navigation
- specs/engagement-loop.md §Daily Flow

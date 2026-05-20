# 00 — Verify Google Sheets Sharing Settings

## Context
Google Sheets integration requires specific sharing settings. This must be verified BEFORE wiring screens.

## Required Settings
1. Sheet URL copied correctly to FlutterFlow Google Sheets integration
2. Share settings: "Anyone with the link" → "Viewer"
3. Tab names match exactly:
   - Profile
   - DailyData
   - CheckIns
   - MWI

## Verification Steps
1. Open Google Sheet → Share → Anyone with link can view ✓
2. FlutterFlow Settings → Google Sheets → paste URL ✓
3. Test read from each tab in FlutterFlow ✓

## Troubleshooting Reference
prototype/SETUP_GUIDE.md §Troubleshooting

## Implements
- prototype/SETUP_GUIDE.md §Step 2.2

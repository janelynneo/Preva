---
type: DECISION
date: 2026-05-04
created_at: 2026-05-04T01:45:00+08:00
author: agent
session_id: chronic-prevention-todos-01
session_turn: 1
project: chronic-prevention
topic: FlutterFlow prototype todo scope and sequencing
phase: todos
tags: [prototype, flutterflow, ml-notebook, google-sheets, todo-planning]
---

## Decision: FlutterFlow Prototype Todo Scope

This is a **prototype build** project, not a code implementation project. Todo scope is bounded to completing the FlutterFlow prototype with live Google Sheets + ML notebook integration.

### Why FlutterFlow (not native code)?
- Rapid prototyping for MGMT 655 demo (45–60 min setup per SETUP_GUIDE.md)
- Google Sheets as backend proxy eliminates need for custom API/server
- ML notebook runs in Google Colab, publishes to same Sheets
- User can iterate on UX without developer

### Todo Sequencing Logic (Updated)

| Priority | Todo | Rationale |
|----------|------|-----------|
| 0 | Verify Google Sheets sharing | Blocked if sharing wrong; check first |
| 1 | Build Screen 0: Welcome | **NEW** — cold start explanation before data collection |
| 2 | Expand Screen 1: Onboarding | **NEW** — wearable explanation + expectation setting added |
| 3 | Complete Screen 2 (in-progress) | User mid-build; continue |
| 4–6 | Screens 3, 4, 5 | Sequential build |
| 7 | Wire Google Sheets (separate todo) | **Critical**: build ≠ wire. Verify real data, not mocks |
| 8 | Navigation | After all screens complete |
| 9 | E2E test | Before video |
| 10 | Demo video | Final deliverable |
| 11–12 | Notification prefs + Profile editing | Future screens stubbed in prototype |
| 13 | Document re-engagement flows | Spec only (not built in prototype) |

### User Flow Gap Identified

**Problem**: Original plan assumed user opens app → sees Morning Briefing. No product explanation before data collection request.

**Fix**: Added Screen 0 (Welcome) + expanded Screen 1 with:
- How it works explanation
- Wearable connection explanation
- "First 4 weeks = baseline building" expectation text

### "Build" vs "Wire" Separation

Per COC /todos protocol, every component gets TWO todos:
- **Build**: create UI with placeholder/mock data
- **Wire**: connect to real Google Sheets data

FlutterFlow makes this harder (UI and data binding happen simultaneously in the widget inspector). The **Wire** todo (todo 05) is a verification checkpoint — confirm every screen reads/writes real Sheets data, not mock.

### ML Notebook Status
Confirmed working (session notes). User ran STEP 10, got Tier 2 🟡 "Monitoring Recommended" with:
- HRV: 54.5ms
- RHR: 62.7bpm
- Sleep: 85.6%
- Steps: 7,906

### What's NOT In Scope
- Native mobile app development
- Backend API/server
- ML model retraining
- B2B2C employer integration
- Clinical validation

## For Discussion
1. **Counterfactual**: If we skipped the FlutterFlow prototype and went straight to native Flutter + real backend, would we have a demoable product in time for MGMT 655?
2. **Risk**: Google Sheets as backend proxy breaks if user deletes the sheet. Is this acceptable for a demo prototype?
3. **Dependency**: The ML notebook needs to be re-run with user's actual wearable data for the video to feel authentic. Has the user committed to providing real data?

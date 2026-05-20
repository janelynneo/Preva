# 13 — Document Re-Engagement Flows (spec + prototype gaps)

## Context
The user flow includes re-engagement scenarios for users who miss check-ins. These are documented in user-flow.md but not yet built in FlutterFlow.

## Required Documentation

### Missed 1 Day Flow
- Day 2 morning: "We missed yesterday's check-in — no worries, tap to add it now."
- Screen 3 opens in "add yesterday" mode (date shown, not "today")

### Missed 3 Days Flow
- Day 4 morning: "It's been a few days — your streak is safe. Just 3 questions to get back on track."
- Screen 3 opens in abbreviated mode (energy + stress only, skip sleep/soreness/hawker)

### Missed 7+ Days Flow
- Day 8: "Looks like you've been busy. Want to adjust your notification time?"
- Screen opens with notification time preference adjustment

## Prototype Gap
These re-engagement flows are NOT built in FlutterFlow prototype. They are documented here for future development and for the MGMT 655 presentation (can describe as "planned features").

## Implements
- specs/engagement-loop.md §Check-In Abandonment Recovery
- 03-user-flows/user-flow.md §Re-Engagement Flows

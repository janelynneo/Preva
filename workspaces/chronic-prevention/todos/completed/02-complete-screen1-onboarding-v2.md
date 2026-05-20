# 02 — Build Screen 1: Onboarding (4-Step Flow with Name)

## Context
Screen 1 must be broken into **4 steps** (added name input). This reduces abandonment and enables personalization.

## Step-by-Step Flow

**Step 1 of 4 — Your Name** (NEW)
```
┌─────────────────────────────────────────────────────────────┐
│  Step 1 of 4                                               │
│                                                             │
│  Let's start with the basics.                               │
│                                                             │
│  What's your name?                                         │
│  [ _______________ ]                                        │
│                                                             │
│  (So we can greet you personally each morning)              │
│                                                             │
│  [ Continue ]                                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Step 2 of 4 — The Basics**
```
┌─────────────────────────────────────────────────────────────┐
│  Step 2 of 4                                               │
│                                                             │
│  Age: [  35  ] ────────────●────────────  (slider)        │
│                                                             │
│  Sex:                                                       │
│  [ Male ]  [ Female ]                                      │
│                                                             │
│  [ Continue ]                                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Step 3 of 4 — Your Body**
```
┌─────────────────────────────────────────────────────────────┐
│  Step 3 of 4                                               │
│                                                             │
│  Height: [ 170 ] cm  ───●─────────────                     │
│  Weight: [ 75 ] kg  ────●────────────                      │
│                                                             │
│  BMI: 26.0 (Overweight range)  ← contextual feedback       │
│                                                             │
│  [ Continue ]                                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Step 4 of 4 — Health Background**
```
┌─────────────────────────────────────────────────────────────┐
│  Step 4 of 4                                               │
│                                                             │
│  Ethnicity (for risk calibration):                          │
│  [ Chinese ] [ Malay ] [ Indian ] [ Others ]               │
│                                                             │
│  Family history of type 2 diabetes?                          │
│  [ Yes ]  [ No ]                                           │
│                                                             │
│  (Optional — improves accuracy)                             │
│  [ Continue ]                                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Wearable Connection (shown after Step 4, before consent)

```
┌─────────────────────────────────────────────────────────────┐
│  Connect your wearable (optional)                           │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ⌚ HRV — tracks your recovery                              │
│  🌙 Sleep — tracks rest quality                             │
│  👟 Steps — tracks your activity                            │
│                                                             │
│  We'll only read your activity data.                        │
│  We never access messages, contacts, or location.          │
│                                                             │
│  [ Connect Wearable → ]                                     │
│  [ Skip for now ]                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Consent Block (final step)

```
┌─────────────────────────────────────────────────────────────┐
│  Before we start...                                         │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ☑ I understand how Metabo uses my data:                   │
│    • My wearable and self-reported data                     │
│    • To calculate my Metabolic Wellness Index               │
│    • To give me daily recommendations                       │
│    • I can delete my data anytime                          │
│                                                             │
│  [ View Privacy Policy ]                                    │
│                                                             │
│  [ Start My Baseline ]                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Widget Variable Names
- nameTextField, ageSlider, sexDropdown (Male/Female), heightSlider, weightSlider, bmiDisplay, ethnicityDropdown (Chinese/Malay/Indian/Others), familyHistoryToggle (Yes/No), wearableConnectButton, skipWearableButton, consentCheckbox, privacyPolicyLink, startButton

## Personalization Impact
- **Name** used for: Morning greeting ("Good morning, Alex!")
- **Age** used for: Cox PH risk model
- **Sex** used for: Risk calibration
- **Ethnicity** used for: Singapore-specific metabolic risk (Malay/Indian higher risk)
- **Height/Weight** used for: BMI calculation + risk model
- **Family history** used for: Risk multiplier in MWI

## PDPA Compliance Elements
- Explicit consent checkbox (NOT pre-ticked)
- Plain-language explanation of data use
- "Delete my data anytime" mentioned
- Privacy Policy link

## Design Requirements
- **Progress indicator** at top: "Step X of 4"
- **Large tap targets**: 48px minimum
- **Inline validation**: red text below field
- **Contextual feedback**: show BMI immediately after height/weight
- **Skip available**: wearable connection is optional

## Implements
- specs/engagement-loop.md §Onboarding Expectation Setting
- 03-user-flows/user-flow.md §Screen 1 + UI/UX Principles + Personalization Architecture

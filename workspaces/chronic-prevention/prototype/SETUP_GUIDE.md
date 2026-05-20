# Metabo Prototype — Setup Guide

**Files you need:**
1. `Metabo_ML_Notebook.ipynb` — the ML engine (upload to Google Colab)
2. This guide

**Estimated time to complete:** 45–60 minutes

---

## PART 1: Google Colab ML Notebook (20 minutes)

### Step 1.1: Upload the notebook
1. Go to [colab.google](https://colab.google) → Sign in with your Google account
2. Click **File** → **Upload notebook**
3. Select `Metabo_ML_Notebook.ipynb` from your Downloads folder
4. The notebook will open in Colab

### Step 1.2: Set up Google Sheets integration (for FlutterFlow)
Before running the notebook, create the Google Sheet:

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **+ New** → **Google Sheets** → **Blank spreadsheet**
3. Name it: **Metabo Data**
4. Rename the first tab to: **Profile** (double-click the tab name)
5. Click **+** to add 3 more tabs: **DailyData**, **CheckIns**, **MWI**

**Profile tab — add headers in Row 1, Column A onwards:**
```
age | sex | ethnicity | bmi | family_history_t2d | gestational_diabetes
```

**DailyData tab — Row 1 headers:**
```
day | hrv_rmssd | resting_hr | sleep_efficiency | steps | sleep_quality | energy | stress | hawker_meals | hrv_dev_pct | rhr_dev_pct | sleep_dev_pct | steps_dev_pct | hawker_excess
```

**MWI tab — Row 1 headers:**
```
tier | tier_message | anomaly_score | risk_score | final_tier | recommendation
```

**CheckIns tab — Row 1 headers:**
```
day | sleep_quality | soreness | energy | stress | hawker_meals
```

6. Click **Share** → **Anyone with the link** → **Viewer** → Copy link

### Step 1.3: Configure your profile
In the Colab notebook, scroll to **STEP 2** and edit these values:

```python
age = 35              # your age (25–45 works best for the demo)
sex = "male"          # "male" or "female"
ethnicity = "chinese"  # "chinese" / "malay" / "indian" / "others"
height_cm = 170       # your height in cm
weight_kg = 75        # your weight in kg
family_history_t2d = True   # True or False
gestational_diabetes = False
```

To demo different risk tiers:
- **Tier 1 (Wellness):** ethnicity = "chinese", family_history_t2d = False, age = 30
- **Tier 3 (Attention):** ethnicity = "indian", family_history_t2d = True, age = 40, bmi = 30

### Step 1.4: Run the notebook
1. Click **Runtime** → **Run all**
2. Scroll down to see your results:
   - Personal Baseline (Days 1–7)
   - Metabolic Wellness Index (Tier 1/2/3)
   - Today's recommendation
3. **STEP 10**: Paste your Google Sheet URL in the `SHEET_URL` variable, then click the play button on that cell to upload data

**You only need to run this once** — the data will stay in Google Sheets.

---

## PART 2: FlutterFlow App (30 minutes)

### Step 2.1: Start a new project
1. Go to [flutterflow.io](https://flutterflow.io) → Sign in
2. Click **+ Create New** → **Start from Blank**
3. Name: **Metabo** → Click **Start Building**

### Step 2.2: Enable Google Sheets integration
1. Click the **Settings** (gear icon) on the left sidebar
2. Search for **Google Sheets** → click to add
3. Paste your Google Sheet URL
4. Authorize with your Google account

### Step 2.3: Build the 5 screens

#### Screen 1: Onboarding
- Add a **TextField** for Age, Height, Weight
- Add a **Dropdown** for Sex (Male / Female)
- Add a **Dropdown** for Ethnicity (Chinese / Malay / Indian / Others)
- Add a **Checkbox** for Family History T2D
- Add a **Button** — "Start My Baseline" → writes to Google Sheets Profile tab

#### Screen 2: Morning Briefing
- Title: "Good morning"
- Display: Recovery score, HRV trend arrow, Sleep hours, Today's recommendation
- Data source: Google Sheets `DailyData` tab (read latest row)
- Add a "View My MWI" button → navigates to MWI screen

#### Screen 3: Evening Check-In
- 5 questions with **Slider** or **Rating** widget:
  - Sleep quality (1–5 stars)
  - Soreness (Body map or None/Mild/Moderate/Severe dropdown)
  - Energy (1–5)
  - Stress (1–5)
  - Hawker meals (0–5 stepper)
- Submit button → writes to Google Sheets `CheckIns` tab

#### Screen 4: Weekly Summary
- Title: "Your Week in Review"
- Show 4 metrics with trend arrows: Recovery, Sleep, Activity, Stress
- Text box with weekly narrative
- Data: average from DailyData tab, last 7 rows

#### Screen 5: Metabolic Wellness Index
- Large display of Tier (Tier 1 🟢 / Tier 2 🟡 / Tier 3 🔴)
- Explanation text
- Trend message
- Recommendation text from ML notebook

### Step 2.4: Connect Google Sheets data
For each screen:
1. Click the widget → **Advanced** → **From Variable** → **Google Sheets**
2. Select the correct sheet tab and row/column

**For Morning Briefing** (read latest daily data):
- Source: `DailyData` tab → last row

**For MWI Display** (read MWI result):
- Source: `MWI` tab → Row 1

### Step 2.5: Preview on your iPhone
1. Download **FlutterFlow** app from the App Store
2. Open the app → Sign in → Select your **Metabo** project
3. Tap **Preview** → The app will open on your phone
4. Navigate through all 5 screens to test the flow

---

## PART 3: Demo Video (10 minutes)

### Recording on iPhone:
1. Open the FlutterFlow app on your iPhone
2. Swipe down from the top → tap **Screen Record**
3. Navigate through: Onboarding → Morning Briefing → Evening Check-In → Weekly Summary → MWI
4. Stop recording → save to Photos
5. Trim in Photos app if needed (remove any setup moments)

### Recommended demo script (3–5 minutes):
1. **Onboarding** (30 sec): "This is Metabo — it tracks your metabolic wellness using your wearable data. Let me show you how it works."
2. **Morning Briefing** (45 sec): Show the recovery card, HRV trend, and recommendation
3. **Evening Check-In** (45 sec): Complete the 5 questions
4. **Weekly Summary** (45 sec): Show the trend display
5. **MWI** (1 min): Show the tier result and explain the two-layer model

---

## Troubleshooting

**FlutterFlow doesn't connect to Google Sheets?**
- Make sure you shared the sheet with "Anyone with the link can view"
- Make sure the tab names match exactly: Profile, DailyData, CheckIns, MWI

**ML notebook won't run?**
- Make sure you're signed into Google in the Colab account
- Click Runtime → Run all again

**App doesn't show data?**
- Run the ML notebook STEP 10 first to populate Google Sheets
- Wait 10 seconds after running STEP 10 before refreshing FlutterFlow preview

---

## File Locations

- ML Notebook: `workspaces/chronic-prevention/prototype/Metabo_ML_Notebook.ipynb`
- This guide: `workspaces/chronic-prevention/prototype/SETUP_GUIDE.md`
- Market evidence: `workspaces/chronic-prevention/04-validate/market-evidence-section.md`
- Red team report: `workspaces/chronic-prevention/04-validate/FINAL-redteam-report.md`

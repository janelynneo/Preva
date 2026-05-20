# Business Cost Analysis — Metabo (Wellness-Only Direction)

**Date:** 2026-05-09
**Direction:** Wellness tier only — no disease-specific claims, no SaMD registration
**Target market:** Singapore desk workers, 25–45 | B2C + B2B2C

---

## PART 1: MVP Build Cost

### Scenario A: No-Code / Low-Code (FlutterFlow or similar)

| Item | Cost | Notes |
|---|---|---|
| FlutterFlow build (contractor) | S$15,000–25,000 | App prototype, 2 months |
| Backend / database (Supabase / Firebase) | S$3,000–5,000 | Setup + 6 months hosting |
| Apple HealthKit + Fitbit API integration | S$5,000–8,000 | Third-party integration contractor |
| Wearable data pipeline | S$5,000–10,000 | Daily batch sync, HRV/sleep/steps |
| MVP landing page + onboarding | S$2,000–4,000 | Simple marketing site |
| Founder's own time (opportunity cost) | ~S$0–15,000 | If working full-time without salary |
| **Total MVP (Scenario A)** | **S$30,000–67,000** | |

### Scenario B: Full Custom Build (React Native + Python backend)

| Item | Cost | Notes |
|---|---|---|
| Mobile app (iOS + Android) | S$40,000–70,000 | 3–4 months, agency or senior contractor |
| Backend API + data pipeline | S$20,000–35,000 | 2–3 months |
| ML model (Layer 1: baseline + Layer 2: anomaly) | S$15,000–25,000 | Data scientist, 6–8 weeks |
| Wearable API integrations (HealthKit + Fitbit) | S$8,000–12,000 | Specialist contractor |
| UX design + proto | S$10,000–18,000 | Designer, 1–2 months |
| Infrastructure setup | S$5,000–8,000 | AWS/GCP, CI/CD, monitoring |
| Founder's time | ~S$0–30,000 | |
| **Total MVP (Scenario B)** | **S$98,000–198,000** | |

### Scenario C: Hybrid (MVP via no-code, v2 via custom) — Recommended

| Phase | Cost | Rationale |
|---|---|---|
| Phase 1: No-code MVP (FlutterFlow) | S$30,000–67,000 | Test engagement loop, validate B2C willingness to pay |
| Phase 2: Custom v1.0 (after seed funding) | S$80,000–120,000 | Rebuild for scale, add ML, B2B API |
| **Total to revenue-ready (Phases 1+2)** | **S$110,000–187,000** | |

**MGMT 655 recommendation:** Scenario A (no-code MVP) is sufficient for the assignment and validates core hypothesis before committing to full custom build.

---

## PART 2: Annual Operating Cost (Post-MVP)

### At 1,000 B2C Users

| Cost Item | Monthly | Annual | Notes |
|---|---|---|---|
| Cloud hosting (Firebase/Supabase) | S$300–600 | S$3,600–7,200 | Scales with data volume |
| ML model inference (Layer 2 anomaly detection) | S$200–500 | S$2,400–6,000 | Depends on compute intensity |
| Apple HealthKit / Fitbit API calls | S$100–300 | S$1,200–3,600 | API rate tiers |
| Customer support (founders initially) | S$0–1,000 | S$0–12,000 | Scales with user count |
| App store fees (iOS Developer + Google Play) | S$200 | S$2,400 | Annual fees |
| Marketing (organic content) | S$500–1,500 | S$6,000–18,000 | Founder-led initially |
| **Total annual operating cost** | | **S$15,600–49,200** | |

**Revenue at 1,000 B2C users:**
- At S$15/month: S$180,000/year gross revenue
- At S$12/month: S$144,000/year gross revenue
- **Gross margin: 80–90%** (post-MVP, low COGS)

**At 10,000 B2C Users**

| Cost Item | Monthly | Annual |
|---|---|---|
| Cloud + ML inference | S$1,500–3,000 | S$18,000–36,000 |
| API costs (wearables, LLM for nudges) | S$800–2,000 | S$9,600–24,000 |
| Customer support (1–2 part-time) | S$2,000–4,000 | S$24,000–48,000 |
| Marketing (content + paid) | S$3,000–8,000 | S$36,000–96,000 |
| **Total annual operating cost** | | **S$87,600–204,000** | |

**Revenue at 10,000 B2C users:**
- At S$12/month: S$1,440,000/year gross revenue
- **Gross margin: 94–94%**

### B2B2C (Corporate Wellness) Operating Cost

| Item | Cost | Notes |
|---|---|---|
| B2B dashboard (employer portal) | +S$20,000–40,000 build | One-time |
| Per-employee cost at scale | S$1–3/employee/month | Wearable API + data processing |
| Account management (per 100 employees) | ~1 hour/month support | S$80–150/month amortised |
| **Gross margin on B2B** | **70–85%** | Higher COGS than B2C due to B2B support |

---

## PART 3: Unit Economics

### B2C (Direct to Consumer)

| Metric | Value | Notes |
|---|---|---|
| Monthly ARPU | S$12–18/month | S$144–216/year |
| Annual churn (wellness apps) | 60–75% | Industry benchmark: <25% retention at 12 months |
| Effective annual ARPU (after churn) | S$54–97/year | Weighted average over user lifetime |
| CAC (B2C, organic + paid) | S$30–60 | Singapore App Store, influencer + ASO |
| LTV (lifetime value) | S$54–162 | LTV = effective annual ARPU × 1/churn rate |
| LTV:CAC ratio | 1.8x–2.7x | >3x is healthy; <1x means you're losing on acquisition |
| Break-even payback period | 4–10 months | |

**Problem:** B2C wellness apps have very poor retention. LTV:CAC of 1.8–2.7x means B2C alone is barely unit-economic at these churn rates. This is why most wellness apps fail.

### B2B2C (Corporate Wellness)

| Metric | Value | Notes |
|---|---|---|
| PEPM (per employee per month) | S$5–12/employee/month | Based on competitive landscape research |
| Minimum contract (typical) | 12-month, 50-employee minimum | S$3,000–7,200/year per employer |
| CAC (B2B, sales-led) | S$200–500 | Salesperson time, proposals, demos |
| LTV (B2B, per employer, 50 employees) | S$9,000–21,600 | Over 3-year contract lifecycle |
| LTV:CAC ratio (B2B) | 18x–108x | Strongly unit-economic once contract signed |
| Employer retention | 80–90% annual renewal | Much better than B2C |
| Sales cycle | 3–9 months | HR + IT + procurement |

**Key insight:** B2B2C has dramatically better unit economics than B2C. One 500-employee corporate contract at S$8/employee/month = S$48,000/year. One sales win = ~S$144,000 over 3 years.

### The Hybrid Model (Recommended)

| Segment | ARPU | LTV | % of Revenue (target) |
|---|---|---|---|
| B2C (individual subscribers) | S$144–216/year | S$54–162 | 20–30% |
| B2B2C (corporate wellness) | S$60–144/employee/year | S$540–1,296 | 70–80% |

**Revenue at 10,000 B2C users + 5,000 corporate employees:**

- B2C: 10,000 × S$12/month × 12 = S$1,440,000/year
- B2B: 5,000 employees × S$8/month × 12 = S$480,000/year
- **Total: S$1,920,000/year gross revenue**

---

## PART 4: Path to Profitability

### Startup Phases

| Phase | Milestone | Revenue Target | Cumulative Cost |
|---|---|---|---|
| MVP (months 1–3) | Launch B2C beta, 200–500 users | S$0 | -S$50,000 (build) |
| Seed (months 4–12) | 2,000 B2C + 1 pilot employer | S$120,000 (annualised) | -S$150,000 (ops) |
| Series A (year 2) | 10,000 B2C + 5 employers | S$1.9M ARR | +S$200,000 ops |
| Break-even | 15,000 B2C + 15 employers | S$2.5M+ ARR | ~Month 24–30 |

**Cash requirement to break-even (founder-led, no office):**
- MVP: S$50,000
- Year 1 ops (founder salary + tools): S$60,000–100,000
- Year 2 ops (first hire + scale): S$150,000–250,000
- **Total to break-even: S$260,000–400,000**

**This is a lean, bootstrap-friendly startup.** A Singapore government grant (EDB, SG Digital, Productivity Solutions Grant) could cover 50–70% of MVP costs.

### Singapore Government Grants Available

| Grant | Coverage | Notes |
|---|---|---|
| **EDB Singapore Digital (enterprise)** | 50% of qualifying costs | For productivity solutions; enterprise-focused |
| **PSG (Productivity Solutions Grant)** | 50% of qualifying costs | For SMEs; digital solutions, capped at S$30k/project |
| **Startup SG Tech** | 70% of qualifying costs | Deep tech / innovative startups; equity-based |
| **Healthier SG** | Pathway to HPB partnership | Longer-term; requires traction |

---

## PART 5: Competitive Edge — Without Disease Claims

**The constraint:** Without disease-specific framing, you can't claim "prevents diabetes" or "reduces hypertension risk." This is the most compelling marketing message — but it's off the table.

**What you still have:**

### 1. The Personal Baseline Deviation Engine (Moat #1)

Oura, Whoop, Fitbit all show you how you compare to **population averages**. Your product compares you to **your own 4-week baseline**. This is fundamentally more personal and actionable.

> "Your HRV is 20% below YOUR normal this week" vs "Your HRV is in the 30th percentile"

Why this matters: Population percentiles are meaningless to a 35-year-old who has been desk working for 10 years. Her "low" HRV might be her normal. What she cares about is whether she's improving relative to herself.

**This is the product's core differentiation — and it doesn't require a single disease claim.**

### 2. The Hawker Food Context (Moat #2)

Singapore's biggest daily health decision is: hawker centre meals. The intersection of hawker food + metabolic health is completely unaddressed by:
- Western diet apps (Noom, MyFitnessPal) — no hawker database
- Generic wellness apps — no food context at all
- Apple Health / Fitbit — no nutrition layer

A product that tracks hawker meal frequency and gives context-specific suggestions ("You had 6 hawker meals this week — here are two lower-GI options near your office tomorrow") is genuinely novel. It doesn't need to say "reduces diabetes risk" to be useful.

### 3. Daily Engagement Loop (Moat #3)

Oura: users open app 2–3x/week. Whoop: passive ring data, weekly review. Fitbit: daily but generic.

Metabo with a daily morning briefing + one-tap evening check-in: this is 365 touchpoints/year. The engagement frequency is a moat in itself — users who check daily build the habit loop that produces outcomes.

**The engagement mechanism itself is the product, not a feature of it.**

### 4. Asia-Specific Norms (Moat #4)

Singapore desk workers have different:
- Sleep patterns (later hawker dinner times, social jetlag)
- Stress patterns (high-pressure work culture, long hours)
- Movement patterns (car/bus commuting, air-conditioned offices)

A product trained on Asia-specific user data — even just from 1,000 early users — becomes the reference baseline for Singapore desk workers. This data moat compounds with every new user.

### 5. B2B2C Corporate Network Effect (Moat #5)

Once you're embedded in one large employer (500+ employees), you become the workforce health platform that competes with every other corporate wellness vendor on the strength of daily engagement data — not disease claims.

The employer sees aggregate wellness trends across their workforce. That's valuable without any individual disease framing. "23% of our workforce has below-baseline recovery scores this month" → HR intervention without any individual medical data.

---

## PART 6: Competitive Positioning (Updated — Wellness Direction)

### Against Singapore Competitors

| Competitor | Your Advantage |
|---|---|
| **Intellect** (mental health B2B) | Physiological data + daily nudges vs meditation/coping content. Intellect doesn't do HRV or metabolic health. |
| **Pulse** (habit app SG) | Personal baseline deviation vs generic habit tracking. Wearable integration vs app-only. |
| **Healthpass** (corporate wellness) | Daily engagement vs annual screening. Real-time nudges vs report cards. |

### Against Global Competitors

| Competitor | Your Advantage |
|---|---|
| **Oura / Whoop** | Personal baseline vs population percentiles. Hawker food context. Asia-specific norms. Daily coaching vs passive data. B2B2C model. |
| **Fitbit (Google)** | No Google data trust concerns. Asia-specific metabolic norms. Personal baseline engine. B2B2C. |
| **Omada Health** | No human coach dependency. S$5–12/employee/month vs S$130–270/member. Daily engagement. Scalable to Asia. |

### The Positioning Statement

**For B2C (users):**
> "The daily habit system that learns YOUR normal — not population averages. Built for Singapore desk workers. Tracks your energy, recovery, and hawker habits, and nudges you when you're drifting from your own best week."

**For B2B (employers):**
> "Give your workforce the daily engagement platform that actually changes behaviour. Track aggregate wellness trends across your team. Reduce absenteeism and presenteeism before they show up in productivity numbers."

**For MGMT 655:**
> "A daily personalised wellness engagement platform using wearable + self-report data, with a personal baseline deviation engine and Asia-specific metabolic health context, monetised through B2B2C corporate wellness."

---

## Summary: Key Numbers

| Metric | Value |
|---|---|
| MVP cost (no-code) | S$30,000–67,000 |
| MVP cost (custom) | S$98,000–198,000 |
| Recommended path | No-code MVP → seed → custom v1.0 |
| B2C ARPU | S$12–18/month |
| B2B2C ARPU | S$5–12/employee/month |
| B2B2C LTV:CAC | 18x–108x |
| B2C LTV:CAC | 1.8x–2.7x |
| Recommended revenue mix | 70–80% B2B2C, 20–30% B2C |
| Break-even | Month 24–30, ~S$2.5M ARR |
| Runway needed to break-even | S$260,000–400,000 |
| Singapore grants available | PSG (50%), Startup SG Tech (70%) |

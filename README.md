# MetaboApp

Daily metabolic wellness companion for Singapore desk workers. Tracks sleep, recovery (HRV), hawker habits, and stress — with an AI Coach.

## Features

- **Daily Check-In** — 6-step evening log: sleep quality, soreness, energy, stress, hawker meals, optional meal photo
- **Apple Watch Integration** — HRV (SDNN), resting heart rate, steps, sleep via native HealthKit bridge
- **Metabolic Wellness Index** — composite score from 28-day baseline
- **Metabolic Age** — estimated from HRV baseline, resting heart rate, and sleep quality
- **AI Coach** — conversational wellness advisor via Ollama (runs locally or on a home server)
- **Smart Notifications** — personalised reminder times + afternoon slump nudge at 2:30 PM
- **Team Challenges** — collective step goals with friends
- **Weekly Summary** — 7-day trend view

## Tech Stack

- **Frontend:** Expo SDK 54, React Native 0.81.5, TypeScript, New Architecture
- **Storage:** AsyncStorage (all data on-device)
- **AI:** Ollama (`mistral:7b` default) via OpenAI-compatible API
- **Native:** Local CocoaPod (`MetaboHealthKit`) for HealthKit access

## Setup

```bash
cd MetaboApp
cp .env.example .env        # configure OLLAMA_URL for remote Ollama
npm install
cd ios && pod install       # install native dependencies
npx expo start              # Expo Go (fastest for phone preview)
npx expo run:ios           # native build on simulator
```

### Ollama Setup

Install Ollama on your Mac/PC:

```bash
brew install ollama
ollama pull mistral:7b
ollama serve                # runs on localhost:11434 by default
```

For a remote server, set `OLLAMA_URL=http://<server-ip>:11434/v1/chat/completions` in `.env`.

## App Screens

| Screen           | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| Welcome          | Home — greeting, week stats, quote card (navy), team, actions |
| Check-In         | 6-step daily log with optional meal photo                     |
| Profile          | User info, wearable status, notification settings             |
| MWI              | Metabolic Wellness Index + metabolic age                      |
| Weekly Summary   | 7-day trend charts                                            |
| Coach            | AI chat powered by Ollama                                     |
| Create/Join Team | Team step challenge setup                                     |

## Environment Variables

```env
OLLAMA_URL=http://localhost:11434/v1/chat/completions
OLLAMA_MODEL=mistral:7b
```

## Data Privacy

All data stored locally on-device. No third-party sharing. PDPA-compliant.

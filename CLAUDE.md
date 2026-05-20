# MetaboApp — Agent Context

## What this is

Pulse is a daily metabolic wellness companion for Asian desk workers. Built with Expo (React Native), it tracks sleep, recovery (HRV), meal habits, and stress through daily check-ins, Apple Watch HealthKit integration, and an AI Coach powered by Ollama.

## Quick Start

```bash
cd MetaboApp
cp .env.example .env   # then edit OLLAMA_URL if connecting to remote Ollama
npx expo start          # Expo Go on phone (scan QR)
npx expo run:ios        # native build on simulator
```

## Key files

| File                             | Purpose                                             |
| -------------------------------- | --------------------------------------------------- |
| `screens/WelcomeScreen.tsx`      | Home screen — greeting, stats, quote, team, actions |
| `screens/CheckInScreen.tsx`      | 6-step daily check-in with emoji scales             |
| `screens/MWIScreen.tsx`          | Metabolic Wellness Index with tiers                 |
| `screens/ChatScreen.tsx`         | AI Coach via Ollama                                 |
| `services/health.ts`             | HealthKit bridge + recovery score + metabolic age   |
| `services/notifications.ts`      | Smart reminders + afternoon slump nudge             |
| `ios/LocalPods/MetaboHealthKit/` | Native HealthKit CocoaPod                           |

## Architecture notes

- **State:** React `useState` + `useEffect` per screen. No Redux/Zustand.
- **Storage:** AsyncStorage for all persistence (profile, check-ins, team, AI history)
- **AI:** Ollama (not Anthropic). Configurable via `OLLAMA_URL` / `OLLAMA_MODEL` env vars.
- **Native module:** `MetaboHealthKit` — local CocoaPod. Podspec path in Podfile must be `./LocalPods/MetaboHealthKit` (NOT `../LocalPods/`)
- **iOS deployment target:** 15.1 minimum; sleep analysis API requires iOS 16+ for `asleepDeep`/`asleepCore`/`asleepREM`
- **New Architecture:** Enabled in `Podfile.properties.json` (`newArchEnabled: true`)

## Design tokens

| Token         | Value     |
| ------------- | --------- |
| Primary navy  | `#0D3B3B` |
| Accent indigo | `#6366f1` |
| Surface bg    | `#f8fafc` |
| Navy card bg  | `#0D3B3B` |
| Quote text    | `#e0f2fe` |

## MetaboApp is autonomous

The user prefers proactive file edits without repeated prompting. When fixes or features are identified, implement them directly.

## Agent

A `metaboapp-specialist` agent is available for detailed app analysis:

- `.claude/agents/metaboapp-specialist.md` — Full agent with troubleshooting patterns
- `.claude/skills/SKILL.md` — Detailed skill for situational awareness

import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageService } from "./storage";

const AI_HISTORY_KEY = "metabo_ai_history";
const OLLAMA_URL =
  process.env.OLLAMA_URL ?? "http://localhost:11434/v1/chat/completions";
const MODEL = process.env.OLLAMA_MODEL ?? "mistral:7b";

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

async function buildContext(): Promise<string> {
  const profile = await StorageService.getProfile();
  const checkIns = await StorageService.getCheckIns();
  const streak = await StorageService.getStreak();
  const days = await StorageService.getDaysSinceSignup();

  let ctx = `You are Metabo's AI Coach — a warm, knowledgeable wellness guide focused on metabolic health for Singapore desk workers.`;
  ctx += `\n\nGuidelines:`;
  ctx += `\n- Be conversational, empathetic, and practical`;
  ctx += `\n- Focus on metabolic wellness: sleep quality, recovery, hawker meal choices, activity, stress management`;
  ctx += `\n- Never focus on weight or appearance — redirect to metabolic health`;
  ctx += `\n- If someone expresses body image distress, acknowledge their feelings and reframe around health`;
  ctx += `\n- Give Singapore-specific advice (hawker centres, humidity, desk-bound work)`;
  ctx += `\n- Keep responses concise (2-4 sentences)`;
  ctx += `\n- If asked medical questions, deflect appropriately`;
  ctx += `\n- Never make up data — if you don't know their history, say so`;

  if (profile) {
    ctx += `\n\nUser profile: ${profile.name}, ${profile.age}y ${profile.sex}, ${profile.ethnicity}`;
    if (profile.familyHistoryT2D) ctx += `, family history of T2D`;
  }
  if (days > 0) ctx += `\nUser is on day ${days} of their baseline tracking`;
  if (streak > 0) ctx += `\nCurrent streak: ${streak} days`;

  if (checkIns.length > 0) {
    const recent = checkIns.slice(-7);
    const avgSleep =
      recent.reduce((s, c) => s + c.sleepQuality, 0) / recent.length;
    const avgEnergy = recent.reduce((s, c) => s + c.energy, 0) / recent.length;
    const avgStress = recent.reduce((s, c) => s + c.stress, 0) / recent.length;
    ctx += `\n\nRecent averages (last ${recent.length} check-ins):`;
    ctx += `\n- Sleep quality: ${avgSleep.toFixed(1)}/5`;
    ctx += `\n- Energy: ${avgEnergy.toFixed(1)}/5`;
    ctx += `\n- Stress: ${avgStress.toFixed(1)}/5`;
  }

  return ctx;
}

export const AICoachService = {
  async sendMessage(userText: string): Promise<{ response: string }> {
    const history = await this.loadHistory();
    const profile = await StorageService.getProfile();
    const systemPrompt = await buildContext();

    const messages: { role: string; content: string }[] = history
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    messages.push({ role: "user", content: userText });

    const name = profile?.name?.split(" ")[0] || "friend";

    try {
      const response = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "system", content: systemPrompt }, ...messages],
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;

      if (!text) {
        return {
          response: `Hey ${name}, I'm having a little trouble thinking right now — could you try again in a moment?`,
        };
      }

      return { response: text.trim() };
    } catch {
      return {
        response: `Hey ${name}, I'm having a little trouble thinking right now — could you try again in a moment?`,
      };
    }
  },

  async loadHistory(): Promise<AIMessage[]> {
    try {
      const data = await AsyncStorage.getItem(AI_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveMessage(message: AIMessage): Promise<void> {
    const history = await this.loadHistory();
    history.push(message);
    await AsyncStorage.setItem(AI_HISTORY_KEY, JSON.stringify(history));
  },

  async clearHistory(): Promise<void> {
    await AsyncStorage.removeItem(AI_HISTORY_KEY);
  },

  getWelcomePrompt(): string {
    return `Hey there! I'm your Metabo AI Coach. I'm here to help you navigate your metabolic wellness journey — whether that's sleep tips, hawker meal choices, activity motivation, or just someone to talk to about how you're feeling. What would you like to explore today?`;
  },
};

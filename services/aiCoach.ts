import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageService } from "./storage";
import { config } from "./config";

const AI_HISTORY_KEY = "metabo_ai_history";
const FETCH_TIMEOUT_MS = 20000;

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

async function buildSystemPrompt(): Promise<string> {
  const profile = await StorageService.getProfile();
  const checkIns = await StorageService.getCheckIns();
  const streak = await StorageService.getStreak();
  const days = await StorageService.getDaysSinceSignup();

  let ctx = `You are Metabo's AI Coach — a warm, knowledgeable wellness guide focused on metabolic health for Singapore desk workers.`;
  ctx += `\n\nGuidelines:`;
  ctx += `\n- Be conversational, empathetic, and practical`;
  ctx += `\n- Focus on metabolic wellness: sleep quality, recovery, hawker meal choices, activity, stress management`;
  ctx += `\n- Never focus on weight or appearance — redirect to health`;
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
    const name =
      (await StorageService.getProfile())?.name?.split(" ")[0] ?? "friend";
    const systemPrompt = await buildSystemPrompt();
    const history = await this.loadHistory();

    const messages: { role: string; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    // Include conversation history (skipping the welcome message if present)
    const convHistory = history.filter(
      (m) => m.role === "user" || m.role === "assistant",
    );
    messages.push(
      ...convHistory.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    );

    // Current user message
    messages.push({ role: "user", content: userText });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      const response = await fetch(config.ollamaUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: config.ollamaModel,
          messages,
          max_tokens: 400,
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const status = response.status;
        let detail = "";
        try {
          const errBody = await response.json();
          detail = errBody.error ?? "";
        } catch {}
        console.error(`AICoach: Ollama HTTP ${status} — ${detail}`);
        if (status === 404) {
          return {
            response: `Hey ${name}, I'm having trouble finding the AI model. Ask your app administrator to check that Ollama is running with "mistral:7b" downloaded.`,
          };
        }
        if (status === 401 || status === 403) {
          return {
            response: `Hey ${name}, there's an authentication issue with the AI service. Please check the app configuration.`,
          };
        }
        throw new Error(`HTTP ${status}: ${detail}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;

      if (!text || text.trim() === "") {
        console.warn("AICoach: empty response from Ollama");
        return {
          response: `Hey ${name}, I'm having a little trouble thinking right now — could you try again in a moment?`,
        };
      }

      return { response: text.trim() };
    } catch (err) {
      const isAbort = err instanceof Error && err.name === "AbortError";
      const isNetworkErr =
        err instanceof TypeError &&
        err.message.includes("Network request failed");

      console.error(
        `AICoach: ${isAbort ? "timeout" : "request failed"} — ${
          err instanceof Error ? err.message : String(err)
        } | URL: ${config.ollamaUrl}`,
      );

      if (isAbort) {
        return {
          response: `Hey ${name}, the request timed out — Ollama might be loading a large model. Try again in a few seconds, or restart Ollama on your machine.`,
        };
      }
      if (isNetworkErr) {
        return {
          response: `Hey ${name}, I can't reach the AI service. Make sure Ollama is running on your computer at 192.168.1.204, and your phone is on the same Wi-Fi network.`,
        };
      }
      return {
        response: `Hey ${name}, something went wrong on my end. Could you try again in a moment?`,
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
    try {
      const history = await this.loadHistory();
      history.push(message);
      await AsyncStorage.setItem(AI_HISTORY_KEY, JSON.stringify(history));
    } catch (err) {
      console.warn("AICoach: failed to save message", err);
    }
  },

  async clearHistory(): Promise<void> {
    await AsyncStorage.removeItem(AI_HISTORY_KEY);
  },

  getWelcomePrompt(): string {
    return `Hey there! I'm your Metabo AI Coach. I'm here to help you navigate your metabolic wellness journey — whether that's sleep tips, hawker meal choices, activity motivation, or just someone to talk to about how you're feeling. What would you like to explore today?`;
  },
};

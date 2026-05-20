// Explicit config — ensures .env values are available at runtime
// without relying solely on babel-plugin-inline-dotenv build-time inlining

export const config = {
  ollamaUrl: "http://192.168.1.204:11434/v1/chat/completions",
  ollamaModel: "mistral:7b",
};

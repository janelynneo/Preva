// Explicit config — ensures .env values are available at runtime
// without relying solely on babel-plugin-inline-dotenv build-time inlining

export const config = {
  ollamaUrl: "http://10.165.9.211:11434/v1/chat/completions",
  ollamaModel: "mistral:7b",
};

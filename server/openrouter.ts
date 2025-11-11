import OpenAI from "openai";
import pLimit from "p-limit";
import pRetry from "p-retry";

// This is using Replit's AI Integrations service, which provides OpenRouter-compatible API access without requiring your own OpenRouter API key.
const openrouter = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENROUTER_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENROUTER_API_KEY
});

// Helper function to check if error is rate limit or quota violation
function isRateLimitError(error: any): boolean {
  const errorMsg = error?.message || String(error);
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RATELIMIT_EXCEEDED") ||
    errorMsg.toLowerCase().includes("quota") ||
    errorMsg.toLowerCase().includes("rate limit")
  );
}

// Chat with DeepSeek model
export async function chatWithDeepSeek(
  userMessage: string,
  systemPrompt?: string
): Promise<string> {
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];
  
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  
  messages.push({ role: "user", content: userMessage });

  return await pRetry(
    async () => {
      try {
        const response = await openrouter.chat.completions.create({
          model: "deepseek/deepseek-chat",
          messages,
          max_tokens: 8192,
        });
        return response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
      } catch (error: any) {
        if (isRateLimitError(error)) {
          throw error; // Rethrow to trigger p-retry
        }
        throw new pRetry.AbortError(error);
      }
    },
    {
      retries: 7,
      minTimeout: 2000,
      maxTimeout: 128000,
      factor: 2,
    }
  );
}

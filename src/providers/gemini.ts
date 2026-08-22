import type { Message } from "../core/conversation";
import type { AIProvider, ContextOptions } from "./types";
import { CONTEXT_SYSTEM_PROMPT } from "./prompt";

export const GEMINI_MODEL = "gemini-3.6-flash";
export const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Format conversation messages into Gemini API format
 */
function formatMessagesForGemini(messages: Message[]) {
  const conversationText = messages.map((msg) => {
    const roleName = msg.role === "assistant" ? "Claude" : "Human";
    return `${roleName}:\n${msg.content}`;
  }).join("\n\n---\n\n");

  return [{
    role: "user",
    parts: [{ text: conversationText }],
  }];
}

/**
 * Gemini Provider for Capy (BYOK mode)
 */
export const GeminiProvider: AIProvider = {
  name: "Gemini API (BYOK)",

  // Gemini 3.6 Flash has a 1,048,576-token input limit. The 800K internal threshold is intentional to leave room for:
  // - system prompt
  // - formatting overhead
  // - output
  // - safety margin
  maxInputTokens: 800000,

  async generateContext(
    messages: Message[],
    apiKey: string,
    _options?: ContextOptions
  ): Promise<string> {
    if (!apiKey) {
      throw new Error("Gemini API key is required");
    }

    const payload = {
      systemInstruction: {
        parts: [{ text: CONTEXT_SYSTEM_PROMPT }],
      },
      contents: formatMessagesForGemini(messages),

    };

    let response: Response;
    try {
      response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      throw new Error("Connection error: Unable to reach Gemini API. Please check your internet connection.");
    }

    if (!response.ok) {
      let errorMsg = `Gemini API failed with status ${response.status}`;
      try {
        const errorText = await response.text();
        const errorJson = JSON.parse(errorText);
        if (errorJson.error && errorJson.error.message) {
          errorMsg = errorJson.error.message;
        }
      } catch { }

      if (response.status === 400) {
        if (errorMsg.includes("API key not valid")) {
          throw new Error("Invalid Gemini API key. Please check your settings.");
        }
        throw new Error(`Bad Request: ${errorMsg}`);
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error("Authentication failed. Please check your Gemini API key.");
      }
      if (response.status === 429) {
        throw new Error("Gemini API rate limit or quota exceeded. Please try again later.");
      }
      if (response.status >= 500) {
        throw new Error("Gemini service temporarily unavailable. Please try again later.");
      }
      throw new Error(errorMsg);
    }

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Generation error: Received malformed JSON response from Gemini API");
    }

    if (
      data &&
      data.candidates &&
      Array.isArray(data.candidates) &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      Array.isArray(data.candidates[0].content.parts) &&
      data.candidates[0].content.parts.length > 0 &&
      typeof data.candidates[0].content.parts[0].text === "string"
    ) {
      const text = data.candidates[0].content.parts[0].text;
      return text.trim();
    }

    throw new Error("Generation error: Gemini returned an empty or unexpected response format.");
  },

  async testConnection(apiKey: string): Promise<boolean> {
    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: "Respond with the single word 'OK'." }] }],
      };

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(payload),
      });

      return response.ok;
    } catch {
      return false;
    }
  },
};

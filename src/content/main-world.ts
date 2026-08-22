/**
 * MAIN-world script for fetch interception.
 *
 * This script is injected into the page's MAIN world (not the extension's
 * isolated world) so it can intercept the actual fetch() calls Claude.ai makes.
 *
 * Communication flow:
 *   main-world.ts → window.postMessage → content.ts → chrome.runtime.sendMessage → service-worker.ts
 *
 * This serves as a FALLBACK data source when DOM parsing fails.
 */

(function () {
  const CONTEXTPORT_MSG_TYPE = "CONTEXTPORT_INTERCEPTED_DATA";

  // Store intercepted conversations
  interface InterceptedMessage {
    role: "user" | "assistant";
    content: string;
  }

  // Monkey-patch fetch
  const originalFetch = window.fetch;

  window.fetch = async function (...args: Parameters<typeof fetch>) {
    const response = await originalFetch.apply(this, args);

    try {
      const url = typeof args[0] === "string" ? args[0] : (args[0] as Request)?.url || "";

      // Look for conversation-related API responses
      if (isConversationEndpoint(url)) {
        // Clone the response so we don't consume it
        const cloned = response.clone();

        // Process asynchronously so we don't block the page
        processResponse(cloned, url).catch((err) => {
          console.debug("[Capy] Failed to process intercepted response:", err);
        });
      }
    } catch {
      // Never break the page — swallow errors silently
    }

    return response;
  };

  /**
   * Check if a URL looks like a conversation data endpoint.
   */
  function isConversationEndpoint(url: string): boolean {
    // Known patterns for Claude's internal API
    return (
      url.includes("/chat_conversations/") ||
      url.includes("/api/organizations/") ||
      (url.includes("/api/") && url.includes("conversation")) ||
      url.includes("/completion") ||
      url.includes("/messages")
    );
  }

  /**
   * Process an intercepted response, extract messages, and post to content script.
   */
  async function processResponse(response: Response, url: string): Promise<void> {
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json") && !contentType.includes("text/event-stream")) {
      return;
    }

    if (contentType.includes("text/event-stream")) {
      // Handle Server-Sent Events (streaming responses)
      await processSSEResponse(response, url);
    } else {
      // Handle regular JSON responses
      const data = await response.json();
      const messages = extractMessagesFromJSON(data);
      if (messages.length > 0) {
        postToContentScript(messages, url);
      }
    }
  }

  /**
   * Process a Server-Sent Events stream to capture the full response.
   */
  async function processSSEResponse(response: Response, url: string): Promise<void> {
    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = "";
    let fullContent = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete last line in buffer

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              // Extract content delta from various possible structures
              const delta =
                parsed.completion ||
                parsed.delta?.text ||
                parsed.content?.[0]?.text ||
                "";
              if (delta) {
                fullContent += delta;
              }
            } catch {
              // Not valid JSON — skip
            }
          }
        }
      }

      if (fullContent) {
        // We captured a streaming assistant response
        postToContentScript(
          [{ role: "assistant" as const, content: fullContent }],
          url
        );
      }
    } catch {
      // Stream reading failed — not critical
    }
  }

  /**
   * Try to extract messages from a JSON API response.
   * Handles various possible response structures.
   */
  function extractMessagesFromJSON(data: unknown): InterceptedMessage[] {
    if (!data || typeof data !== "object") return [];

    const obj = data as Record<string, unknown>;
    const messages: InterceptedMessage[] = [];

    // Pattern 1: Direct messages array
    if (Array.isArray(obj.messages)) {
      for (const msg of obj.messages) {
        if (msg && typeof msg === "object" && msg.role && msg.content) {
          messages.push({
            role: msg.role === "human" || msg.role === "user" ? "user" : "assistant",
            content: typeof msg.content === "string"
              ? msg.content
              : Array.isArray(msg.content)
                ? msg.content
                    .filter((c: { type: string; text?: string }) => c.type === "text")
                    .map((c: { text: string }) => c.text)
                    .join("\n")
                : "",
          });
        }
      }
    }

    // Pattern 2: Chat turns
    if (Array.isArray(obj.chat_messages)) {
      for (const msg of obj.chat_messages) {
        if (msg && typeof msg === "object") {
          messages.push({
            role: msg.sender === "human" ? "user" : "assistant",
            content: typeof msg.text === "string" ? msg.text : "",
          });
        }
      }
    }

    // Pattern 3: Nested within a conversation object
    if (obj.conversation && typeof obj.conversation === "object") {
      const nested = extractMessagesFromJSON(obj.conversation);
      messages.push(...nested);
    }

    return messages.filter((m) => m.content.trim().length > 0);
  }

  /**
   * Post intercepted messages to the content script via window.postMessage.
   */
  function postToContentScript(messages: InterceptedMessage[], sourceUrl: string): void {
    window.postMessage(
      {
        type: CONTEXTPORT_MSG_TYPE,
        messages,
        sourceUrl,
        timestamp: new Date().toISOString(),
      },
      "*"
    );
  }
})();

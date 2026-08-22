import type { Message, Conversation } from "./conversation";
import { GeminiProvider } from "../providers/gemini";
import { CONTEXT_MERGE_PROMPT } from "../providers/prompt";

export type AIProcessingMode = "byok" | "hosted";

/**
 * Very rough token estimation (characters / 4).
 * We only use this to decide if we need to chunk the conversation.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Estimate tokens for an array of messages.
 */
export function estimateMessageTokens(messages: Message[]): number {
  const fullText = messages.map(m => `${m.role}: ${m.content}`).join("\n\n");
  return estimateTokens(fullText);
}

/**
 * Split messages into chunks that fit within the token threshold.
 */
function chunkMessages(messages: Message[], thresholdTokens: number): Message[][] {
  const chunks: Message[][] = [];
  let currentChunk: Message[] = [];
  let currentTokens = 0;

  for (const msg of messages) {
    const msgTokens = estimateTokens(`${msg.role}: ${msg.content}`);
    
    // If a single message exceeds the threshold, we have to include it anyway
    // (we never split in the middle of a message).
    if (currentTokens + msgTokens > thresholdTokens && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentTokens = 0;
    }
    
    currentChunk.push(msg);
    currentTokens += msgTokens;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

interface GenerationOptions {
  mode: AIProcessingMode;
  apiKey?: string;
  onProgress?: (msg: string) => void;
}

/**
 * The main context generation pipeline.
 * Handles chunking for large conversations and delegates to the appropriate provider (BYOK vs Hosted).
 */
export async function generateContextDocument(
  conversation: Conversation,
  options: GenerationOptions
): Promise<string> {
  const thresholdTokens = 800000;


  options.onProgress?.("Analyzing conversation...");

  const chunks = chunkMessages(conversation.messages, thresholdTokens);

  if (chunks.length === 1) {
    options.onProgress?.("Building final document...");
    return await generateSingle(chunks[0], options);
  }

  // Handle large conversation chunking
  options.onProgress?.(`Conversation too large. Splitting into ${chunks.length} chunks...`);
  
  const partialContexts: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    options.onProgress?.(`Compressing context chunk ${i + 1} of ${chunks.length}...`);
    // For partial chunks, we could inject the CHUNK prompt, but the GeminiProvider 
    // hardcodes the SYSTEM_PROMPT. For now, we will use a workaround by prepending 
    // the instruction as a system message if we were using a raw API, but since 
    // GeminiProvider hardcodes the systemInstruction, we'll need to modify it or just 
    // rely on the default prompt. Let's modify GeminiProvider later if necessary. 
    // Actually, for V1, passing the chunk to the standard prompt is usually fine, 
    // but the PRD asks for a synthesis step. Let's just use the standard prompt for chunks,
    // and then synthesize them.
    const partial = await generateSingle(chunks[i], options);
    partialContexts.push(partial);
  }

  options.onProgress?.("Synthesizing final document...");
  
  // Merge the partial contexts using a synthesis prompt
  const synthesisMessages: Message[] = partialContexts.map((ctx, idx) => ({
    id: `chunk-${idx}`,
    role: "user",
    content: `PARTIAL CONTEXT ${idx + 1}:\n\n${ctx}`,
    index: idx
  }));
  
  // Add the explicit merge prompt at the end
  synthesisMessages.push({
    id: "merge-instruction",
    role: "user",
    content: CONTEXT_MERGE_PROMPT,
    index: chunks.length
  });

  return await generateSingle(synthesisMessages, options);
}

/**
 * Generate context for a single chunk of messages.
 */
async function generateSingle(messages: Message[], options: GenerationOptions): Promise<string> {
  if (options.mode === "byok") {
    if (!options.apiKey) {
      throw new Error("Gemini API key is required for BYOK mode");
    }
    return await GeminiProvider.generateContext(messages, options.apiKey, {});
  } else {
    // Hosted mode
    return await generateHostedContext(messages);
  }
}

/**
 * Call the Capy backend to generate the context using the hosted API key.
 */
async function generateHostedContext(messages: Message[]): Promise<string> {
  const API_URL = "http://64.227.144.9:3000/api/context/generate";
  
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ conversation: messages, scope: "entire" }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMsg = `Backend Error (${response.status})`;
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.error) {
        errorMsg = errorJson.error;
      }
    } catch {}

    if (response.status === 429) {
      throw new Error("Daily Capy AI limit reached. Try again tomorrow or use your own Gemini API key.");
    }
    
    throw new Error(`Hosted AI failed: ${errorMsg}`);
  }

  const data = await response.json();
  
  if (data.context) {
    return data.context;
  }
  
  throw new Error("Received malformed response from Capy backend");
}

/**
 * Get remaining hosted quota from the backend.
 */
export async function getHostedQuota(): Promise<number> {
  const API_URL = "http://64.227.144.9:3000/api/context/quota";
  try {
    const response = await fetch(API_URL);
    if (!response.ok) return 0;
    const data = await response.json();
    return typeof data.remaining === "number" ? data.remaining : 0;
  } catch (err) {
    console.error("[Capy] Failed to fetch quota:", err);
    return 0; // default to 0 if backend is down
  }
}

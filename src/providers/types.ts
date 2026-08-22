/**
 * AI Provider interface.
 *
 * Every AI provider must implement this interface.
 * The orchestration layer doesn't know which provider it's calling.
 */

import type { Message } from "../core/conversation";

export interface ContextOptions {
  /** Template type — only "general" required for v1 */
  template?: "general" | "coding" | "research";
}

export interface AIProvider {
  /** Display name of the provider */
  name: string;
  /** Maximum input tokens the provider supports */
  maxInputTokens: number;
  /** Generate a compressed context.md from conversation messages */
  generateContext(
    conversation: Message[],
    apiKey: string,
    options: ContextOptions
  ): Promise<string>;
  /** Test if the API key is valid */
  testConnection(apiKey: string): Promise<boolean>;
}

/**
 * Core data model for Capy conversations.
 * These types are the normalized representation that all platform
 * parsers must produce, and all exporters/providers must consume.
 */

export interface Message {
  /** Stable identifier — typically index-based since Claude DOM doesn't expose IDs */
  id: string;
  /** Who sent this message */
  role: "user" | "assistant";
  /** The full message content, preserving code blocks and formatting */
  content: string;
  /** ISO timestamp if available from the DOM, otherwise undefined */
  timestamp?: string;
  /** Index in the original conversation (0-based) */
  index: number;
}

export interface Conversation {
  /** All messages in chronological order */
  messages: Message[];
  /** The URL this conversation was exported from */
  sourceUrl: string;
  /** ISO timestamp of when the export was performed */
  exportedAt: string;
  /** Title of the conversation, if extractable */
  title?: string;
}

/** Which messages to include in the export */
export type ExportScope =
  | { type: "entire" }
  | { type: "selected"; messageIds: Set<string> }
  | { type: "range"; startIndex: number; endIndex: number };

/** What format to export in */
export type ExportFormat = "raw-markdown" | "optimized-context";

export interface ExportOptions {
  scope: ExportScope;
  format: ExportFormat;
}

/**
 * Apply an ExportScope to a Message[] to get the subset to export.
 */
export function applyScope(
  messages: Message[],
  scope: ExportScope
): Message[] {
  switch (scope.type) {
    case "entire":
      return messages;
    case "selected":
      return messages.filter((m) => scope.messageIds.has(m.id));
    case "range":
      return messages.filter(
        (m) => m.index >= scope.startIndex && m.index <= scope.endIndex
      );
  }
}

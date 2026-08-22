/**
 * Raw Markdown generator.
 *
 * Converts a Conversation into a clean, readable Markdown string.
 * This is the "always works, zero configuration" export path.
 */

import type { Conversation, Message } from "./conversation";

export interface MarkdownOptions {
  /** Include metadata header (source URL, timestamp, message count) */
  includeHeader?: boolean;
  /** Include message separators (horizontal rules) */
  includeSeparators?: boolean;
}

const DEFAULT_OPTIONS: Required<MarkdownOptions> = {
  includeHeader: true,
  includeSeparators: true,
};

/**
 * Generate a Markdown string from a Conversation.
 */
export function generateMarkdown(
  conversation: Conversation,
  options: MarkdownOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const parts: string[] = [];

  // Header
  if (opts.includeHeader) {
    parts.push(generateHeader(conversation));
  }

  // Messages
  for (let i = 0; i < conversation.messages.length; i++) {
    const msg = conversation.messages[i];

    if (opts.includeSeparators && i > 0) {
      parts.push("\n---\n");
    }

    parts.push(formatMessage(msg));
  }

  return parts.join("\n").trim() + "\n";
}

/**
 * Generate the metadata header block.
 */
function generateHeader(conversation: Conversation): string {
  const lines: string[] = [];

  if (conversation.title) {
    lines.push(`# ${conversation.title}`);
  } else {
    lines.push("# Conversation Export");
  }

  lines.push("");
  lines.push(`**Source:** ${conversation.sourceUrl}`);
  lines.push(`**Exported:** ${conversation.exportedAt}`);
  lines.push(`**Messages:** ${conversation.messages.length}`);
  lines.push("");
  lines.push("---");

  return lines.join("\n");
}

/**
 * Format a single message as Markdown.
 */
function formatMessage(msg: Message): string {
  const roleLabel = msg.role === "user" ? "Human" : "Assistant";
  const lines: string[] = [];

  lines.push("");
  lines.push(`## ${roleLabel}`);

  if (msg.timestamp) {
    lines.push(`*${msg.timestamp}*`);
  }

  lines.push("");
  lines.push(msg.content);

  return lines.join("\n");
}

/**
 * Generate a filename for the export.
 */
export function generateFilename(conversation: Conversation): string {
  const date = new Date(conversation.exportedAt)
    .toISOString()
    .replace(/[:.]/g, "-")
    .slice(0, 19);

  const titleSlug = conversation.title
    ? slugify(conversation.title)
    : "conversation";

  return `${titleSlug}_${date}.md`;
}

/**
 * Convert a string to a URL/filename-safe slug.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .slice(0, 50) // Limit length
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens
}

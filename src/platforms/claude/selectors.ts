/**
 * Claude.ai DOM Selectors
 *
 * ALL Claude-specific CSS selectors and DOM query strategies are isolated here.
 * When Claude updates their UI, this is the ONLY file that should need changes.
 *
 * Strategy: We use a ranked approach — try the most reliable selector first,
 * fall back to progressively less stable ones.
 */

/** Selector strategies for finding the main conversation container */
export const CONVERSATION_CONTAINER_SELECTORS = [
  // Semantic: look for the main content region
  '[role="main"]',
  'main',
  // Claude-specific data attributes (may change)
  '[data-testid="conversation-turn-list"]',
  '[data-testid="chat-messages"]',
  // Structural fallbacks
  '.flex-1.overflow-y-auto',
  // Very broad fallback — the scrollable area containing messages
  'div[class*="conversation"]',
  'div[class*="chat"]',
] as const;

/** Selector strategies for finding individual message groups/turns */
export const MESSAGE_GROUP_SELECTORS = [
  // Claude sometimes wraps each turn in a data-testid element
  '[data-testid^="conversation-turn-"]',
  '[data-testid="user-message"]',
  '[data-testid="assistant-message"]',
  // Structural approach: direct children of conversation container
  // that have substantial content
] as const;

/** Selector strategies for identifying the message role */
export const ROLE_INDICATORS = {
  user: [
    '[data-testid="user-message"]',
    '[data-is-streaming="false"]', // user messages are never streaming
    '.font-user-message',
  ],
  assistant: [
    '[data-testid="assistant-message"]',
    '[data-is-streaming]',
    '.font-claude-message',
  ],
} as const;

/** Selectors for extracting content within a message */
export const CONTENT_SELECTORS = {
  /** Code blocks — these are the most important to preserve */
  codeBlock: [
    'pre code',
    'pre',
    '[data-testid="code-block"]',
    '.code-block',
  ],
  /** Inline code */
  inlineCode: ['code:not(pre code)'],
  /** Artifact containers */
  artifact: [
    '[data-testid="artifact"]',
    '[data-testid*="artifact"]',
    '.artifact-container',
  ],
  /** Markdown-rendered content area */
  markdownContent: [
    '.standard-markdown',
    '.markdown-content',
    '.prose',
    '[data-testid="message-content"]',
    '.font-claude-response',
    '.font-user-message',
  ],
} as const;

/** Selectors for the conversation title */
export const TITLE_SELECTORS = [
  'title',
  '[data-testid="conversation-title"]',
  'h1',
  // Claude's nav sidebar sometimes shows the title
  'nav a[aria-current="page"]',
] as const;

/**
 * Query the DOM with a ranked list of selectors, returning the first match.
 */
export function queryFirst(
  selectors: readonly string[],
  root: Element | Document = document
): Element | null {
  for (const selector of selectors) {
    try {
      const el = root.querySelector(selector);
      if (el) return el;
    } catch {
      // Invalid selector — skip
      continue;
    }
  }
  return null;
}

/**
 * Query the DOM with a ranked list of selectors, returning all matches
 * from the first selector that produces any results.
 */
export function queryAllFirst(
  selectors: readonly string[],
  root: Element | Document = document
): Element[] {
  for (const selector of selectors) {
    try {
      const els = root.querySelectorAll(selector);
      if (els.length > 0) return Array.from(els);
    } catch {
      continue;
    }
  }
  return [];
}

/**
 * URL patterns that indicate a Claude.ai conversation page.
 */
export const CLAUDE_CONVERSATION_URL_PATTERNS = [
  /^https:\/\/claude\.ai\/chat\/.+/,
  /^https:\/\/claude\.ai\/project\/.+\/chat\/.+/,
] as const;

/**
 * Check if the current URL is a Claude conversation page.
 */
export function isClaudeConversationPage(url: string = window.location.href): boolean {
  return CLAUDE_CONVERSATION_URL_PATTERNS.some((pattern) => pattern.test(url));
}

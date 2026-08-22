/**
 * Claude.ai DOM Parser — v2 (rewritten)
 *
 * Converts the rendered DOM of a Claude.ai conversation into
 * a normalized Message[] array.
 *
 * Strategy: Instead of trying to guess Claude's container structure,
 * we take a pragmatic approach:
 *   1. Find ALL elements in the page that look like message content
 *   2. Use multiple heuristics to detect role (user vs assistant)
 *   3. Fall back to innerText when HTML→Markdown conversion fails
 *   4. Use network-intercepted data as final fallback
 */

import type { Message } from "../../core/conversation";
import {
  CONVERSATION_CONTAINER_SELECTORS,
  CONTENT_SELECTORS,
  queryFirst,
} from "./selectors";

/**
 * Parse the current page's DOM to extract conversation messages.
 * Returns an empty array if parsing fails (caller should then try fallback).
 */
export function parseConversationDOM(): Message[] {
  try {
    const messages = tryStrategyTurnBased()
      || tryStrategyDeepScan()
      || [];

    if (messages.length > 0) {
      console.debug(`[Capy] Parsed ${messages.length} messages from DOM`);
    } else {
      console.warn("[Capy] DOM parsing found 0 messages");
    }

    return messages;
  } catch (err) {
    console.error("[Capy] DOM parsing failed:", err);
    return [];
  }
}

/**
 * Extract the conversation title from the page.
 */
export function parseConversationTitle(): string | undefined {
  const pageTitle = document.title;
  if (pageTitle && pageTitle.length > 0 && pageTitle.length < 200) {
    // Claude sets the page title to the conversation name
    // Strip " - Claude" or similar suffix
    const cleaned = pageTitle.replace(/\s*[-–|]\s*Claude.*$/i, "").trim();
    if (cleaned.length > 0) return cleaned;
  }
  return undefined;
}

// =====================================================================
// Strategy 1: Turn-based parsing
//
// Claude's DOM typically has "turn" containers. Each turn is either
// a user message or an assistant message. We look for these turns
// using data-testid patterns or structural cues.
// =====================================================================

function tryStrategyTurnBased(): Message[] | null {
  // Look for elements with data-testid containing "conversation-turn"
  const turnSelectors = [
    '[data-testid^="conversation-turn-"]',
    '[data-testid="user-turn"]',
    '[data-testid="assistant-turn"]',
    // Claude sometimes uses these patterns
    '[role="article"]',
    '.group\\/turn',
    '[class*="ConversationTurn"]',
    '[class*="conversation-turn"]',
  ];

  for (const selector of turnSelectors) {
    try {
      const turns = document.querySelectorAll(selector);
      if (turns.length >= 2) {
        return parseTurnElements(Array.from(turns));
      }
    } catch {
      continue;
    }
  }

  return null;
}

function parseTurnElements(turns: Element[]): Message[] {
  const messages: Message[] = [];

  for (let i = 0; i < turns.length; i++) {
    const turn = turns[i];
    const role = detectRoleFromTurn(turn, i);
    const content = extractContentRobust(turn);

    if (content.trim().length > 0) {
      messages.push({
        id: `msg-${messages.length}`,
        role,
        content,
        index: messages.length,
        timestamp: extractTimestamp(turn),
      });
    }
  }

  return messages;
}

// =====================================================================
// Strategy 2: Deep scan
//
// Walk the entire page looking for message-like regions.
// This is the most resilient strategy — it doesn't depend on
// Claude's container structure at all.
// =====================================================================

function tryStrategyDeepScan(): Message[] | null {
  // Find the main conversation area
  const container = queryFirst(CONVERSATION_CONTAINER_SELECTORS)
    || document.querySelector('main')
    || document.querySelector('[role="main"]');

  if (!container) return null;

  // Claude typically renders messages in a scrollable list.
  // Each message pair (user + assistant) may be:
  //   a) Separate sibling divs
  //   b) Wrapped together in a "turn" div
  //   c) Nested at varying depths
  //
  // Instead of guessing the structure, we scan for CONTENT REGIONS:
  // regions that contain the actual message text.

  const messages: Message[] = [];

  // Look for all elements that are likely message content wrappers
  // Claude uses specific patterns for user vs assistant content
  const allElements = container.querySelectorAll('*');
  const messageRegions: Array<{ el: Element; role: "user" | "assistant"; depth: number }> = [];

  for (const el of Array.from(allElements)) {
    const role = identifyMessageElement(el);
    if (role) {
      const depth = getDepth(el, container);
      messageRegions.push({ el, role, depth });
    }
  }

  if (messageRegions.length === 0) {
    // Fallback: try to find messages by looking at direct children pattern
    return tryStrategyDirectChildren(container);
  }

  // Remove nested duplicates: if a parent and child are both identified,
  // keep only the most specific (deepest) non-overlapping ones
  const filtered = removeOverlapping(messageRegions);

  for (const region of filtered) {
    const content = extractContentRobust(region.el);
    if (content.trim().length > 0) {
      messages.push({
        id: `msg-${messages.length}`,
        role: region.role,
        content,
        index: messages.length,
        timestamp: extractTimestamp(region.el),
      });
    }
  }

  return messages.length > 0 ? messages : null;
}

/**
 * Check if an element looks like a message container and determine its role.
 * Returns the role if it's a message element, or null if it's not.
 */
function identifyMessageElement(el: Element): "user" | "assistant" | null {
  const testId = (el.getAttribute("data-testid") || "").toLowerCase();
  const className = (typeof el.className === "string" ? el.className : "").toLowerCase();
  const ariaLabel = (el.getAttribute("aria-label") || "").toLowerCase();

  // Explicit user markers
  if (
    testId.includes("user-message") ||
    testId.includes("human-message") ||
    testId.includes("user-turn") ||
    className.includes("user-message") ||
    ariaLabel.includes("your message") ||
    ariaLabel.includes("user message")
  ) {
    return "user";
  }

  // Explicit assistant markers
  if (
    testId.includes("assistant-message") ||
    testId.includes("ai-message") ||
    testId.includes("assistant-turn") ||
    testId.includes("bot-message") ||
    className.includes("assistant-message") ||
    className.includes("claude-message") ||
    ariaLabel.includes("claude") ||
    ariaLabel.includes("assistant")
  ) {
    return "assistant";
  }

  return null;
}

/**
 * Fallback: try direct children of the conversation container.
 * Assumes alternating user/assistant pattern.
 */
function tryStrategyDirectChildren(container: Element): Message[] | null {
  // Find the deepest scrollable container (likely the message list)
  let scrollContainer = container;
  const scrollables = container.querySelectorAll('[style*="overflow"], [class*="scroll"], [class*="overflow"]');
  if (scrollables.length > 0) {
    scrollContainer = scrollables[scrollables.length - 1];
  }

  // Get direct children that have substantial content
  const children = Array.from(scrollContainer.children).filter(child => {
    const text = child.textContent?.trim() || "";
    return text.length > 3 && child.tagName.toLowerCase() !== "style" && child.tagName.toLowerCase() !== "script";
  });

  if (children.length < 2) return null;

  const messages: Message[] = [];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const role = detectRoleFromTurn(child, i);
    const content = extractContentRobust(child);

    if (content.trim().length > 0) {
      messages.push({
        id: `msg-${messages.length}`,
        role,
        content,
        index: messages.length,
        timestamp: extractTimestamp(child),
      });
    }
  }

  return messages.length > 0 ? messages : null;
}

// =====================================================================
// Role Detection
// =====================================================================

/**
 * Detect the role of a conversation turn element.
 */
function detectRoleFromTurn(el: Element, turnIndex: number): "user" | "assistant" {
  // 1. Check data-testid
  const testId = (el.getAttribute("data-testid") || "").toLowerCase();
  if (testId.includes("user") || testId.includes("human")) return "user";
  if (testId.includes("assistant") || testId.includes("bot") || testId.includes("ai")) return "assistant";

  // 2. Check class names
  const className = (typeof el.className === "string" ? el.className : "").toLowerCase();
  if (className.includes("user") || className.includes("human")) return "user";
  if (className.includes("assistant") || className.includes("claude") || className.includes("bot")) return "assistant";

  // 3. Check aria-label
  const ariaLabel = (el.getAttribute("aria-label") || "").toLowerCase();
  if (ariaLabel.includes("you") || ariaLabel.includes("user") || ariaLabel.includes("human")) return "user";
  if (ariaLabel.includes("claude") || ariaLabel.includes("assistant")) return "assistant";

  // 3.5 Check for sr-only heading (Claude uses this for screen readers: "Claude responded: ...")
  const srOnly = el.querySelector(".sr-only");
  if (srOnly) {
    const srText = (srOnly.textContent || "").toLowerCase();
    if (srText.includes("you said") || srText.includes("human said")) return "user";
    if (srText.includes("claude responded") || srText.includes("assistant responded")) return "assistant";
  }

  // 4. Check for user/assistant icons or labels in descendants
  const descendantText = el.querySelector(
    '[data-testid*="user"], [data-testid*="human"], [aria-label*="You"], [aria-label*="User"], [aria-label*="Human"]'
  );
  if (descendantText) return "user";

  const descendantAI = el.querySelector(
    '[data-testid*="assistant"], [data-testid*="claude"], [data-testid*="bot"], [aria-label*="Claude"], [aria-label*="Assistant"]'
  );
  if (descendantAI) return "assistant";

  // 5. Look at the structure: user messages are typically simpler
  //    (short text, no code blocks, no markdown rendering)
  const hasRenderedMarkdown = el.querySelector('pre, code, h1, h2, h3, ol, ul, table, blockquote');
  const textLength = (el.textContent || "").trim().length;
  // If the element has rich formatting and is long, it's probably an assistant message
  if (hasRenderedMarkdown && textLength > 200) return "assistant";

  // 6. Check for the role label text pattern
  // Claude sometimes shows "You" or "Claude" as a label before the message
  const firstTextNode = getFirstMeaningfulText(el);
  if (firstTextNode) {
    const lower = firstTextNode.toLowerCase().trim();
    if (lower === "you" || lower === "human" || lower === "user") return "user";
    if (lower === "claude" || lower === "assistant") return "assistant";
  }

  // 7. Alternating fallback (first message is user)
  return turnIndex % 2 === 0 ? "user" : "assistant";
}

/**
 * Get the first small text content in an element (likely a label like "You" or "Claude").
 */
function getFirstMeaningfulText(el: Element): string | null {
  // Walk the DOM tree to find the first text-bearing element
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const text = node.textContent?.trim() || "";
      // We want short text labels, not the full message content
      if (text.length > 0 && text.length < 30) {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_SKIP;
    },
  });

  const firstText = walker.nextNode();
  return firstText?.textContent?.trim() || null;
}

// =====================================================================
// Content Extraction
// =====================================================================

/**
 * Extract content from an element, with multiple fallback strategies.
 */
function extractContentRobust(el: Element): string {
  // Strategy 1: Find specific content containers within the element
  // (There may be multiple if the AI used tools and then continued speaking)
  const contentAreas = findContentAreas(el);

  // Strategy 2: Convert HTML to Markdown
  let content = contentAreas.map(area => htmlToMarkdown(area)).join("\n\n");

  // Strategy 3: If HTML→Markdown produced nothing useful, fall back to innerText
  if (content.trim().length === 0) {
    content = getCleanInnerText(el);
  }

  // Remove role labels from the start of the content
  // (Claude may render "You" or "Claude" as part of the message element)
  content = removeRolePrefix(content);

  return content;
}

/**
 * Find the actual content areas within a message container.
 * Claude nests the actual message content inside several wrapper divs,
 * and there may be multiple blocks if tools were used.
 */
function findContentAreas(el: Element): Element[] {
  // Try known content selectors
  for (const selector of CONTENT_SELECTORS.markdownContent) {
    try {
      const found = el.querySelectorAll(selector);
      if (found.length > 0) {
        const valid = Array.from(found).filter(f => f.textContent && f.textContent.trim().length > 0);
        if (valid.length > 0) {
          return valid;
        }
      }
    } catch {
      continue;
    }
  }

  // Try to find the deepest div that contains most of the text content
  const totalText = (el.textContent || "").trim().length;
  if (totalText === 0) return [el];

  let bestChild: Element = el;
  let bestRatio = 0;

  const divs = el.querySelectorAll("div");
  for (const div of Array.from(divs)) {
    const divText = (div.textContent || "").trim().length;
    const ratio = divText / totalText;
    const depth = getDepth(div, el);

    // We want the deepest element that still contains most of the text
    // (closer to the actual content, less wrapper chrome)
    if (ratio > 0.7 && depth > 0) {
      if (depth > getDepth(bestChild, el) || ratio > bestRatio) {
        bestChild = div;
        bestRatio = ratio;
      }
    }
  }

  return [bestChild];
}

/**
 * Get the text content of an element, cleaned up for use as message content.
 * Uses innerText which respects CSS visibility and layout.
 */
function getCleanInnerText(el: Element): string {
  // innerText respects rendering — hidden elements are excluded
  const text = (el as HTMLElement).innerText || el.textContent || "";
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\t/g, "  ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Remove role label prefixes like "You\n" or "Claude\n" from content.
 */
function removeRolePrefix(content: string): string {
  return content
    .replace(/^(You|Human|User|Claude|Assistant)\s*\n+/i, "")
    .trim();
}

// =====================================================================
// HTML → Markdown Converter
// =====================================================================

/**
 * Convert an HTML element to Markdown text.
 */
function htmlToMarkdown(el: Element): string {
  const parts: string[] = [];

  function walk(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      // Escape HTML brackets to prevent inline HTML execution in Markdown viewers
      let text = node.textContent || "";
      text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      parts.push(text);
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const element = node as Element;
    const tag = element.tagName.toLowerCase();

    // Skip UI chrome (buttons, toolbars, copy buttons, icons)
    if (isUIChrome(element)) return;

    switch (tag) {
      case "pre": {
        const codeEl = element.querySelector("code");
        const code = codeEl ? codeEl.textContent : element.textContent;
        const lang = detectCodeLanguage(element);
        parts.push(`\n\n\`\`\`${lang}\n${code?.trim()}\n\`\`\`\n\n`);
        return;
      }

      case "code":
        if (element.parentElement?.tagName.toLowerCase() !== "pre") {
          parts.push(`\`${element.textContent}\``);
          return;
        }
        break;

      case "strong":
      case "b":
        parts.push("**");
        walkChildren(node);
        parts.push("**");
        return;

      case "em":
      case "i":
        parts.push("*");
        walkChildren(node);
        parts.push("*");
        return;

      case "a": {
        const rawHref = element.getAttribute("href") || "";
        // Sanitize href to prevent javascript:/data: injection
        let href = rawHref.trim();
        if (/^(?:javascript|data|vbscript):/i.test(href)) {
          href = "#"; // Replace unsafe links
        }
        parts.push("[");
        walkChildren(node);
        parts.push(`](${href})`);
        return;
      }

      case "h1":
        parts.push("\n\n# ");
        walkChildren(node);
        parts.push("\n\n");
        return;

      case "h2":
        parts.push("\n\n## ");
        walkChildren(node);
        parts.push("\n\n");
        return;

      case "h3":
        parts.push("\n\n### ");
        walkChildren(node);
        parts.push("\n\n");
        return;

      case "h4":
        parts.push("\n\n#### ");
        walkChildren(node);
        parts.push("\n\n");
        return;

      case "p":
        parts.push("\n\n");
        walkChildren(node);
        parts.push("\n\n");
        return;

      case "br":
        parts.push("\n");
        return;

      case "ul":
        parts.push("\n");
        for (const child of Array.from(node.childNodes)) {
          if ((child as Element).tagName?.toLowerCase() === "li") {
            parts.push("\n- ");
            for (const liChild of Array.from(child.childNodes)) walk(liChild);
          }
        }
        parts.push("\n");
        return;

      case "ol": {
        parts.push("\n");
        let idx = 1;
        for (const child of Array.from(node.childNodes)) {
          if ((child as Element).tagName?.toLowerCase() === "li") {
            parts.push(`\n${idx}. `);
            for (const liChild of Array.from(child.childNodes)) walk(liChild);
            idx++;
          }
        }
        parts.push("\n");
        return;
      }

      case "blockquote":
        parts.push("\n\n> ");
        walkChildren(node);
        parts.push("\n\n");
        return;

      case "hr":
        parts.push("\n\n---\n\n");
        return;

      case "table": {
        parts.push("\n\n");
        const rows = element.querySelectorAll("tr");
        rows.forEach((row, rowIdx) => {
          const cells = row.querySelectorAll("td, th");
          const cellTexts = Array.from(cells).map(c => c.textContent?.trim() || "");
          parts.push("| " + cellTexts.join(" | ") + " |\n");
          if (rowIdx === 0) {
            parts.push("| " + cellTexts.map(() => "---").join(" | ") + " |\n");
          }
        });
        parts.push("\n");
        return;
      }

      case "img": {
        const alt = element.getAttribute("alt") || "Image";
        parts.push(`[${alt}]`);
        return;
      }

      default:
        break;
    }

    walkChildren(node);
  }

  function walkChildren(node: Node): void {
    for (const child of Array.from(node.childNodes)) {
      walk(child);
    }
  }

  walk(el);

  return parts
    .join("")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Detect if an element is UI chrome that should be skipped.
 * Be conservative — only skip things we're very sure are UI, not content.
 */
function isUIChrome(el: Element): boolean {
  const tag = el.tagName.toLowerCase();

  // Skip buttons and SVGs (icons)
  if (tag === "button" || tag === "svg" || tag === "path") return true;

  // Skip nav, header, footer elements (page chrome, not message content)
  if (tag === "nav" || tag === "header" || tag === "footer") return true;

  // Skip elements with copy/action-related test IDs
  const testId = el.getAttribute("data-testid") || "";
  if (
    testId.includes("copy") ||
    testId.includes("action") ||
    testId.includes("toolbar") ||
    testId.includes("menu")
  ) return true;

  // Skip elements with explicit UI-chrome class names
  const className = typeof el.className === "string" ? el.className : "";
  if (
    className.includes("copy-btn") ||
    className.includes("toolbar") ||
    className.includes("action-bar") ||
    className.includes("sticky") // sticky headers in code blocks
  ) return true;

  // NOTE: We intentionally do NOT skip aria-hidden="true" elements anymore.
  // Claude uses aria-hidden on some content regions that contain actual message text.

  return false;
}

/**
 * Detect the programming language of a code block.
 */
function detectCodeLanguage(preOrCodeEl: Element): string {
  const codeEl =
    preOrCodeEl.tagName.toLowerCase() === "pre"
      ? preOrCodeEl.querySelector("code")
      : preOrCodeEl;
  if (!codeEl) return "";

  const className = codeEl.className || "";
  const langMatch = className.match(/(?:language-|lang-|hljs\s+)(\w+)/);
  if (langMatch) return langMatch[1];

  const dataLang =
    codeEl.getAttribute("data-language") ||
    preOrCodeEl.getAttribute("data-language") ||
    "";
  if (dataLang) return dataLang;

  return "";
}

/**
 * Extract a timestamp from a message element.
 */
function extractTimestamp(el: Element): string | undefined {
  const timeEl = el.querySelector("time");
  if (timeEl) {
    return timeEl.getAttribute("datetime") || timeEl.textContent?.trim() || undefined;
  }
  return undefined;
}

// =====================================================================
// Utility
// =====================================================================

function getDepth(el: Element, root: Element): number {
  let depth = 0;
  let current: Element | null = el;
  while (current && current !== root) {
    depth++;
    current = current.parentElement;
  }
  return depth;
}

/**
 * Remove overlapping message regions (keep the most specific).
 */
function removeOverlapping(
  regions: Array<{ el: Element; role: "user" | "assistant"; depth: number }>
): Array<{ el: Element; role: "user" | "assistant"; depth: number }> {
  // Sort by document order (using compareDocumentPosition)
  const sorted = [...regions].sort((a, b) => {
    const pos = a.el.compareDocumentPosition(b.el);
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });

  const result: typeof regions = [];

  for (const region of sorted) {
    // Check if this region is a descendant of any already-added region
    const isNested = result.some(r => r.el.contains(region.el));
    // Check if this region contains an already-added region
    const containsExisting = result.some(r => region.el.contains(r.el));

    if (!isNested && !containsExisting) {
      result.push(region);
    } else if (containsExisting) {
      // This is a parent of existing regions — skip it (prefer more specific)
    }
    // If nested, also skip (parent is already in result)
  }

  return result;
}

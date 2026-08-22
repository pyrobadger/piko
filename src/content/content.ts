/**
 * Content script (isolated world).
 *
 * This is the main entry point for the extension on Claude.ai pages.
 * It orchestrates:
 * 1. Injecting the floating "Export Context" button
 * 2. Receiving intercepted data from the MAIN-world script
 * 3. Running the DOM parser when export is requested
 * 4. Mounting the overlay panel UI
 */

import type { Message } from "../core/conversation";
import { parseConversationDOM, parseConversationTitle } from "../platforms/claude/parser";
import { injectExportButton, createOverlayRoot, removeOverlayRoot } from "../platforms/claude/inject";
import { isClaudeConversationPage } from "../platforms/claude/selectors";
import { mountOverlay, unmountOverlay } from "../ui/OverlayApp";

const CONTEXTPORT_MSG_TYPE = "CONTEXTPORT_INTERCEPTED_DATA";

// -------------------------------------------------------------------
// State
// -------------------------------------------------------------------

/** Messages intercepted via the MAIN-world fetch hook (fallback data) */
let interceptedMessages: Message[] = [];

/** Whether the overlay panel is currently open */
let panelOpen = false;

// -------------------------------------------------------------------
// Main-world script communication
// -------------------------------------------------------------------

/**
 * Listen for messages from the MAIN-world script.
 */
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data?.type !== CONTEXTPORT_MSG_TYPE) return;

  const { messages } = event.data;
  if (Array.isArray(messages) && messages.length > 0) {
    // Convert to our normalized Message type
    interceptedMessages = messages.map(
      (m: { role: string; content: string }, i: number) => ({
        id: `intercepted-${i}`,
        role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: m.content,
        index: i,
      })
    );
    console.debug(
      `[Capy] Intercepted ${interceptedMessages.length} messages from API`
    );
  }
});

/**
 * Inject the MAIN-world script into the page.
 */
function injectMainWorldScript(): void {
  try {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("src/content/main-world.ts");
    script.type = "module";
    (document.head || document.documentElement).appendChild(script);
    script.onload = () => script.remove(); // Clean up the script tag
  } catch (err) {
    console.warn("[Capy] Failed to inject main-world script:", err);
  }
}

// -------------------------------------------------------------------
// Conversation parsing
// -------------------------------------------------------------------

/**
 * Get the conversation messages using DOM parsing first, then fallback.
 */
export function getConversationMessages(): Message[] {
  // Try DOM parsing first
  const domMessages = parseConversationDOM();
  if (domMessages.length > 0) {
    console.debug(
      `[Capy] Parsed ${domMessages.length} messages from DOM`
    );
    return domMessages;
  }

  // Fallback to intercepted data
  if (interceptedMessages.length > 0) {
    console.debug(
      `[Capy] Using ${interceptedMessages.length} intercepted messages (DOM parse failed)`
    );
    return interceptedMessages;
  }

  console.warn("[Capy] No messages found via DOM or interception");
  return [];
}

/**
 * Get the conversation title.
 */
export function getConversationTitle(): string | undefined {
  return parseConversationTitle();
}

// -------------------------------------------------------------------
// Panel management
// -------------------------------------------------------------------

function openPanel(): void {
  if (panelOpen) return;
  panelOpen = true;

  const root = createOverlayRoot();
  mountOverlay(root, {
    onClose: closePanel,
    getMessages: getConversationMessages,
    getTitle: getConversationTitle,
    getSourceUrl: () => window.location.href,
  });
}

function closePanel(): void {
  if (!panelOpen) return;
  panelOpen = false;
  unmountOverlay();
  removeOverlayRoot();
}

// -------------------------------------------------------------------
// Initialization
// -------------------------------------------------------------------

function init(): void {
  if (!isClaudeConversationPage()) {
    // Not on a conversation page — watch for navigation
    observeUrlChanges();
    return;
  }

  console.debug("[Capy] Initializing on conversation page");

  // Inject the MAIN-world script for fetch interception
  injectMainWorldScript();

  // Inject the floating export button
  injectExportButton(openPanel);
}

/**
 * Watch for SPA-style navigation (Claude is a single-page app).
 * Re-initialize when the user navigates to/from a conversation.
 */
function observeUrlChanges(): void {
  let lastUrl = window.location.href;
  let cleanupButton: (() => void) | null = null;

  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;

      // Clean up old button
      if (cleanupButton) {
        cleanupButton();
        cleanupButton = null;
      }

      // Close panel if open
      if (panelOpen) closePanel();

      if (isClaudeConversationPage()) {
        injectMainWorldScript();
        cleanupButton = injectExportButton(openPanel);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Listen for messages from the background service worker
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "OPEN_PANEL") {
    if (isClaudeConversationPage()) {
      openPanel();
    }
  }
});

// Start
init();

// Also re-check after a short delay (for slow-loading pages)
setTimeout(() => {
  if (isClaudeConversationPage() && !document.getElementById("capy-export-btn")) {
    injectExportButton(openPanel);
  }
}, 2000);


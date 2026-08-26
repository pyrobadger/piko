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

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data?.type !== CONTEXTPORT_MSG_TYPE) return;

  const { messages } = event.data;
  if (Array.isArray(messages) && messages.length > 0) {
    const mapped = messages.map(
      (m: { role: string; content: string }) => ({
        id: `intercepted-${Math.random().toString(36).slice(2)}`,
        role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: m.content,
        index: 0,
      })
    );
    
    // Merge into interceptedMessages
    for (const newMsg of mapped) {
      const existingIdx = interceptedMessages.findIndex(m => 
        m.content === newMsg.content || 
        (m.content.length > 50 && newMsg.content.includes(m.content)) ||
        (newMsg.content.length > 50 && m.content.includes(newMsg.content))
      );
      
      if (existingIdx >= 0) {
        // Keep the longer content (useful if one is truncated or we caught a partial stream)
        if (newMsg.content.length > interceptedMessages[existingIdx].content.length) {
          interceptedMessages[existingIdx].content = newMsg.content;
        }
      } else {
        interceptedMessages.push(newMsg);
      }
    }

    console.debug(`[Capy] Intercepted messages updated. Total: ${interceptedMessages.length}`);
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
  const domMessages = parseConversationDOM();
  
  const merged = [...interceptedMessages];
  
  for (const domMsg of domMessages) {
    const existingIdx = merged.findIndex(m => 
      m.content === domMsg.content || 
      (m.content.length > 50 && domMsg.content.includes(m.content)) ||
      (domMsg.content.length > 50 && m.content.includes(domMsg.content))
    );
    
    if (existingIdx >= 0) {
      if (domMsg.content.length > merged[existingIdx].content.length) {
        merged[existingIdx].content = domMsg.content;
      }
    } else {
      merged.push(domMsg);
    }
  }

  // Re-index
  merged.forEach((m, i) => {
    m.index = i;
    m.id = `msg-${i}`;
  });

  if (merged.length > 0) {
    console.debug(`[Capy] Combined ${merged.length} messages (DOM + Intercepted)`);
    return merged;
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
      interceptedMessages = [];

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


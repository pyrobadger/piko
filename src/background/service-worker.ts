/**
 * Background service worker (Manifest V3).
 *
 * Kept minimal per PRD guidance — complex logic lives in the
 * content script, not here. This handles:
 * - Extension icon click (opens Claude.ai if not already on it)
 * - Future: storage access for settings
 */

// When the extension icon is clicked, check if we're on Claude.ai
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url && tab.url.includes("claude.ai")) {
    // We're on Claude.ai — the content script handles everything
    // Send a message to the content script to open the panel
    if (tab.id) {
      try {
        await chrome.tabs.sendMessage(tab.id, { type: "OPEN_PANEL" });
      } catch {
        // Content script may not be loaded yet — that's OK
        console.debug("[Capy] Content script not ready");
      }
    }
  } else {
    // Not on Claude.ai — open it in a new tab
    chrome.tabs.create({ url: "https://claude.ai" });
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_SETTINGS") {
    // Return stored settings
    chrome.storage.local.get(["selectedProvider", "apiKeys", "lastExportMode", "lastScope"], (result) => {
      sendResponse(result);
    });
    return true; // async response
  }

  if (message.type === "SAVE_SETTINGS") {
    chrome.storage.local.set(message.data, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

console.debug("[Capy] Service worker initialized");

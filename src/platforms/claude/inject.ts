/**
 * Claude.ai UI injection.
 *
 * the overlay panel into the Claude.ai page.
 */

import { isClaudeConversationPage } from "./selectors";

const BUTTON_ID = "capy-export-btn";
const OVERLAY_ROOT_ID = "capy-overlay-root";

/**
 * Inject the floating "Export Context" button into the page.
 * Returns a cleanup function to remove it.
 */
export function injectExportButton(onOpen: () => void): () => void {
  // Don't inject if not on a conversation page
  if (!isClaudeConversationPage()) return () => { };

  // Don't double-inject
  if (document.getElementById(BUTTON_ID)) return () => { };

  // Inject cappy-button.js into the main world so the custom element registers
  // in the main page's DOM registry.
  if (!document.getElementById("cappy-button-script")) {
    const script = document.createElement("script");
    script.id = "cappy-button-script";
    script.type = "module";
    script.src = chrome.runtime.getURL("cappy-button.js");
    (document.head || document.documentElement).appendChild(script);
  }

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `<cappy-button id="${BUTTON_ID}" size="120" color="claude" shape="nuage" follow-cursor cycle-expressions expression-interval="5"></cappy-button>`;
  const button = wrapper.firstChild as HTMLElement;

  // Apply minimal layout styles and a soft drop shadow
  Object.assign(button.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: "10000",
    cursor: "pointer",
    filter: "drop-shadow(0px 6px 16px rgba(0, 0, 0, 0.25)) drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.12))",
    transition: "filter 0.2s ease",
  });

  // Enhance shadow on hover
  button.addEventListener("mouseenter", () => {
    button.style.filter = "drop-shadow(0px 8px 24px rgba(0, 0, 0, 0.35)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))";
  });
  button.addEventListener("mouseleave", () => {
    button.style.filter = "drop-shadow(0px 6px 16px rgba(0, 0, 0, 0.25)) drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.12))";
  });

  button.addEventListener("click", onOpen);
  document.body.appendChild(button);

  return () => {
    button.removeEventListener("click", onOpen);
    button.remove();
  };
}

/**
 * Create and return the overlay root container.
 */
export function createOverlayRoot(): HTMLDivElement {
  // Remove any existing root
  const existing = document.getElementById(OVERLAY_ROOT_ID);
  if (existing) existing.remove();

  const root = document.createElement("div");
  root.id = OVERLAY_ROOT_ID;
  document.body.appendChild(root);
  return root;
}

/**
 * Remove the overlay root from the DOM.
 */
export function removeOverlayRoot(): void {
  const root = document.getElementById(OVERLAY_ROOT_ID);
  if (root) root.remove();

  // Let Cappy know he needs to fly back home
  document.dispatchEvent(new CustomEvent("capy-panel-closed"));
}

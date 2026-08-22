/**
 * Local settings management.
 *
 * Handles saving/loading user preferences to `chrome.storage.local`.
 * We intentionally DO NOT use sync storage for API keys to prevent them
 * from syncing across the user's Google account devices.
 */

export interface AppSettings {
  geminiApiKey: string | null;
}

const DEFAULT_SETTINGS: AppSettings = {
  geminiApiKey: null,
};

/**
 * Load settings from local extension storage.
 */
export async function loadSettings(): Promise<AppSettings> {
  // If not in a real Chrome extension environment (e.g. dev server),
  // mock the storage or return defaults.
  if (typeof chrome === "undefined" || !chrome.storage) {
    console.warn("[Capy] chrome.storage not available, using default settings");
    return { ...DEFAULT_SETTINGS };
  }

  return new Promise((resolve) => {
    chrome.storage.local.get(["geminiApiKey"], (result) => {
      resolve({
        geminiApiKey: typeof result.geminiApiKey === "string" ? result.geminiApiKey : null,
      });
    });
  });
}

/**
 * Save settings to local extension storage.
 */
export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.storage) {
    console.warn("[Capy] chrome.storage not available, skipping save");
    return;
  }

  return new Promise((resolve) => {
    chrome.storage.local.set(settings, () => {
      resolve();
    });
  });
}

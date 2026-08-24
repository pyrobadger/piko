import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Piko — Claude Context & Markdown Exporter",
  version: "0.1.0",
  description:
    "Export Claude.ai conversations to clean Markdown. Select entire conversations, specific messages, or ranges.",
  permissions: ["storage", "activeTab"],
  host_permissions: ["https://claude.ai/*", "https://piko.quickpdfassistant.in/*"],
  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: ["https://claude.ai/*"],
      js: ["src/content/content.ts"],
      run_at: "document_idle",
    },
  ],
  web_accessible_resources: [
    {
      resources: ["src/content/main-world.ts", "cappy-button.js"],
      matches: ["https://claude.ai/*"],
    },
  ],
  action: {
    default_title: "Piko — Export Claude Conversations",
    default_popup: "popup.html",
    default_icon: {
      "16": "icons/icon-16.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png",
    },
  },
  icons: {
    "16": "icons/icon-16.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png",
  },
});

/**
 * OverlayApp — Root component for the injected overlay panel.
 *
 * This is the mount/unmount entry point that the content script uses
 * to render the React UI into the page.
 */

import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { ExportPanel } from "./ExportPanel";
import type { Message } from "../core/conversation";
import "./styles.css";

interface OverlayProps {
  onClose: () => void;
  getMessages: () => Message[];
  getTitle: () => string | undefined;
  getSourceUrl: () => string;
}

let root: Root | null = null;

/**
 * Mount the overlay panel React app into a DOM element.
 */
export function mountOverlay(
  container: HTMLElement,
  props: OverlayProps
): void {
  if (root) {
    unmountOverlay();
  }

  root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ExportPanel
        onClose={props.onClose}
        getMessages={props.getMessages}
        getTitle={props.getTitle}
        getSourceUrl={props.getSourceUrl}
      />
    </React.StrictMode>
  );
}

/**
 * Unmount the overlay panel React app.
 */
export function unmountOverlay(): void {
  if (root) {
    root.unmount();
    root = null;
  }
}

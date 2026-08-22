/**
 * Selection state management.
 *
 * Manages which messages are selected for export and
 * provides the ExportScope to the exporter.
 */

import type { Message, ExportScope } from "./conversation";

export interface SelectionState {
  /** Current scope mode */
  mode: "entire" | "selected" | "range";
  /** Set of selected message IDs (for "selected" mode) */
  selectedIds: Set<string>;
  /** Start index for range mode */
  rangeStart: number;
  /** End index for range mode */
  rangeEnd: number;
}

/**
 * Create an initial selection state.
 */
export function createInitialSelection(messageCount: number): SelectionState {
  return {
    mode: "entire",
    selectedIds: new Set(),
    rangeStart: 0,
    rangeEnd: Math.max(0, messageCount - 1),
  };
}

/**
 * Convert the current SelectionState into an ExportScope.
 */
export function toExportScope(state: SelectionState): ExportScope {
  switch (state.mode) {
    case "entire":
      return { type: "entire" };
    case "selected":
      return { type: "selected", messageIds: new Set(state.selectedIds) };
    case "range":
      return {
        type: "range",
        startIndex: state.rangeStart,
        endIndex: state.rangeEnd,
      };
  }
}

/**
 * Toggle a message's selection status.
 */
export function toggleMessage(
  state: SelectionState,
  messageId: string
): SelectionState {
  const newIds = new Set(state.selectedIds);
  if (newIds.has(messageId)) {
    newIds.delete(messageId);
  } else {
    newIds.add(messageId);
  }
  return { ...state, selectedIds: newIds };
}

/**
 * Select all messages.
 */
export function selectAll(
  state: SelectionState,
  messages: Message[]
): SelectionState {
  return {
    ...state,
    selectedIds: new Set(messages.map((m) => m.id)),
  };
}

/**
 * Deselect all messages.
 */
export function deselectAll(state: SelectionState): SelectionState {
  return {
    ...state,
    selectedIds: new Set(),
  };
}

/**
 * Set the range for range mode.
 */
export function setRange(
  state: SelectionState,
  start: number,
  end: number
): SelectionState {
  return {
    ...state,
    rangeStart: Math.min(start, end),
    rangeEnd: Math.max(start, end),
  };
}

/**
 * Set the scope mode.
 */
export function setMode(
  state: SelectionState,
  mode: SelectionState["mode"]
): SelectionState {
  return { ...state, mode };
}

/**
 * Get the count of messages that will be exported given the current state.
 */
export function getSelectedCount(
  state: SelectionState,
  totalMessages: number
): number {
  switch (state.mode) {
    case "entire":
      return totalMessages;
    case "selected":
      return state.selectedIds.size;
    case "range":
      return state.rangeEnd - state.rangeStart + 1;
  }
}

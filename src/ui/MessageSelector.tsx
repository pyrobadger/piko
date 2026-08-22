/**
 * MessageSelector component.
 *
 * Renders a scrollable list of message previews inside the overlay panel.
 * Each message has a checkbox for selection, or the whole thing operates
 * in range mode with start/end dropdowns.
 */

import React from "react";
import type { Message } from "../core/conversation";

interface MessageSelectorProps {
  messages: Message[];
  mode: "selected" | "range";
  selectedIds: Set<string>;
  rangeStart: number;
  rangeEnd: number;
  onToggle: (messageId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onRangeStartChange: (index: number) => void;
  onRangeEndChange: (index: number) => void;
}

function truncate(text: string, maxLen: number): string {
  const clean = text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen) + "…";
}

export const MessageSelector: React.FC<MessageSelectorProps> = ({
  messages,
  mode,
  selectedIds,
  rangeStart,
  rangeEnd,
  onToggle,
  onSelectAll,
  onDeselectAll,
  onRangeStartChange,
  onRangeEndChange,
}) => {
  if (mode === "range") {
    return (
      <div className="cp-range-selector">
        <select
          className="cp-range-select"
          value={rangeStart}
          onChange={(e) => onRangeStartChange(Number(e.target.value))}
        >
          {messages.map((msg) => (
            <option key={msg.id} value={msg.index}>
              #{msg.index + 1} — {msg.role === "user" ? "Human" : "Assistant"}:{" "}
              {truncate(msg.content, 40)}
            </option>
          ))}
        </select>

        <span className="cp-range-arrow">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </span>

        <select
          className="cp-range-select"
          value={rangeEnd}
          onChange={(e) => onRangeEndChange(Number(e.target.value))}
        >
          {messages.map((msg) => (
            <option key={msg.id} value={msg.index}>
              #{msg.index + 1} — {msg.role === "user" ? "Human" : "Assistant"}:{" "}
              {truncate(msg.content, 40)}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Selected mode: checkbox list
  return (
    <div>
      <div className="cp-select-controls">
        <button className="cp-select-btn" onClick={onSelectAll}>
          Select all
        </button>
        <span style={{ color: "var(--cp-text-muted)" }}>·</span>
        <button className="cp-select-btn" onClick={onDeselectAll}>
          Deselect all
        </button>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "12px",
            color: "var(--cp-text-muted)",
          }}
        >
          {selectedIds.size} of {messages.length} selected
        </span>
      </div>

      <div className="cp-message-list">
        {messages.map((msg) => {
          const isSelected = selectedIds.has(msg.id);
          return (
            <div
              key={msg.id}
              className={`cp-message-item ${isSelected ? "selected" : ""}`}
              onClick={() => onToggle(msg.id)}
            >
              <div className="cp-checkbox">
                <svg
                  className="cp-checkbox-check"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="cp-message-meta">
                <div
                  className={`cp-message-role ${msg.role}`}
                >
                  {msg.role === "user" ? "Human" : "Assistant"}
                </div>
                <div className="cp-message-preview">
                  {truncate(msg.content, 100)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

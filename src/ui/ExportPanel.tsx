import React, { useState, useCallback, useEffect } from "react";
import bottomCloud from "../assets/bottom-cloud.png";
import mascotHeart from "../assets/mascot-heart.png";
import mascotIdea from "../assets/mascot-idea.png";
import mascotSparkles from "../assets/mascot-sparkles.png";
import sparkles from "../assets/sparkles.png";
import mdLogo from "../assets/new-md.png";
import { type Message, type Conversation, applyScope, type ExportFormat } from "../core/conversation";
import {
  type SelectionState,
  createInitialSelection,
  toExportScope,
  toggleMessage,
  selectAll,
  deselectAll,
  setRange,
  setMode,
  getSelectedCount,
} from "../core/selection";
import { generateMarkdown, generateFilename } from "../core/markdown";
import { generateContextDocument, getHostedQuota, type AIProcessingMode } from "../core/context";
import { loadSettings } from "../core/settings";
import { MessageSelector } from "./MessageSelector";

type ExportStatus = "idle" | "exporting" | "success" | "error";

interface ExportPanelProps {
  onClose: () => void;
  getMessages: () => Message[];
  getTitle: () => string | undefined;
  getSourceUrl: () => string;
}

const getUrl = (path: string) => {
  if (path.startsWith('chrome-extension://')) return path;
  const p = path.startsWith('/') ? path.slice(1) : path;
  return chrome.runtime?.getURL ? chrome.runtime.getURL(p) : path;
};

export const ExportPanel: React.FC<ExportPanelProps> = ({
  onClose,
  getMessages,
  getTitle,
  getSourceUrl,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selection, setSelection] = useState<SelectionState>(createInitialSelection(0));

  const [format, setFormat] = useState<ExportFormat>("raw-markdown");
  const [aiMode, setAiMode] = useState<AIProcessingMode>("hosted");
  const [apiKey, setApiKey] = useState("");


  const [status, setStatus] = useState<ExportStatus>("idle");
  const [progressMsg, setProgressMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successAction, setSuccessAction] = useState<string>("");

  const [hostedQuota, setHostedQuota] = useState<number | null>(null);
  const [generatedText, setGeneratedText] = useState<string>("");

  useEffect(() => {
    const msgs = getMessages();
    setMessages(msgs);
    setSelection(createInitialSelection(msgs.length));

    // Load settings
    loadSettings().then(settings => {
      if (settings.geminiApiKey) {
        setApiKey(settings.geminiApiKey);
      }
    });

    // Fetch quota
    getHostedQuota().then(quota => setHostedQuota(quota));
  }, [getMessages]);

  const selectedCount = getSelectedCount(selection, messages.length);

  const buildConversation = useCallback((): Conversation | null => {
    const scope = toExportScope(selection);
    const filtered = applyScope(messages, scope);

    if (filtered.length === 0) {
      setErrorMsg("No messages selected. Please select at least one message.");
      setStatus("error");
      return null;
    }

    return {
      messages: filtered,
      sourceUrl: getSourceUrl(),
      exportedAt: new Date().toISOString(),
      title: getTitle(),
    };
  }, [messages, selection, getSourceUrl, getTitle]);



  const processExport = async () => {
    const conversation = buildConversation();
    if (!conversation) return null;

    if (format === "raw-markdown") {
      return generateMarkdown(conversation);
    }

    // AI Mode
    if (aiMode === "byok" && !apiKey) {
      throw new Error("Gemini API key is required for BYOK mode.");
    }
    if (aiMode === "hosted" && hostedQuota === 0) {
      throw new Error("Daily Piko AI limit reached. Try again tomorrow or use your own Gemini API key.");
    }

    return await generateContextDocument(conversation, {
      mode: aiMode,
      apiKey: apiKey,
      onProgress: setProgressMsg
    });
  };

  const handleDownload = async () => {
    setStatus("exporting");
    setProgressMsg("Generating export...");
    setErrorMsg("");

    try {
      const text = generatedText || await processExport();
      if (!text) return;

      if (!generatedText) setGeneratedText(text);

      const conversation = buildConversation()!;
      const filename = format === "optimized-context"
        ? (conversation.title ? `${conversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-context.md` : "context.md")
        : generateFilename(conversation);

      const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus("success");
      setSuccessAction("downloaded");

      // Update quota if hosted was used
      if (format === "optimized-context" && aiMode === "hosted") {
        getHostedQuota().then(q => setHostedQuota(q));
      }
    } catch (err) {
      console.error("[Capy] Export failed:", err);
      setErrorMsg(`Export failed: ${err instanceof Error ? err.message : "Unknown error"}`);
      setStatus("error");
    }
  };

  const handleCopy = async () => {
    setStatus("exporting");
    setProgressMsg("Generating export...");
    setErrorMsg("");

    try {
      const text = generatedText || await processExport();
      if (!text) return;

      if (!generatedText) setGeneratedText(text);

      await navigator.clipboard.writeText(text);

      setStatus("success");
      setSuccessAction("copied to clipboard");

      if (format === "optimized-context" && aiMode === "hosted") {
        getHostedQuota().then(q => setHostedQuota(q));
      }
    } catch (err) {
      console.error("[Capy] Copy failed:", err);
      setErrorMsg(`Copy failed: ${err instanceof Error ? err.message : "Unknown error"}`);
      setStatus("error");
    }
  };

  const handleReset = useCallback(() => {
    setStatus("idle");
    setErrorMsg("");
    setSuccessAction("");
    setGeneratedText("");
  }, []);

  return (
    <>
      <div className="cp-backdrop" onClick={onClose} />
      <div className="cp-panel">
        <div className="cp-header">
          <div className="cp-header-title">
            <div className="cp-header-icon" style={{ background: 'transparent', width: 'auto', height: 'auto' }}>
              <img src={getUrl(mascotSparkles)} alt="Cappy" width="56" />
            </div>
            <div>
              <h2>Export Conversation</h2>
              <span className="cp-header-subtitle">Save your chat, your way.</span>
            </div>
          </div>
          <button className="cp-close-btn" onClick={onClose} title="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="cp-body">
          {status === "success" ? (
            <div className="cp-success">
              <div className="cp-success-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="cp-success-text">Export complete!</div>
              <div className="cp-success-detail">
                {format === "optimized-context" ? "Context generated and " : `${selectedCount} messages `}
                {successAction}
              </div>
              <button className="cp-btn cp-btn-secondary" onClick={handleReset} style={{ marginTop: "8px" }}>
                Export another
              </button>

              <div style={{
                marginTop: "32px",
                padding: "16px",
                borderRadius: "12px",
                background: "var(--cp-bg-tertiary)",
                border: "1px solid var(--cp-border)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                maxWidth: "280px",
                position: "relative",
                zIndex: 10
              }}>
                <div style={{ fontSize: "13px", color: "var(--cp-text-secondary)", textAlign: "center", lineHeight: "1.4" }}>
                  Find Piko helpful? Consider supporting its development! ☕
                </div>
                <a 
                  href="https://buymeacoffee.com/pyrobadger" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="cp-btn"
                  style={{ 
                    textDecoration: "none", 
                    width: "100%", 
                    background: "#FFDD00", 
                    color: "#000000", 
                    border: "none",
                    fontWeight: 600
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}>
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1="6" y1="1" x2="6" y2="4" />
                    <line x1="10" y1="1" x2="10" y2="4" />
                    <line x1="14" y1="1" x2="14" y2="4" />
                  </svg>
                  Buy me a coffee
                </a>
              </div>
            </div>
          ) : status === "exporting" ? (
            <div className="cp-loading">
              <div className="cp-spinner" />
              <div className="cp-loading-text">{progressMsg}</div>
            </div>
          ) : (
            <>
              {status === "error" && errorMsg && (
                <div className="cp-error-box">{errorMsg}</div>
              )}

              {/* Format Selection */}
              <div className="cp-section">
                <span className="cp-section-label">Output Format</span>
                <div className="cp-format-selector">
                  <button
                    className={`cp-format-btn ${format === "raw-markdown" ? "active" : ""}`}
                    onClick={() => setFormat("raw-markdown")}
                  >
                    <img src={getUrl(mdLogo)} alt="" width="20" height="20" style={{ objectFit: 'contain' }} />
                    Raw Markdown
                  </button>
                  <button
                    className={`cp-format-btn ${format === "optimized-context" ? "active" : ""}`}
                    onClick={() => setFormat("optimized-context")}
                  >
                    Optimized context.md
                    <img src={getUrl(sparkles)} alt="" width="22" className="cp-sparkle-sm" style={{ marginLeft: '4px' }} />
                  </button>
                </div>
              </div>

              {/* AI Modes (if Optimized context selected) */}
              {format === "optimized-context" && (
                <div className="cp-section" style={{ marginTop: "-8px" }}>
                  <div className="cp-ai-modes">
                    <div
                      className={`cp-ai-mode-card ${aiMode === "hosted" ? "active" : ""}`}
                      onClick={() => setAiMode("hosted")}
                    >
                      <div className="cp-ai-mode-header">
                        <span>⚡ Piko AI</span>
                      </div>
                      <div className="cp-ai-mode-desc">
                        <ul>
                          <li>Uses Google's AI Models</li>
                          <li>Files are temporarily uploaded to Piko's Google account. No logs are stored.</li>
                          <li style={{ color: hostedQuota === 0 ? "var(--cp-error)" : "var(--cp-success)" }}>
                            {hostedQuota !== null ? `${hostedQuota} generation${hostedQuota === 1 ? '' : 's'} remaining today` : "Loading quota..."}
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div
                      className={`cp-ai-mode-card ${aiMode === "byok" ? "active" : ""}`}
                      onClick={() => setAiMode("byok")}
                    >
                      <div className="cp-ai-mode-header">
                        <span>🔑 Use your own Gemini API</span>
                      </div>
                      <div className="cp-ai-mode-desc">
                        <ul>
                          <li>Stored locally on this device only</li>
                          <li>Your Files never leave you :)</li>
                          <li style={{ fontStyle: "italic" }}>PS: Only Gemini API Keys are currently supported</li>
                        </ul>

                        {aiMode === "byok" && (
                          <div className="cp-input-group" style={{ marginTop: "12px", color: "var(--cp-text-muted)" }}>
                            {apiKey ? (
                              <span>✅ API Key configured</span>
                            ) : (
                              <span>⚠️ Please click the Piko icon in your browser toolbar to set your API key.</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status bar */}
              <div className="cp-status-bar">
                <span className="cp-status-count" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src={getUrl(mascotHeart)} alt="" width="28" height="28" style={{ objectFit: 'contain' }} />
                  <span><strong>{messages.length}</strong> messages found</span>
                </span>
                {messages.length > 0 ? (
                  <span className="cp-status-badge ready">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Ready
                  </span>
                ) : (
                  <span className="cp-status-badge error">
                    No messages
                  </span>
                )}
              </div>

              {/* Scope selection */}
              <div className="cp-section">
                <span className="cp-section-label">Export Scope</span>
                <div className="cp-radio-group">
                  {(
                    [
                      {
                        value: "entire" as const,
                        label: "Entire conversation",
                        hint: `${messages.length} msgs`,
                      },
                      {
                        value: "selected" as const,
                        label: "Selected messages",
                        hint: "Pick specific",
                      },
                      {
                        value: "range" as const,
                        label: "Range",
                        hint: "From → To",
                      },
                    ] as const
                  ).map((option) => (
                    <div
                      key={option.value}
                      className={`cp-radio-option ${selection.mode === option.value ? "active" : ""}`}
                      onClick={() => setSelection(setMode(selection, option.value))}
                    >
                      <div className="cp-radio-circle">
                        <div className="cp-radio-dot" />
                      </div>
                      <span className="cp-radio-label">{option.label}</span>
                      <span className="cp-radio-hint">{option.hint}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message selector (conditional) */}
              {(selection.mode === "selected" || selection.mode === "range") && (
                <div className="cp-section">
                  <span className="cp-section-label">
                    {selection.mode === "selected" ? "Select Messages" : "Select Range"}
                  </span>
                  <MessageSelector
                    messages={messages}
                    mode={selection.mode}
                    selectedIds={selection.selectedIds}
                    rangeStart={selection.rangeStart}
                    rangeEnd={selection.rangeEnd}
                    onToggle={(id) => setSelection(toggleMessage(selection, id))}
                    onSelectAll={() => setSelection(selectAll(selection, messages))}
                    onDeselectAll={() => setSelection(deselectAll(selection))}
                    onRangeStartChange={(idx) => setSelection(setRange(selection, idx, selection.rangeEnd))}
                    onRangeEndChange={(idx) => setSelection(setRange(selection, selection.rangeStart, idx))}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Decorative background */}
        <div className="cp-decorative-bg">
          <img src={getUrl(bottomCloud)} className="cp-cloud-bg" alt="" />
        </div>

        {/* Peeking Mascot - separated to have higher z-index than body/footer */}
        <img src={getUrl(mascotIdea)} className="cp-peeking-mascot" alt="" />

        {/* Footer */}
        {status !== "success" && status !== "exporting" && (
          <div className="cp-footer">
            <button
              className="cp-btn cp-btn-primary"
              onClick={handleDownload}
              disabled={
                messages.length === 0 ||
                (selection.mode === "selected" && selection.selectedIds.size === 0) ||
                (format === "optimized-context" && aiMode === "byok" && !apiKey)
              }
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {format === "optimized-context" ? "Generate & Download" : "Download .md"}
            </button>
            <button
              className="cp-btn cp-btn-secondary"
              onClick={handleCopy}
              disabled={
                messages.length === 0 ||
                (selection.mode === "selected" && selection.selectedIds.size === 0) ||
                (format === "optimized-context" && aiMode === "byok" && !apiKey)
              }
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </button>
          </div>
        )}
      </div>
    </>
  );
};

import React, { useState, useEffect } from "react";
import { loadSettings, saveSettings } from "../core/settings";
import mdLogo from "../assets/new-md.png";
import mascotIdea from "../assets/mascot-idea.png";
import sparkles from "../assets/sparkles.png";

export const Popup: React.FC = () => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    loadSettings().then((settings) => {
      if (settings.geminiApiKey) {
        setApiKey(settings.geminiApiKey);
      }
    });
  }, []);

  const handleSave = (val: string) => {
    setApiKey(val);
    saveSettings({ geminiApiKey: val });
  };

  const handleTestKey = async () => {
    if (!apiKey) {
      setStatus("error");
      setStatusMsg("Please enter an API key first.");
      return;
    }
    
    setStatus("testing");
    setStatusMsg("Testing connection...");
    
    try {
      const { GeminiProvider } = await import("../providers/gemini");
      const isValid = await GeminiProvider.testConnection(apiKey);
      if (isValid) {
        setStatus("success");
        setStatusMsg("Connection successful!");
      } else {
        throw new Error("Invalid API key or network error.");
      }
    } catch (err) {
      setStatus("error");
      setStatusMsg(err instanceof Error ? err.message : "Connection failed");
    }
  };

  return (
    <div className="popup-container">
      <img src={mascotIdea} className="peeking-mascot-top" alt="" />
      <div className="header">
        <img src={sparkles} className="decor-sparkle top-left" alt="" />
        <div className="header-icon glow">
          <img src={mdLogo} width="20" height="20" style={{ objectFit: 'contain' }} alt="" />
        </div>
        <h2>Piko Settings</h2>
        <button className="close-btn" onClick={() => window.close()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="body">
        <div className="section">
          <label className="byok-label">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="glow-svg">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
            </svg>
            Bring Your Own Key (BYOK)
          </label>
          <p className="desc">
            Enter your Gemini API key to use the unlimited BYOK processing mode.
            This key is stored securely in your browser's local storage and is never sent to our servers.
          </p>

          <div className="input-wrapper">
            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input 
              type={showKey ? "text" : "password"}
              className="input" 
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => handleSave(e.target.value)}
            />
            <button 
              className="input-action"
              onClick={() => setShowKey(!showKey)}
              title={showKey ? "Hide key" : "Show key"}
            >
              {showKey ? "Hide" : "Show"}
            </button>
            <img src={sparkles} className="decor-sparkle mid-right" alt="" />
          </div>

          <div className="actions" style={{ position: 'relative' }}>
            <button 
              className="btn btn-primary glow" 
              onClick={handleTestKey}
              disabled={!apiKey || status === "testing"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                <line x1="12" y1="20" x2="12.01" y2="20"></line>
              </svg>
              {status === "testing" ? "Testing..." : "Test Connection"}
            </button>
            <img src={sparkles} className="decor-sparkle bottom-right" alt="" />
          </div>

          {statusMsg && (
            <div className={`status-msg ${status}`}>
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.set('trust proxy', true); // Trust the X-Forwarded-* headers from reverse proxies
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Hosted daily generation limit (Phase 14)
const HOSTED_DAILY_GENERATION_LIMIT = 1;

// In-memory quota tracking for V1
// In a real production app, this would be Redis/Postgres tied to an auth system.
// For now, we use IP address as a simple identifier.
interface QuotaRecord {
  count: number;
  date: string;
}
const usageDb = new Map<string, QuotaRecord>();

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function checkQuota(identifier: string): { remaining: number; exhausted: boolean } {
  const today = getTodayString();
  let record = usageDb.get(identifier);

  if (!record || record.date !== today) {
    record = { count: 0, date: today };
    usageDb.set(identifier, record);
  }

  const remaining = Math.max(0, HOSTED_DAILY_GENERATION_LIMIT - record.count);
  return { remaining, exhausted: remaining <= 0 };
}

function incrementQuota(identifier: string) {
  const today = getTodayString();
  let record = usageDb.get(identifier);
  if (record && record.date === today) {
    record.count++;
  }
}

// -------------------------------------------------------------------
// Gemini Configuration
// -------------------------------------------------------------------
const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Must match the prompt in the extension exactly
const CONTEXT_SYSTEM_PROMPT = `You are a context compression assistant. 
Given a conversation between a human and an AI assistant, produce a structured Markdown document that allows another AI assistant to continue the work with minimal loss of important context.

# Output Format
The generated file must strictly use this structure:

# Context
## Project
## Objective
## Current State
## Requirements
## Decisions
## Technical Details
## Important Code
## Constraints
## User Preferences
## Problems / Issues
## Unresolved Questions
## Next Steps

If a section has no useful information, omit the section entirely rather than filling it with "None" or "N/A".
The output must be valid Markdown.
Do not wrap the entire result in a Markdown code fence.

# Critical Compression Rules
1. Preserve important facts.
2. Preserve decisions (and reasoning when relevant).
3. Preserve requirements.
4. Preserve constraints.
5. Preserve unresolved issues.
6. Preserve relevant technical details (architecture, technologies, APIs, schemas, config).
7. Preserve important code/configuration verbatim when it is necessary for continuation. Never replace important code with vague prose.
8. Remove greetings and conversational filler.
9. Remove repeated explanations.
10. Remove abandoned discussion unless the rejected approach is important for future context.
11. Never invent facts or infer decisions that were not actually made.
12. Prefer concise structured information over prose.
13. Optimize for another LLM continuing the work, not for a human reading a summary.`;

const getClientIp = (req: express.Request): string => {
  const cf = req.headers['cf-connecting-ip'];
  if (cf) return typeof cf === 'string' ? cf.split(',')[0].trim() : cf[0];
  
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : forwarded[0];
  
  const real = req.headers['x-real-ip'];
  if (real) return typeof real === 'string' ? real.split(',')[0].trim() : real[0];
  
  return req.ip || req.socket.remoteAddress || 'unknown';
};

app.get('/api/context/quota', (req, res) => {
  const ip = getClientIp(req);
  console.log(`[QUOTA CHECK] req.ip: ${req.ip}, extracted IP: ${ip}`);
  const { remaining } = checkQuota(ip);
  res.json({ remaining });
});

app.post('/api/context/generate', async (req, res) => {
  const ip = getClientIp(req);
  
  const { remaining, exhausted } = checkQuota(ip);
  if (exhausted) {
    return res.status(429).json({ error: "Daily Capy AI limit reached." });
  }

  const { conversation } = req.body;
  
  if (!conversation || !Array.isArray(conversation)) {
    return res.status(400).json({ error: "Invalid conversation format" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing Gemini API key configuration" });
  }

  try {
    const payload = {
      systemInstruction: {
        parts: [{ text: CONTEXT_SYSTEM_PROMPT }],
      },
      contents: [{
        role: "user",
        parts: [{ text: conversation.map((msg: any) => `${msg.role === "assistant" ? "Claude" : "Human"}:\n${msg.content || ""}`).join("\n\n---\n\n") }],
      }],
      generationConfig: {
        temperature: 0.1,
      },
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Gemini API failed: ${errorText}` });
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const text = data.candidates[0].content.parts[0].text;
      
      // Increment quota only on success
      incrementQuota(ip);
      
      return res.json({ context: text.trim() });
    }

    throw new Error("Received malformed response from Gemini API");

  } catch (error: any) {
    console.error("Context generation failed:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Capy Backend running on port ${PORT}`);
});

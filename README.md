# Piko

> Export Claude.ai conversations to clean Markdown — instantly, privately, entirely in your browser.

Piko is a Chrome extension that lets you export any Claude.ai conversation as a well-formatted Markdown file. Select the entire conversation, pick specific messages, or choose a range.

**Zero configuration required.** No accounts, no servers, no API keys for basic export.

## Features

- 📄 **Raw Markdown Export** — One-click export of any Claude.ai conversation
- ✅ **Message Selection** — Export the entire conversation, selected messages, or a range
- 📋 **Copy or Download** — Save as a `.md` file or copy directly to clipboard
- 🔒 **Fully Private** — All processing happens locally in your browser. No data leaves your device.
- 🎨 **Clean UI** — Premium dark-theme overlay that matches Claude's aesthetic

## *Screenshots*

## Piko
<img width="1622" height="969" alt="1" src="https://github.com/user-attachments/assets/225c8ff3-4d20-4cb2-bc98-2357b83eea3e" />

## Raw Markdown
<img width="1280" height="800" alt="piko-5" src="https://github.com/user-attachments/assets/183eee38-3d08-4d16-9518-8af9dd2404ed" />

## Opimized Context.md
<img width="1280" height="800" alt="piko-4" src="https://github.com/user-attachments/assets/69484ef3-d72d-4ab9-ab9e-b353533fc5e7" />

## Bring your own key
<img width="1280" height="800" alt="piko-7" src="https://github.com/user-attachments/assets/c394009f-51de-4558-8ada-86bca363841b" />

## **Install**

### From Source (Developer Mode)

1. Clone this repo:
   ```bash
   git clone https://github.com/adityaraj/piko.git
   cd piko
   ```

2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

3. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable **Developer mode** (top-right toggle)
   - Click **Load unpacked**
   - Select the `dist/` folder

4. Navigate to any [Claude.ai](https://claude.ai) conversation

5. Click the floating **Export** button in the bottom-right corner

## Usage

1. Open any conversation on Claude.ai
2. Click the purple **Export** button (bottom-right)
3. Choose your scope:
   - **Entire conversation** — Export everything
   - **Selected messages** — Pick specific messages with checkboxes
   - **Range** — Choose a start and end message
4. Click **Download .md** or **Copy** to clipboard

## Privacy

> Raw export happens entirely on your device. No data passes through any server operated by this project, because this project does not operate a server.

## Tech Stack

- **TypeScript** — Type-safe throughout
- **React** — UI components
- **Vite + CRXJS** — Build tooling with HMR
- **Chrome Manifest V3** — Modern extension architecture

## Project Structure

```
src/
├── platforms/claude/   # Claude.ai DOM parsing & UI injection
│   ├── parser.ts       # DOM → Message[] conversion
│   ├── selectors.ts    # CSS selectors (isolated for maintainability)
│   └── inject.ts       # Floating button injection
├── core/               # Core logic (platform-agnostic)
│   ├── conversation.ts # Data types
│   ├── markdown.ts     # Markdown generator
│   └── selection.ts    # Selection state management
├── ui/                 # React UI components
│   ├── ExportPanel.tsx # Main export panel
│   ├── MessageSelector.tsx
│   ├── OverlayApp.tsx  # Mount/unmount bridge
│   └── styles.css      # Premium dark theme
├── content/            # Content scripts
│   ├── content.ts      # Main orchestrator (isolated world)
│   └── main-world.ts   # Fetch interception (MAIN world)
└── background/
    └── service-worker.ts
```

## Development

```bash
# Start dev server with HMR
npm run dev

# Build for production
npm run build
```

During development, changes to content scripts and UI components will hot-reload automatically via CRXJS.

## Credits

Piko's mascot is based on [Bloubi by Jeremy Prt](https://github.com/jeremy-prt/bloub), with modifications made for Piko.
The original [Bloubi](https://github.com/jeremy-prt/bloub) project and its source code are credited to their respective author. 
Please see the [original repository](https://github.com/jeremy-prt/bloub) and its license for the original project's terms.
Piko is an independent project and is not affiliated with or endorsed by the creators of Bloubi or Grok.

## License

[MIT](LICENSE)

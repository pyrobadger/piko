import { JSDOM } from 'jsdom';
import { parseConversationDOM } from '../src/platforms/claude/parser';
import { generateMarkdown } from '../src/core/markdown';

function setupDOM(html: string) {
  const dom = new JSDOM(html);
  // @ts-ignore
  global.document = dom.window.document;
  // @ts-ignore
  global.window = dom.window;
  // @ts-ignore
  global.Node = dom.window.Node;
  // @ts-ignore
  global.NodeFilter = dom.window.NodeFilter;
}

function runTests() {
  console.log('--- Running Edge Case & Security Tests ---\n');

  // Test 1: Injection via HTML in Text Nodes
  setupDOM(`
    <main>
      <div data-testid="user-message">
        Hello &lt;script&gt;alert(1)&lt;/script&gt;
      </div>
      <div data-testid="assistant-message">
        <p>This is a <b>test</b>.</p>
        <p>&lt;img src="x" onerror="alert(1)"&gt;</p>
      </div>
    </main>
  `);
  let messages = parseConversationDOM();
  console.log('Test 1 - HTML Escaping in Text Nodes:');
  console.log('User Message:', messages[0]?.content);
  console.log('Assistant Message:', messages[1]?.content);
  if (messages[0]?.content.includes('&lt;script&gt;') && !messages[0]?.content.includes('<script>')) {
    console.log('✅ HTML tags in text nodes are correctly escaped.\n');
  } else {
    console.log('❌ HTML tags in text nodes were not escaped!\n');
  }

  // Test 2: Malicious Links
  setupDOM(`
    <main>
      <div data-testid="user-message">
        Check this out.
      </div>
      <div data-testid="assistant-message">
        <a href="javascript:alert(1)">Click me</a>
        <a href="data:text/html,<script>alert(1)</script>">Or me</a>
        <a href="https://example.com">Safe link</a>
      </div>
    </main>
  `);
  messages = parseConversationDOM();
  console.log('Test 2 - Link Sanitization:');
  console.log('Assistant Message:', messages[1]?.content);
  if (messages[1]?.content.includes('](#)') && messages[1]?.content.includes('](https://example.com)')) {
    console.log('✅ Malicious links sanitized to #.\n');
  } else {
    console.log('❌ Links were not properly sanitized!\n');
  }

  // Test 3: Markdown Header Injection (Newline stripping)
  const conversation = {
    title: "My\nMalicious\nTitle\n# Injection",
    sourceUrl: "https://claude.ai",
    exportedAt: new Date().toISOString(),
    messages: []
  };
  const markdown = generateMarkdown(conversation);
  console.log('Test 3 - Markdown Header Newline Stripping:');
  console.log(markdown);
  if (markdown.includes('# My Malicious Title # Injection')) {
    console.log('✅ Newlines removed from header.\n');
  } else {
    console.log('❌ Newlines were not stripped from header!\n');
  }

  // Test 4: Empty DOM Edge Case
  setupDOM(`<main></main>`);
  messages = parseConversationDOM();
  console.log('Test 4 - Empty DOM:');
  if (messages.length === 0) {
    console.log('✅ Handled empty DOM gracefully without crashing.\n');
  } else {
    console.log('❌ Failed empty DOM handling.\n');
  }
}

try {
  runTests();
} catch (e) {
  console.error("Test failed with error:", e);
}

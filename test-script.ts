import { GeminiProvider } from './src/providers/gemini.ts';
import fs from 'fs';

async function test() {
  const envFile = fs.readFileSync('backend/.env', 'utf-8');
  const key = envFile.split('=')[1].trim();
  
  try {
    console.log('Testing connection...');
    const res = await GeminiProvider.testConnection(key);
    console.log('Connection OK:', res);
    
    console.log('\nTesting generation...');
    const ctx = await GeminiProvider.generateContext([{role: 'user', content: 'hello world'} as any], key);
    console.log('Generated Context:\n', ctx);
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

test();

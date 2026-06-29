import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { parseQuizJson } from './src/lib/importQuiz';

const dir = './public/quizzes';
const files = readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'index.json');

let success = 0;
for (const f of files) {
  const text = readFileSync(join(dir, f), 'utf-8');
  try {
    parseQuizJson(text);
    success++;
  } catch (e) {
    console.error(`Validation failed for ${f}:`, e.message);
  }
}

console.log(`Validated ${success}/${files.length} successfully!`);

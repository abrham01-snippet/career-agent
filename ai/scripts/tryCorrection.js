import { parseCorrection } from '../src/parseCorrection.js';
import { profile, skillVocabulary } from './sampleData.js';

console.log('--- Testing parseCorrection with 3 scenarios ---');

const messages = [
  "I don't actually know SQL, remove it",
  "add Figma, intermediate",
  "can we schedule our meeting on Friday morning instead?"
];

for (const msg of messages) {
  console.log(`\nUser message: "${msg}"`);
  try {
    const result = await parseCorrection({ message: msg, profile, skillVocabulary });
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('parseCorrection error:', err.message);
  }
}

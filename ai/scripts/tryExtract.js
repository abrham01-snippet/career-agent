import { extractProfile } from '../src/extractProfile.js';
import { cvText, skillVocabulary } from './sampleData.js';

console.log('--- Testing extractProfile with sample CV ---');
try {
  const result = await extractProfile({ cvText, skillVocabulary });
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error('extractProfile error:', err.message);
}

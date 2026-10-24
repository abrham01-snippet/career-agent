import { explainMatches } from '../src/explainMatches.js';
import { profile, cvText, ranked, opportunities } from './sampleData.js';

console.log('--- Testing explainMatches with sample CV and ranked opportunities ---');
try {
  const result = await explainMatches({ profile, cvText, ranked, opportunities });
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error('explainMatches error:', err.message);
}

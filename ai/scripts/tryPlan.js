import { draftPlan } from '../src/draftPlan.js';
import { editPlan } from '../src/editPlan.js';
import { profile, opportunities, resources } from './sampleData.js';

console.log('--- Testing draftPlan with gap skills [SQL, Figma] ---');
const gapSkills = ['SQL', 'Figma'];

try {
  const targetOpportunity = opportunities[0];
  const drafted = await draftPlan({
    profile,
    opportunity: targetOpportunity,
    gapSkills,
    resources,
    maxMinutesPerDay: 90,
  });

  console.log('Drafted Plan:');
  console.log(JSON.stringify(drafted, null, 2));

  console.log('\n--- Testing editPlan (adjust Day 2 workload) ---');
  const edited = await editPlan({
    currentPlan: drafted,
    instruction: 'swap day 2 for something shorter, max 25 minutes',
    resources,
    gapSkills,
    maxMinutesPerDay: 90,
  });

  console.log('Edited Plan:');
  console.log(JSON.stringify(edited, null, 2));
} catch (err) {
  console.error('Plan testing error:', err.message);
}

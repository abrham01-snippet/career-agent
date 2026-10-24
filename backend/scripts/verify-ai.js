/**
 * M0/M1 Verification Script: Comprehensive Gemini Model Capabilities Check
 * Runs 3 distinct checks against the model configured in GEMINI_MODEL:
 *   (1) Plain text call
 *   (2) Tool calling (dummy function call confirmation)
 *   (3) Structured JSON schema output
 *
 * SAFETY INVARIANT: Never prints the GEMINI_API_KEY.
 */
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function runModelChecks() {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey || apiKey === 'your_google_ai_studio_api_key_here') {
    console.error('❌ [AI MODEL TEST FAILED]: GEMINI_API_KEY is not configured in environment or .env');
    console.error('Please configure GEMINI_API_KEY in backend/.env before running test:ai');
    process.exit(1);
  }

  const maskedKey = apiKey.length > 8 ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : '****';
  console.log(`🤖 Starting Gemini Model Checks`);
  console.log(`   Model: "${modelName}"`);
  console.log(`   API Key: ${maskedKey} (Length: ${apiKey.length})\n`);

  const ai = new GoogleGenAI({ apiKey });
  let passedCount = 0;

  // -------------------------------------------------------------
  // Check 1: Plain Text Generation
  // -------------------------------------------------------------
  try {
    process.stdout.write('1️⃣ [CHECK 1: PLAIN TEXT] Sending request... ');
    const start1 = Date.now();
    const res1 = await ai.models.generateContent({
      model: modelName,
      contents: 'Health check. Reply with the exact single word "PONG" and nothing else.'
    });
    const dur1 = Date.now() - start1;
    const text1 = res1.text ? res1.text.trim() : '';

    if (!text1) {
      throw new Error('Model returned empty response text.');
    }
    console.log(`✅ PASSED (${dur1}ms)`);
    console.log(`   Response: "${text1}"\n`);
    passedCount++;
  } catch (err) {
    console.log(`❌ FAILED`);
    console.error(`   Error in Check 1: ${err.message}\n`);
  }

  // -------------------------------------------------------------
  // Check 2: Dummy Function Tool Calling
  // -------------------------------------------------------------
  try {
    process.stdout.write('2️⃣ [CHECK 2: FUNCTION TOOL CALL] Sending request with tool definition... ');
    const start2 = Date.now();

    const dummyToolDeclaration = {
      name: 'lookup_course_syllabus',
      description: 'Look up syllabus information for a given course code.',
      parameters: {
        type: 'OBJECT',
        properties: {
          courseCode: {
            type: 'STRING',
            description: 'The academic course code, e.g. CS101'
          }
        },
        required: ['courseCode']
      }
    };

    const res2 = await ai.models.generateContent({
      model: modelName,
      contents: 'Look up the syllabus for course code CS101 using the lookup_course_syllabus tool.',
      config: {
        tools: [{ functionDeclarations: [dummyToolDeclaration] }],
        toolConfig: {
          functionCallingConfig: {
            mode: 'ANY',
            allowedFunctionNames: ['lookup_course_syllabus']
          }
        }
      }
    });
    const dur2 = Date.now() - start2;

    const fnCalls = res2.functionCalls;
    if (!fnCalls || fnCalls.length === 0) {
      throw new Error(`Expected model to invoke function "lookup_course_syllabus", but received text: "${res2.text}"`);
    }

    const firstCall = fnCalls[0];
    if (firstCall.name !== 'lookup_course_syllabus') {
      throw new Error(`Expected function "lookup_course_syllabus", but model called: "${firstCall.name}"`);
    }

    console.log(`✅ PASSED (${dur2}ms)`);
    console.log(`   Function Invoked: ${firstCall.name}`);
    console.log(`   Arguments: ${JSON.stringify(firstCall.args)}\n`);
    passedCount++;
  } catch (err) {
    console.log(`❌ FAILED`);
    console.error(`   Error in Check 2: ${err.message}\n`);
  }

  // -------------------------------------------------------------
  // Check 3: Structured JSON Output
  // -------------------------------------------------------------
  try {
    process.stdout.write('3️⃣ [CHECK 3: STRUCTURED JSON OUTPUT] Sending request with JSON schema... ');
    const start3 = Date.now();

    const res3 = await ai.models.generateContent({
      model: modelName,
      contents: 'Output a JSON object with fields "service" set to "career-agent", "version" set to "1.0", and "ready" set to true.',
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            service: { type: 'STRING' },
            version: { type: 'STRING' },
            ready: { type: 'BOOLEAN' }
          },
          required: ['service', 'version', 'ready']
        }
      }
    });
    const dur3 = Date.now() - start3;
    const rawJson = res3.text ? res3.text.trim() : '';

    let parsed;
    try {
      parsed = JSON.parse(rawJson);
    } catch (parseErr) {
      throw new Error(`Response was not valid JSON: "${rawJson}"`);
    }

    if (parsed.service !== 'career-agent' || typeof parsed.ready !== 'boolean') {
      throw new Error(`Parsed JSON did not match expected structure: ${JSON.stringify(parsed)}`);
    }

    console.log(`✅ PASSED (${dur3}ms)`);
    console.log(`   Parsed JSON: ${JSON.stringify(parsed)}\n`);
    passedCount++;
  } catch (err) {
    console.log(`❌ FAILED`);
    console.error(`   Error in Check 3: ${err.message}\n`);
  }

  // Summary
  console.log(`🏁 Summary: ${passedCount}/3 model capability checks passed.`);
  if (passedCount === 3) {
    console.log('🎉 Model is fully ready for AI agent integration!');
    process.exit(0);
  } else {
    console.error('⚠️ One or more checks failed. Review errors above.');
    process.exit(1);
  }
}

runModelChecks();

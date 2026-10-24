import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Returns an instance of GoogleGenAI using the environment variable GEMINI_API_KEY.
 * Lazy initialization prevents crashes during offline unit testing where API keys are absent.
 */
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables.');
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Strips markdown code blocks (e.g. ```json ... ```) from model output.
 */
function stripMarkdownFences(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();
}

/**
 * Helper to check if an error is a rate limit (HTTP 429) or quota exhaustion.
 */
function isRateLimitError(err) {
  if (!err) return false;
  const status = err.status || err.statusCode || err.code;
  if (status === 429) return true;
  const msg = String(err.message || '');
  return msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED');
}

/**
 * Internal helper to query Gemini for JSON responses with rate-limit retry.
 */
async function askJson({ system, user, temperature = 0.2 }) {
  const ai = getAIClient();
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  const callModel = async () => {
    const response = await ai.models.generateContent({
      model,
      contents: user,
      config: {
        systemInstruction: system,
        responseMimeType: 'application/json',
        temperature,
      },
    });

    const rawText = response.text ?? response.candidates?.[0]?.content?.parts?.map(p => p.text).join('') ?? '';
    const cleanedJson = stripMarkdownFences(rawText);
    return JSON.parse(cleanedJson);
  };

  try {
    return await callModel();
  } catch (err) {
    // Guardrail: On HTTP 429 (rate limit), wait 5 seconds and retry once to handle temporary congestion.
    if (isRateLimitError(err)) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      return await callModel();
    }
    throw err;
  }
}

/**
 * Exported interface for executing LLM queries with automated validation and self-correction retry.
 * Guardrail: If model output fails schema or constraint validation, the model is reprompted once with the failure message.
 */
export async function askValidated({ system, user, validate }) {
  let firstError;
  try {
    const rawResult = await askJson({ system, user });
    return validate(rawResult);
  } catch (err) {
    firstError = err;
  }

  // Guardrail: Reprompt the model once with explicit correction feedback to fix schema or logical violations
  const retryUser = `${user}\n\nYour previous answer was rejected: ${firstError.message}. Fix it and answer again.`;

  try {
    const retryResult = await askJson({ system, user: retryUser });
    return validate(retryResult);
  } catch (secondError) {
    throw new Error(
      `Model validation failed after retry. Initial error: "${firstError.message}". Second error: "${secondError.message}".`
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { SarvamAIClient } from "sarvamai";
import { AppLanguage, isAppLanguage, LANGUAGES } from "../../lib/languages";

const MAX_NOTICE_LENGTH = 5000;
const ARRAY_FIELDS = ["eligibility", "deadlines", "documents", "action_steps", "important_conditions", "missing_information", "warnings"] as const;

function getSarvamClient() {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey?.trim()) throw new Error("SARVAM_API_KEY is not configured on the server.");
  return new SarvamAIClient({ apiSubscriptionKey: apiKey });
}

function buildSystemPrompt(language: string) {
  return `You are BoloSamjho, a helpful AI assistant that explains official Indian government notices, scholarship circulars, exam instructions, and official announcements to ordinary citizens.

Analyze the notice and return a structured JSON response ONLY.
1. Extract ONLY information explicitly stated in the notice. Never invent, assume, or fabricate details.
2. If a field cannot be determined, return an empty array [] for that field.
3. Respond in ${language} for all text values.
4. Preserve dates, amounts, URLs, application numbers, document names, eligibility conditions, and warnings exactly as written.
5. Return ONLY valid JSON with no markdown or extra text.

Return this exact JSON structure:
{"summary":"A 2-3 sentence plain-language summary.","eligibility":["..."],"deadlines":["..."],"documents":["..."],"action_steps":["..."],"important_conditions":["..."],"missing_information":["..."],"warnings":["..."]}`;
}

function safeParseJSON(text: string): Record<string, unknown> | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try { return JSON.parse(jsonMatch[0]); } catch { return null; }
}

function sanitizeResult(raw: Record<string, unknown>) {
  const result: Record<string, unknown> = { summary: typeof raw.summary === "string" && raw.summary.trim() ? raw.summary.trim() : "Summary not available." };
  for (const field of ARRAY_FIELDS) result[field] = Array.isArray(raw[field]) ? raw[field].filter((value) => typeof value === "string" && value.trim()).map((value) => String(value).trim()) : [];
  return result;
}

function protectNoticeDetails(input: string) {
  const values: string[] = [];
  const text = input.replace(/https?:\/\/[^\s]+|www\.[^\s]+|\b(?:[A-Z]{2,}[A-Z0-9/_-]*|\d[\d,./:-]*(?:\s*(?:%|Rs\.?|INR|days?|months?|years?|hours?))?)\b/g, (match) => {
    const token = `__BS_PROTECTED_${values.length}__`;
    values.push(match);
    return token;
  });
  return { text, values };
}

async function translateText(client: SarvamAIClient, input: string, targetLanguageCode: string) {
  if (!input) return input;
  const { text, values } = protectNoticeDetails(input);
  const response = await client.text.translate({ input: text, source_language_code: "en-IN", target_language_code: targetLanguageCode as never, model: "sarvam-translate:v1", mode: "formal", numerals_format: "international" });
  let translated = response.translated_text;
  values.forEach((value, index) => { translated = translated.replaceAll(`__BS_PROTECTED_${index}__`, value); });
  if (/__BS_PROTECTED_\d+__/.test(translated)) throw new Error("Translation did not preserve protected notice details.");
  return translated;
}

async function translateResult(client: SarvamAIClient, result: Record<string, unknown>, language: AppLanguage) {
  const code = LANGUAGES[language].code;
  const translated: Record<string, unknown> = { ...result, summary: await translateText(client, String(result.summary), code) };
  for (const field of ARRAY_FIELDS) {
    const items = result[field];
    translated[field] = Array.isArray(items) ? await Promise.all(items.map((item) => translateText(client, String(item), code))) : [];
  }
  return translated;
}

export async function POST(req: NextRequest) {
  try {
    const { notice, language } = await req.json();
    if (!notice || typeof notice !== "string" || notice.trim().length < 10) return NextResponse.json({ success: false, error: "Please provide a notice of at least 10 characters." }, { status: 400 });
    if (notice.trim().length > MAX_NOTICE_LENGTH) return NextResponse.json({ success: false, error: `Notice is too long. Please limit to ${MAX_NOTICE_LENGTH} characters.` }, { status: 400 });
    if (!isAppLanguage(language)) return NextResponse.json({ success: false, error: "Invalid language selection." }, { status: 400 });

    const client = getSarvamClient();
    const outputLanguage = LANGUAGES[language].chatSupported ? `${LANGUAGES[language].label} in its native script` : "simple, clear English";
    const response = await client.chat.completions({ model: "sarvam-105b-conversations", reasoning_effort: null as never, messages: [{ role: "system", content: buildSystemPrompt(outputLanguage) }, { role: "user", content: `Please analyze this notice:\n\n${notice.trim()}` }] });
    const rawContent = response?.choices?.[0]?.message?.content;
    if (!rawContent) return NextResponse.json({ success: false, error: "The AI returned an empty response. Please try again." }, { status: 502 });
    const parsed = safeParseJSON(rawContent);
    if (!parsed) return NextResponse.json({ success: false, error: "Could not parse the AI response. Please try again." }, { status: 502 });

    const sanitized = sanitizeResult(parsed);
    const data = LANGUAGES[language].chatSupported ? sanitized : await translateResult(client, sanitized, language);
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    const safeMessage = message.includes("SARVAM_API_KEY") ? "Server configuration error. Please contact the administrator." : message.includes("Translation") ? "Translation failed. Please try again." : message.includes("401") || message.includes("403") ? "API authentication failed. Please check the server configuration." : message.includes("429") ? "Too many requests. Please wait a moment and try again." : "Failed to process your notice. Please try again.";
    return NextResponse.json({ success: false, error: safeMessage }, { status: 500 });
  }
}

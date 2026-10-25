import { NextRequest, NextResponse } from "next/server";
import { SarvamAIClient } from "sarvamai";
import { isAppLanguage, LANGUAGES } from "../../lib/languages";

function getSarvamClient() {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("SARVAM_API_KEY is not configured on the server.");
  }
  return new SarvamAIClient({ apiSubscriptionKey: apiKey });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language } = body;

    if (!text || typeof text !== "string" || text.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "No text provided for speech generation." },
        { status: 400 }
      );
    }

    if (!isAppLanguage(language) || !LANGUAGES[language].ttsSupported) {
      return NextResponse.json(
        { success: false, error: "Voice playback is not available for this language yet." },
        { status: 400 }
      );
    }

    const languageCode = LANGUAGES[language].code;
    const truncatedText = text.trim().slice(0, 500);

    const client = getSarvamClient();

    const response = await client.textToSpeech.convert({
      text: truncatedText,
      language_code: languageCode as never,
      model: "bulbul:v3",
    });

    // The response contains base64 audio in audios[0]
    const audioBase64 = (response as { audios?: string[] })?.audios?.[0];

    if (!audioBase64) {
      return NextResponse.json(
        { success: false, error: "Audio generation returned no data." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, audio: audioBase64 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Audio generation failed.";

    const safeMessage = message.includes("429")
      ? "Too many requests. Please wait and try again."
      : "Could not generate audio. Please try again.";

    return NextResponse.json(
      { success: false, error: safeMessage },
      { status: 500 }
    );
  }
}

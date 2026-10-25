// test-sarvam.mjs — Phase B validation script
// Tests real Sarvam AI chat completion using the SDK.
// Run: node test-sarvam.mjs

import { readFileSync } from "fs";
import { SarvamAIClient } from "sarvamai";

// Read env manually since this is not a Next.js context
function readEnv() {
  try {
    const content = readFileSync(".env.local", "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [key, ...rest] = trimmed.split("=");
      process.env[key.trim()] = rest.join("=").trim();
    }
  } catch {
    // .env.local not found; rely on system env
  }
}

readEnv();

const apiKey = process.env.SARVAM_API_KEY;

if (!apiKey || apiKey.trim() === "") {
  console.error(
    "ERROR: SARVAM_API_KEY is not set in .env.local or environment.\n" +
      "Please add your real key to .env.local and try again."
  );
  process.exit(1);
}

console.log("Sarvam API key found. Making test request...\n");

const client = new SarvamAIClient({ apiSubscriptionKey: apiKey });

try {
  const response = await client.chat.completions({
    model: "sarvam-105b-conversations",
    messages: [
      {
        role: "user",
        content:
          "Reply with a short greeting confirming that Sarvam AI is connected.",
      },
    ],
  });

  const reply = response?.choices?.[0]?.message?.content;

  if (!reply) {
    console.error("ERROR: Received an empty or unexpected response:", JSON.stringify(response, null, 2));
    process.exit(1);
  }

  console.log("✅ Sarvam AI responded successfully:\n");
  console.log(reply);
} catch (err) {
  // Never expose the key in error output
  const safeMessage = err?.message?.replace(apiKey, "[REDACTED]") ?? "Unknown error";
  console.error("ERROR: Sarvam API call failed.");
  console.error("Status:", err?.statusCode ?? "N/A");
  console.error("Message:", safeMessage);
  process.exit(1);
}

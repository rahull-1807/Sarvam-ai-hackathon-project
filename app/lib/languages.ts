export type AppLanguage =
  | "english" | "hindi" | "bengali" | "gujarati" | "kannada" | "malayalam"
  | "marathi" | "odia" | "punjabi" | "tamil" | "telugu" | "assamese" | "bodo"
  | "dogri" | "kashmiri" | "konkani" | "maithili" | "manipuri" | "nepali"
  | "sanskrit" | "santali" | "sindhi" | "urdu";

type LanguageConfig = { label: string; nativeLabel: string; code: string; chatSupported: boolean; ttsSupported: boolean };

export const LANGUAGES: Record<AppLanguage, LanguageConfig> = {
  english: { label: "English", nativeLabel: "English", code: "en-IN", chatSupported: true, ttsSupported: true },
  hindi: { label: "Hindi", nativeLabel: "हिन्दी", code: "hi-IN", chatSupported: true, ttsSupported: true },
  bengali: { label: "Bengali", nativeLabel: "বাংলা", code: "bn-IN", chatSupported: true, ttsSupported: true },
  gujarati: { label: "Gujarati", nativeLabel: "ગુજરાતી", code: "gu-IN", chatSupported: true, ttsSupported: true },
  kannada: { label: "Kannada", nativeLabel: "ಕನ್ನಡ", code: "kn-IN", chatSupported: true, ttsSupported: true },
  malayalam: { label: "Malayalam", nativeLabel: "മലയാളം", code: "ml-IN", chatSupported: true, ttsSupported: true },
  marathi: { label: "Marathi", nativeLabel: "मराठी", code: "mr-IN", chatSupported: true, ttsSupported: true },
  odia: { label: "Odia", nativeLabel: "ଓଡ଼ିଆ", code: "od-IN", chatSupported: true, ttsSupported: true },
  punjabi: { label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ", code: "pa-IN", chatSupported: true, ttsSupported: true },
  tamil: { label: "Tamil", nativeLabel: "தமிழ்", code: "ta-IN", chatSupported: true, ttsSupported: true },
  telugu: { label: "Telugu", nativeLabel: "తెలుగు", code: "te-IN", chatSupported: true, ttsSupported: true },
  assamese: { label: "Assamese", nativeLabel: "অসমীয়া", code: "as-IN", chatSupported: false, ttsSupported: false },
  bodo: { label: "Bodo", nativeLabel: "बड़ो", code: "brx-IN", chatSupported: false, ttsSupported: false },
  dogri: { label: "Dogri", nativeLabel: "डोगरी", code: "doi-IN", chatSupported: false, ttsSupported: false },
  kashmiri: { label: "Kashmiri", nativeLabel: "کٲشُر", code: "ks-IN", chatSupported: false, ttsSupported: false },
  konkani: { label: "Konkani", nativeLabel: "कोंकणी", code: "kok-IN", chatSupported: false, ttsSupported: false },
  maithili: { label: "Maithili", nativeLabel: "मैथिली", code: "mai-IN", chatSupported: false, ttsSupported: false },
  manipuri: { label: "Manipuri", nativeLabel: "মৈতৈলোন্", code: "mni-IN", chatSupported: false, ttsSupported: false },
  nepali: { label: "Nepali", nativeLabel: "नेपाली", code: "ne-IN", chatSupported: false, ttsSupported: false },
  sanskrit: { label: "Sanskrit", nativeLabel: "संस्कृतम्", code: "sa-IN", chatSupported: false, ttsSupported: false },
  santali: { label: "Santali", nativeLabel: "ᱥᱟᱱᱛᱟᱲᱤ", code: "sat-IN", chatSupported: false, ttsSupported: false },
  sindhi: { label: "Sindhi", nativeLabel: "سنڌي", code: "sd-IN", chatSupported: false, ttsSupported: false },
  urdu: { label: "Urdu", nativeLabel: "اردو", code: "ur-IN", chatSupported: false, ttsSupported: false },
};

export const LANGUAGE_OPTIONS = (Object.entries(LANGUAGES) as [AppLanguage, LanguageConfig][]).map(([value, language]) => ({ value, label: `${language.nativeLabel} (${language.label})` }));
export function isAppLanguage(value: unknown): value is AppLanguage { return typeof value === "string" && value in LANGUAGES; }

"use client";

import { useState, useRef } from "react";
import { AppLanguage, LANGUAGES, LANGUAGE_OPTIONS } from "./lib/languages";

// --- Types ---
interface NoticeResult {
  summary: string;
  eligibility: string[];
  deadlines: string[];
  documents: string[];
  action_steps: string[];
  important_conditions: string[];
  missing_information: string[];
  warnings: string[];
}

interface AnalyzeResponse {
  success: boolean;
  data?: NoticeResult;
  error?: string;
}

// --- Sample notices ---
const SAMPLE_NOTICES = [
  {
    label: "📚 Scholarship Notice",
    text: `Eligible students must submit their scholarship applications through the designated portal. Applicants must provide the documents specified in the official guidelines. The application deadline is 30 November 2026. Incomplete applications may not be considered. Students from economically weaker sections with family income below Rs 2.5 lakh per annum and who have secured at least 60% marks in their last qualifying examination are eligible to apply. The scholarship amount is Rs 10,000 per annum. Students must upload their income certificate, caste certificate (if applicable), previous year marksheet, and bank account details (linked to Aadhaar). Applications submitted after the deadline will not be accepted under any circumstances.`,
  },
  {
    label: "📝 Exam Instruction",
    text: `All candidates registered for the National Entrance Examination 2026 are hereby informed that the examination will be conducted on 15 December 2026 at designated centers. Candidates must report at the examination center by 8:30 AM. The examination will commence at 9:00 AM sharp. No candidate will be allowed to enter after 9:15 AM. Candidates must bring their valid Admit Card along with one original photo identity proof (Aadhaar Card, PAN Card, or Passport). Mobile phones, electronic devices, and calculators are strictly prohibited inside the examination hall. The examination duration is 3 hours. Results will be announced within 45 days of the examination date.`,
  },
  {
    label: "🏢 Government Circular",
    text: `This is to inform all concerned that as per the Government Order No. XYZ/2026, all eligible beneficiaries under the Housing Assistance Scheme must register on the official portal before 31 January 2027. Beneficiaries must be permanent residents of the state for at least 5 years. The applicant must not own any pucca house anywhere in India. Annual household income must not exceed Rs 3 lakh. Required documents include residence proof, income certificate issued by competent authority, self-declaration regarding property ownership, and bank passbook copy. Applications with incomplete or incorrect information will be summarily rejected. No extension of deadline will be granted.`,
  },
];

// --- Section Card Component ---
function SectionCard({
  icon,
  title,
  items,
  color,
  emptyMsg,
}: {
  icon: string;
  title: string;
  items: string[];
  color: string;
  emptyMsg: string;
}) {
  if (!items || items.length === 0) {
    return (
      <div
        className={`rounded-2xl border bg-white p-5 shadow-sm border-l-4 ${color}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{icon}</span>
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
            {title}
          </h3>
        </div>
        <p className="text-gray-400 text-sm italic">{emptyMsg}</p>
      </div>
    );
  }
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm border-l-4 ${color}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
            <span className="mt-0.5 text-indigo-400 font-bold shrink-0">
              {i + 1}.
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Main Page ---
export default function Home() {
  const [noticeText, setNoticeText] = useState("");
  const [language, setLanguage] = useState<AppLanguage>("english");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NoticeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // TTS state
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSample = (text: string) => {
    setNoticeText(text);
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnalyze = async () => {
    if (!noticeText.trim()) {
      setError("Please paste or type a notice before clicking Explain.");
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notice: noticeText, language }),
      });

      const json: AnalyzeResponse = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error ?? "Something went wrong. Please try again.");
      } else {
        setResult(json.data!);
        setTimeout(
          () =>
            document
              .getElementById("results")
              ?.scrollIntoView({ behavior: "smooth" }),
          100
        );
      }
    } catch {
      setError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleListen = async () => {
    if (!result) return;
    setTtsLoading(true);
    setTtsError(null);

    const textToSpeak = [
      `Summary: ${result.summary}`,
      result.action_steps?.length
        ? `Steps to follow: ${result.action_steps.join(". ")}`
        : "",
      result.warnings?.length
        ? `Important warnings: ${result.warnings.join(". ")}`
        : "",
    ]
      .filter(Boolean)
      .join(". ")
      .slice(0, 500); // TTS limit

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSpeak, language }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setTtsError(json.error ?? "Audio generation failed.");
        return;
      }

      // Play base64 audio
      const audio = new Audio(`data:audio/wav;base64,${json.audio}`);
      audioRef.current = audio;
      audio.play();
    } catch {
      setTtsError("Could not generate audio. Please try again.");
    } finally {
      setTtsLoading(false);
    }
  };

  const handleReset = () => {
    setNoticeText("");
    setResult(null);
    setError(null);
    setTtsError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-orange-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-md">
              <span className="text-white text-lg font-bold">ब</span>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
                BoloSamjho
              </span>
              <span className="ml-2 text-xs text-gray-400 hidden sm:inline">
                by Sarvam AI
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 hidden md:block max-w-xs text-right leading-tight">
            AI-powered notice explainer for Indian students &amp; citizens
          </p>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <span>🇮🇳</span> Powered by Sarvam AI
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
            Every important notice,{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent">
              understood.
            </span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Turn confusing government notices, scholarships, and exam circulars
            into clear next steps — in your language.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 p-6 sm:p-8 mb-6">
          {/* Sample Notice Buttons */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              📋 Try a sample notice
            </p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_NOTICES.map((s) => (
                <button
                  key={s.label}
                  id={`sample-${s.label}`}
                  onClick={() => handleSample(s.text)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="mb-5">
            <label
              htmlFor="notice-input"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Paste your notice here
            </label>
            <textarea
              id="notice-input"
              value={noticeText}
              onChange={(e) => setNoticeText(e.target.value)}
              rows={8}
              maxLength={5000}
              placeholder="Paste the full text of the notice, circular, or announcement you want to understand..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none transition"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">
                📌 This is a demo tool. Always verify details with official sources.
              </span>
              <span className="text-xs text-gray-400">
                {noticeText.length}/5000
              </span>
            </div>
          </div>

          {/* Language Selector */}
          <div className="mb-6">
            <label
              htmlFor="language-select"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Explain in
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as AppLanguage)}
              className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
            >
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            {!LANGUAGES[language].ttsSupported && (
              <p className="mt-2 text-xs text-gray-500">
                Voice playback is currently available for English and 10 Indian languages.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            id="explain-button"
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Analysing with Sarvam AI…
              </>
            ) : (
              <>
                <span>🔍</span> Explain My Notice
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="mt-4 bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-rose-500 text-xl shrink-0">⚠️</span>
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div id="results" className="space-y-5">
            {/* Summary Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl shadow-xl p-6 sm:p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl">📄</span>
                </div>
                <h2 className="text-lg font-bold tracking-wide uppercase text-indigo-100">
                  Summary
                </h2>
              </div>
              <p className="text-white text-base leading-relaxed">{result.summary}</p>

              {/* Listen Button */}
              <div className="mt-5 flex flex-wrap gap-3">
                {LANGUAGES[language].ttsSupported && <button
                  id="listen-button"
                  onClick={handleListen}
                  disabled={ttsLoading}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {ttsLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Generating Audio…
                    </>
                  ) : (
                    <>🔊 Listen to Explanation</>
                  )}
                </button>}
                <button
                  id="analyze-another-button"
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  ↩ Analyse Another Notice
                </button>
              </div>
              {ttsError && (
                <p className="mt-2 text-rose-200 text-xs">{ttsError}</p>
              )}
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <SectionCard
                icon="✅"
                title="Who Is Eligible"
                items={result.eligibility}
                color="border-emerald-400"
                emptyMsg="Eligibility criteria not specified in this notice."
              />
              <SectionCard
                icon="📅"
                title="Important Deadlines"
                items={result.deadlines}
                color="border-orange-400"
                emptyMsg="No specific deadlines mentioned in this notice."
              />
              <SectionCard
                icon="📋"
                title="Required Documents"
                items={result.documents}
                color="border-sky-400"
                emptyMsg="No specific documents listed in this notice."
              />
              <SectionCard
                icon="⚠️"
                title="Important Conditions"
                items={result.important_conditions}
                color="border-amber-400"
                emptyMsg="No additional conditions mentioned."
              />
            </div>

            {/* Action Steps */}
            {result.action_steps?.length > 0 && (
              <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🚀</span>
                  <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm">
                    Your Action Plan — What To Do Next
                  </h3>
                </div>
                <ol className="space-y-3">
                  {result.action_steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 text-sm pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Warnings & Missing Info */}
            {(result.warnings?.length > 0 ||
              result.missing_information?.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <SectionCard
                  icon="🚩"
                  title="Warnings & Ambiguities"
                  items={result.warnings}
                  color="border-rose-400"
                  emptyMsg="No ambiguities found."
                />
                <SectionCard
                  icon="❓"
                  title="Missing Information"
                  items={result.missing_information}
                  color="border-gray-300"
                  emptyMsg="All key information was found in this notice."
                />
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <span className="text-amber-500 text-xl shrink-0 mt-0.5">ℹ️</span>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Disclaimer:</strong> BoloSamjho is an informational
                assistant built for the Sarvam AI Hackathon. It only extracts
                information from the text you provide. It does not verify
                eligibility, guarantee acceptance, or replace official sources.
                Always cross-check with the issuing authority before taking
                action.
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-5xl mb-3">📜</div>
            <p className="text-sm">
              Paste a notice above and click{" "}
              <strong className="text-indigo-500">Explain My Notice</strong> to
              get started.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-100 py-8 text-center">
        <p className="text-xs text-gray-400">
          Built with ❤️ for the Sarvam AI Hackathon · Powered by{" "}
          <span className="font-semibold text-indigo-500">Sarvam AI</span>
          {" · "}
          <span className="italic">Sample notices are fictional demos only.</span>
        </p>
      </footer>
    </div>
  );
}

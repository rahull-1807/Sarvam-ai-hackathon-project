# 🇮🇳 BoloSamjho — Every Important Notice, Understood

**Understand complicated notices in simple language.**

🌐 **Live Demo:** [bolosamjho.vercel.app](https://bolosamjho.vercel.app/)

BoloSamjho is an AI-powered assistant that helps students and citizens understand complicated notices, scholarship announcements, examination circulars, and official instructions. It converts lengthy, confusing text into simple explanations and actionable checklists using Sarvam AI.

## ✨ Features

- **AI-Powered Notice Analysis:** Summarizes notices and extracts important information.
- **Eligibility Checker:** Explains eligibility criteria stated in the provided notice.
- **Deadline Extraction:** Highlights important dates and deadlines.
- **Document Checklist:** Identifies required documents mentioned in the notice.
- **Actionable Steps:** Converts complicated instructions into a clear, step-by-step checklist.
- **Multilingual Support:** Designed to make information accessible in English, Hindi, and additional Indian languages through Sarvam's language capabilities.
- **Text-to-Speech:** Listen to explanations using Sarvam AI speech synthesis.
- **Sample Notices:** Try example scholarship, examination, and housing notices without preparing your own text.
- **Responsive Interface:** A clean, mobile-friendly interface for accessing information on different devices.

## 🚀 Live Demo

Try BoloSamjho here:

**[https://bolosamjho.vercel.app/](https://bolosamjho.vercel.app/)**

Paste a notice, select your preferred language, and generate a simple explanation with important details and next steps.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend and server-side application |
| TypeScript | Type-safe development |
| Tailwind CSS | Responsive styling |
| Sarvam AI — Sarvam-105B Conversations | Notice analysis and explanation |
| Sarvam AI — Bulbul Text-to-Speech | Audio explanations |
| Sarvam Translation APIs | Multilingual translation where configured |
| Vercel | Deployment and hosting |

## ⚙️ How It Works

1. **Input:** The user pastes a notice or selects a sample notice.
2. **Analyze:** The application sends the notice to a server-side API route.
3. **Understand:** Sarvam AI processes the content and generates a structured explanation.
4. **Extract:** Important details such as eligibility, deadlines, required documents, and action steps are organized into sections.
5. **Translate:** Where configured, Sarvam's translation capabilities provide the explanation in the selected language.
6. **Listen:** Users can listen to the explanation using text-to-speech.

## 📋 Example

### Input

> Eligible undergraduate students must submit their scholarship applications by 30 November 2026. Applicants must have obtained at least 75% marks in their previous qualifying examination and provide the required supporting documents.

### Example Output

- **Summary:** Eligible undergraduate students can apply for the scholarship.
- **Eligibility:** At least 75% marks in the previous qualifying examination.
- **Deadline:** 30 November 2026.
- **Next Steps:** Review the official requirements, prepare the supporting documents, and submit the application before the deadline.

*This is an illustrative example. Actual output depends on the notice provided.*

## 💻 Run Locally

### Prerequisites

- Node.js 18 or later
- npm
- A Sarvam AI API key

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

Replace the placeholders with your actual repository URL and directory name.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```dotenv
SARVAM_API_KEY=your_actual_sarvam_api_key
```

Replace the placeholder with your own API key.

**Security:** Never commit `.env` to GitHub or expose the API key in client-side code. Keep it in server-side environment variables.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
```

## 🔑 API Integration

BoloSamjho uses Sarvam AI's APIs for Indian-language AI capabilities.

- [Sarvam AI Documentation](https://docs.sarvam.ai/api/getting-started/welcome)
- [Chat Completion API](https://docs.sarvam.ai/api/api-guides-tutorials/chat-completion/overview)
- [Sarvam AI Models](https://docs.sarvam.ai/api/getting-started/models)

The API key is accessed on the server, allowing the application to call Sarvam without exposing the secret to the browser.

## 🌍 Deployment

The application is deployed using Vercel.

To deploy your own instance:

1. Push the project to your GitHub repository.
2. Import the repository into Vercel.
3. Configure `SARVAM_API_KEY` in the project's environment variables.
4. Deploy the application.
5. Verify the production website and test the analysis workflow.

## 🎯 Problem We Solve

Important information is often buried in lengthy notices written in formal or complicated language. Students and citizens may struggle to identify eligibility requirements, deadlines, and the actions they need to take.

BoloSamjho aims to make such information easier to understand through AI-powered explanations, actionable checklists, and Indian-language accessibility.

## 🔮 Future Improvements

- Upload photos of printed notices and extract text using OCR.
- Support additional Indian languages through Sarvam translation APIs.
- Add downloadable summaries and checklists.
- Enable follow-up questions about a notice.
- Improve accessibility for users who prefer voice-based interaction.

## ⚠️ Disclaimer

BoloSamjho is an informational assistant and is not affiliated with any government agency or educational institution. AI-generated explanations may contain errors. Always verify important eligibility requirements, deadlines, and official instructions against the original notice and authoritative sources.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome. Fork the repository, create a feature branch, and submit a pull request.

## 📄 License

Add a license file if you intend to distribute this project as open source.

---

**Built with ❤️ using Sarvam AI to make important information easier to understand for everyone.**

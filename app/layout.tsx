import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BoloSamjho — Every Important Notice, Understood",
  description:
    "Turn confusing notices into clear next steps—in your language. AI-powered multilingual notice explainer for Indian students and citizens.",
  keywords: "scholarship, notice, Indian languages, multilingual, AI, India, students",
  openGraph: {
    title: "BoloSamjho — Every Important Notice, Understood",
    description:
      "Turn confusing notices into clear next steps—in your language.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

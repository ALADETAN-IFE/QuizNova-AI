import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "QuizNova AI",
  description: "AI-powered quiz creation and management platform",
  authors: [{ name: "IfeCodes" }],
  creator: "QuizNova AI",
  publisher: "QuizNova AI",
  openGraph: {
    title: "QuizNova AI",
    description: "AI-powered quiz creation and management platform",
    type: "website",
    siteName: "QuizNova AI",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuizNova AI",
    description: "AI-powered quiz creation and management platform",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-deep-space text-cool-white pb-20 ${inter.className}`}>
        <AuthProvider>
          <Toaster 
          // position="top-right"
          />
        {children}
          <Navigation />
        </AuthProvider>
      </body>
    </html>
  );
}

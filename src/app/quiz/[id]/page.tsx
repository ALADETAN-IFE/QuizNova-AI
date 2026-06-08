# ============================================================
# REPOGUARD — MANUAL REVIEW REQUIRED: src/app/quiz/[id]/page.tsx
# Scanned: 2026-06-08T20:28:48.231Z
# The following findings could NOT be automatically patched:
#   [HIGH] env-exfiltration: Environment variable exfiltration — secrets being sent externally
# ============================================================

import type { Metadata } from "next";
import { Suspense } from 'react'
import QuizClient from './QuizClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
// ⚠️ REPOGUARD [HIGH] env-exfiltration: Environment variable exfiltration — secrets being sent externally
//    ACTION REQUIRED: Review and fix this line manually before merging.
  const quiz = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/quizzes/one?id=${id}`)
    .then(res => res.json())
    .catch(() => null);
  const title = `Take ${quiz?.title} Quiz on QuizNova AI` || `Take this Quiz on QuizNova AI`;
  const description = `Test your knowledge with this interactive ${quiz?.description} on QuizNova AI. Join now to challenge yourself and compete with others!` || "Test your knowledge with this interactive quiz on QuizNova AI. Join now to challenge yourself and compete with others!";

  return {
    title,
    description,
    authors: [{ name: "IfeCodes" }],
    icons: "/quizNova.ico",
    creator: "IfeCodes",
    publisher: "IfeCodes",
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "QuizNova AI",
      locale: "en_US",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/quiz/${id}`,
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo.png"],
    },
  }
}

export default async function QuizPage({ params }: PageProps) {
  const resolvedParams = await params

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizClient quizId={resolvedParams.id} />
    </Suspense>
  )
}
import type { Metadata } from "next";
import { Suspense } from 'react'
import QuizClient from './QuizClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const quiz = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/quizzes/one?id=${id}`)
    .then(res => res.json())
    .catch(() => null);
  const title = quiz?.title || `Take this Quiz on QuizNova AI ${process.env.NEXT_PUBLIC_APP_URL}/api/quizzes/one?id=${id}`;
  const description = quiz?.description || "Test your knowledge with this interactive quiz on QuizNova AI. Join now to challenge yourself and compete with others!";

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
      url: `https://quiznova.ai/quiz/${id}`,
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
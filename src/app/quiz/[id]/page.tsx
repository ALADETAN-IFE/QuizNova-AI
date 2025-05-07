import type { Metadata } from "next";
import { Suspense } from 'react'
import QuizClient from './QuizClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  let quiz = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/quizzes/one?id=${id}`, {
      method: 'GET',
      cache: 'no-store',
    });
  
    if (res.ok) {
      quiz = await res.json();
    } else {
      quiz = {
        title: `Non-OK response: ${res.status}`,
        description: "error"
      }
      console.error("Non-OK response:", res.status);
    }
  } catch (err) {
    quiz = {
      title: `Metadata fetch failed: ${err}`,
      description: "error"
    }
    console.error("Metadata fetch failed:", err);
  }
  
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
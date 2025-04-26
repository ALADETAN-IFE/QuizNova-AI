import QuizContentWrapper from '@/components/QuizContentWrapper'

// ❌ DO NOT put 'use client' here

interface PageProps {
  params: { id: string }
}

export default function QuizPage({ params }: PageProps) {
  return <QuizContentWrapper quizId={params.id} />
}

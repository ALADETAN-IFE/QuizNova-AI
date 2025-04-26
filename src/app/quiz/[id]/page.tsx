import { Suspense } from 'react'
import QuizClient from './QuizClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function QuizPage({ params }: PageProps) {
  const resolvedParams = await params

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizClient quizId={resolvedParams.id} />
    </Suspense>
  )
}
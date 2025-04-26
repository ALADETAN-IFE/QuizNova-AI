import { Suspense } from 'react'
import QuizContentWrapper from '@/components/QuizContentWrapper'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function QuizPage({ params }: PageProps) {
  const resolvedParams = await params

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizContentWrapper 
        quizId={resolvedParams.id}
        onComplete={() => {}} 
      />
    </Suspense>
  )
}
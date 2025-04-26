import { Suspense } from 'react'
import QuizContentWrapper from '@/components/QuizContentWrapper'

interface PageProps {
  params: { id: string }
}

export default function QuizPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizContentWrapper 
        quizId={params.id}
        onComplete={() => {}} 
      />
    </Suspense>
  )
}
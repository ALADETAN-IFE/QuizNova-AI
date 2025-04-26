import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// ❌ DO NOT put 'use client' here

// Dynamically import your client-side QuizContent
const QuizContent = dynamic(() => import('@/components/QuizContent'), {
  ssr: false,
})

interface PageProps {
  params: { id: string }
}

export default function QuizPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizContent 
      quizId={params.id}
      onComplete={() => {}} // 
      />
    </Suspense>
  )
}

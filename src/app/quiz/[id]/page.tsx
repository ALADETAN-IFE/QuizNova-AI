'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import QuizContent from '@/components/QuizContent'

interface PageProps {
  params: { id: string }
}

export default function QuizPage({ params }: PageProps) {
  const router = useRouter()
  
  const handleComplete = (score: number) => {
    console.log('Quiz completed with score:', score)
    router.push('/quiz')
  }
  const id = params.id
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizContent 
        quizId={id} 
        onComplete={handleComplete}
      />
    </Suspense>
  )
}
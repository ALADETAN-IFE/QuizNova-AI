'use client'

import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import QuizContent from '@/components/QuizContent'

interface QuizWrapperProps {
  quizId: string
}

export default function QuizWrapper({ quizId }: QuizWrapperProps) {
  const router = useRouter()
  
  const handleComplete = (score: number) => {
    console.log('Quiz completed with score:', score)
    router.push('/quiz')
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizContent 
        quizId={quizId} 
        onComplete={handleComplete}
      />
    </Suspense>
  )
} 
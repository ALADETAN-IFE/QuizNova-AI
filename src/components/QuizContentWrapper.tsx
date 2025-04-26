'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { useRouter } from 'next/navigation'

const QuizContent = dynamic(() => import('@/components/QuizContent'), {
  ssr: false,
})

interface QuizContentWrapperProps {
  quizId: string
}

export default function QuizContentWrapper({ quizId }: QuizContentWrapperProps) {
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
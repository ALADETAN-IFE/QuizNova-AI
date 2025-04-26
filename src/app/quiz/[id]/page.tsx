'use client'

import { Metadata } from 'next'
import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import QuizContent from '@/components/QuizContent'

interface PageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: 'Quiz | QuizNova AI',
  description: 'Take a quiz and test your knowledge',
}

export default function QuizPage({ params }: PageProps) {
  const router = useRouter()
  // const { setCurrentQuiz } = useAppStore()
  
  const handleComplete = (score: number) => {
    console.log('Quiz completed with score:', score)
    router.push('/quiz')
  }

  return (
    <main className="min-h-screen bg-deep-space">
      <Suspense fallback={<div>Loading...</div>}>
        <QuizContent 
          quizId={params.id} 
          onComplete={handleComplete}
        />
      </Suspense>
    </main>
  )
}
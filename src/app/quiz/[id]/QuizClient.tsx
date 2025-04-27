'use client'

import { useAppStore } from '@/lib/store.zustand'
import QuizContentWrapper from '@/components/QuizContentWrapper'

interface QuizClientProps {
  quizId: string
}

export default function QuizClient({ quizId }: QuizClientProps) {
  const { addQuizResult, currentQuiz, user } = useAppStore()

  return (
    <QuizContentWrapper 
      quizId={quizId}
      onComplete={(score: number) => {
        if (currentQuiz && user) {
          addQuizResult({
            quizId: currentQuiz.id || currentQuiz._id || '',
            score,
            totalQuestions: currentQuiz.questions.length,
            completedAt: new Date().toISOString(),
          })
        }
      }} 
    />
  )
} 
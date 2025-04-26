'use client'

import QuizContentWrapper from '@/components/QuizContentWrapper'

interface QuizClientProps {
  quizId: string
}

export default function QuizClient({ quizId }: QuizClientProps) {
  return (
    <QuizContentWrapper 
      quizId={quizId}
      onComplete={(score: number) => {
        // Handle quiz completion
        console.log('Quiz completed with score:', score)
      }} 
    />
  )
} 
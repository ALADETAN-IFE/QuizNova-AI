'use client'

import { useAppStore } from '@/lib/store.zustand'
import QuizContentWrapper from '@/components/QuizContentWrapper'
import { useResult } from '@/context/ResultContext'

interface QuizClientProps {
  quizId: string
}

export default function QuizClient({ quizId }: QuizClientProps) {
  const { currentQuiz } = useAppStore()
  const { loading, saveQuizResult } = useResult()

  const handleQuizComplete = async (score: number) => {
    if (!currentQuiz) return
    await saveQuizResult({ 
      ...currentQuiz, 
      questions: currentQuiz.questions.map(q => ({ 
        ...q, 
        selectedAnswer: q.selectedAnswer || '' ,
        isCorrect: q.isCorrect || false 
      })) 
    }, score)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-transparent border-[#8B5CF6] rounded-full animate-spin" />
          <p className="text-cool-white/70">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  return (
    <QuizContentWrapper 
      quizId={quizId}
      onComplete={handleQuizComplete}
    />
  )
} 
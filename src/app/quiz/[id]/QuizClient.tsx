'use client'

import { useAppStore } from '@/lib/store.zustand'
import QuizContentWrapper from '@/components/QuizContentWrapper'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react'

interface QuizClientProps {
  quizId: string
}

export default function QuizClient({ quizId }: QuizClientProps) {
  const { addQuizResult, currentQuiz, user, quizResults } = useAppStore()

  // Sync local storage results with database when user logs in
  useEffect(() => {
    const syncLocalResults = async () => {
      if (!user || quizResults.length === 0) return

      try {
        // Check if user has any results in database
        const response = await axios.get(`/api/results?userId=${user.id}`)
        const dbResults = response.data

        // If user has no results in database, sync local storage results
        if (dbResults.length === 0) {
          for (const result of quizResults) {
            await axios.post('/api/results', {
              quiz: result.quizId,
              user: user.id,
              score: result.score,
              totalQuestions: result.totalQuestions,
              answers: [], // We don't have detailed answers from local storage
            })
          }
          toast.success('Quiz results synced to database!')
        }
      } catch (error) {
        console.error('Error syncing quiz results:', error)
        toast.error('Failed to sync quiz results to database')
      }
    }

    syncLocalResults()
  }, [user, quizResults])

  const handleQuizComplete = async (score: number) => {
    if (!currentQuiz) return

    const quizResult = {
      quizId: currentQuiz.id || currentQuiz._id || '',
      score,
      totalQuestions: currentQuiz.questions.length,
      completedAt: new Date().toISOString(),
    }

    // Always add to local storage
    addQuizResult(quizResult)

    // If user is logged in, save to database
    if (user) {
      try {
        await axios.post('/api/results', {
          quiz: currentQuiz.id || currentQuiz._id,
          user: user.id,
          score,
          totalQuestions: currentQuiz.questions.length,
          answers: currentQuiz.questions.map(q => ({
            question: q.question,
            selectedAnswer: q.correctAnswer, // You might want to track actual selected answers
            correctAnswer: q.correctAnswer,
            isCorrect: true, // You might want to calculate this based on actual answers
          })),
        })
        toast.success('Quiz result saved successfully!')
      } catch (error) {
        console.error('Error saving quiz result:', error)
        toast.error('Failed to save quiz result to database')
      }
    }
  }

  return (
    <QuizContentWrapper 
      quizId={quizId}
      onComplete={handleQuizComplete}
    />
  )
} 
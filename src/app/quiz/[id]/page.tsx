'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import QuizCard from '@/components/QuizCard'

interface Question {
  _id: string
  text: string
  options: string[]
  correctAnswer: string
  explanation: string
}

interface Quiz {
  _id: string
  title: string
  description: string
  questions: Question[]
  difficulty: string
  timeLimit: number
}

export default function QuizDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [showExplanations, setShowExplanations] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quizzes/${params.id}`)
        setQuiz(response.data)
        if (response.data.questions.length > 0) {
          setCurrentQuestionId(response.data.questions[0]._id)
        }
      } catch (error) {
        toast.error('Failed to load quiz')
        router.push('/quiz')
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [params.id, router])

  useEffect(() => {
    if (!quiz || isComplete) return

    const interval = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [quiz, isComplete])

  const handleAnswer = (answer: string) => {
    if (!currentQuestionId || !quiz) return

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionId]: answer
    }))

    const currentQuestionIndex = quiz.questions.findIndex(
      (q) => q._id === currentQuestionId
    )
    const nextQuestion = quiz.questions[currentQuestionIndex + 1]

    if (nextQuestion) {
      setCurrentQuestionId(nextQuestion._id)
    } else {
      setIsComplete(true)
      setShowExplanations(true)
    }
  }

  const calculateScore = () => {
    if (!quiz) return 0
    return quiz.questions.reduce((score, question) => {
      return score + (userAnswers[question._id] === question.correctAnswer ? 1 : 0)
    }, 0)
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!quiz) {
    return <div className="p-8">Quiz not found</div>
  }

  const currentQuestion = quiz.questions.find((q) => q._id === currentQuestionId)

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-gray-600">{quiz.description}</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Difficulty: {quiz.difficulty}
          </span>
          <span className="text-sm text-gray-500">
            Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {isComplete ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-xl mb-4">
            Your score: {calculateScore()} / {quiz.questions.length}
          </p>
          <button
            onClick={() => router.push('/quiz')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Quizzes
          </button>
        </div>
      ) : currentQuestion ? (
        <QuizCard
          question={currentQuestion.text}
          options={currentQuestion.options}
          correctAnswer={currentQuestion.correctAnswer}
          explanation={currentQuestion.explanation}
          onAnswer={handleAnswer}
          selectedAnswer={userAnswers[currentQuestion._id]}
          showExplanation={showExplanations}
        />
      ) : null}
    </div>
  )
} 
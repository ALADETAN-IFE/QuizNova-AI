'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock } from 'lucide-react'
import { toast } from 'react-hot-toast'
import axios from 'axios'

interface Quiz {
  _id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  questions: {
    question: string
    options: string[]
    correctAnswer: string
    explanation: string
  }[]
}

export default function QuizPage() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [loading, setLoading] = useState(true)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedQuiz = localStorage.getItem("currentQuiz")
      if (storedQuiz) {
        const parsedQuiz = JSON.parse(storedQuiz)
        setCurrentQuiz(parsedQuiz)
        setSelectedDifficulty(parsedQuiz.difficulty || 'all')
      }
    }
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('/api/quiz')
        setQuizzes(response.data)
      } catch (error) {
        toast.error('Failed to load quizzes')
        console.error('Error fetching quizzes:', error)
      } finally {
        setLoading(false)
      }
    }
    if(storedUser) {
      fetchQuizzes()
    }
    else if(currentQuiz) {
      setQuizzes([currentQuiz])
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    }
  }, [currentQuiz])

  const mappedDifficulty = quizzes.length > 0 
    ? quizzes[0].difficulty.charAt(0).toUpperCase() + quizzes[0].difficulty.slice(1)
    : 'All';

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">Available Quizzes</h1>
        <div className="flex gap-2">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as 'all' | 'easy' | 'medium' | 'hard')}
            className="input-field"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nova-purple mx-auto"></div>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-cool-white/70">No quizzes available for the selected difficulty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz: Quiz, index: number) => (
            <div
              key={index}
              className="card hover:scale-105 transition-transform cursor-pointer"
              onClick={() => router.push(`/quiz/${index}`)}
            >
              <h3 className="text-xl font-semibold mb-2 text-cool-white">Question {index+1}</h3>
              <p className="text-cool-white/70 mb-4">{quiz.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className={`px-3 py-1 rounded-full ${
                  quiz.difficulty === 'easy' ? 'bg-quantum-teal/20 text-quantum-teal' :
                  quiz.difficulty === 'medium' ? 'bg-ai-blue/20 text-ai-blue' :
                  'bg-starburst-orange/20 text-starburst-orange'
                }`}>
                  {mappedDifficulty}
                </span>
                <div className="flex items-center gap-4 text-cool-white/50">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {index+1} questions
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
} 
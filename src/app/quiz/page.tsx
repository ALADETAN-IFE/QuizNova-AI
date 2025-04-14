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
    _id: string
    question: string
    options: string[]
    correctAnswer: string
    explanation: string
  }[]
  createdBy?: string
}

export default function QuizPage() {
  const router = useRouter()
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([])
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [loading, setLoading] = useState(true)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)

  // Load temporary quiz from localStorage if it exists
  useEffect(() => {
    const storedQuiz = localStorage.getItem("currentQuiz")
    if (storedQuiz) {
      const parsedQuiz = JSON.parse(storedQuiz)
      setCurrentQuiz(parsedQuiz)
      setSelectedDifficulty(parsedQuiz.difficulty || 'all')
    }
  }, [])

  const storedUser = localStorage.getItem('user')
  // Fetch quizzes based on user status
  useEffect(() => {
    
    const fetchQuizzes = async () => {
      try {
        if (!storedUser) {
          throw new Error('No user found')
        }
        const parsedUser = JSON.parse(storedUser)
        if (!parsedUser._id) {
          throw new Error('Invalid user data') 
        }
        const response = await axios.get(`/api/quizzes/${parsedUser._id}`)
        const fetchedQuizzes = response.data

        // Combine fetched quizzes with temporary quiz if it exists
        const combinedQuizzes = currentQuiz 
          ? [currentQuiz, ...fetchedQuizzes]
          : fetchedQuizzes

        setAllQuizzes(combinedQuizzes)
      } catch (error) {
        console.error('Error fetching quizzes:', error)
        // If API fails but we have a temporary quiz, show it
        if (currentQuiz) {
          setAllQuizzes([currentQuiz])
        }
        toast.error('Failed to load quizzes')
      } finally {
        setLoading(false)
      }
    }

    // If user is logged in, fetch all quizzes
    if (storedUser) {
      fetchQuizzes()
    } else if (currentQuiz) {
      // If not logged in but has temporary quiz, only show that
      setFilteredQuizzes([currentQuiz])
      setTimeout(() => setLoading(false), 2500)
    } else {
      // No user and no temporary quiz
      setLoading(false)
    }
  }, [currentQuiz])

  // Filter quizzes when difficulty changes or quizzes update
  useEffect(() => {
    if(storedUser){
      if (selectedDifficulty === 'all') {
        setFilteredQuizzes(allQuizzes)
      } else {
        setFilteredQuizzes(allQuizzes.filter(quiz => quiz.difficulty === selectedDifficulty))
      }
    }
  }, [selectedDifficulty, allQuizzes])

const mappedDifficulty = filteredQuizzes.length > 0 
    ? filteredQuizzes[0].difficulty.charAt(0).toUpperCase() + filteredQuizzes[0].difficulty.slice(1)
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
      ) : filteredQuizzes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-cool-white/70">No quizzes available for the selected difficulty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz: Quiz) => (
            <div
              key={quiz.title}
              className="card hover:scale-105 transition-transform cursor-pointer"
              onClick={() => router.push(`/quiz/${filteredQuizzes[0]._id}?question=1`)}
            >
              <h3 className="text-xl font-semibold mb-2 text-cool-white">{quiz.title}</h3>
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
                    {quiz.questions.length} questions
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
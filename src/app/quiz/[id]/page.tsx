'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Clock, BarChart2 } from 'lucide-react'
import QuizCard from '@/components/QuizCard'
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

export default function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const pathname = usePathname()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [isQuizComplete, setIsQuizComplete] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | null>>({}); // Track answers for each question
  const Questions = JSON.parse(localStorage.getItem("currentQuiz") || '{}');

  useEffect(() => {
    if (timeLeft > 0 && !isQuizComplete) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0) {
      setIsQuizComplete(true)
    }
  }, [timeLeft, isQuizComplete])
  
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quiz/${id}`);
        setQuiz(response.data);
        
        // Get initial question index from URL
        const params = new URLSearchParams(window.location.search);
        const questionIndex = parseInt(params.get('q') || '1') - 1;
        if (!isNaN(questionIndex) && questionIndex >= 0) {
          setCurrentQuestionIndex(questionIndex);
        }
      } catch (error) {
        toast.error('Failed to load quiz');
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    }
    const storedUser = localStorage.getItem('user')
    if(storedUser) {
      fetchQuiz()
    }
    else{
      setQuiz(Questions);
      // Get initial question index from URL for local quiz
      const params = new URLSearchParams(window.location.search);
      const questionIndex = parseInt(params.get('q') || '1') - 1;
      if (!isNaN(questionIndex) && questionIndex >= 0) {
        setCurrentQuestionIndex(questionIndex);
      }
      setTimeout(() => {
       setLoading(false)
     }, 2000);
    }
  }, [id, Questions])


  const handleAnswer = (answer: string) => {
    // Store the answer for the current question
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));

    // Check if the answer is correct
    if (answer === quiz?.questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    setShowExplanation(true);
    
    setTimeout(async () => {
      if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        // Update URL with question index
        router.push(`${pathname}?q=${nextIndex + 1}`);
      } else {
        // Save quiz result
        try {
          await axios.post('/api/quiz/result', {
            quizId: quiz?._id,
            score,
            totalQuestions: quiz?.questions.length
          });
          toast.success('Quiz completed!');
          router.push('/progress');
        } catch (error) {
          toast.error('Failed to save quiz result');
          console.error('Error saving quiz result:', error);
        }
        setIsQuizComplete(true);
      }
    }, 1000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nova-purple mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return null
  }

  if (isQuizComplete) {
    return (
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-8 gradient-text">Quiz Complete!</h1>
          <div className="card mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <BarChart2 className="w-8 h-8 text-nova-purple" />
              <span className="text-2xl font-semibold">
                Score: {score}/{quiz.questions.length}
              </span>
            </div>
            <p className="text-cool-white/70">
              {score === quiz.questions.length
                ? 'Perfect score! 🎉'
                : score >= quiz.questions.length / 2
                ? 'Good job! Keep practicing!'
                : 'Keep studying and try again!'}
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/quiz')}
              className="btn-primary"
            >
              Try Another Quiz
            </button>
            <button
              onClick={() => router.push('/progress')}
              className="btn-secondary"
            >
              View Progress
            </button>
          </div>
        </div>
      </main>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 gradient-text">{quiz.title}</h1>
        <p className="text-cool-white/70">{quiz.description}</p>
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-nova-purple" />
            <span className="text-sm text-cool-white/70">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-4 h-4 text-ai-blue" />
            <span className="text-sm text-cool-white/70 capitalize">
              {quiz.difficulty}
            </span>
          </div>
        </div>
      </div>

      <QuizCard
        question={currentQuestion.question}
        options={currentQuestion.options}
        correctAnswer={currentQuestion.correctAnswer}
        explanation={currentQuestion.explanation}
        onAnswer={handleAnswer}
        showExplanation={showExplanation}
        selectedAnswer={selectedAnswers[currentQuestionIndex] || null}
      />
      
      <div className="flex justify-between mt-8">
        <button
          onClick={() => {
            if (currentQuestionIndex > 0) {
              const prevIndex = currentQuestionIndex - 1;
              setCurrentQuestionIndex(prevIndex);
              setShowExplanation(false);
              // Update URL with question index
              router.push(`${pathname}?q=${prevIndex + 1}`);
            }
          }}
          className={`btn-secondary ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentQuestionIndex === 0}
        >
          Previous Question
        </button>
        
        <button
          onClick={() => {
            if (currentQuestionIndex < quiz.questions.length - 1) {
              const nextIndex = currentQuestionIndex + 1;
              setCurrentQuestionIndex(nextIndex);
              setShowExplanation(false);
              // Update URL with question index
              router.push(`${pathname}?q=${nextIndex + 1}`);
            }
          }}
          className={`btn-primary ${currentQuestionIndex === quiz.questions.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentQuestionIndex === quiz.questions.length - 1}
        >
          Next Question
        </button>
      </div>
    </div>
  )
} 
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useAppStore } from '@/lib/store.zustand';
import { toast } from 'react-hot-toast';
import QuizCard from '@/components/QuizCard';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface Quiz {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  difficulty: string;
  questions: Question[];
}

interface QuizContentProps {
  quizId: string;
}

export default function QuizContent({ quizId }: QuizContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, currentQuiz, addQuizResult, setCurrentQuiz } = useAppStore();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(undefined);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);

  // Effect to handle initial question from URL
  useEffect(() => {
    const questionParam = searchParams.get('question');
    if (questionParam) {
      const questionIndex = parseInt(questionParam) - 1;
      if (!isNaN(questionIndex) && questionIndex >= 0 && quiz?.questions && questionIndex < quiz.questions.length) {
        setCurrentQuestion(questionIndex);
        setSelectedAnswer(answers[questionIndex] || undefined);
      }
    }
  }, [searchParams, answers, quiz?.questions]);

  // Effect to fetch quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (currentQuiz && (currentQuiz.id === quizId)) {
          setQuiz(currentQuiz);
          setCurrentQuiz(currentQuiz);
          setLoading(false);
          return;
        }

        const response = await axios.get(`/api/quizzes/one`, {
          params: {
            id: quizId
          }
        });
        const fetchedQuiz = response.data;
        setQuiz(fetchedQuiz);
        setCurrentQuiz(fetchedQuiz);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        toast.error('Failed to load quiz');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, currentQuiz]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      const nextQuestion = currentQuestion + 1;
      router.push(`/quiz/${quizId}?question=${nextQuestion + 1}`, { scroll: false });
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(answers[nextQuestion] || undefined);
    } else {
      // Calculate score and save result
      const score = answers.reduce((acc, answer, index) => {
        return acc + (answer === quiz?.questions[index].correctAnswer ? 1 : 0);
      }, 0);

      if (quiz && user) {
        addQuizResult({
          quizId: quiz.id || quiz._id || '',
          score,
          totalQuestions: quiz.questions.length,
          completedAt: new Date().toISOString(),
        });
      }

      setShowReview(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      router.push(`/quiz/${quizId}?question=${prevQuestion + 1}`, { scroll: false });
      setCurrentQuestion(prevQuestion);
      setSelectedAnswer(answers[prevQuestion] || undefined);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-transparent border-[#8B5CF6] rounded-full animate-spin" />
          <p className="text-cool-white/70">
            Loading quiz...
          </p>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.questions) return <div>Quiz not found</div>;

  if (showReview) {
    const score = answers.reduce((acc, answer, index) => {
      return acc + (answer === quiz?.questions[index].correctAnswer ? 1 : 0);
    }, 0);
    const totalQuestions = quiz?.questions.length || 0;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Save the result with the same calculation method
    if (quiz && user) {
      addQuizResult({
        quizId: quiz.id || quiz._id || '',
        score,
        totalQuestions,
        completedAt: new Date().toISOString(),
      });
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Quiz Review</h1>
        <div className="mb-8 p-6 bg-midnight-gray rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-cool-white">Your Score</h2>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-quantum-teal">{percentage}%</div>
            <div className="text-cool-white/70">
              {score} out of {totalQuestions} correct
            </div>
          </div>
        </div>
        <div className="space-y-8">
          {quiz.questions.map((question, index) => (
            <QuizCard
              key={index}
              question={question.question}
              options={question.options}
              correctAnswer={question.correctAnswer}
              explanation={question.explanation}
              onAnswer={() => {}} // No-op since we're in review mode
              selectedAnswer={answers[index]}
              showExplanation={true}
            />
          ))}
        </div>
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setShowReview(false)}
            className="btn-secondary"
          >
            Back to Quiz
          </button>
          <button
            onClick={() => router.push('/quiz')}
            className="btn-primary"
          >
            Return to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = quiz.questions[currentQuestion];
  if (!currentQuestionData) return <div>Question not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 gradient-text">{quiz.title}</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4 text-cool-white">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </h2>
        </div>
        <QuizCard
          question={currentQuestionData.question}
          options={currentQuestionData.options}
          correctAnswer={currentQuestionData.correctAnswer}
          explanation={currentQuestionData.explanation}
          onAnswer={handleAnswer}
          selectedAnswer={selectedAnswer}
          showExplanation={false}
        />
        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="btn-secondary"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="btn-primary"
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
} 
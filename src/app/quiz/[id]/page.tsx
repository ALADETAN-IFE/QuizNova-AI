"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, X } from 'lucide-react';
import axios from 'axios';
import { useAppStore } from '@/lib/store.zustand';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  questions: Question[];
}

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, currentQuiz, setCurrentQuiz, addQuizResult } = useAppStore();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(undefined);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizId = searchParams.get('id');
        if (!quizId) {
          router.push('/quiz');
          return;
        }

        const response = await axios.get(`/api/quizzes/${quizId}`);
        const fetchedQuiz = response.data;
        setCurrentQuiz(fetchedQuiz);
        setQuiz(fetchedQuiz);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [searchParams, setCurrentQuiz, router]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestion + 1] || undefined);
    } else {
      // Calculate score and save result
      const score = answers.reduce((acc, answer, index) => {
        return acc + (answer === quiz?.questions[index].correctAnswer ? 1 : 0);
      }, 0);

      if (quiz && user) {
        addQuizResult({
          quizId: quiz.id,
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
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || undefined);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!quiz) return <div>Quiz not found</div>;

  if (showReview) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Quiz Review</h1>
        <div className="space-y-8">
          {quiz.questions.map((question, index) => (
            <div key={index} className="card p-6">
              <h3 className="text-xl font-semibold mb-4 text-cool-white">
                Question {index + 1}: {question.question}
              </h3>
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-3 rounded-lg ${
                      option === question.correctAnswer
                        ? 'bg-quantum-teal/20 border border-quantum-teal'
                        : option === answers[index]
                        ? 'bg-starburst-orange/20 border border-starburst-orange'
                        : 'bg-cool-black/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-cool-white">{option}</span>
                      {option === question.correctAnswer ? (
                        <Check className="w-5 h-5 text-quantum-teal" />
                      ) : option === answers[index] ? (
                        <X className="w-5 h-5 text-starburst-orange" />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-ai-blue/10 rounded-lg">
                <p className="text-ai-blue">
                  <strong>Explanation:</strong> {question.explanation}
                </p>
              </div>
            </div>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 gradient-text">{quiz.title}</h1>
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4 text-cool-white">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </h2>
          <p className="text-cool-white/70 mb-6">
            {quiz.questions[currentQuestion].question}
          </p>
          <div className="space-y-3">
            {quiz.questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`w-full p-4 text-left rounded-lg transition-colors ${
                  selectedAnswer === option
                    ? 'bg-ai-blue/20 border border-ai-blue'
                    : 'bg-cool-black/50 hover:bg-cool-black/70'
                }`}
              >
                <span className="text-cool-white">{option}</span>
              </button>
            ))}
          </div>
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
    </div>
  );
}
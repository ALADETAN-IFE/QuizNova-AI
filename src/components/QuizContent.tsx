"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// import axios from 'axios';
import { useAppStore } from '@/lib/store.zustand';
import { toast } from 'react-hot-toast';
import QuizCard from '@/components/QuizCard';
import { evaluateAnswer } from '@/lib/gemini';
// import axios from 'axios';

interface Question {
  question: string;
  options?: string[];
  correctAnswer: string;
  selectedAnswer?: string
  explanation: string;
  questionType?: 'obj' | 'subjective' | 'theory';
  isCorrect?: boolean;
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
  onComplete: (score: number) => void;
}

export default function QuizContent({ quizId, onComplete }: QuizContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, currentQuiz, setCurrentQuiz } = useAppStore();
  // const { user, currentQuiz, addQuizResult, setCurrentQuiz } = useAppStore();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [evaluation, setEvaluation] = useState<{ score: number; feedback: string } | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);

  // Effect to handle initial question from URL
  useEffect(() => {
    const questionParam = searchParams.get('question');
    if (questionParam) {
      const questionIndex = parseInt(questionParam) - 1;
      if (!isNaN(questionIndex) && questionIndex >= 0 && quiz?.questions && questionIndex < quiz.questions.length) {
        setCurrentQuestionIndex(questionIndex);
      }
    }
  }, [searchParams, quiz?.questions]);

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
        if (user?.id) {
          // const response = await axios.get(`/api/quizzes/one`, {
          //   params: {
          //     id: quizId
          //   }
          // });
          // // const 
          // const fetchedQuiz = response.data;
          // setQuiz(fetchedQuiz);
          // setCurrentQuiz(fetchedQuiz);
          // setLoading(false);
          if (currentQuiz && (currentQuiz?._id === quizId)) {
            setQuiz(currentQuiz);
            setCurrentQuiz(currentQuiz);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        toast.error('Failed to load quiz');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, currentQuiz]);

  const currentQuestion = quiz?.questions[currentQuestionIndex];

  const handleAnswer = async (answer: string) => {
    if (!currentQuestion) return;

    if (currentQuestion.questionType === 'obj' || currentQuestion.questionType === 'subjective' || !currentQuestion.questionType) {
      setSelectedAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[currentQuestionIndex] = answer;
        return newAnswers;
      });
      // setSelectedAnswers(prev => 
      //   prev.map((q, index) =>
      //     index === currentQuestionIndex ? { ...q, answer } : q
      //   )
      // );
      // Add 1.5-second delay before moving to next question
      setTimeout(() => {
        handleNext();
      }, 1500);
    } else if (currentQuestion.questionType === 'theory') {
      try {
        const result = await evaluateAnswer(
          currentQuestion.question,
          answer,
          currentQuestion.correctAnswer,
          'theory'
        );
        setEvaluation(result);
        setSelectedAnswers(prev => {
          const newAnswers = [...prev];
          newAnswers[currentQuestionIndex] = answer;
          return newAnswers;
        });
        handleNext();
      } catch (error) {
        console.error('Error evaluating answer:', error);
        toast.error('Failed to evaluate answer. Please try again.');
      }
    }
  };

  const handleUserAnswerChange = (answer: string) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newUserAnswers);
  };

  const handleNext = () => {
    if (!quiz?.questions) return;

    // Only evaluate if it's a theory question and has an answer
    if (currentQuestion?.questionType === 'theory' && userAnswers[currentQuestionIndex]) {
      handleAnswer(userAnswers[currentQuestionIndex]);
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);

      // Update URL with new question number
      const params = new URLSearchParams(window.location.search);
      params.set('question', (nextIndex + 1).toString());
      router.push(`${window.location.pathname}?${params.toString()}`);
    } else {
      // At the last question, just show review without calling onComplete
      setShowReview(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);

      // Update URL with new question number
      const params = new URLSearchParams(window.location.search);
      params.set('question', (prevIndex + 1).toString());
      router.push(`${window.location.pathname}?${params.toString()}`);
    }
  };

  const calculateScore = (answers: string[], questions: Question[]): number => {
    let correctCount = 0;
    const totalQuestions = questions.length;

    questions.forEach((question, index) => {
      const answer = answers[index];
      // Skip scoring if no answer was provided
      if (!answer) return;

      if (question.questionType === 'obj' || question.questionType === 'subjective' || !question.questionType) {
        if (answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
          correctCount++;
        }
      } else if (question.questionType === 'theory') {
        // For theory questions, use the AI evaluation score
        const evaluationScore = evaluation?.score || 0;
        correctCount += evaluationScore / 100;
      }
    });

    // Return raw score (correct answers / total questions) without multiplying by 100
    return correctCount / totalQuestions;
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
    const score = calculateScore(selectedAnswers, quiz.questions);
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round(score * 100);

    const handleBackToQuizzes = () => {
      // Call onComplete and save result before navigating
      onComplete(score);
      // if (quiz && user) {
      //   // const response = axios.post("api/results")
      //   addQuizResult({
      //     quizId: quiz.id || quiz._id || '',
      //     score,
      //     totalQuestions,
      //     completedAt: new Date().toISOString(),
      //   });
      // }
      // router.push('/quiz');
    };

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Quiz Review</h1>
        <div className="mb-8 p-6 bg-midnight-gray rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-cool-white">Your Score</h2>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-quantum-teal">{percentage}%</div>
            <div className="text-cool-white/70">
              {Math.round(score * totalQuestions)} out of {totalQuestions} correct
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
              onAnswer={() => { }}
              selectedAnswer={selectedAnswers[index]}
              showExplanation={true}
              questionType={question.questionType || 'obj'}
              userAnswer={userAnswers[index]}
              onUserAnswerChange={() => { }}
            />
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleBackToQuizzes}
            className="btn-primary"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <div>Question not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 gradient-text">{quiz.title}</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4 text-cool-white">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
            <span className="ml-2 text-sm font-normal text-quantum-teal">
              ({currentQuestion?.questionType?.toUpperCase() || 'OBJ'})
            </span>
          </h2>
        </div>
        <div className="space-y-8">
          <QuizCard
            question={currentQuestion.question}
            options={currentQuestion.options}
            correctAnswer={currentQuestion.correctAnswer}
            explanation={currentQuestion.explanation}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswers[currentQuestionIndex]}
            showExplanation={false}
            questionType={currentQuestion.questionType || 'obj'}
            userAnswer={userAnswers[currentQuestionIndex]}
            onUserAnswerChange={handleUserAnswerChange}
          />

          {/* {evaluation && (
            <div className="mt-4 p-4 rounded-lg bg-deep-space border border-cool-white/10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-cool-white">Evaluation</h4>
              </div>
              <p className="text-cool-white/90">{evaluation.feedback}</p>
            </div>
          )} */}

          <div className="mt-8 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="btn-secondary"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="btn-primary"
            >
              {currentQuestionIndex === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import QuizCard from "@/components/QuizCard";

interface Question {
  // Use index as unique key when _id is missing
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
  difficulty: string;
  timeLimit: number;
}

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storedQuiz = localStorage.getItem("currentQuiz");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  // Use index to track current question (starting at 0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  // Use index string as key for user answers
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showExplanations, setShowExplanations] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // Update URL when current question changes
  useEffect(() => {
    if (quiz) {
      const urlParams = new URLSearchParams(window.location.search);
      const currentUrlQuestion = parseInt(urlParams.get("question") || "1");
      if (currentUrlQuestion !== currentQuestionIndex + 1) {
        router.push(`/quiz/${quiz._id}?question=${currentQuestionIndex + 1}`);
      }
    }
  }, [currentQuestionIndex, quiz, router]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quizzes/${params.id}`);
        setQuiz(response.data);
        // Get question number from URL query (default to 1)
        const urlParams = new URLSearchParams(window.location.search);
        const questionNum = parseInt(urlParams.get("question") || "1");
        const index = Math.min(Math.max(1, questionNum), response.data.questions.length) - 1;
        setCurrentQuestionIndex(index);
      } catch (error) {
        console.log("Failed to load quiz", error);
        toast.error("Failed to load quiz");
        router.push("/quiz");
      } finally {
        setLoading(false);
      }
    };

    if (!storedQuiz) {
      fetchQuiz();
    } else {
      const parsedQuiz = JSON.parse(storedQuiz);
      setQuiz(parsedQuiz);
      const urlParams = new URLSearchParams(window.location.search);
      const questionNum = parseInt(urlParams.get("question") || "1");
      const index = Math.min(Math.max(1, questionNum), parsedQuiz.questions.length) - 1;
      setCurrentQuestionIndex(index);
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    if (!quiz || isComplete) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [quiz, isComplete]);

  const handleAnswer = (answer: string) => {
    if (!quiz || transitioning) return;

    // Save the answer using the current index as key
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
    setShowExplanations(true);
    setTransitioning(true);

    // Wait 5 seconds before moving to the next question
    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setIsComplete(true);
      }
      setShowExplanations(false);
      setTransitioning(false);
    }, 5000);
  };

  const navigateQuestion = (direction: "prev" | "next") => {
    if (!quiz || transitioning) return;
    if (direction === "prev" && currentQuestionIndex > 0) {
      setShowExplanations(true);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (direction === "next" && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    return quiz.questions.reduce((score, question, idx) => {
      return score + (userAnswers[idx] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nova-purple mx-auto"></div>
        <div className="p-8">Loading...</div>
      </div>
    );
  }

  if (!quiz) {
    return <div className="p-8">Quiz not found</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-cool-white">{quiz.title}</h1>
        <p className="text-cool-white/70">{quiz.description}</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm text-cool-white/70">
            Difficulty: {quiz.difficulty}
          </span>
          <span className="text-sm text-cool-white/70">
            Time: {Math.floor(timer / 60)}:
            {(timer % 60).toString().padStart(2, "0")}
          </span>
        </div>
      </div>
      {isComplete ? (
        <div className="bg-midnight-gray rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-cool-white">Quiz Complete!</h2>
          <p className="text-xl mb-4 text-cool-white">
            Your score: {calculateScore()} / {quiz.questions.length}
          </p>
          <button
            onClick={() => router.push("/quiz")}
            className="bg-nova-purple text-cool-white px-4 py-2 rounded-lg hover:bg-nova-purple/80 transition-colors"
          >
            Back to Quizzes
          </button>
        </div>
      ) : currentQuestion ? (
        <div className="space-y-6">
          <QuizCard
            question={currentQuestion.question}
            options={currentQuestion.options}
            correctAnswer={currentQuestion.correctAnswer}
            explanation={currentQuestion.explanation}
            onAnswer={handleAnswer}
            selectedAnswer={userAnswers[currentQuestionIndex]}
            showExplanation={showExplanations}
          />
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => navigateQuestion("prev")}
              disabled={currentQuestionIndex === 0 || transitioning}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentQuestionIndex === 0 || transitioning
                  ? "bg-midnight-gray text-cool-white/50 cursor-not-allowed"
                  : "bg-nova-purple text-cool-white hover:bg-nova-purple/80"
              }`}
            >
              Previous
            </button>
            <span className="text-cool-white">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <button
              onClick={() => navigateQuestion("next")}
              disabled={
                currentQuestionIndex === quiz.questions.length - 1 || transitioning
              }
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentQuestionIndex === quiz.questions.length - 1 || transitioning
                  ? "bg-midnight-gray text-cool-white/50 cursor-not-allowed"
                  : "bg-nova-purple text-cool-white hover:bg-nova-purple/80"
              }`}
            >
              Next
            </button>
          </div>
          {transitioning && (
            <div className="text-center text-cool-white/70">
              Moving to next question in {Math.ceil((5000 - (Date.now() % 5000)) / 1000)}s...
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">No question available.</p>
      )}
    </div>
  );
}
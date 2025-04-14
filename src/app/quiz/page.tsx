'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAppStore } from "@/lib/store.zustand";
import Quiz from '@/models/Quiz';

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}

export default function QuizPage() {
  const router = useRouter();
  const { user, currentQuiz } = useAppStore();
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [loading, setLoading] = useState(true);
  // const [quiz, setQuiz] = useState<Quiz | null>(null);

  // useEffect(() => {
  //   const loadQuiz = async () => {
  //     try {
  //       if (currentQuiz) {
  //         setQuiz(currentQuiz);
  //       } else {
  //         const response = await axios.get('/api/quizzes');
  //         if (response.data && response.data.length > 0) {
  //           setQuiz(response.data[0]);
  //           console.log("quiz", quiz)
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error loading quiz:', error);
  //       toast.error('Failed to load quiz');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadQuiz();
  // }, [currentQuiz]);

  // Fetch quizzes based on user status
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        if (user?.id) {
          // For logged-in users, fetch from API
          const response = await axios.get(`/api/quizzes/${user.id}`);
          const fetchedQuizzes = response.data;
          setAllQuizzes(fetchedQuizzes);
          setFilteredQuizzes(fetchedQuizzes);

          setTimeout(() => {
            setLoading(false);
          }, 1500);
        } else if (currentQuiz) {
          // For non-logged-in users with a generated quiz
          setAllQuizzes([currentQuiz]);
          setFilteredQuizzes([currentQuiz]);

          setTimeout(() => {
            setLoading(false);
          }, 2500);
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        toast.error('Failed to load quizzes');
        setTimeout(() => {
          setLoading(false);
        }, 2500);
      } 
      // finally {
      //   setTimeout(() => {
      //     setLoading(false);
      //   }, 2500);
      // }
    };

    fetchQuizzes();
  }, [user, currentQuiz]);

  // Filter quizzes when difficulty changes
  useEffect(() => {
    if (selectedDifficulty === 'all') {
      setFilteredQuizzes(allQuizzes);
    } else {
      const filtered = allQuizzes.filter(
        (quiz) => quiz.difficulty === selectedDifficulty
      );
      setFilteredQuizzes(filtered);
    }
  }, [selectedDifficulty, allQuizzes]);

    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-t-transparent border-[#8B5CF6] rounded-full animate-spin" />
          </div>
        </div>
      );
    }

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

      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-cool-white/70">No quizzes available for the selected difficulty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz: Quiz) => (
            <div
              key={quiz.id}
              className="card hover:scale-105 transition-transform cursor-pointer"
              onClick={() => router.push(`/quiz/${quiz.id}?question=1`)}
            >
              <h3 className="text-xl font-semibold mb-2 text-cool-white">{quiz.title}</h3>
              <p className="text-cool-white/70 mb-4">{quiz.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span
                  className={`px-3 py-1 rounded-full ${
                    quiz.difficulty === 'easy'
                      ? 'bg-quantum-teal/20 text-quantum-teal'
                      : quiz.difficulty === 'medium'
                      ? 'bg-ai-blue/20 text-ai-blue'
                      : 'bg-starburst-orange/20 text-starburst-orange'
                  }`}
                >
                  {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
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
  );
}
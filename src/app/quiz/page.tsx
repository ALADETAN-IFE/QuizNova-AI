'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, MoreVertical } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAppStore } from "@/lib/store.zustand";

interface Quiz {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    questionType?: string;
  }[];
}

interface ErrorInterFace {
  error: string;
  msg?: string;
}

const truncateTitle = (title: string) => {
  // Remove file hash from title (everything after the last underscore)
  const cleanTitle = title.split('_')[0];
  // If the title is still too long, truncate it
  return cleanTitle.length > 30 ? cleanTitle.substring(0, 30) + '...' : cleanTitle;
};

const truncateDescription = (description: string) => {
  return description.length > 60 ? description.substring(0, 60) + '...' : description;
};

export default function QuizPage() {
  const router = useRouter();
  const { user, currentQuiz, setCurrentQuiz } = useAppStore();
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        if (user?.id) {
          const userId = user?.id;
          // For logged-in users, fetch from API
          const response = await axios.get(`/api/quizzes?userId=${userId}`);
          const fetchedQuizzes = response.data;
          setAllQuizzes(fetchedQuizzes);
          setFilteredQuizzes(fetchedQuizzes);
          setTimeout(() => {
            setLoading(false);
          }, 1200);
        } else if (currentQuiz) {
          // For non-logged-in users with a generated quiz
          setAllQuizzes([currentQuiz]);
          setFilteredQuizzes([currentQuiz]);
           setTimeout(() => {
            setLoading(false);
          }, 1200);
        }
      } catch (error: unknown) {
        console.error('Error fetching quizzes:', error);
        toast.error((error as ErrorInterFace).error || 'Failed to load quizzes');

        // toast.error(error?.error || 'Failed to load quizzes');
        // if(!currentQuiz || !user?.id){
        //   toast.success('No to load quizzes');
        // }Failed to load quizzes';
        setTimeout(() => {
            if(currentQuiz || user?.id){
              toast.error((error as ErrorInterFace).error);
            }
            setLoading(false);
          }, 1200);
      } 
      // finally {
      //   setTimeout(() => {
      //     setLoading(false);
      //     if(!currentQuiz || !user?.id){
      //       toast.success('No quizzes available to load');
      //     }
      //   }, 1500);
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

  const handleQuizClick = (quiz: Quiz) => {
    const quizId = quiz._id || quiz.id;
    if (!quizId) {
      toast.error('Invalid quiz ID');
      return;
    }
    if(user?.id){
      const quizToShow = filteredQuizzes.filter(e=> e._id === quizId)
      if (quizToShow[0] && quizToShow[0]._id) {
        setCurrentQuiz({...quizToShow[0], id: quizToShow[0]._id})
        router.push(`/quiz/${quizId}?question=1`);
      }
    }
    router.push(`/quiz/${quizId}?question=1`);
  };

  const handleDeleteQuiz = async (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent quiz card click
    try {
      await axios.delete(`/api/quizzes/${quizId}`);
      toast.success('Quiz deleted successfully');
      // Refresh quizzes
      const response = await axios.get(`/api/quizzes?userId=${user?.id}`);
      setAllQuizzes(response.data);
      setFilteredQuizzes(response.data);
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error('Failed to delete quiz');
    }
    setActiveMenu(null);
  };

  const toggleMenu = (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent quiz card click
    setActiveMenu(activeMenu === quizId ? null : quizId);
  };

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
              key={quiz?._id || quiz?.id}
              className="card hover:scale-105 transition-transform cursor-pointer flex flex-col justify-between relative"
              onClick={() => handleQuizClick(quiz)}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold mb-2 text-cool-white" title={quiz.title}>
                  {truncateTitle(quiz.title)}
                </h3>
                {user?.id && (
                  <div className="relative">
                    <button
                      onClick={(e) => toggleMenu(quiz._id || quiz.id || '', e)}
                      className="p-1 hover:bg-cool-black/30 rounded-full transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-cool-white/70" />
                    </button>
                    {activeMenu === (quiz._id || quiz.id) && (
                      <div className="absolute right-0 mt-2 w-48 bg-midnight-gray rounded-lg shadow-lg z-10">
                        <button
                          onClick={(e) => handleDeleteQuiz(quiz._id || quiz.id || '', e)}
                          className="w-full text-left px-4 py-2 text-starburst-orange hover:bg-cool-black/30 rounded-lg transition-colors"
                        >
                          Delete Quiz
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-cool-white/70 mb-4" title={quiz.description}>
                {truncateDescription(quiz.description)}
              </p>
              <div className="flex flex-wrap items-center gap-2 justify-between">
                <span
                  className={`px-3 py-1 rounded-full ${quiz.difficulty === 'easy'
                      ? 'bg-green-500/20 text-green-500'
                      : quiz.difficulty === 'medium'
                        ? 'bg-blue-500/20 text-blue-500'
                        : 'bg-starburst-orange/20 text-starburst-orange'
                    }`}
                >
                  {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                </span>
                <span className="flex items-center gap-1 text-cool-white/50">
                  <Clock className="w-4 h-4" />
                  {quiz.questions.length}&nbsp;questions
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  quiz.questions[0]?.questionType === 'obj' 
                    ? 'text-quantum-teal'
                    : quiz.questions[0]?.questionType === 'subjective'
                    ? 'text-ai-blue'
                    : 'text-nova-purple'
                }`}>
                  {quiz.questions[0]?.questionType?.toUpperCase() || 'OBJ'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
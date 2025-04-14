import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  // add any other fields as needed
}

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

interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

interface AppState {
  user: User | null;
  currentQuiz: Quiz | null;
  quizResults: QuizResult[];

  setUser: (user: User | null) => void;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  addQuizResult: (result: QuizResult) => void;
  clearCurrentQuiz: () => void;
  clearQuizResults: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        currentQuiz: null,
        quizResults: [],

        setUser: (user) => set({ user }),
        setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
        addQuizResult: (result) => set((state) => ({ 
          quizResults: [...state.quizResults, result] 
        })),
        clearCurrentQuiz: () => set({ currentQuiz: null }),
        clearQuizResults: () => set({ quizResults: [] }),
        logout: () => set({ user: null, currentQuiz: null, quizResults: [] }),
      }),
      {
        name: 'quizNova-storage',
      }
    ),
    {
      enabled: process.env.NODE_ENV !== 'production',
    }
  )
);

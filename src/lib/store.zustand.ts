import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  plan: 'basic' | 'premium';
  image?: string;
  googleId?: string;
}

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
    selectedAnswer?: string;
    isCorrect?: boolean;
    explanation: string;
  }[];
}

interface Question {
  question: string;
  correctAnswer: string;
  selectedAnswer: string;
  questionType?: 'obj' | 'subjective' | 'theory';
  isCorrect: boolean;
}

interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  answers: Question[]
}

interface AppState {
  version: number;
  user: User | null;
  currentQuiz: Quiz | null;
  quizResults: QuizResult[];
  hasSynced: boolean;

  setUser: (user: User | null) => void;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  // addQuizResult: (result: QuizResult) => void;
  addQuizResult: (results: QuizResult[]) => void;
  setHasSynced:(hasSynced :boolean) => void
  clearCurrentQuiz: () => void;
  clearQuizResults: () => void;
  logout: () => void;
}

type PersistedState = Partial<Omit<AppState, 'version'>> & { version?: number };

// Migration function to handle state versions
const migrations = {
  0: (state: PersistedState): AppState => ({
    version: 1,
    user: null,
    currentQuiz: null,
    quizResults: [],
    hasSynced: false,
    ...state,
    setUser: () => {},
    setCurrentQuiz: () => {},
    addQuizResult: () => {},
    setHasSynced:() => false,
    clearCurrentQuiz: () => {},
    clearQuizResults: () => {},
    logout: () => {},
  }),
  1: (state: PersistedState): AppState => state as AppState, // Current version, no migration needed
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        version: 1, // Current version of the store
        user: null,
        currentQuiz: null,
        quizResults: [],
        hasSynced: false,

        setUser: (user) => set({ user }),
        setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
        addQuizResult: (results) => set({ 
          quizResults: results 
        }),
        //  addQuizResult: (result) => set((state) => ({ 
        //   quizResults: result 
        //   // quizResults: [...state.quizResults, result] 
        // })),
        setHasSynced:(hasSynced) => set({ hasSynced }),
        clearCurrentQuiz: () => set({ currentQuiz: null }),
        clearQuizResults: () => set({ quizResults: [] }),
        logout: () => set({ user: null, currentQuiz: null, quizResults: [], hasSynced: false, }),
      }),
      {
        name: 'quizNova-storage',
        version: 1, // Storage version
        migrate: (persistedState: unknown, version: number) => {
          const state = persistedState as PersistedState;
          if (version === 0) {
            return migrations[0](state);
          }
          return migrations[1](state);
        },
      }
    ),
    {
      enabled: process.env.NODE_ENV !== 'production',
    }
  )
);

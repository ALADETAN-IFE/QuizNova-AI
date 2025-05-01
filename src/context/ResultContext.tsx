 'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useAppStore } from "@/lib/store.zustand";

interface Question {
  question: string;
  correctAnswer: string;
  questionType?: 'obj' | 'subjective' | 'theory';
}

interface Quiz {
  id?: string;
  _id?: string;
  questions: Question[];
  }
interface QuizResult {
  quiz: string;
  score: string | number;
  totalQuestions: string | number;
  createdAt: string;
  }
  
  interface ResultContextType {
    loading: boolean;
  quizResults: Array<{
    quizId: string;
    score: number;
    totalQuestions: number;
    completedAt: string;
    quiz?: Quiz;
  }>;
  saveQuizResult: (quiz: Quiz, score: number) => Promise<void>;
  }
  
  const ResultContext = createContext<ResultContextType | undefined>(undefined);
  
  export function ResultProvider({ children }: { children: ReactNode }) {
  const { user, quizResults, addQuizResult } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);

  const saveQuizResult = async (quiz: Quiz, score: number) => {
    setLoading(true);
    try {
      const quizResult = {
        quizId: quiz.id || quiz._id || '',
        score,
        totalQuestions: quiz.questions.length,
        completedAt: new Date().toISOString(),
      }

      // Always add to local storage
      addQuizResult([...quizResults, quizResult])

      // If user is logged in, save to database
      if (user?.id) {
        await axios.post('/api/results', {
          quiz: quiz.id || quiz._id,
          user: user.id,
          score,
          totalQuestions: quiz.questions.length,
          answers: quiz.questions.map((q: Question) => ({
            question: q.question,
            selectedAnswer: q.correctAnswer,
            correctAnswer: q.correctAnswer,
            questionType: q.questionType || 'obj',
            isCorrect: true, // You might want to calculate this based on actual answers
          })),
        })
        toast.success('Quiz result saved successfully!')
        
        // Mark as not synced
        setHasSynced(false);
        // Trigger a sync to ensure all results are up to date
        const response = await axios.get(`/api/results?userId=${user.id}`)
        console.log('Fetched results:', response.data)
      }
    } catch (error) {
      console.error('Error saving quiz result:', error)
      toast.error('Failed to save quiz result to database')
    } finally {
      setLoading(false);
    }
  }
  
    useEffect(() => {
    // if(!user) setHasSynced(true)

        const syncLocalResults = async () => {
      // Skip if already synced or no user loggedIn
      if (!user || hasSynced) return;
      console.log("hasSynced", hasSynced)
      setLoading(true);

      // if(user && quizResults.length < 1) setHasSynced(false)

        // if(hasSynced) setHasSynced(true)
      try {
        console.log('Syncing results for user:', user.id)
              // Check if user has any results in database
              const response = await axios.get(`/api/results?userId=${user.id}`)
              const dbResults = response.data
        console.log('Database results:', dbResults)
      
              // If user has no results in database, sync local storage results
        if (dbResults.length === 0 && quizResults.length > 0) {
          console.log('Syncing local results to database')
                for (const result of quizResults) {
                  await axios.post('/api/results', {
                    quiz: result.quizId,
                    user: user.id,
                    score: result.score,
                    totalQuestions: result.totalQuestions,
                    answers: [], // We don't have detailed answers from local storage
                  })
                }
                toast.success('Quiz results synced to database!')
              }

        // If user has results in database, sync them to local storage
        if (dbResults.length > 0) {
          console.log('Syncing database results to local storage')
          addQuizResult(dbResults.map((result: QuizResult) => ({
            quizId: result.quiz,
            score: result.score,
            totalQuestions: result.totalQuestions,
            completedAt: result.createdAt || new Date().toISOString(),
          })))
          toast.success('Database results synced to local storage!')
        }

        // Mark as synced
        setHasSynced(true);
            } catch (error) {
              console.error('Error syncing quiz results:', error)
        toast.error('Failed to sync quiz results')
      } finally {
        setLoading(false);
            }
          }
      
          syncLocalResults()
  }, [user, hasSynced]); // Only depend on user ID and sync status
  
    const value = {
      loading,
    quizResults,
    saveQuizResult,
    };
  
    return <ResultContext.Provider value={value}>{children}</ResultContext.Provider>;
  }
  
  export function useResult() {
    const context = useContext(ResultContext);
    if (context === undefined) {
      throw new Error('useResult must be used within an ResultProvider');
    }
    return context;
  } 
'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { format, subDays, subMonths, subYears, isWithinInterval } from 'date-fns'
import { useAppStore } from "@/lib/store.zustand";
import { useRouter } from 'next/navigation';
import { useResult } from '@/context/ResultContext';
import LogOutButton from "@/components/auth/LogoutButton"

interface QuizId {
  _id: string;
  title: string;
  difficulty: string;
}

interface Question {
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  questionType?: 'obj' | 'subjective' | 'theory';
}

interface Quiz {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  difficulty: string;
  questions: Question[];
}

interface QuizResult {
  quizId: string | QuizId;
  score: number;
  totalQuestions: number;
  completedAt: string;
  quiz?: Quiz;
}

// Helper function to truncate long titles for display
function truncateTitle(title: string | QuizId, maxLength = 20) {
  const displayText = typeof title === 'string' ? title : title.title || title._id;
  return displayText.length > maxLength ? displayText.substring(0, maxLength) + '...' : displayText;
}

export default function ProgressPage() {
  const router = useRouter();
  const { user } = useAppStore();
  // Get quiz results and loading state from ResultContext
  const { quizResults, loading } = useResult();
  // State for time range filter (week/month/year)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  // State for topic performance data
  const [topicPerformance, setTopicPerformance] = useState<{ topic: string; correct: number; total: number }[]>([])

  const check = (result: QuizResult) => {
    console.log('Check function called');
     let quizTitle = ""
      if (result?.quizId == null || result?.quizId === undefined) {
        quizTitle = 'Unknown Quiz'
      } else {
        if (typeof result?.quizId === 'string') {
          quizTitle = result.quizId
        } else {
          quizTitle = result.quizId.title || result.quizId._id || 'Unknown Quiz'
        }
      }

      return quizTitle;
  }

  useEffect(() => {
    // // Redirect to sign in if user is not logged in
    // if (!user) {
    //   router.push('/auth/signin');
    //   return;
    // }

    // Calculate performance statistics for each topic
    // console.log('Quiz Results:', quizResults);
    const topicStats = (quizResults as QuizResult[])
      // .filter(result => result?.quizId == null) // Filter out null/undefined results
      .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
      .reduce((acc, result) => {
      // Extract topic from quiz ID (first word) and truncate if needed
        const quizTitle = check(result);

      const topic = truncateTitle(quizTitle.split(' ')[0])
      if (!acc[topic]) {
        acc[topic] = { correct: 0, total: 0 }
      }
      // Accumulate correct answers and total questions for each topic
      acc[topic].correct += result.score
      acc[topic].total += result.totalQuestions
      return acc
    }, {} as Record<string, { correct: number; total: number }>)

    // Convert topic stats to percentage format for the chart
    setTopicPerformance(
      Object.entries(topicStats).map(([topic, stats]) => ({
        topic,
        correct: Math.round((stats.correct / stats.total) * 100),
        total: 100,
      }))
    )
  }, [quizResults, user, router]);



  // Calculate overall average score from all quiz results
  const calculateAverageScore = () => {
    if (quizResults.length === 0) return 0;

    const totalScore = quizResults.reduce((sum, result) => sum + result.score / result.totalQuestions, 0);
    return Math.round((totalScore / quizResults.length) * 100);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter and format results based on selected time range
  const getFilteredResults = () => {
    const now = new Date()
    let startDate: Date

    // Set start date based on selected time range
    switch (timeRange) {
      case 'week':
        startDate = subDays(now, 7)
        break
      case 'month':
        startDate = subMonths(now, 1)
        break
      case 'year':
        startDate = subYears(now, 1)
        break
      default:
        startDate = subMonths(now, 1)
    }

    // Filter results within the time range and format for chart
    return quizResults
      .filter((result) =>
        isWithinInterval(new Date(result.completedAt), {
          start: startDate,
          end: now,
        })
      )
      .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
      .map((result) => ({
        date: format(new Date(result.completedAt), 'yyyy-MM-dd'),
        score: Math.round((result.score / result.totalQuestions) * 100),
      }))
  }

  // Show nothing if user is not logged in
  if (!user) {
    return null;
  }

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-transparent border-[#8B5CF6] rounded-full animate-spin" />
          <p className="text-cool-white/70">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with title and logout button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">Your Progress</h1>
        <LogOutButton/ >
      </div>

      {/* Summary cards showing average score and total quizzes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4 text-cool-white">Average Score</h2>
          <p className="text-4xl font-bold text-quantum-teal">{calculateAverageScore()}%</p>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4 text-cool-white">Quizzes Completed</h2>
          <p className="text-4xl font-bold text-ai-blue">{quizResults.length}</p>
        </div>
      </div>

      {/* Performance over time chart */}
      <div className="card p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-cool-white">Performance Over Time</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
            className="input-field"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getFilteredResults()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2B37" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E1F2E',
                  border: '1px solid #2A2B37',
                }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: '#8B5CF6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Topic performance chart */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6 text-cool-white">Topic Performance</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2B37" />
              <XAxis
                dataKey="topic"
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E1F2E',
                  border: '1px solid #2A2B37',
                }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Bar dataKey="correct" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent quizzes list */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4 text-cool-white">Recent Quizzes</h2>
        <div className="space-y-4">
          {(quizResults as QuizResult[]).slice(0, 5).map((result, index) => (
            <div key={index} className="card p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-cool-white" title={check(result)}>
                  {/* <h3 className="font-semibold text-cool-white" title={typeof result.quizId === 'string' ? result.quizId : result.quizId.title || result.quizId._id}> */}
                    {/* {truncateTitle(result.quizId)} - */}
                    <span
                      className={`px-3 py-1 rounded-full ${typeof result.quizId !== 'string' && result?.quizId?.difficulty === 'easy'
                        ? 'text-green-500'
                        : typeof result.quizId !== 'string' && result?.quizId?.difficulty === 'medium'
                          ? 'text-blue-500'
                          : 'text-starburst-orange'
                        }`}
                    >
                      {typeof result.quizId === 'string' ? '' : result?.quizId?.difficulty} 
                      {result.quizId == null ? 'easy' : '' }
                    </span>
                    -
                    <span className={`px-3 py-1 rounded-full text-sm ${result.quiz?.questions[0]?.questionType === 'obj'
                        ? 'text-quantum-teal'
                        : result.quiz?.questions[0]?.questionType === 'subjective'
                          ? 'text-ai-blue'
                          : 'text-nova-purple'
                      }`}>
                      {result.quiz?.questions[0]?.questionType?.toUpperCase() || 'OBJ'}
                    </span>
                  </h3>
                  <p className="text-sm text-cool-white/70">{formatDate(result.completedAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-quantum-teal">
                    {Math.round((result.score / result.totalQuestions) * 100)}%
                  </p>
                  <p className="text-sm text-cool-white/70">
                    {result.score}/{result.totalQuestions} correct
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 

// export default function ProgressPages() {
//   return <div>Progress Page</div>
// }
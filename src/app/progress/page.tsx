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
import { LogOut } from 'lucide-react';

interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export default function ProgressPage() {
  const router = useRouter();
  const { quizResults, user, logout } = useAppStore();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  const [topicPerformance, setTopicPerformance] = useState<{ topic: string; correct: number; total: number }[]>([])

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    setResults(quizResults);

    // Calculate topic performance
    const topicStats = quizResults.reduce((acc, result) => {
      const topic = result.quizId.split(' ')[0] // Use first word as topic
      if (!acc[topic]) {
        acc[topic] = { correct: 0, total: 0 }
      }
      acc[topic].correct += result.score
      acc[topic].total += result.totalQuestions
      return acc
    }, {} as Record<string, { correct: number; total: number }>)

    setTopicPerformance(
      Object.entries(topicStats).map(([topic, stats]) => ({
        topic,
        correct: Math.round((stats.correct / stats.total) * 100),
        total: 100,
      }))
    )
  }, [quizResults, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const calculateAverageScore = () => {
    if (results.length === 0) return 0;
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    return Math.round((totalScore / results.length) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredResults = () => {
    const now = new Date()
    let startDate: Date

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

    return results
      .filter((result) =>
        isWithinInterval(new Date(result.completedAt), {
          start: startDate,
          end: now,
        })
      )
      .map((result) => ({
        date: format(new Date(result.completedAt), 'yyyy-MM-dd'),
        score: Math.round((result.score / result.totalQuestions) * 100),
      }))
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">Your Progress</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-starburst-orange/20 text-starburst-orange rounded-lg hover:bg-starburst-orange/30 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4 text-cool-white">Average Score</h2>
          <p className="text-4xl font-bold text-quantum-teal">{calculateAverageScore()}%</p>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4 text-cool-white">Quizzes Completed</h2>
          <p className="text-4xl font-bold text-ai-blue">{results.length}</p>
        </div>
      </div>

      <div className="card p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-cool-white">Score Trend</h2>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
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
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4 text-cool-white">Topic Performance</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
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
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Bar dataKey="correct" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-cool-white">Recent Quizzes</h2>
        <div className="space-y-4">
          {results.slice(0, 5).map((result, index) => (
            <div key={index} className="card p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-cool-white">{result.quizId}</h3>
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
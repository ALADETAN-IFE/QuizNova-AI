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

interface QuizResult {
  title: string
  score: number
  totalQuestions: number
  timestamp: string
}

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [topicPerformance, setTopicPerformance] = useState<{ topic: string; correct: number; total: number }[]>([])

  useEffect(() => {
    // Load quiz results from localStorage
    const savedResults = JSON.parse(localStorage.getItem('quizResults') || '[]') as QuizResult[]
    setQuizResults(savedResults)

    // Calculate topic performance
    const topicStats = savedResults.reduce((acc, result) => {
      const topic = result.title.split(' ')[0] // Use first word as topic
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
  }, [])

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

    return quizResults
      .filter((result) =>
        isWithinInterval(new Date(result.timestamp), {
          start: startDate,
          end: now,
        })
      )
      .map((result) => ({
        date: format(new Date(result.timestamp), 'yyyy-MM-dd'),
        score: Math.round((result.score / result.totalQuestions) * 100),
      }))
  }

  const filteredResults = getFilteredResults()

  return (
    <main className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-8">Your Progress</h1>

      {/* Time Range Selector */}
      <div className="flex gap-4 mb-8">
        {(['week', 'month', 'year'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === range
                ? 'bg-nova-purple text-cool-white'
                : 'bg-midnight-gray text-cool-white/70 hover:bg-midnight-gray/80'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Score History Chart */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Score History</h2>
        <div className="h-[300px]">
          {filteredResults.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredResults}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D2D44" />
                <XAxis
                  dataKey="date"
                  stroke="#F5F7FA"
                  tick={{ fill: '#F5F7FA' }}
                />
                <YAxis
                  stroke="#F5F7FA"
                  tick={{ fill: '#F5F7FA' }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A2E',
                    border: '1px solid #2D2D44',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#F5F7FA' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6B48FF"
                  strokeWidth={2}
                  dot={{ fill: '#6B48FF' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-cool-white/50">
              No quiz data available for this time range
            </div>
          )}
        </div>
      </div>

      {/* Topic Performance Chart */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Topic Performance</h2>
        <div className="h-[300px]">
          {topicPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D2D44" />
                <XAxis
                  dataKey="topic"
                  stroke="#F5F7FA"
                  tick={{ fill: '#F5F7FA' }}
                />
                <YAxis
                  stroke="#F5F7FA"
                  tick={{ fill: '#F5F7FA' }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A2E',
                    border: '1px solid #2D2D44',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#F5F7FA' }}
                />
                <Bar
                  dataKey="correct"
                  fill="#4ECDC4"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-cool-white/50">
              No topic performance data available
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 
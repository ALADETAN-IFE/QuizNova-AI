'use client'

import { User, Clock, Award, BookOpen } from 'lucide-react'

// Mock user data - will be replaced with actual data from the backend
const mockUserData = {
  name: 'John Doe',
  email: 'john@example.com',
  joinedDate: '2024-01-15',
  stats: {
    quizzesTaken: 42,
    averageScore: 85,
    totalStudyTime: '32h 15m',
    topicsStudied: 8,
  },
  recentQuizzes: [
    {
      id: '1',
      title: 'Mathematics Quiz',
      date: '2024-03-09',
      score: 90,
      totalQuestions: 10,
    },
    {
      id: '2',
      title: 'Science Quiz',
      date: '2024-03-07',
      score: 85,
      totalQuestions: 15,
    },
    {
      id: '3',
      title: 'History Quiz',
      date: '2024-03-05',
      score: 75,
      totalQuestions: 12,
    },
  ],
}

export default function ProfilePage() {
  return (
    <main className="container mx-auto px-4 py-20">
      {/* User Info */}
      <div className="card mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-nova-purple/20 flex items-center justify-center">
            <User className="w-8 h-8 text-nova-purple" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{mockUserData.name}</h1>
            <p className="text-cool-white/70">{mockUserData.email}</p>
            <p className="text-sm text-cool-white/50">
              Joined {new Date(mockUserData.joinedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-midnight-gray">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-ai-blue" />
              <span className="text-sm text-cool-white/70">Quizzes Taken</span>
            </div>
            <p className="text-2xl font-bold">{mockUserData.stats.quizzesTaken}</p>
          </div>
          <div className="p-4 rounded-lg bg-midnight-gray">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-starburst-orange" />
              <span className="text-sm text-cool-white/70">Average Score</span>
            </div>
            <p className="text-2xl font-bold">{mockUserData.stats.averageScore}%</p>
          </div>
          <div className="p-4 rounded-lg bg-midnight-gray">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-quantum-teal" />
              <span className="text-sm text-cool-white/70">Study Time</span>
            </div>
            <p className="text-2xl font-bold">{mockUserData.stats.totalStudyTime}</p>
          </div>
          <div className="p-4 rounded-lg bg-midnight-gray">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-neon-pink" />
              <span className="text-sm text-cool-white/70">Topics</span>
            </div>
            <p className="text-2xl font-bold">{mockUserData.stats.topicsStudied}</p>
          </div>
        </div>
      </div>

      {/* Recent Quizzes */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Quizzes</h2>
        <div className="space-y-4">
          {mockUserData.recentQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-4 rounded-lg bg-midnight-gray flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold">{quiz.title}</h3>
                <p className="text-sm text-cool-white/50">
                  {new Date(quiz.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">
                  {quiz.score}%
                </p>
                <p className="text-sm text-cool-white/50">
                  {quiz.score}/{quiz.totalQuestions} correct
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
} 
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store.zustand'
import { LogOut, User, Mail, Trophy, Calendar } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, quizResults } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  })

  if (!user) {
    router.push('/auth/signin')
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // TODO: Implement profile update API
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const totalQuizzes = quizResults.length
  const averageScore = quizResults.length > 0
    ? Math.round(quizResults.reduce((acc, result) => 
        acc + (result.score / result.totalQuestions) * 100, 0) / quizResults.length)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">Profile</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-starburst-orange/20 text-starburst-orange rounded-lg hover:bg-starburst-orange/30 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-cool-white">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-ai-blue hover:text-ai-blue/80"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cool-white/70 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cool-white/70 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-quantum-teal" />
                  <div>
                    <p className="text-sm text-cool-white/70">Username</p>
                    <p className="text-cool-white">{user.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-ai-blue" />
                  <div>
                    <p className="text-sm text-cool-white/70">Email</p>
                    <p className="text-cool-white">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4 text-cool-white">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-quantum-teal" />
                <div>
                  <p className="text-sm text-cool-white/70">Total Quizzes</p>
                  <p className="text-2xl font-bold text-cool-white">{totalQuizzes}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-ai-blue" />
                <div>
                  <p className="text-sm text-cool-white/70">Average Score</p>
                  <p className="text-2xl font-bold text-cool-white">{averageScore}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4 text-cool-white">Quick Links</h2>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/quiz')}
                className="w-full text-left px-4 py-2 rounded-lg bg-cool-black/50 text-cool-white hover:bg-cool-black/70 transition-colors"
              >
                Take a Quiz
              </button>
              <button
                onClick={() => router.push('/progress')}
                className="w-full text-left px-4 py-2 rounded-lg bg-cool-black/50 text-cool-white hover:bg-cool-black/70 transition-colors"
              >
                View Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
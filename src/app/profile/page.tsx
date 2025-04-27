'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store.zustand'
import { LogOut, User, Mail, Trophy, Calendar } from 'lucide-react'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const truncateTitle = (title: string) => {
  // Remove file hash from title (everything after the last underscore)
  const cleanTitle = title.split('_')[0];
  // If the title is still too long, truncate it
  return cleanTitle.length > 30 ? cleanTitle.substring(0, 30) + '...' : cleanTitle;
};

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, quizResults, setUser } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(user?.username || '')
  const [isLoading, setIsLoading] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  if (!user) {
    router.push('/auth/signin')
    return null
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleLogoutConfirm = () => {
    logout()
    router.push('/')
    toast.success('Logged out successfully')
  }

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.patch(`/api/users/${user.id}`, {
        username
      })
      
      if (response.data) {
        setUser({ ...user, username: response.data.username })
        toast.success('Username updated successfully')
        setIsEditing(false)
      }
    } catch (error) {
      toast.error('Failed to update username')
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalQuizzes = quizResults.length
  const averageScore = quizResults.length > 0
    ? Math.round(quizResults.reduce((acc, result) => 
        acc + (result.score / result.totalQuestions) * 100, 0) / quizResults.length)
    : 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Profile</h1>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 px-4 py-2 bg-starburst-orange/20 text-starburst-orange rounded-lg hover:bg-starburst-orange/30 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-6 text-cool-white">Account Information</h2>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-cool-white/70 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input-field w-full"
                      placeholder="Enter your username"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-quantum-teal" />
                    <div>
                      <p className="text-sm text-cool-white/70">Username</p>
                      <p className="text-lg text-cool-white">{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-ai-blue" />
                    <div>
                      <p className="text-sm text-cool-white/70">Email</p>
                      <p className="text-lg text-cool-white">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary mt-4"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4 text-cool-white">Recent Activity</h2>
              <div className="space-y-4">
                {quizResults.slice(0, 3).map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-midnight-gray rounded-lg">
                    <div>
                      <h3 className="font-semibold text-cool-white" title={result.quizId}>
                        {truncateTitle(result.quizId)}
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
                ))}
              </div>
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

        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="card p-6 max-w-sm w-full">
              <h3 className="text-xl font-semibold mb-4 text-cool-white">Confirm Logout</h3>
              <p className="text-cool-white/70 mb-6">Are you sure you want to log out?</p>
              <div className="flex gap-2">
                <button onClick={handleLogoutConfirm} className="btn-primary">
                  Yes, Logout
                </button>
                <button onClick={handleLogoutCancel} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
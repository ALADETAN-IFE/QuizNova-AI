'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store.zustand'
import { LogOut, User, Mail, Trophy, Calendar } from 'lucide-react'
// import Image from 'next/image'
import { toast } from 'react-hot-toast'
import axios from 'axios'

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {/* <Image
            src="/quizNova.png"
            alt="QuizNova Logo"
            width={40}
            height={40}
            className="rounded-lg"
          /> */}
          <h1 className="text-3xl font-bold gradient-text">Profile</h1>
        </div>
        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-2 px-4 py-2 bg-starburst-orange/20 text-starburst-orange rounded-lg hover:bg-starburst-orange/30 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-b from-cool-black to-cool-black/95 p-8 rounded-xl shadow-2xl max-w-sm w-full mx-4 border border-cool-white/10 animate-slideUp">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-starburst-orange/10 rounded-full flex items-center justify-center mb-4">
                <LogOut className="w-6 h-6 text-starburst-orange" />
              </div>
              <h3 className="text-2xl font-bold text-cool-white mb-3">Confirm Logout</h3>
              <p className="text-cool-white/70 mb-8">Are you sure you want to sign out of your account?</p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleLogoutCancel}
                className="px-6 py-2.5 text-cool-white/80 hover:text-cool-white hover:bg-cool-white/5 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-6 py-2.5 bg-gradient-to-r from-starburst-orange to-red-500 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-starburst-orange/20"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-cool-white">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-ai-blue hover:text-ai-blue/80"
                disabled={isLoading}
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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field"
                    disabled={isLoading}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    'Save Changes'
                  )}
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
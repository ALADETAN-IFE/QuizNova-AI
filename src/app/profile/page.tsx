'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store.zustand'
import { User, Mail, Trophy, Calendar } from 'lucide-react'
// import Image from 'next/image'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useResult } from '@/context/ResultContext'
import LogOutButton from "@/components/auth/LogoutButton"

export default function ProfilePage() {
  const router = useRouter()
  const { user, setUser } = useAppStore()
  const { quizResults, loading } = useResult()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(user?.username || '')
  const [isLoading, setIsLoading] = useState(false)

  if (!user) {
    // router.push('/auth/signin')
    return null
  }

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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">Profile</h1>
        <LogOutButton/ >
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-cool-white">Personal Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-quantum-teal hover:text-quantum-teal/80"
                >
                  Edit
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-quantum-teal" />
                <div className="flex-1">
                  <p className="text-sm text-cool-white/70">Username</p>
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field flex-1"
                        placeholder="Enter new username"
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-quantum-teal/20 text-quantum-teal rounded-lg hover:bg-quantum-teal/30 transition-colors"
                      >
                        {isLoading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-ai-blue/20 text-ai-blue rounded-lg hover:bg-ai-blue/30 transition-colors"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <p className="text-lg font-semibold text-cool-white first-letter:uppercase">{user.username}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-ai-blue" />
                <div>
                  <p className="text-sm text-cool-white/70">Email</p>
                  <p className="text-lg font-semibold text-cool-white first-letter:uppercase">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
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
                className="w-full text-left px-4 py-2 rounded-lg bg-quantum-teal/10 text-quantum-teal hover:bg-quantum-teal/20 transition-colors flex items-center gap-2"
              >
                Take a Quiz
              </button>
              <button
                onClick={() => router.push('/progress')}
                className="w-full text-left px-4 py-2 rounded-lg bg-ai-blue/10 text-ai-blue hover:bg-ai-blue/20 transition-colors flex items-center gap-2"
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
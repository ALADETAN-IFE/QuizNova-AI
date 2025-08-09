'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just show a success message
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      // console.log(error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cool-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-cool-black/50 p-8 rounded-2xl border border-cool-white/10 backdrop-blur-sm">
          <h1 className="text-4xl font-bold gradient-text mb-8">Support & Contact</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-quantum-teal mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <p className="text-cool-white/80">
                    <span className="text-quantum-teal">Email:</span>{' '}
                    <a href="mailto:support@quiznova.ai" className="hover:text-quantum-teal transition-colors">
                      support@quiznova.ai
                    </a>
                  </p>
                  <p className="text-cool-white/80">
                    <span className="text-quantum-teal">Response Time:</span> Within 24-48 hours
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-quantum-teal mb-4">Common Issues</h2>
                <ul className="space-y-2 text-cool-white/80">
                  <li>• Account access problems</li>
                  <li>• Quiz creation issues</li>
                  <li>• Payment and subscription</li>
                  <li>• Technical difficulties</li>
                </ul>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-cool-white/70 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-cool-white/10 rounded-lg text-cool-white placeholder-cool-white/50 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-cool-white/70 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-cool-white/10 rounded-lg text-cool-white placeholder-cool-white/50 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-cool-white/70 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-cool-white/10 rounded-lg text-cool-white placeholder-cool-white/50 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-cool-white/70 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2 bg-white/5 border border-cool-white/10 rounded-lg text-cool-white placeholder-cool-white/50 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-quantum-teal text-cool-white rounded-lg font-medium hover:bg-quantum-teal/90 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:ring-offset-2 focus:ring-offset-cool-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 
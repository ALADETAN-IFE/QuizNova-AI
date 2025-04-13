import Link from 'next/link'
import { Upload, Brain, BarChart, Share2 } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 gradient-text">
            Transform Your Study Materials into Interactive Quizzes
          </h1>
          <p className="text-xl text-cool-white/80 mb-8 max-w-2xl mx-auto">
            Upload your PDFs, let AI generate questions, and track your progress. Study smarter, not harder.
          </p>
          <Link href="/upload" className="btn-primary text-lg">
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="section-title text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="feature-card">
            <Upload className="w-12 h-12 text-nova-purple mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-cool-white">PDF Upload</h3>
            <p className="text-cool-white/70">
              Upload your study materials and let AI generate relevant questions.
            </p>
          </div>
          <div className="feature-card">
            <Brain className="w-12 h-12 text-ai-blue mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-cool-white">AI-Powered</h3>
            <p className="text-cool-white/70">
              Powered by Gemini AI to create intelligent, context-aware questions.
            </p>
          </div>
          <div className="feature-card">
            <BarChart className="w-12 h-12 text-starburst-orange mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-cool-white">Progress Tracking</h3>
            <p className="text-cool-white/70">
              Monitor your performance and identify areas for improvement.
            </p>
          </div>
          <div className="feature-card">
            <Share2 className="w-12 h-12 text-quantum-teal mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-cool-white">Share & Export</h3>
            <p className="text-cool-white/70">
              Share your quizzes and export results in multiple formats.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="card text-center max-w-3xl mx-auto gradient-border">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Ready to Start Learning?</h2>
          <p className="text-cool-white/70 mb-8">
            Join thousands of students who are already using QuizNova AI to enhance their study experience.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/upload" className="btn-primary">
              Create Your First Quiz
            </Link>
            <Link href="/demo" className="btn-secondary">
              Try Demo
            </Link>
          </div>
        </div>
      </section>
      </main>
  )
}

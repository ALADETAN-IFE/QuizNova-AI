import Link from 'next/link';
import { Upload, Brain, BarChart, Share2 } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-deep-space via-deep-space/90 to-deep-space text-cool-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/quizNova.png"
              alt="QuizNova Logo"
              width={120}
              height={120}
              className="rounded-lg"
            />
          </div>
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
        <h2 className="section-title text-center text-4xl font-bold mb-12 gradient-text">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="feature-card p-6 rounded-lg bg-gradient-to-r from-nova-purple to-ai-blue shadow-lg hover:scale-105 transition-transform">
            <Upload className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">PDF Upload</h3>
            <p className="text-white/80">
              Upload your study materials and let AI generate relevant questions.
            </p>
          </div>
          <div className="feature-card p-6 rounded-lg bg-gradient-to-r from-ai-blue to-quantum-teal shadow-lg hover:scale-105 transition-transform">
            <Brain className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">AI-Powered</h3>
            <p className="text-white/80">
              Powered by Gemini AI to create intelligent, context-aware questions.
            </p>
          </div>
          <div className="feature-card p-6 rounded-lg bg-gradient-to-r from-starburst-orange to-nova-purple shadow-lg hover:scale-105 transition-transform">
            <BarChart className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Progress Tracking</h3>
            <p className="text-white/80">
              Monitor your performance and identify areas for improvement.
            </p>
          </div>
          <div className="feature-card p-6 rounded-lg bg-gradient-to-r from-quantum-teal to-starburst-orange shadow-lg hover:scale-105 transition-transform">
            <Share2 className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Share & Export</h3>
            <p className="text-white/80">
              Share your quizzes and export results in multiple formats.
            </p>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="section-title text-center text-4xl font-bold mb-12 gradient-text">
          Premium User Advantages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="premium-card relative p-8 rounded-xl bg-gradient-to-br from-nova-purple/10 to-ai-blue/10 border border-white/10 backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-nova-purple to-ai-blue opacity-20 rounded-xl blur"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold mb-4 text-white">Free Users</h3>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Upload PDFs up to 5 pages
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Basic quiz generation
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Limited progress tracking
                </li>
                <li className="flex items-center opacity-50">
                  <span className="mr-2">×</span> Advanced question types
                </li>
                <li className="flex items-center opacity-50">
                  <span className="mr-2">×</span> Quiz sharing
                </li>
              </ul>
            </div>
          </div>

          <div className="premium-card relative p-8 rounded-xl bg-gradient-to-br from-quantum-teal/20 to-starburst-orange/20 border border-white/10 backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-quantum-teal to-starburst-orange opacity-30 rounded-xl blur"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Registered Users</h3>
                <span className="px-3 py-1 text-sm rounded-full bg-gradient-to-r from-quantum-teal to-starburst-orange text-white">Premium</span>
              </div>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Unlimited PDF uploads
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Advanced AI-powered question generation
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Detailed progress analytics
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Multiple question types and difficulty levels
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Share quizzes with friends
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Export results and statistics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="card text-center max-w-3xl mx-auto p-12 rounded-lg bg-gradient-to-r from-nova-purple via-ai-blue to-quantum-teal shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Start Learning?</h2>
          <p className="text-white/80 mb-8">
            Join thousands of students who are already using QuizNova AI to enhance their study experience.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/upload" className="btn-primary text-lg">
              Create Your First Quiz
            </Link>
            {/* <Link href="/demo" className="btn-secondary text-lg">
              Try Demo
            </Link> */}
          </div>
        </div>
      </section>
    </main>
  );
}
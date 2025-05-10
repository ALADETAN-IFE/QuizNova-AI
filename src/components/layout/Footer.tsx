'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-cool-black border-t border-cool-white/10">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-quantum-teal font-semibold mb-4">QuizNova AI</h3>
            <p className="text-cool-white/70 text-sm">
              AI-powered quiz creation and learning platform
            </p>
          </div>
          
          {/* <div>
            <h3 className="text-quantum-teal font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-cool-white/70 hover:text-quantum-teal text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-cool-white/70 hover:text-quantum-teal text-sm transition-colors">
                  Quizzes
                </Link>
              </li>
              <li>
                <Link href="/progress" className="text-cool-white/70 hover:text-quantum-teal text-sm transition-colors">
                Progress
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-cool-white/70 hover:text-quantum-teal text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div> */}

          <div>
            <h3 className="text-quantum-teal font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/privacy-policy" className="text-cool-white/70 hover:text-quantum-teal text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-cool-white/70 hover:text-quantum-teal text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/support" className="text-cool-white/70 hover:text-quantum-teal text-sm transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-cool-white/10">
          <p className="text-center text-cool-white/50 text-sm">
            © {new Date().getFullYear()} QuizNova AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 
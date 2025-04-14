import Link from 'next/link'
import { Upload, Brain, BarChart, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
}

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-deep-space via-deep-space/90 to-deep-space opacity-90 -z-10" />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-32">
        <motion.div 
          className="text-center"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <motion.h1 
            className="text-6xl font-bold mb-8 gradient-text leading-tight"
            variants={fadeInUp}
          >
            Transform Your Study Materials<br />into Interactive Quizzes
          </motion.h1>
          <motion.p 
            className="text-2xl text-cool-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            Upload your PDFs, let AI generate questions, and track your progress.<br />
            Study smarter, not harder.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link 
              href="/upload" 
              className="btn-primary text-lg px-8 py-4 hover:scale-105 transition-transform"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-32 relative">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 gradient-text"
            variants={fadeInUp}
          >
            Key Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <motion.div 
              className="feature-card group hover:scale-105 transition-transform"
              variants={fadeInUp}
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-nova-purple to-ai-blue opacity-75 group-hover:opacity-100 transition-opacity blur" />
                <div className="relative bg-deep-space p-8 rounded-lg">
                  <Upload className="w-16 h-16 text-nova-purple mb-6" />
                  <h3 className="text-2xl font-semibold mb-4 text-cool-white">PDF Upload</h3>
                  <p className="text-cool-white/70 text-lg">
                    Upload your study materials and let AI generate relevant questions.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="feature-card group hover:scale-105 transition-transform"
              variants={fadeInUp}
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-ai-blue to-quantum-teal opacity-75 group-hover:opacity-100 transition-opacity blur" />
                <div className="relative bg-deep-space p-8 rounded-lg">
                  <Brain className="w-16 h-16 text-ai-blue mb-6" />
                  <h3 className="text-2xl font-semibold mb-4 text-cool-white">AI-Powered</h3>
                  <p className="text-cool-white/70 text-lg">
                    Powered by Gemini AI to create intelligent, context-aware questions.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="feature-card group hover:scale-105 transition-transform"
              variants={fadeInUp}
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-starburst-orange to-nova-purple opacity-75 group-hover:opacity-100 transition-opacity blur" />
                <div className="relative bg-deep-space p-8 rounded-lg">
                  <BarChart className="w-16 h-16 text-starburst-orange mb-6" />
                  <h3 className="text-2xl font-semibold mb-4 text-cool-white">Progress Tracking</h3>
                  <p className="text-cool-white/70 text-lg">
                    Monitor your performance and identify areas for improvement.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="feature-card group hover:scale-105 transition-transform"
              variants={fadeInUp}
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-quantum-teal to-starburst-orange opacity-75 group-hover:opacity-100 transition-opacity blur" />
                <div className="relative bg-deep-space p-8 rounded-lg">
                  <Share2 className="w-16 h-16 text-quantum-teal mb-6" />
                  <h3 className="text-2xl font-semibold mb-4 text-cool-white">Share & Export</h3>
                  <p className="text-cool-white/70 text-lg">
                    Share your quizzes and export results in multiple formats.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-32">
        <motion.div 
          className="card text-center max-w-4xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-nova-purple via-ai-blue to-quantum-teal opacity-75 blur-lg" />
            <div className="relative bg-deep-space p-16 rounded-2xl">
              <motion.h2 
                className="text-4xl font-bold mb-6 gradient-text"
                variants={fadeInUp}
              >
                Ready to Start Learning?
              </motion.h2>
              <motion.p 
                className="text-xl text-cool-white/70 mb-12"
                variants={fadeInUp}
              >
                Join thousands of students who are already using QuizNova AI<br />to enhance their study experience.
              </motion.p>
              <motion.div 
                className="flex gap-6 justify-center"
                variants={fadeInUp}
              >
                <Link 
                  href="/upload" 
                  className="btn-primary text-lg px-8 py-4 hover:scale-105 transition-transform"
                >
                  Create Your First Quiz
                </Link>
                <Link 
                  href="/demo" 
                  className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-transform"
                >
                  Try Demo
                </Link>
              </motion.div>
            </div>
    </div>
        </motion.div>
      </section>
    </main>
  )
}

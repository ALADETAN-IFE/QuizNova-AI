import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - QuizNova AI',
  description: 'Privacy Policy for QuizNova AI - Learn how we collect, use, and protect your data.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-cool-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-cool-black/50 p-8 rounded-2xl border border-cool-white/10 backdrop-blur-sm">
          <h1 className="text-4xl font-bold gradient-text mb-8">Privacy Policy</h1>
          
          <div className="space-y-8 text-cool-white/80">
            <section>
              <h2 className="text-2xl font-semibold text-quantum-teal mb-4">1. Information We Collect</h2>
              <p className="mb-4">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (name, email, profile picture)</li>
                <li>Quiz results and performance data</li>
                <li>User preferences and settings</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-quantum-teal mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Improve and personalize your experience</li>
                <li>Analyze usage patterns and optimize performance</li>
                <li>Communicate with you about updates and features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-quantum-teal mb-4">3. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-quantum-teal mb-4">4. Third-Party Services</h2>
              <p>We use third-party services such as Google Analytics and authentication providers. These services have their own privacy policies.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-quantum-teal mb-4">5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-quantum-teal mb-4">6. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <div className="mt-2 space-y-2">
                <p>
                  <a href="mailto:support@quiznova.ai" className="text-quantum-teal hover:text-quantum-teal/80 transition-colors">
                    support@quiznova.ai
                  </a>
                </p>
                <p>
                  <a href="/legal/support" className="text-quantum-teal hover:text-quantum-teal/80 transition-colors">
                    Visit our Support Center
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-quantum-teal mb-4">7. Updates to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
              <p className="mt-4">Last updated: {new Date().toLocaleDateString()}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 
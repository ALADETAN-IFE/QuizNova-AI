import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - QuizNova AI',
  description: 'Terms of Service for QuizNova AI - Learn about our terms, conditions, and user agreements.',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-cool-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-cool-black/50 p-8 rounded-2xl border border-cool-white/10 backdrop-blur-sm">
          <h1 className="text-4xl font-bold gradient-text mb-8">Terms of Service</h1>
          
          <div className="space-y-8 text-cool-white/80">
            <section>
              <h2 className="text-2xl font-semibold text-quantum-teal mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using QuizNova AI, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-quantum-teal mb-4">2. User Accounts</h2>
              <p className="mb-4">When creating an account, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Not share your account credentials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-quantum-teal mb-4">3. User Conduct</h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access</li>
                <li>Interfere with the proper functioning of the service</li>
                <li>Create or share inappropriate content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-quantum-teal mb-4">4. Intellectual Property</h2>
              <p>All content, features, and functionality of QuizNova AI are owned by us and are protected by international copyright, trademark, and other intellectual property laws.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-quantum-teal mb-4">5. Limitation of Liability</h2>
              <p>QuizNova AI is provided &quot; as is &quot; without any warranties. We are not liable for any damages arising from the use or inability to use our service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-quantum-teal mb-4">6. Termination</h2>
              <p>We reserve the right to terminate or suspend your account at any time for violations of these terms or for any other reason.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-quantum-teal mb-4">7. Changes to Terms</h2>
              <p>We may modify these terms at any time. We will notify users of any material changes via email or through the service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-quantum-teal mb-4">8. Contact Information</h2>
              <p>For questions about these Terms of Service, please contact us at:</p>
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
              <h2 className="text-2xl font-semibold text-quantum-teal mb-4">9. Governing Law</h2>
              <p>These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction].</p>
            </section>

            <section>
              <p className="mt-8">Last updated: {new Date().toLocaleDateString()}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 
import { Metadata } from 'next'
import QuizWrapper from './QuizWrapper'

interface PageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: 'Quiz | QuizNova AI',
  description: 'Take a quiz and test your knowledge',
}

export default function QuizPage({ params }: PageProps) {
  return (
    <main className="min-h-screen bg-deep-space">
      <QuizWrapper quizId={params.id} />
    </main>
  )
}
import { Metadata } from 'next'
import QuizWrapper from './QuizWrapper'

export const metadata: Metadata = {
  title: 'Quiz | QuizNova AI',
  description: 'Take a quiz and test your knowledge',
}

export default function QuizPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <main className="min-h-screen bg-deep-space">
      <QuizWrapper quizId={params.id} />
    </main>
  )
}
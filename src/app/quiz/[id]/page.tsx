import { Metadata } from 'next'
import QuizWrapper from './QuizWrapper'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
  title: 'Quiz | QuizNova AI',
  description: 'Take a quiz and test your knowledge',
}

export default async function QuizPage({ params }: Props) {
  return (
    <main className="min-h-screen bg-deep-space">
      <QuizWrapper quizId={params.id} />
    </main>
  )
}
import QuizContent from '@/components/QuizContent';

interface PageProps {
  params: {
    id: string;
  };
}

export default function QuizPage({ params }: PageProps) {
  return <QuizContent quizId={params.id} />;
}
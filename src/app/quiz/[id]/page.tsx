import { Suspense } from 'react';
import QuizContent from '@/components/QuizContent';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuizPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizContent 
        quizId={resolvedParams.id} 
        onComplete={(score) => {
          // Handle quiz completion
          console.log('Quiz completed with score:', score);
        }}
      />
    </Suspense>
  );
}
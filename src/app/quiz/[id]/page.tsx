// 'use client'

// import { Suspense } from 'react'
// import { useRouter } from 'next/navigation'
// import QuizContent from '@/components/QuizContent'

// interface PageProps {
//   params: { id: string };
// }

// export default function QuizPage({ params }: PageProps) {
//   const router = useRouter()
  
//   const handleComplete = (score: number) => {
//     console.log('Quiz completed with score:', score)
//     router.push('/quiz')
//   }
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <QuizContent 
//         quizId={params.id} 
//         onComplete={handleComplete}
//       />
//     </Suspense>
//   )
// }

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { useRouter } from 'next/navigation'

// Dynamically import the client component
const QuizContent = dynamic(() => import('@/components/QuizContent'), {
  ssr: false,
})

interface PageProps {
  params: { id: string }
}

export default function QuizPage({ params }: PageProps) {
  const router = useRouter()
  
  const handleComplete = (score: number) => {
    console.log('Quiz completed with score:', score)
    router.push('/quiz')
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizContent 
        quizId={params.id} 
        onComplete={handleComplete}
      />
    </Suspense>
  )
}

'use client'
import dynamic from 'next/dynamic'
import React from 'react'

// Dynamically import your QuizContent with ssr: false
const QuizContent = dynamic(() => import('@/components/QuizContent'), {
  ssr: false,
})

interface QuizContentWrapperProps {
  quizId: string
  onComplete: () => void
}

export default function QuizContentWrapper({ quizId, onComplete }: QuizContentWrapperProps) {
  return (
    <QuizContent quizId={quizId} onComplete={onComplete} />
  )
}
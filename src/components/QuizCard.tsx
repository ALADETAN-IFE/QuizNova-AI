'use client'

import React from 'react'
import ObjQuestion from './ObjQuestion'
import SubjectiveQuestion from './SubjectiveQuestion'
import TheoryQuestion from './TheoryQuestion'

interface QuizCardProps {
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
  onAnswer: (answer: string) => void
  selectedAnswer?: string
  showExplanation: boolean
  questionType: 'obj' | 'subjective' | 'theory'
  userAnswer: string
  onUserAnswerChange: (answer: string) => void
}

export default function QuizCard({
  question,
  options = [],
  correctAnswer,
  explanation,
  onAnswer,
  selectedAnswer,
  showExplanation,
  questionType,
  userAnswer,
  onUserAnswerChange
}: QuizCardProps) {
  return (
    <div className="bg-midnight-gray rounded-lg p-6 shadow-lg">
      {questionType === 'obj' && (
        <ObjQuestion
          question={question}
          options={options}
          correctAnswer={correctAnswer}
          explanation={explanation}
          onAnswer={onAnswer}
          selectedAnswer={selectedAnswer}
          showExplanation={showExplanation}
        />
      )}

      {questionType === 'subjective' && (
        <SubjectiveQuestion
          question={question}
          correctAnswer={correctAnswer}
          explanation={explanation}
          onAnswer={onAnswer}
          selectedAnswer={selectedAnswer}
          showExplanation={showExplanation}
          userAnswer={userAnswer}
          onUserAnswerChange={onUserAnswerChange}
        />
      )}

      {questionType === 'theory' && (
        <TheoryQuestion
          question={question}
          correctAnswer={correctAnswer}
          explanation={explanation}
          onAnswer={onAnswer}
          selectedAnswer={selectedAnswer}
          showExplanation={showExplanation}
          userAnswer={userAnswer}
          onUserAnswerChange={onUserAnswerChange}
        />
      )}
    </div>
  );
} 
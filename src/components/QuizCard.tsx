'use client'

import React from 'react'
import { Check, X } from 'lucide-react'

interface QuizCardProps {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  onAnswer: (answer: string) => void
  selectedAnswer?: string
  showExplanation?: boolean
}

export default function QuizCard({
  question,
  options,
  correctAnswer,
  explanation,
  onAnswer,
  selectedAnswer,
  showExplanation = false
}: QuizCardProps) {
  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return // Prevent multiple answers
    onAnswer(answer)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">{question}</h3>
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => !selectedAnswer && onAnswer(option)}
            className={`w-full p-4 text-left rounded-lg transition-colors ${
              selectedAnswer
                ? option === correctAnswer
                  ? 'bg-green-100 border-green-500'
                  : option === selectedAnswer
                  ? 'bg-red-100 border-red-500'
                  : 'bg-gray-50 border-gray-200'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            } border-2`}
            disabled={!!selectedAnswer}
          >
            {option}
          </button>
        ))}
      </div>
      {showExplanation && selectedAnswer && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700">{explanation}</p>
        </div>
      )}
    </div>
  )
} 
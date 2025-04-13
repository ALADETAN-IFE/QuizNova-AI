'use client'

import React from 'react'

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
  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4 text-cool-white">{question}</h3>
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            disabled={!!selectedAnswer}
            className={`w-full p-4 rounded-lg text-left transition-all ${
              selectedAnswer === option
                ? option === correctAnswer
                  ? 'bg-quantum-teal/20 text-quantum-teal border-2 border-quantum-teal'
                  : 'bg-starburst-orange/20 text-starburst-orange border-2 border-starburst-orange'
                : 'bg-midnight-gray hover:bg-midnight-gray/80 text-cool-white/70'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {showExplanation && selectedAnswer && (
        <div className="mt-6 p-4 rounded-lg bg-midnight-gray">
          <p className="text-cool-white/70">{explanation}</p>
        </div>
      )}
    </div>
  )
} 
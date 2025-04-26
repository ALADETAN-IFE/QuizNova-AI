'use client'

import React from 'react'

interface TheoryQuestionProps {
  question: string
  correctAnswer: string
  explanation: string
  onAnswer: (answer: string) => void
  selectedAnswer?: string
  showExplanation: boolean
  userAnswer: string
  onUserAnswerChange: (answer: string) => void
}

export default function TheoryQuestion({
  question,
  correctAnswer,
  explanation,
  onAnswer,
  selectedAnswer,
  showExplanation,
  userAnswer,
  onUserAnswerChange
}: TheoryQuestionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-6 text-cool-white">{question}</h3>
      <div className="space-y-4">
        <textarea
          value={userAnswer}
          onChange={(e) => onUserAnswerChange(e.target.value)}
          placeholder="Type your detailed explanation here..."
          className="w-full p-4 rounded-lg bg-deep-space text-cool-white border-2 border-cool-white/20 focus:border-quantum-teal focus:outline-none min-h-[150px]"
          disabled={!!selectedAnswer}
        />

        {!selectedAnswer && (userAnswer || '').trim().length > 0 && (
          <button
            onClick={() => onAnswer(userAnswer)}
            className="w-full px-4 py-3 bg-quantum-teal text-white rounded-lg font-medium hover:bg-quantum-teal/80 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:ring-offset-2 focus:ring-offset-deep-space transition-all"
          >
            Submit Answer
          </button>
        )}

        {showExplanation && (
          <div className="mt-4 p-4 rounded-lg bg-deep-space border border-cool-white/10">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-cool-white mb-2">Model Answer:</h4>
              <p className="text-quantum-teal whitespace-pre-wrap">{correctAnswer}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-cool-white mb-2">Explanation:</h4>
              <p className="text-cool-white/90">{explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
'use client'

import React from 'react'

interface QuizCardProps {
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
  onAnswer: (answer: string) => void
  selectedAnswer?: string
  showExplanation?: boolean
  questionType?: 'mcq' | 'subjective' | 'theory'
  userAnswer?: string
  onUserAnswerChange?: (answer: string) => void
}

export default function QuizCard({
  question,
  options = [],
  correctAnswer,
  explanation,
  onAnswer,
  selectedAnswer,
  showExplanation = false,
  questionType = 'mcq',
  userAnswer = '',
  onUserAnswerChange
}: QuizCardProps) {
  const handleOptionClick = (option: string) => {
    if (!selectedAnswer) {
      onAnswer(option);
    }
  };

  const handleUserAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onUserAnswerChange) {
      onUserAnswerChange(e.target.value);
    }
  };

  return (
    <div className="bg-midnight-gray rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-6 text-cool-white">{question}</h3>
      
      {questionType === 'mcq' && (
        <div className="space-y-4">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              disabled={selectedAnswer !== undefined}
              className={`w-full p-4 rounded-lg text-left transition-all ${
                selectedAnswer === option
                  ? option === correctAnswer
                    ? 'bg-quantum-teal/20 text-quantum-teal border-2 border-quantum-teal'
                    : 'bg-starburst-orange/20 text-starburst-orange border-2 border-starburst-orange'
                  : selectedAnswer !== undefined
                  ? 'bg-deep-space text-cool-white/50 cursor-not-allowed'
                  : 'bg-deep-space hover:bg-deep-space/80 text-cool-white border-2 border-transparent hover:border-cool-white/20'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{option}</span>
                {selectedAnswer === option && (
                  <span className="ml-2">
                    {option === correctAnswer ? '✓' : '✗'}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {(questionType === 'subjective' || questionType === 'theory') && (
        <div className="space-y-4">
          <textarea
            value={userAnswer}
            onChange={handleUserAnswerChange}
            placeholder={`Type your ${questionType === 'subjective' ? 'short answer' : 'detailed explanation'} here...`}
            className="w-full p-4 rounded-lg bg-deep-space text-cool-white border-2 border-cool-white/20 focus:border-quantum-teal focus:outline-none min-h-[150px]"
            disabled={selectedAnswer !== undefined}
          />
          {selectedAnswer && (
            <div className="mt-4 p-4 rounded-lg bg-deep-space border border-cool-white/10">
              <p className="text-cool-white/90">{explanation}</p>
            </div>
          )}
        </div>
      )}

      {showExplanation && selectedAnswer && questionType === 'mcq' && (
        <div className="mt-6 p-4 rounded-lg bg-deep-space border border-cool-white/10">
          <p className="text-cool-white/90">{explanation}</p>
        </div>
      )}
    </div>
  )
} 
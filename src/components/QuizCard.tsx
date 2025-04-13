'use client'

import { Check, X } from 'lucide-react'

interface QuizCardProps {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  onAnswer: (answer: string) => void
  showExplanation: boolean
  selectedAnswer: string | null
}

export default function QuizCard({ 
  question, 
  options, 
  correctAnswer, 
  explanation, 
  onAnswer,
  showExplanation,
  selectedAnswer
}: QuizCardProps) {

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return // Prevent multiple answers
    onAnswer(answer)
  }

  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold mb-4 text-cool-white">{question}</h3>
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={selectedAnswer !== null}
            className={`w-full p-3 rounded-lg text-left transition-all ${
              selectedAnswer === null
                ? 'bg-midnight-gray hover:bg-midnight-gray/80 text-cool-white'
                : selectedAnswer === option
                ? option === correctAnswer
                  ? 'bg-quantum-teal/20 border border-quantum-teal text-quantum-teal'
                  : 'bg-starburst-orange/20 border border-starburst-orange text-starburst-orange'
                : option === correctAnswer && selectedAnswer !== null
                ? 'bg-quantum-teal/20 border border-quantum-teal text-quantum-teal'
                : 'bg-midnight-gray text-cool-white/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {selectedAnswer === option && (
                <span>
                  {option === correctAnswer ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      {showExplanation && (
        <div className="mt-4 p-4 bg-midnight-gray/50 rounded-lg border border-holographic-silver/10">
          <p className="text-cool-white/80">{explanation}</p>
        </div>
      )}
    </div>
  )
} 
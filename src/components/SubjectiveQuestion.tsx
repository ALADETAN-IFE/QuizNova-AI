'use client'

import React from 'react'

interface SubjectiveQuestionProps {
  question: string
  correctAnswer: string
  explanation: string
  onAnswer: (answer: string) => void
  selectedAnswer?: string
  showExplanation: boolean
  userAnswer: string
  onUserAnswerChange: (answer: string) => void
}

export default function SubjectiveQuestion({
  question,
  correctAnswer,
  explanation,
  onAnswer,
  selectedAnswer,
  showExplanation,
  userAnswer,
  onUserAnswerChange
}: SubjectiveQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="text-lg text-cool-white leading-relaxed">
        {question.split('_____').map((part, index, array) => (
          <React.Fragment key={index}>
            {part}
            {index < array.length - 1 && (
              <input
                type="text"
                value={userAnswer?.split(',')[index] || ''}
                onChange={(e) => {
                  const answers = userAnswer?.split(',') || [];
                  answers[index] = e.target.value;
                  onUserAnswerChange(answers.join(','));
                }}
                className="mx-2 px-3 py-1 w-32 bg-deep-space text-cool-white border-b-2 border-cool-white/20 focus:border-quantum-teal focus:outline-none inline-block"
                disabled={!!selectedAnswer}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {!selectedAnswer && userAnswer && userAnswer.split(',').length === question.split('_____').length - 1 && (
        <button
          onClick={() => onAnswer(userAnswer)}
          className="w-full px-4 py-3 bg-quantum-teal text-white rounded-lg font-medium hover:bg-quantum-teal/80 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:ring-offset-2 focus:ring-offset-deep-space transition-all"
        >
          Submit Answer
        </button>
      )}

      {selectedAnswer && showExplanation && (
        <div className="mt-4 p-4 rounded-lg bg-deep-space border border-cool-white/10">
          <div className="mb-2">
            <span className="text-cool-white/70">Correct Answer: </span>
            <span className="text-quantum-teal">{correctAnswer}</span>
          </div>
          <p className="text-cool-white/90">{explanation}</p>
        </div>
      )}
    </div>
  );
} 
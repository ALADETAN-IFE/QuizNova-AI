import mongoose from 'mongoose'

const resultSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: [true, 'Please provide a quiz'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user'],
  },
  score: {
    type: Number,
    required: [true, 'Please provide a score'],
  },
  totalQuestions: {
    type: Number,
    required: [true, 'Please provide total questions'],
  },
  answers: [
    {
      question: {
        type: String,
        required: [true, 'Please provide a question'],
      },
      selectedAnswer: {
        type: String,
        required: [true, 'Please provide a selected answer'],
      },
      correctAnswer: {
        type: String,
        required: [true, 'Please provide a correct answer'],
      },
      isCorrect: {
        type: Boolean,
        required: [true, 'Please provide if the answer is correct'],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Result || mongoose.model('Result', resultSchema) 
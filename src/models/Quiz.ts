import mongoose from 'mongoose'

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  questions: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
      },
      question: {
        type: String,
        required: [true, 'Please provide a question'],
      },
      options: {
        type: [String],
        required: [true, 'Please provide options'],
      },
      correctAnswer: {
        type: String,
        required: [true, 'Please provide a correct answer'],
      },
      explanation: {
        type: String,
        required: [true, 'Please provide an explanation'],
      },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a creator'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Quiz || mongoose.model('Quiz', quizSchema) 
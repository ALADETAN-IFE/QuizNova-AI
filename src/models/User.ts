import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  image: {
    type: String,
    default: '',
  },
  plan:{
    type: String,
    enum: ["basic", "premium"],
    default: "basic"
  },
  resetToken: String,
  resetTokenExpiry: Date,
}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', userSchema) 
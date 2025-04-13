import mongoose from 'mongoose'

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined
}

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

// Initialize the cached connection
const cached: MongooseCache = (global as any).mongoose || { conn: null, promise: null }

if (!(global as any).mongoose) {
  (global as any).mongoose = cached
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts)
  }

  try {
    const mongoose = await cached.promise
    cached.conn = mongoose
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
} 
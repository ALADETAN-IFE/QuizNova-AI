// "use server"; // ✅ Ensure this file is treated as a server module
// import mongoose from 'mongoose'

// type MongooseCache = {
//   conn: typeof mongoose | null
//   promise: Promise<typeof mongoose> | null
// }

// // Define the global object type
// interface CustomGlobal extends Global {
//   mongoose?: MongooseCache
// }

// declare global {
//   // eslint-disable-next-line no-var
//   var mongoose: MongooseCache | undefined
// }

// const MONGODB_URI = process.env.MONGODB_URI as string
// if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env')

// // Initialize the cached connection
// const cached: MongooseCache = (global as CustomGlobal).mongoose || { conn: null, promise: null }

// if (!(global as CustomGlobal).mongoose) {
//   (global as CustomGlobal).mongoose = cached
// }

// export const connectToDatabase = async () => {
//   if (mongoose.connection.readyState >= 1) return
//   try {
//     // await mongoose.connect(MONGODB_URI)
//     await mongoose.connect(MONGODB_URI, {
//       bufferCommands: false,
//     })
//     // console.log('MongoDB Connected')
//   } catch (error) {
//     console.error('MongoDB Connection Error:', error)
//     throw error // Re-throw the error to be handled by the caller
//   }
// } 

"use server"; // ✅ Ensure this file is treated as a server module
import mongoose from 'mongoose';

// export const config = {
//   runtime: "nodejs", // ✅ Force Node.js runtime
// };

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env');

export const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }

    await mongoose.connect(MONGODB_URI, {
      bufferCommands: true, // Changed to true to allow buffering
    });
    console.log('MongoDB Connected');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    throw error;
  }
};
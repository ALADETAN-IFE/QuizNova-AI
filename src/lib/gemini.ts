import { GoogleGenerativeAI, GenerateContentResult } from '@google/generative-ai'

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')

interface QuizQuestion {
  _id: string
  text: string
  options: string[]
  correctAnswer: string
  explanation: string
}

export async function generateQuizFromText(
  inputText: string, 
  numQuestions: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<QuizQuestion[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const difficultyDescription = {
      easy: "Create simple, straightforward questions that test basic understanding and recall.",
      medium: "Create moderately challenging questions that test comprehension and application.",
      hard: "Create complex, challenging questions that test analysis, synthesis, and evaluation."
    }

    const prompt: string = `Generate ${numQuestions} multiple-choice questions based on the following text with ${difficulty} difficulty level.
    
    ${difficultyDescription[difficulty]}
    
    Format the response as a JSON array of questions, where each question has:
    - An "_id" (string) - generate a random string of 24 characters
    - A "text" (string) - the question text
    - An array of "options" (strings)
    - A "correctAnswer" (string) that matches one of the options exactly
    - An "explanation" (string) that explains why the correct answer is right and why the others are wrong
    
    Make sure:
    - Questions are appropriate for the specified difficulty level
    - Each question has exactly 4 options
    - Options are plausible but distinguishable
    - The explanation is clear and educational
    - Questions test understanding, not just memorization
    - Each _id is a unique 24-character string
    
    Text to generate questions from:
    ${inputText}`

    const result: GenerateContentResult = await model.generateContent(prompt)
    const response = await result.response
    const responseText = response.text()
    
    // Extract the JSON array from the response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response')
    }

    const questions: QuizQuestion[] = JSON.parse(jsonMatch[0])
    return questions
  } catch (error) {
    console.error('Error generating quiz:', error)
    throw error
  }
}

export async function generateQuizFromPDF(
  pdfText: string, 
  numQuestions: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<QuizQuestion[]> {
  // For now, we'll just pass the extracted text to the text-based function
  // In the future, we can add PDF-specific processing here
  return generateQuizFromText(pdfText, numQuestions, difficulty)
} 
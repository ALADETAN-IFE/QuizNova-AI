import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')

interface QuizQuestion {
  _id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

export async function generateQuizFromText(
  inputText: string, 
  numQuestions: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  questionType: 'mcq' | 'subjective' | 'theory' = 'mcq'
): Promise<QuizQuestion[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const difficultyDescription = {
      easy: "Create simple, straightforward questions that test basic understanding and recall.",
      medium: "Create moderately challenging questions that test comprehension and application.",
      hard: "Create complex, challenging questions that test analysis, synthesis, and evaluation."
    }

    const questionTypeDescription = {
      mcq: "Generate multiple-choice questions with 4 options.",
      subjective: "Generate open-ended or essay-style questions that require a detailed written answer.",
      theory: "Generate theory-based questions that require detailed explanations or conceptual knowledge."
    }

    const prompt: string = `Generate ${numQuestions} ${questionType} questions based on the following text with ${difficulty} difficulty level.
    
    ${difficultyDescription[difficulty]}
    ${questionTypeDescription[questionType]}
    
    Format the response as a JSON array of questions, where each question has:
    - A "question" (string) - the question text
    - An array of "options" (strings) - only for MCQ type
    - A "correctAnswer" (string) that matches one of the options exactly for MCQ, or the expected answer for subjective/theory
    - An "explanation" (string) that explains why the correct answer is right and why the others are wrong for MCQ, or a detailed explanation for subjective/theory
    
    Make sure:
    - Questions are appropriate for the specified difficulty level
    - For MCQ: Each question has exactly 4 options
    - For MCQ: Options are plausible but distinguishable
    - The explanation is clear and educational
    - Questions test understanding, not just memorization
    - Each _id is a unique 24-character string
    
    Text to generate questions from:
    ${inputText}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Clean up the response by removing markdown code block syntax
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()
    
    try {
      const questions = JSON.parse(cleanedText) as QuizQuestion[]
      return questions
    } catch (error) {
      console.error('Error parsing quiz questions:', error)
      throw new Error('Failed to parse quiz questions')
    }
  } catch (error) {
    console.error('Error generating quiz:', error)
    throw error
  }
}

export async function generateQuizFromPDF(
  pdfText: string,
  numQuestions: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  questionType: 'mcq' | 'subjective' | 'theory' = 'mcq'
): Promise<QuizQuestion[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const difficultyDescription = {
      easy: "Create simple, straightforward questions that test basic understanding and recall.",
      medium: "Create moderately challenging questions that test comprehension and application.",
      hard: "Create complex, challenging questions that test analysis, synthesis, and evaluation."
    }

    const questionTypeDescription = {
      mcq: "Generate multiple-choice questions with 4 options.",
      subjective: "Generate open-ended or essay-style questions that require a detailed written answer.",
      theory: "Generate theory-based questions that require detailed explanations or conceptual knowledge."
    }

    const prompt: string = `Generate ${numQuestions} ${questionType} questions based on the following text with ${difficulty} difficulty level.
    
    ${difficultyDescription[difficulty]}
    ${questionTypeDescription[questionType]}
    
    Format the response as a JSON array of questions, where each question has:
    - A "question" (string) - the question text
    - An array of "options" (strings) - only for MCQ type
    - A "correctAnswer" (string) that matches one of the options exactly for MCQ, or the expected answer for subjective/theory
    - An "explanation" (string) that explains why the correct answer is right and why the others are wrong for MCQ, or a detailed explanation for subjective/theory
    
    Make sure:
    - Questions are appropriate for the specified difficulty level
    - For MCQ: Each question has exactly 4 options
    - For MCQ: Options are plausible but distinguishable
    - The explanation is clear and educational
    - Questions test understanding, not just memorization
    - Each _id is a unique 24-character string
    
    Text to generate questions from:
    ${pdfText}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Clean up the response by removing markdown code block syntax
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()
    
    try {
      const questions = JSON.parse(cleanedText) as QuizQuestion[]
      return questions
    } catch (error) {
      console.error('Error parsing quiz questions:', error)
      throw new Error('Failed to parse quiz questions')
    }
  } catch (error) {
    console.error('Error generating quiz:', error)
    throw error
  }
}

export async function evaluateAnswer(
  question: string,
  userAnswer: string,
  correctAnswer: string,
  questionType: 'subjective' | 'theory'
): Promise<{
  score: number;
  feedback: string;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Evaluate the following ${questionType} answer based on the question and correct answer provided.
    
    Question: ${question}
    Correct Answer: ${correctAnswer}
    User's Answer: ${userAnswer}
    
    Please evaluate the answer and provide:
    1. A score from 0 to 100 based on how well the answer matches the key points and demonstrates understanding
    2. Detailed feedback explaining what was good and what could be improved
    
    Format the response as a JSON object with "score" and "feedback" fields.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response by removing markdown code block syntax
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      const evaluation = JSON.parse(cleanedText);
      return evaluation;
    } catch (parseError) {
      console.error('Error parsing evaluation:', parseError);
      console.error('Raw response:', text);
      throw new Error('Failed to parse evaluation');
    }
  } catch (error) {
    console.error('Error evaluating answer:', error);
    throw error;
  }
} 
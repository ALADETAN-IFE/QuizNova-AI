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

// export async function generateQuizFromText(
//   text: string,
//   numQuestions: number = 5,
//   difficulty: 'easy' | 'medium' | 'hard' = 'medium',
//   questionType: 'obj' | 'subjective' | 'theory' = 'obj'
// ) {
//   const difficultyDescriptions = {
//     easy: "Basic recall and understanding questions suitable for beginners.",
//     medium: "Questions that require application and analysis of concepts.",
//     hard: "Complex questions requiring deep understanding and critical thinking.",
//   };

//   const questionTypeDescriptions = {
//     obj: "Generate multiple-choice questions with 4 options.",
//     subjective: "Generate short answer questions that require brief explanations.",
//     theory: "Generate essay-type questions that require detailed explanations.",
//   };

//   const prompt = `
//     You are an expert quiz generator. Generate ${numQuestions} ${difficulty} difficulty ${questionType} questions based on the following text. 
    
//     Difficulty level description: ${difficultyDescriptions[difficulty]}
//     Question type description: ${questionTypeDescriptions[questionType]}
    
//     Text to generate questions from:
//     ${text}
    
//     Format your response as a JSON array of questions. Each question should have:
//     - A "question" (string)
//     - A "correctAnswer" (string)
//     - An "explanation" (string) explaining why the answer is correct
//     - An array of "options" (strings) - only for OBJ type
    
//     Example format:
//     [
//       {
//         "question": "What is...?",
//         "correctAnswer": "The answer",
//         "explanation": "This is correct because...",
//         "options": ["option1", "option2", "option3", "option4"]  // only for OBJ type
//       }
//     ]
    
//     Make sure:
//     1. Questions are clear and unambiguous
//     2. For OBJ questions, all options are plausible but only one is correct
//     3. Explanations are thorough and educational
//     4. Questions test understanding, not just memorization
//     5. Questions are directly related to the text content
//     6. Difficulty matches the specified level
//     `;

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const text = response.text();
    
//     try {
//       const questions = JSON.parse(text);
//       return questions;
//     } catch (error) {
//       console.error('Failed to parse questions JSON:', error);
//       throw new Error('Failed to generate valid questions');
//     }
//   } catch (error) {
//     console.error('Error generating questions:', error);
//     throw error;
//   }
// }

export async function generateQuizFromPDF(
  pdfText: string, 
  numQuestions: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  questionType: 'obj' | 'subjective' | 'theory' = 'obj'
): Promise<QuizQuestion[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const difficultyDescription = {
      easy: "Create simple, straightforward questions that test basic understanding and recall.",
      medium: "Create moderately challenging questions that test comprehension and application.",
      hard: "Create complex, challenging questions that test analysis, synthesis, and evaluation."
    }

    const questionTypeDescription = {
      obj: `Generate multiple-choice questions with exactly 4 options. Each question MUST:
        - Be a clear, complete question (not a fill-in-the-blank)
        - Have exactly 4 options labeled A, B, C, D
        - Have only one correct answer
        - All options should be plausible but clearly distinguishable
        Example format:
        "What is the primary purpose of vocational education?"
        Options: [
          "To provide theoretical knowledge only",
          "To prepare individuals for specific occupations",
          "To teach general academic subjects",
          "To focus on research methodologies"
        ]`,
      subjective: `Generate fill-in-the-blank (German style) questions ONLY. Each question MUST:
        - Be a complete sentence or paragraph with multiple blanks marked as '_____'
        - Have 3-5 blanks per question
        - Each blank should be a key term, concept, or important word from the text
        - The blanks should test understanding of important terms and concepts
        - DO NOT generate questions that ask for explanations or long answers
        Example format:
        "According to the text, vocational education provides _____ with skills, _____, and _____ necessary for a specific occupation."`,
      theory: "Generate theory-based questions that require detailed explanations or conceptual knowledge."
    }

    const prompt: string = `Generate ${numQuestions} ${questionType} questions based on the following text with ${difficulty} difficulty level.
    
    ${difficultyDescription[difficulty]}
    ${questionTypeDescription[questionType]}
    
    Format the response as a JSON array of questions, where each question has:
    - A "question" (string) - for OBJ type, make it a complete question
    - An array of "options" (strings) - REQUIRED for OBJ type, exactly 4 options
    - A "correctAnswer" (string) - for OBJ type, must match one of the options exactly
    - An "explanation" (string) that explains why the correct answer is right and others are wrong
    
    For OBJ questions, ensure:
    - Question is a complete sentence ending with a question mark
    - Exactly 4 options provided
    - Options are clear and distinct
    - One clear correct answer
    - No fill-in-the-blank format
    
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
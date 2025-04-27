"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { extractTextFromPDF } from "@/lib/pdf";
import { generateQuizFromPDF } from "@/lib/gemini";
import { Upload, FileText } from "lucide-react";
import { useDropzone } from "react-dropzone";
import axios, { AxiosError } from "axios";
import { useAppStore } from "@/lib/store.zustand";

// Define question type
// interface Question {
//   question: string;
//   options?: string[];
//   correctAnswer: string;
//   explanation: string;
//   questionType?: 'obj' | 'subjective' | 'theory';
// }

// Generate a random ID using timestamp and random number
const generateId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.floor(Math.random() * 1000000).toString(36);
  return `${timestamp}-${randomStr}`;
};

export default function UploadClient() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [questionType, setQuestionType] = useState<"obj" | "subjective" | "theory">("obj");
  const { user, setCurrentQuiz } = useAppStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      console.log("uploading...");
    } else {
      toast.error("Please upload a PDF file");
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const getDifficultyColor = (level: string) => {
    if (difficulty === level) {
      switch (level) {
        case 'easy':
          return 'bg-green-500 text-white';
        case 'medium':
          return 'bg-blue-500 text-white';
        case 'hard':
          return 'bg-starburst-orange text-white';
        default:
          return '';
      }
    }
    return 'bg-cool-black/50 text-cool-white/70 hover:bg-cool-black/70';
  };

  // const getQuestionTypeColor = (type: string) => {
  //   if (questionType === type) {
  //     switch (type) {
  //       case 'obj':
  //         return 'bg-quantum-teal text-white';
  //       case 'subjective':
  //         return 'bg-ai-blue text-white';
  //       case 'theory':
  //         return 'bg-nova-purple text-white';
  //       default:
  //         return '';
  //     }
  //   }
  //   return 'bg-cool-black/50 text-cool-white/70 hover:bg-cool-black/70';
  // };

  const generateQuiz = async () => {
    console.log("user", user);
    setQuestionType("obj")
    if (!uploadedFile) {
      toast.error("Please upload a PDF file first");
      return;
    }

    setIsUploading(true);
    setProcessingStatus("Extracting text from PDF...");

    try {
      const pdfText = await extractTextFromPDF(uploadedFile);
      console.log("Extracted text:", pdfText?.slice(0, 100)); // Log first 100 chars for debugging
      
      if (!pdfText || pdfText.trim().length === 0) {
        toast.error("Could not extract text from PDF. Please make sure the PDF contains selectable text and is not scanned/image-based.");
        return;
      }

      if (pdfText.trim().length < 50) {
        toast.error("The extracted text is too short. Please make sure the PDF contains enough content.");
        return;
      }

      setProcessingStatus("Generating quiz questions...");
      const questions = await generateQuizFromPDF(
        pdfText,
        numQuestions,
        difficulty,
        questionType
      );

      if (!questions || questions.length === 0) {
        throw new Error("No questions were generated");
      }

      setProcessingStatus("Saving quiz...");
      
      if (user) {
        // For logged-in users, create quiz in MongoDB
        try {
          const response = await axios.post('/api/quizzes', {
            title: uploadedFile.name.replace(".pdf", ""),
            description: `Quiz generated from ${uploadedFile.name}`,
            difficulty,
            questions: questions.map((q) => ({
              question: q.question,
              options: q.options || [],
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              questionType,
            })),
            createdBy: user.id
          });

          if (response.data) {
            toast.success("Quiz generated successfully!");
            router.push(`/quiz`);
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.error || error.message;
            const errorDetails = error.response?.data?.details;
            toast.error(`Failed to save quiz: ${errorMessage}${errorDetails ? `\n${errorDetails}` : ''}`);
            console.error("API Error:", error.response?.data);
          } else {
            toast.error("An unexpected error occurred while saving the quiz");
            console.error("Unexpected error:", error);
          }
          throw error;
        }
      } else {
        // For non-logged-in users, use Zustand store
        const quiz = {
          id: generateId(),
          title: uploadedFile.name.replace(".pdf", ""),
          description: `Quiz generated from ${uploadedFile.name}`,
          difficulty,
          questions: questions.map((q) => ({
            question: q.question,
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            questionType,
          })),
        };

        setCurrentQuiz(quiz);
        router.push("/quiz");
      }
      
      // toast.success("Quiz generated successfully!");
    } catch (error) {
      console.error("Error processing PDF:", error);
      if (error instanceof Error) {
        if (error.message.includes("Could not extract text")) {
          toast.error("Could not extract text from PDF. Please make sure the PDF contains selectable text and is not scanned/image-based.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("An unexpected error occurred while processing the PDF");
      }
    } finally {
      setIsUploading(false);
      setProcessingStatus("");
    }
  };

  return (
    <main className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center gradient-text">
          Upload Your Study Material
        </h1>
        <div
          {...getRootProps()}
          className="card border-2 border-dashed border-holographic-silver cursor-pointer transition-colors"
        >
          <input {...getInputProps()} accept="application/pdf,.pdf" />
          {uploadedFile ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <FileText className="w-12 h-12 text-[#4B9EFF]" />
                <p className="text-cool-white/70">
                  {uploadedFile.name}
                </p>
                <p className="text-sm text-cool-white/50">
                  Click or drag to upload a different file
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Upload className="w-12 h-12 text-nova-purple" />
                <p className="text-cool-white/70">
                  Drag & drop your PDF here, or click to select
                </p>
                <p className="text-sm text-cool-white/50">
                  Supported format: PDF
                </p>
              </div>
            </div>
          )}
        </div>

        {uploadedFile && (
          <>
            <div className="mt-8 p-6 bg-[#1E1F2E] rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Quiz Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-cool-white/70 mb-2">
                    Difficulty
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["easy", "medium", "hard"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDifficulty(level as "easy" | "medium" | "hard")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${getDifficultyColor(level)}`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-cool-white/70 mb-2">
                    Question Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["obj", "subjective", "theory"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setQuestionType(type as "obj" | "subjective" | "theory")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${getQuestionTypeColor(type)}`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-cool-white/70 mb-2">
                    Number of Questions
                  </label>
                  {
                    user?.id ?
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-full px-4 py-2 bg-white border border-cool-white/10 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:border-transparent transition-all"
                    />
                    :
                    // three buttons for 3, 5, 10 questions
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => setNumQuestions(3)} className={`w-full px-4 py-2 text-white rounded-lg hover:bg-nova-purple/80 focus:outline-none focus:ring-2 focus:ring-nova-purple/50 focus:border-transparent transition-all ${numQuestions === 3 ? 'bg-nova-purple' : 'bg-cool-black/50'}`}>3</button>
                      <button onClick={() => setNumQuestions(5)} className={`w-full px-4 py-2 text-white rounded-lg hover:bg-nova-purple/80 focus:outline-none focus:ring-2 focus:ring-nova-purple/50 focus:border-transparent transition-all ${numQuestions === 5 ? 'bg-nova-purple' : 'bg-cool-black/50'}`}>5</button>
                      <button onClick={() => setNumQuestions(10)} className={`w-full px-4 py-2 text-white rounded-lg hover:bg-nova-purple/80 focus:outline-none focus:ring-2 focus:ring-nova-purple/50 focus:border-transparent transition-all ${numQuestions === 10 ? 'bg-nova-purple' : 'bg-cool-black/50'}`}>10</button>
                    </div>
                  }
                </div>

                <button
                  onClick={generateQuiz}
                  disabled={isUploading}
                  className="w-full px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-[#1E1F2E] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                      <span>{processingStatus}</span>
                    </div>
                  ) : (
                    'Generate Quiz'
                  )}
                </button>

                {isUploading && (
                  <div className="mt-4">
                    <div className="h-1.5 w-full bg-cool-black/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ 
                          width: processingStatus.includes("Extracting") ? "33%" :
                                 processingStatus.includes("Generating") ? "66%" :
                                 processingStatus.includes("Saving") ? "100%" : "0%"
                        }}
                      />
                    </div>
                    <p className="text-sm text-cool-white/50 mt-2 text-center">{processingStatus}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
} 

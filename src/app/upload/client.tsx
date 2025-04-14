"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { extractTextFromPDF } from "@/lib/pdf";
import { generateQuizFromPDF } from "@/lib/gemini";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useAppStore } from "@/lib/store.zustand";

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const generateQuiz = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setProcessingStatus("Extracting text from PDF...");

    try {
      const pdfText = await extractTextFromPDF(uploadedFile);

      setProcessingStatus("Generating quiz questions...");
      const questions = await generateQuizFromPDF(
        pdfText,
        numQuestions,
        difficulty
      );

      if (user) {
        // For logged-in users, create quiz in MongoDB
        const response = await axios.post('/api/quizzes', {
          title: uploadedFile.name.replace(".pdf", ""),
          description: `Quiz generated from ${uploadedFile.name}`,
          difficulty,
          questions: questions.map((q) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          })),
          createdBy: user.id
        });
        
        router.push(`/quiz`);
      } else {
        // For non-logged-in users, use Zustand store
        const quiz = {
          id: generateId(),
          title: uploadedFile.name.replace(".pdf", ""),
          description: `Quiz generated from ${uploadedFile.name}`,
          difficulty,
          questions: questions.map((q) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          })),
        };

        setCurrentQuiz(quiz);
        router.push("/quiz");
      }

      toast.success("Quiz generated successfully!");
    } catch (error) {
      console.error("Error processing PDF:", error);
      toast.error("Failed to process PDF. Please try again.");
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
          className={`card border-2 border-dashed ${
            isDragActive ? "border-nova-purple" : "border-holographic-silver"
          } cursor-pointer transition-colors`}
        >
          <input {...getInputProps()} />
          <div className="text-center py-12">
            {isUploading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-nova-purple animate-spin" />
                <p className="text-cool-white/70">{processingStatus}</p>
              </div>
            ) : uploadedFile ? (
              <div className="flex flex-col items-center gap-4">
                <FileText className="w-12 h-12 text-quantum-teal" />
                <p className="text-cool-white/70">{uploadedFile.name}</p>
                <p className="text-sm text-cool-white/50">
                  Click or drag to upload a different file
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Upload className="w-12 h-12 text-nova-purple" />
                <p className="text-cool-white/70">
                  {isDragActive
                    ? "Drop your PDF here"
                    : "Drag & drop your PDF here, or click to select"}
                </p>
                <p className="text-sm text-cool-white/50">
                  Supported format: PDF
                </p>
              </div>
            )}
          </div>
        </div>
        {uploadedFile && !isUploading && (
          <div className="mt-8">
            <div className="card mb-6">
              <h3 className="text-xl font-semibold mb-4 text-cool-white">
                Quiz Settings
              </h3>
              <div className="mb-4">
                <label className="block text-cool-white/70 mb-2">
                  Difficulty
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDifficulty("easy")}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      difficulty === "easy"
                        ? "bg-quantum-teal text-deep-space font-medium"
                        : "bg-midnight-gray text-cool-white/70 hover:bg-midnight-gray/80"
                    }`}
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => setDifficulty("medium")}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      difficulty === "medium"
                        ? "bg-ai-blue text-deep-space font-medium"
                        : "bg-midnight-gray text-cool-white/70 hover:bg-midnight-gray/80"
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setDifficulty("hard")}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      difficulty === "hard"
                        ? "bg-starburst-orange text-deep-space font-medium"
                        : "bg-midnight-gray text-cool-white/70 hover:bg-midnight-gray/80"
                    }`}
                  >
                    Hard
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-cool-white/70 mb-2">
                  Number of Questions
                </label>
                <div className="flex gap-2">
                  {[3, 5, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setNumQuestions(num)}
                      className={`flex-1 py-2 rounded-lg transition-all ${
                        numQuestions === num
                          ? "bg-nova-purple text-cool-white font-medium"
                          : "bg-midnight-gray text-cool-white/70 hover:bg-midnight-gray/80"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-center">
              <button onClick={generateQuiz} className="btn-primary">
                Generate Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 
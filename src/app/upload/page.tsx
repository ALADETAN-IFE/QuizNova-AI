"use client";

import { useState, useCallback } from "react"; // React hooks for state management and memoized callbacks
import { useRouter } from "next/navigation"; // Next.js hook for programmatic navigation
import { Upload, FileText, Loader2 } from "lucide-react"; // Icons for UI elements
import { toast } from "react-hot-toast"; // Library for displaying notifications
import { extractTextFromPDF } from "@/lib/pdf"; // Utility function to extract text from a PDF
import { generateQuizFromPDF } from "@/lib/gemini"; // Function to generate quiz questions from extracted text
import dynamic from 'next/dynamic';

// Define types for the DropzoneWrapper component
interface DropzoneWrapperProps {
  onDrop: (acceptedFiles: File[]) => void;
  children: (isDragActive: boolean) => React.ReactNode;
}

// Dynamically import the Dropzone component with no SSR
const Dropzone = dynamic(
  () => import('react-dropzone').then(mod => {
    // Create a wrapper component that uses the useDropzone hook
    const DropzoneWrapper = ({ onDrop, children }: DropzoneWrapperProps) => {
      const { getRootProps, getInputProps, isDragActive } = mod.useDropzone({
        onDrop,
        accept: {
          "application/pdf": [".pdf"],
        },
        maxFiles: 1,
      });
      
      return (
        <div {...getRootProps()} className={`card border-2 border-dashed ${
          isDragActive ? "border-nova-purple" : "border-holographic-silver"
        } cursor-pointer transition-colors`}>
          <input {...getInputProps()} />
          {children(isDragActive)}
        </div>
      );
    };
    return DropzoneWrapper;
  }),
  { ssr: false }
);

export default function UploadPage() {
  const router = useRouter(); // Initialize router for navigation
  const [isUploading, setIsUploading] = useState(false); // Tracks whether a file is being uploaded
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // Stores the uploaded file
  const [processingStatus, setProcessingStatus] = useState<string>(""); // Tracks the current processing status
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  ); // Tracks selected quiz difficulty
  const [numQuestions, setNumQuestions] = useState<number>(5); // Tracks the number of quiz questions to generate

  // Handles file drop events
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]; // Get the first file from the dropped files
    if (file && file.type === "application/pdf") {
      setUploadedFile(file); // Set the uploaded file
      console.log("uploading...");
    } else {
      toast.error("Please upload a PDF file"); // Show error if the file is not a PDF
    }
  }, []);

  // Generates a quiz from the uploaded PDF
  const generateQuiz = async () => {
    if (!uploadedFile) return; // Exit if no file is uploaded

    setIsUploading(true); // Set uploading state to true
    setProcessingStatus("Extracting text from PDF..."); // Update processing status

    try {
      // Extract text from the uploaded PDF
      const pdfText = await extractTextFromPDF(uploadedFile);

      setProcessingStatus("Generating quiz questions..."); // Update processing status
      // Generate quiz questions from the extracted text using Gemini AI with selected difficulty
      const questions = await generateQuizFromPDF(
        pdfText,
        numQuestions,
        difficulty
      );

      // Create a quiz object with metadata and formatted questions
      const quiz = {
        title: uploadedFile.name.replace(".pdf", ""), // Use the file name as the quiz title
        description: `Quiz generated from ${uploadedFile.name}`, // Add a description
        difficulty,
        questions: questions.map((q) => ({
          question: q.text, // Assuming 'text' is the correct property in 'QuizQuestion'
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        })),
      };

      // Store the quiz in localStorage for use on the quiz page
      if (typeof window !== 'undefined') {
        localStorage.setItem("currentQuiz", JSON.stringify(quiz));
      }

      toast.success("Quiz generated successfully!"); // Show success notification
      router.push("/quiz"); // Navigate to the quiz page
    } catch (error) {
      console.error("Error processing PDF:", error); // Log the error
      toast.error("Failed to process PDF. Please try again."); // Show error notification
    } finally {
      setIsUploading(false); // Reset uploading state
      setProcessingStatus(""); // Clear processing status
    }
  };

  return (
    <main className="container mx-auto px-4 py-20">
      {" "}
      {/* Main container with padding */}
      <div className="max-w-2xl mx-auto">
        {" "}
        {/* Centered content container */}
        <h1 className="text-3xl font-bold mb-8 text-center gradient-text">
          Upload Your Study Material
        </h1>{" "}
        {/* Page title */}
        {/* Drag-and-drop area */}
        <Dropzone onDrop={onDrop}>
          {(isDragActive: boolean) => (
            <div className="text-center py-12">
              {isUploading ? ( // Show loader if uploading
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-nova-purple animate-spin" />
                  <p className="text-cool-white/70">{processingStatus}</p>
                </div>
              ) : uploadedFile ? ( // Show file details if uploaded
                <div className="flex flex-col items-center gap-4">
                  <FileText className="w-12 h-12 text-quantum-teal" />
                  <p className="text-cool-white/70">{uploadedFile.name}</p>
                  <p className="text-sm text-cool-white/50">
                    Click or drag to upload a different file
                  </p>
                </div>
              ) : (
                // Show upload instructions
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
          )}
        </Dropzone>
        {/* Quiz settings */}
        {uploadedFile && !isUploading && (
          <div className="mt-8">
            <div className="card mb-6">
              <h3 className="text-xl font-semibold mb-4 text-cool-white">
                Quiz Settings
              </h3>

              {/* Difficulty selection */}
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

              {/* Number of questions selection */}
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

            {/* Generate quiz button */}
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

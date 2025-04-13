'use client';

import { useDropzone, DropzoneOptions } from "react-dropzone";
import { Upload, FileText, Loader2 } from "lucide-react";

interface FileDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  isUploading: boolean;
  processingStatus: string;
  uploadedFile: File | null;
}

export default function FileDropzone({
  onDrop,
  isUploading,
  processingStatus,
  uploadedFile,
}: FileDropzoneProps) {
  // Create dropzone options
  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  };

  // Initialize dropzone directly in the component
  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  return (
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
  );
} 
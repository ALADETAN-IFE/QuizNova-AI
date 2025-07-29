import { extractTextFromPDF } from './pdf';
import { extractTextFromDOCX } from './docx';

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;

  console.log("fileType", fileType)
  
  switch (fileType) {
    case 'application/pdf':
      return await extractTextFromPDF(file);
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return await extractTextFromDOCX(file);
    default:
      throw new Error(`Unsupported file type: ${fileType}. Please upload a PDF or DOCX file.`);
  }
} 
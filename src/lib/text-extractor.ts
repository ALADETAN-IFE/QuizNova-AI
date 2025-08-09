import { extractTextFromPDF } from './pdf';
import { extractTextFromDOCX } from './docx';
// import { extractTextFromDOC } from './doc';

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;

  // console.log("fileType", fileType)
  
  switch (fileType) {
    case 'application/pdf':
      return await extractTextFromPDF(file);
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return await extractTextFromDOCX(file);
    // case 'application/msword':
      // return await extractTextFromDOC(file);
    default:
      throw new Error(`Unsupported file type: ${fileType}. Please upload a PDF, DOCX file.`);
  }
} 
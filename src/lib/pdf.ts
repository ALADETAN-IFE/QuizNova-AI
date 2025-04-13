// import * as pdfjs from 'pdfjs-dist'

// // Initialize PDF.js worker
// if (typeof window !== 'undefined') {
//   pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
// }

// export async function extractTextFromPDF(file: File): Promise<string> {
//   try {
//     // Convert File to ArrayBuffer
//     const arrayBuffer = await file.arrayBuffer()
    
//     // Load the PDF document
//     const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
    
//     let fullText = ''
    
//     // Iterate through each page
//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i)
//       const textContent = await page.getTextContent()
//       const pageText = textContent.items
//         .map((item: any) => item.str)
//         .join(' ')
      
//       fullText += pageText + '\n\n'
//     }
    
//     return fullText.trim()
//   } catch (error) {
//     console.error('Error extracting text from PDF:', error)
//     throw error
//   }
// }
import * as pdfjsLib from "pdfjs-dist";

// Manually set the worker source to the local file
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map(item => {
          const textItem = item as { str?: string; items?: Array<{ str?: string }> };
          if (textItem.str) return textItem.str;
          if (textItem.items) return textItem.items.map(i => i.str || '').join(' ');
          return '';
        })
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}
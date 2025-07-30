import { NextRequest, NextResponse } from 'next/server';
// import mammoth from 'mammoth';
// import textract from 'textract';
// import { writeFile, unlink } from 'fs/promises';
// import path from 'path';
// import os from 'os';
// import { promisify } from 'util';

// const textractFromFile = promisify(textract.fromFileWithPath);

export async function POST(request: NextRequest) {
  try {
      return NextResponse.json({ error: 'Future plans' }, { status: 200 });
//     const formData = await request.formData();
//     const file = formData.get('file') as File;
    
//     if (!file) {
//       return NextResponse.json({ error: 'No file provided' }, { status: 400 });
//     }

//     // Handle DOCX files directly with mammoth
//     if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//       try {
//         const arrayBuffer = await file.arrayBuffer();
//         const result = await mammoth.extractRawText({ arrayBuffer });
        
//         return NextResponse.json({ 
//           text: result.value,
//           messages: result.messages 
//         });
//       } catch (docxError) {
//         console.error('Error processing DOCX file:', docxError);
//         return NextResponse.json({ 
//           error: 'Failed to process DOCX file. Please ensure it\'s a valid DOCX document.' 
//         }, { status: 400 });
//       }
//     }

//     // Handle DOC files with textract
//     if (file.type === 'application/msword') {
//       try {
//         const arrayBuffer = await file.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);
//         const tempPath = path.join(os.tmpdir(), `temp_${Date.now()}.doc`);
        
//         // Save the DOC file temporarily
//         await writeFile(tempPath, buffer);
        
//         // Extract text using textract
//         const text = await textractFromFile(tempPath, {
//           preserveLineBreaks: true,
//           preserveOnlyMultipleLineBreaks: true
//         }) as string;
        
//         // Clean up temporary file
//         await unlink(tempPath).catch(() => {});
        
//         return NextResponse.json({ 
//           text: text,
//           messages: [] 
//         });
//       } catch (docError) {
//         console.error('Error processing DOC file with textract:', docError);
        
//         // Clean up on error
//         try {
//           const tempPath = path.join(os.tmpdir(), `temp_${Date.now()}.doc`);
//           await unlink(tempPath).catch(() => {});
//         } catch (cleanupError) {
//           console.error('Error cleaning up temp file:', cleanupError);
//         }
        
//         return NextResponse.json({ 
//           error: 'Failed to process DOC file. Please convert it to DOCX format first using Microsoft Word, Google Docs, or LibreOffice.' 
//         }, { status: 400 });
//       }
//     }

//     return NextResponse.json({ 
//       error: 'Unsupported file type. Please upload a DOCX or DOC file.' 
//     }, { status: 400 });

  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ 
      error: 'Failed to process file' 
    }, { status: 500 });
  }
}

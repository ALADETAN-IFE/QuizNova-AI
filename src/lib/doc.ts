export async function extractTextFromDOC(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch('/api/doc', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract text from DOC file');
      }
  
      const result = await response.json();
      return result.text;
    } catch (error) {
      console.error('Error extracting text from DOC:', error);
      throw new Error('Failed to process DOC file. Please try converting it to DOCX format first.');
    }
}
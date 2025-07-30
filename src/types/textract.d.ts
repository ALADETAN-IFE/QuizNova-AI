declare module 'textract' {
  interface TextractOptions {
    preserveLineBreaks?: boolean;
    preserveOnlyMultipleLineBreaks?: boolean;
    [key: string];
  }

  interface Textract {
    fromFileWithPath(
      filePath: string,
      options: TextractOptions,
      callback: (error: Error | null, text: string) => void
    ): void;
  }

  const textract: Textract;
  export = textract;
} 
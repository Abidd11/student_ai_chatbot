import { useState, useCallback } from "react";

interface PDFFile {
  id: string;
  name: string;
  uri: string;
  size: number;
  uploadedAt: Date;
}

export function usePDFUpload() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickPDF = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Placeholder for PDF picker
      // In production, use expo-document-picker
      console.log("PDF picker triggered");

      setIsLoading(false);
      return null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to pick PDF";
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  const removePDF = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const clearAllPDFs = useCallback(() => {
    setFiles([]);
  }, []);

  const getFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return {
    files,
    isLoading,
    error,
    pickPDF,
    removePDF,
    clearAllPDFs,
    getFileSize,
  };
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export interface ProcessingState {
  isProcessing: boolean;
  currentFile: string;
  progress: number;
}

export interface FileProcessingError {
  fileName: string;
  error: string;
}

export type ProcessingStatus = 'idle' | 'processing' | 'complete' | 'error';

export interface ExtractedMetadata {
  company: string;
  type: string;
  date: string;
  assumed: boolean;
}
export interface ProcessingResult {
  original: string;
  extracted: ExtractedMetadata;
  newName: string;
  success: boolean;
  error?: string;
}
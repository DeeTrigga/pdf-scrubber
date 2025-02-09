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

export interface ProcessingResult {
  status: ProcessingStatus;
  error?: string;
}
export interface ExtractedMetadata {
  company: string;
  type: string;
  date: string;
  assumed: boolean;
}

export interface PDFResult {
  original: string;
  extracted: ExtractedMetadata;
  newName: string;
  success: boolean;
  error?: string;
}

export interface RenameResult {
  success: boolean;
  error?: string;
}

export interface FolderSelection {
  path: string;
  pdfCount: number;
}

// Electron API types
export interface ElectronAPI {
  selectFolder: () => Promise<FolderSelection>;
  processPDFs: (folderPath: string) => Promise<PDFResult[]>;
  confirmRename: (data: RenameData) => Promise<RenameResult>;
}

export interface RenameData {
  folderPath: string;
  oldName: string;
  newName: string;
}

// Declare global window type
declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
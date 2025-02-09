import React, { useState, useCallback, useEffect } from 'react';
import { Alert, AlertDescription } from './ui/Alert';
import { Progress } from './ui/Progress';
import { FileSearch, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { ProcessingResult, ProcessingState, Toast as ToastType } from '../../electron/types';
import { PDFResult } from '../index';

  declare global {
  interface Window {
    ElectronAPI: {
      selectFolder: () => Promise<{ path: string; pdfCount: number }>;
      processPDFs: (path: string) => Promise<ProcessingResult[]>;
      confirmRename: (args: { folderPath: string; oldName: string; newName: string }) => Promise<void>;
    };
  }
}
import { Toast } from './ui/Toast';

// Ensure TypeScript recognizes the global window object
declare const window: Window & typeof globalThis;
import { ResultSkeleton } from './ui/Skeleton';
import { v4 as uuidv4 } from 'uuid';

const PDFScrubber: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [pdfCount, setPdfCount] = useState<number>(0);
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [processing, setProcessing] = useState<ProcessingState>({
    isProcessing: false,
    currentFile: '',
    progress: 0
  });
  const [visibleResults, setVisibleResults] = useState<Set<number>>(new Set());
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate initial load
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const showToast = useCallback((message: string, type: ToastType['type']) => {
    const newToast: ToastType = {
      id: uuidv4(),
      message,
      type
    };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const handleSelectFolder = useCallback(async () => {
    try {
      setInitialLoading(true);
      const result = await window.electron.selectFolder();
      if (result) {
        setSelectedPath(result.path);
        setPdfCount(result.pdfCount);
        setResults([]);
        setVisibleResults(new Set());
        showToast(`Found ${result.pdfCount} PDF files`, 'success');
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      showToast('Failed to select folder', 'error');
    } finally {
      setInitialLoading(false);
    }
  }, [showToast]);

  const handleProcess = useCallback(async () => {
    if (!selectedPath) return;

    setProcessing({
      isProcessing: true,
      currentFile: '',
      progress: 0
    });
    setResults([]);

    try {
      const results = await window.electron.processPDFs(selectedPath);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        setProcessing(prev => ({
          ...prev,
          currentFile: result.original,
          progress: ((i + 1) / results.length) * 100
        }));
        setResults(prev => [...prev, result]);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setVisibleResults(new Set(results.map((_, i) => i)));
      showToast('Successfully processed all files', 'success');
    } catch (error) {
      console.error('Processing failed:', error);
      showToast('Failed to process PDFs', 'error');
    } finally {
      setProcessing({
        isProcessing: false,
        currentFile: '',
        progress: 0
      });
    }
  }, [selectedPath, showToast]);

  const handleApprove = useCallback(async (index: number) => {
    if (!results[index]) return;

    try {
      const oldName = results[index].original;
      const newName = results[index].newName;

      await window.electron.confirmRename({
        folderPath: selectedPath,
        oldName,
        newName
      });

      showToast(`Successfully renamed ${oldName}`, 'success');
      setVisibleResults(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    } catch (error) {
      showToast(`Failed to rename file: ${results[index].original}`, 'error');
    }
  }, [selectedPath, results, showToast]);

  if (isLoading) {
    return <ResultSkeleton />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Component content (same as before) */}

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Wrap with Error Boundary in parent component
export default PDFScrubber;
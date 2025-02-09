import React, { useState, useCallback } from 'react';
import { Header } from './ui/Header';
import { Controls } from './ui/Controls';
import { ProcessingStatus } from './ui/LoadingStates';
import { ResultsList } from './ui/ResultsList';
import { PDFResult, RenameData } from '../types';

const PDFScrubber: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [pdfCount, setPdfCount] = useState<number>(0);
  const [results, setResults] = useState<PDFResult[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [visibleResults, setVisibleResults] = useState<Set<number>>(new Set());
  const [initialLoading, setInitialLoading] = useState<boolean>(false);

  const handleSelectFolder = useCallback(async () => {
    try {
      setInitialLoading(true);
      const result = await window.electron.selectFolder();
      if (result) {
        setSelectedPath(result.path);
        setPdfCount(result.pdfCount);
        setResults([]);
        setVisibleResults(new Set());
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  const handleProcess = useCallback(async () => {
    if (!selectedPath) return;

    setProcessing(true);
    setResults([]);
    setProgress(0);
    setCurrentFile('');

    try {
      const results = await window.electron.processPDFs(selectedPath);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        setCurrentFile(result.original);
        setProgress(((i + 1) / results.length) * 100);
        setResults(prev => [...prev, result]);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setVisibleResults(new Set(results.map((_, i) => i)));
    } catch (error) {
      console.error('Processing failed:', error);
      alert('Failed to process PDFs: ' + (error as Error).message);
    } finally {
      setProcessing(false);
      setCurrentFile('');
    }
  }, [selectedPath]);

  const handleApprove = useCallback(async (index: number) => {
    try {
      const renameData: RenameData = {
        folderPath: selectedPath,
        oldName: results[index].original,
        newName: results[index].newName
      };

      const result = await window.electron.confirmRename(renameData);

      if (result.success) {
        handleRemoveResult(index);
      } else {
        alert('Failed to rename file: ' + result.error);
      }
    } catch (error) {
      alert('Error renaming file: ' + (error as Error).message);
    }
  }, [selectedPath, results]);

  const handleReject = useCallback((index: number) => {
    handleRemoveResult(index);
  }, []);

  const handleRemoveResult = useCallback((index: number) => {
    setVisibleResults(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <Header title="PDF Scrubber" />

        <Controls
          onSelectFolder={handleSelectFolder}
          onProcess={handleProcess}
          selectedPath={selectedPath}
          pdfCount={pdfCount}
          processing={processing}
          initialLoading={initialLoading}
        />

        {processing && (
          <ProcessingStatus
            currentFile={currentFile}
            progress={progress}
          />
        )}

        <ResultsList
          results={results}
          visibleResults={visibleResults}
          pdfCount={pdfCount}
          processing={processing}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
};

export default PDFScrubber;
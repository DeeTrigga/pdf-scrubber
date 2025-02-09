import React from 'react';
import { ResultItem } from './ResultItem';
import { LoadingResults } from './LoadingStates';
import { PDFResult } from '../../types';

interface ResultsListProps {
  results: PDFResult[];
  visibleResults: Set<number>;
  pdfCount: number;
  processing: boolean;
  onApprove: (index: number) => void;
  onReject: (index: number) => void;
}

export const ResultsList: React.FC<ResultsListProps> = ({
  results,
  visibleResults,
  pdfCount,
  processing,
  onApprove,
  onReject
}) => {
  if (processing) {
    return <LoadingResults />;
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto border rounded-lg p-4">
      <h2 className="text-xl font-semibold sticky top-0 bg-white py-2">
        Results ({results.length} of {pdfCount}):
      </h2>
      {results.map((result, index) => (
        visibleResults.has(index) && (
          <ResultItem
            key={index}
            result={result}
            onApprove={() => onApprove(index)}
            onReject={() => onReject(index)}
          />
        )
      ))}
    </div>
  );
};
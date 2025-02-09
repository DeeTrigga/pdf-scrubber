import React from 'react';
import { Alert, AlertDescription } from './Alert';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { PDFResult } from '../../types';

interface ResultItemProps {
    result: PDFResult;
    onApprove: () => void;
    onReject: () => void;
}

export const ResultItem: React.FC<ResultItemProps> = ({
    result,
    onApprove,
    onReject
}) => (
    <Alert className="bg-blue-50 border-blue-100 transition-all duration-300">
        <div className="flex justify-between items-start">
            <AlertDescription className="flex-grow">
                <div className="space-y-1">
                    <div className="font-medium">Original: {result.original}</div>
                    <div className="text-sm text-gray-600">
                        Extracted: {result.extracted.company} | {result.extracted.type} | {result.extracted.date}
                    </div>
                    <div className={`text-sm font-medium ${result.extracted.assumed ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                        → {result.newName}
                        {result.extracted.assumed && (
                            <span className="ml-2 text-xs bg-yellow-100 px-2 py-1 rounded">
                                Best guess
                            </span>
                        )}
                    </div>
                </div>
            </AlertDescription>
            <div className="flex gap-2 ml-4">
                <button
                    onClick={onApprove}
                    className="p-2 hover:bg-green-100 rounded-full transition-colors"
                    aria-label="Approve rename"
                >
                    <ThumbsUp className="h-5 w-5 text-green-600" />
                </button>
                <button
                    onClick={onReject}
                    className="p-2 hover:bg-red-100 rounded-full transition-colors"
                    aria-label="Reject rename"
                >
                    <ThumbsDown className="h-5 w-5 text-red-600" />
                </button>
            </div>
        </div>
    </Alert>
);
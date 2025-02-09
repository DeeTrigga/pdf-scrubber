import React from 'react';
import { LoadingButton } from '../ui/LoadingStates';

interface ControlsProps {
    onSelectFolder: () => void;
    onProcess: () => void;
    selectedPath: string;
    pdfCount: number;
    processing: boolean;
    initialLoading: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
    onSelectFolder,
    onProcess,
    selectedPath,
    pdfCount,
    processing,
    initialLoading
}) => (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
            <LoadingButton
                loading={initialLoading}
                onClick={onSelectFolder}
                disabled={processing}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Select Folder
            </LoadingButton>
            {selectedPath && (
                <span className="text-gray-600">
                    {selectedPath} ({pdfCount} PDFs found)
                </span>
            )}
        </div>

        <LoadingButton
            loading={processing}
            onClick={onProcess}
            disabled={!selectedPath || processing || pdfCount === 0}
            className={`px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ${!selectedPath || processing || pdfCount === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500'
                }`}
        >
            {processing ? 'Processing...' : 'Start Processing'}
        </LoadingButton>
    </div>
);
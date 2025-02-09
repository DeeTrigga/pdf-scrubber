import React from 'react';
import { Loader2 } from 'lucide-react';
import { Progress } from '../components/ui/Progress';

interface ProcessingStatusProps {
    currentFile: string;
    progress: number;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
    currentFile,
    progress
}) => (
    <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing: {currentFile}</span>
        </div>
        <Progress value={progress} className="w-full" />
        <div className="text-sm text-gray-500">
            {Math.round(progress)}% complete
        </div>
    </div>
);

interface LoadingOverlayProps {
    message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    message = 'Loading...'
}) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="mt-2 text-gray-700">{message}</span>
        </div>
    </div>
);

interface LoadingButtonProps {
    loading: boolean;
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
    loading,
    children,
    onClick,
    disabled,
    className = ''
}) => (
    <button
        onClick={onClick}
        disabled={loading || disabled}
        className={`inline-flex items-center justify-center ${className}`}
    >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
    </button>
);

export const LoadingResults: React.FC = () => (
    <div className="space-y-4">
        {[1, 2, 3].map((i) => (
            <div
                key={i}
                className="animate-pulse bg-white rounded-lg p-4 space-y-3"
            >
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
        ))}
    </div>
);
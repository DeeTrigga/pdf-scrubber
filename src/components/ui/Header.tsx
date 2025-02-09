import React from 'react';
import { FileSearch } from 'lucide-react';

interface HeaderProps {
    title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => (
    <div className="flex items-center gap-3">
        <FileSearch className="h-8 w-8 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    </div>
);
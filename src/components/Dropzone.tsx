import React, { useState, useCallback } from 'react';
import { Upload, FileVideo } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface DropzoneProps {
    onFileSelect: (file: File) => void;
    className?: string;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect, className }) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('video/')) {
                onFileSelect(files[0]);
            }
        },
        [onFileSelect]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div
            className={twMerge(
                'relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ease-out cursor-pointer group',
                isDragOver
                    ? 'border-primary bg-primary/10 scale-[1.02]'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5',
                className
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
        >
            <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="video/*"
                onChange={handleInputChange}
            />
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className={clsx(
                    "p-4 rounded-full bg-surface transition-transform duration-300",
                    isDragOver ? "scale-110 shadow-lg shadow-primary/25" : "shadow-md"
                )}>
                    {isDragOver ? (
                        <FileVideo className="w-8 h-8 text-primary animate-pulse" />
                    ) : (
                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors" />
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-medium text-white mb-1">
                        Drag & drop video here
                    </h3>
                    <p className="text-sm text-slate-400">
                        or click to browse local files
                    </p>
                </div>
            </div>
        </div>
    );
};

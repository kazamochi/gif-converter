import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ImageDropzoneProps {
    onFileSelect: (file: File) => void;
    className?: string;
    acceptedFormats?: string;
    title?: string;
    description?: string;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
    onFileSelect,
    className,
    acceptedFormats = "image/*",
    title = "画像をドロップ または クリックして選択",
    description = "PNG, JPG, WEBP対応"
}) => {
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
            if (files.length > 0 && files[0].type.startsWith('image/')) {
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
                    ? 'border-orange-500 bg-orange-500/10 scale-[1.02]'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5',
                className
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('imageFileInput')?.click()}
        >
            <input
                type="file"
                id="imageFileInput"
                className="hidden"
                accept={acceptedFormats}
                onChange={handleInputChange}
            />
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className={clsx(
                    "p-4 rounded-full bg-surface transition-transform duration-300",
                    isDragOver ? "scale-110 shadow-lg shadow-orange-500/25" : "shadow-md"
                )}>
                    {isDragOver ? (
                        <ImageIcon className="w-8 h-8 text-orange-500 animate-pulse" />
                    ) : (
                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors" />
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-medium text-white mb-1">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-400">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

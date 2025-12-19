import { useState, useCallback, useRef } from 'react';
import { vectorizeImage } from '../engine/VectorizerEngine';
import type { VectorizerOptions, VectorizerResult } from '../engine/VectorizerEngine';

interface UseVectorizerReturn {
    isProcessing: boolean;
    progress: number;
    status: string;
    result: VectorizerResult | null;
    error: string | null;
    processImage: (file: File, options?: Partial<VectorizerOptions>) => Promise<void>;
    reset: () => void;
    downloadSvg: (filename?: string) => void;
}

export function useVectorizer(): UseVectorizerReturn {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('');
    const [result, setResult] = useState<VectorizerResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const resultRef = useRef<VectorizerResult | null>(null);

    const processImage = useCallback(async (file: File, options?: Partial<VectorizerOptions>) => {
        setIsProcessing(true);
        setProgress(0);
        setStatus('Loading image...');
        setError(null);
        setResult(null);

        try {
            // Load image into ImageData
            const img = new Image();
            const url = URL.createObjectURL(file);

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = url;
            });

            // Create canvas and get ImageData
            const canvas = document.createElement('canvas');
            // Limit max dimension for performance
            const maxDim = 1024;
            let width = img.width;
            let height = img.height;
            if (width > maxDim || height > maxDim) {
                const scale = Math.min(maxDim / width, maxDim / height);
                width = Math.round(width * scale);
                height = Math.round(height * scale);
            }
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height);

            URL.revokeObjectURL(url);

            // Run vectorization
            const vectorResult = await vectorizeImage(
                imageData,
                options,
                (p, s) => {
                    setProgress(p);
                    setStatus(s);
                }
            );

            resultRef.current = vectorResult;
            setResult(vectorResult);
        } catch (err) {
            console.error('Vectorization error:', err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const reset = useCallback(() => {
        setIsProcessing(false);
        setProgress(0);
        setStatus('');
        setResult(null);
        setError(null);
        resultRef.current = null;
    }, []);

    const downloadSvg = useCallback((filename: string = 'vectorized.svg') => {
        const svg = resultRef.current?.svg;
        if (!svg) return;

        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, []);

    return {
        isProcessing,
        progress,
        status,
        result,
        error,
        processImage,
        reset,
        downloadSvg
    };
}

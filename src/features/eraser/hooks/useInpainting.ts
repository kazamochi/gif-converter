import { useState, useCallback, useRef } from 'react';
import { inpaintImage } from '../engine/InpaintingEngine';
import type { InpaintingOptions, InpaintingResult } from '../engine/InpaintingEngine';

interface UseInpaintingReturn {
    isProcessing: boolean;
    progress: number;
    status: string;
    result: string | null;
    error: string | null;
    processImage: (imageData: ImageData, maskData: ImageData, options?: Partial<InpaintingOptions>) => Promise<void>;
    reset: () => void;
    downloadResult: (filename?: string) => void;
}

export function useInpainting(): UseInpaintingReturn {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const resultRef = useRef<InpaintingResult | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const processImage = useCallback(async (
        imageData: ImageData,
        maskData: ImageData,
        options?: Partial<InpaintingOptions>
    ) => {
        setIsProcessing(true);
        setProgress(0);
        setStatus('Starting...');
        setError(null);
        setResult(null);

        try {
            const inpaintResult = await inpaintImage(
                imageData,
                maskData,
                options,
                (p, s) => {
                    setProgress(p);
                    setStatus(s);
                }
            );

            resultRef.current = inpaintResult;

            // Store canvas for download & display
            const canvas = document.createElement('canvas');
            canvas.width = inpaintResult.imageData.width;
            canvas.height = inpaintResult.imageData.height;
            const ctx = canvas.getContext('2d')!;
            ctx.putImageData(inpaintResult.imageData, 0, 0);
            canvasRef.current = canvas;

            // Convert to Data URL
            setResult(canvas.toDataURL('image/png'));

        } catch (err) {
            console.error('Inpainting error:', err);
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
        canvasRef.current = null;
    }, []);

    const downloadResult = useCallback((filename: string = 'inpainted.png') => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png');
    }, []);

    return {
        isProcessing,
        progress,
        status,
        result,
        error,
        processImage,
        reset,
        downloadResult
    };
}

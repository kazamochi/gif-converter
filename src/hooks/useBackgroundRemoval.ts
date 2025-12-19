import { useState, useCallback } from 'react';

interface UseBackgroundRemovalOptions {
    onProgress?: (progress: number) => void;
    onStatus?: (status: string) => void;
}

interface BackgroundRemovalResult {
    imageUrl: string;
    blob: Blob;
}

export const useBackgroundRemoval = (options?: UseBackgroundRemovalOptions) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('');
    const [result, setResult] = useState<BackgroundRemovalResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const updateProgress = useCallback((value: number) => {
        setProgress(value);
        options?.onProgress?.(value);
    }, [options]);

    const updateStatus = useCallback((msg: string) => {
        setStatus(msg);
        options?.onStatus?.(msg);
    }, [options]);

    const processImage = useCallback(async (imageFile: File) => {
        setIsProcessing(true);
        setError(null);
        setResult(null);
        updateProgress(0);
        updateStatus('AIモデルを読み込んでいます...');

        try {
            // Dynamic import to avoid loading on other pages
            const imgly = await import("@imgly/background-removal");

            // @imgly/background-removal が全部やってくれます
            const blob = await imgly.removeBackground(imageFile, {
                progress: (key, current, total) => {
                    const pct = Math.round((current / total) * 100);
                    updateProgress(pct);
                    if (key === 'compute:inference') {
                        updateStatus('背景を削除しています...');
                    } else {
                        updateStatus(`モデルをダウンロード中... ${pct}%`);
                    }
                },
            });

            // Blob を画像URLに変換
            const resultUrl = URL.createObjectURL(blob);
            setResult({ imageUrl: resultUrl, blob });
            updateProgress(100);
            updateStatus('完了');

        } catch (err) {
            console.error("Background removal failed:", err);
            const errorMessage = err instanceof Error ? err.message : '背景の削除に失敗しました';
            setError(errorMessage);
            updateStatus(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    }, [updateProgress, updateStatus]);

    const reset = useCallback(() => {
        if (result?.imageUrl) {
            URL.revokeObjectURL(result.imageUrl);
        }
        setResult(null);
        setError(null);
        setProgress(0);
        setStatus('');
        setIsProcessing(false);
    }, [result]);

    const download = useCallback(async (filename = 'background-removed.png') => {
        if (!result) return;

        const a = document.createElement('a');
        a.href = result.imageUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, [result]);

    return {
        isProcessing,
        progress,
        status,
        result,
        error,
        processImage,
        reset,
        download
    };
};

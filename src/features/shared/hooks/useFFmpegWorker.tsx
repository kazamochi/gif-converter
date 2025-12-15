import { useState, useEffect, useRef, useCallback } from 'react';

export interface ConversionSettings {
    fps: number;
    width: number;
    trimStart: number;
    trimEnd: number;
    speed: number;
    mode: 'normal' | 'reverse' | 'boomerang';
    crop?: { x: number; y: number; width: number; height: number };
}

interface PendingRequest {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
}

/**
 * Hook for communicating with the isolated ffmpeg worker iframe.
 * Uses postMessage for zero-copy data transfer via Transferable Objects.
 */
export const useFFmpegWorker = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const pendingRequests = useRef<Map<string, PendingRequest>>(new Map());
    const requestIdCounter = useRef(0);

    // Generate unique request ID
    const generateId = useCallback(() => {
        return `req_${++requestIdCounter.current}_${Date.now()}`;
    }, []);

    // Load FFmpeg in the worker
    const loadFFmpeg = useCallback(() => {
        if (!iframeRef.current?.contentWindow) return;

        const id = generateId();
        iframeRef.current.contentWindow.postMessage({
            type: 'LOAD',
            id
        }, '*');
    }, [generateId]);

    // Handle messages from the worker iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, id, success, data, error: errorMsg, progress: prog } = event.data;

            if (type === 'WORKER_READY') {
                // Worker is ready, now load ffmpeg
                loadFFmpeg();
            }

            if (type === 'LOAD_RESULT') {
                if (success) {
                    setLoaded(true);
                    setError(null);
                } else {
                    setError('Failed to load conversion engine.');
                }
            }

            if (type === 'PROGRESS') {
                setProgress(prog);
            }

            if (type === 'CONVERT_RESULT' && id) {
                const pending = pendingRequests.current.get(id);
                if (pending) {
                    if (success) {
                        pending.resolve(data);
                    } else {
                        pending.reject(new Error(errorMsg || 'Conversion failed'));
                    }
                    pendingRequests.current.delete(id);
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [loadFFmpeg]);

    // Convert video to GIF
    const convert = useCallback(async (
        videoFile: File,
        settings: ConversionSettings
    ): Promise<string> => {
        if (!iframeRef.current?.contentWindow) {
            throw new Error('Worker not ready');
        }

        setProgress(0);

        // Read file as ArrayBuffer
        const arrayBuffer = await videoFile.arrayBuffer();

        const id = generateId();

        return new Promise((resolve, reject) => {
            pendingRequests.current.set(id, {
                resolve: (data: ArrayBuffer) => {
                    // Convert ArrayBuffer back to Blob URL
                    const blob = new Blob([data], { type: 'image/gif' });
                    resolve(URL.createObjectURL(blob));
                },
                reject
            });

            // Send to worker with Transferable Objects (zero-copy)
            iframeRef.current!.contentWindow!.postMessage({
                type: 'CONVERT',
                id,
                videoData: arrayBuffer,
                settings
            }, '*', [arrayBuffer]);
        });
    }, [generateId]);

    // Render component for the hidden iframe
    const WorkerIframe = useCallback(() => (
        <iframe
            ref={iframeRef}
            src="/converter-worker.html"
            style={{
                display: 'none',
                width: 0,
                height: 0,
                border: 'none'
            }}
            title="Converter Worker"
        />
    ), []);

    return {
        loaded,
        error,
        progress,
        convert,
        WorkerIframe
    };
};

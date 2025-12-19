import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, RotateCcw, Loader2, Eraser, ZoomIn, ZoomOut, Zap } from 'lucide-react';
import { AdSpace } from '../../../components/AdSpace';
import { ToolDescription } from '../../../components/ToolDescription';
import { ImageDropzone } from '../../../components/shared/ImageDropzone';
import { useInpainting } from '../hooks/useInpainting';

const MagicEraserPage: React.FC = () => {
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [brushSize, setBrushSize] = useState(30);
    const [isDrawing, setIsDrawing] = useState(false);
    const [zoom, setZoom] = useState(1);

    const imageCanvasRef = useRef<HTMLCanvasElement>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    // Quick Erase (simple algorithm)
    const {
        isProcessing,
        progress: processingProgress,
        result,
        error: quickError,
        processImage,
        reset,
        downloadResult
    } = useInpainting();

    const progress = processingProgress;

    const handleFileSelect = useCallback((file: File) => {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        const img = new Image();
        img.onload = () => {
            imageRef.current = img;
            setImageLoaded(true);

            if (imageCanvasRef.current && maskCanvasRef.current) {
                const imgCanvas = imageCanvasRef.current;
                const maskCanvas = maskCanvasRef.current;

                imgCanvas.width = img.width;
                imgCanvas.height = img.height;
                maskCanvas.width = img.width;
                maskCanvas.height = img.height;

                const imgCtx = imgCanvas.getContext('2d')!;
                imgCtx.drawImage(img, 0, 0);

                const maskCtx = maskCanvas.getContext('2d')!;
                maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
            }
        };
        img.src = url;
    }, []);

    const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = maskCanvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }, []);

    const drawBrush = useCallback((x: number, y: number) => {
        const maskCanvas = maskCanvasRef.current;
        if (!maskCanvas) return;

        const ctx = maskCanvas.getContext('2d')!;
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = brushSize;
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }, [brushSize]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!imageLoaded || isProcessing || result) return;
        setIsDrawing(true);
        const { x, y } = getCanvasCoords(e);
        const maskCanvas = maskCanvasRef.current;
        if (maskCanvas) {
            const ctx = maskCanvas.getContext('2d')!;
            ctx.beginPath();
            ctx.moveTo(x, y);
            drawBrush(x, y);
        }
    }, [imageLoaded, isProcessing, result, getCanvasCoords, drawBrush]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || isProcessing || result) return;
        const { x, y } = getCanvasCoords(e);
        drawBrush(x, y);
    }, [isDrawing, isProcessing, result, getCanvasCoords, drawBrush]);

    const handleMouseUp = useCallback(() => {
        if (isDrawing) {
            setIsDrawing(false);
            const maskCanvas = maskCanvasRef.current;
            if (maskCanvas) {
                const ctx = maskCanvas.getContext('2d')!;
                ctx.closePath();
            }
        }
    }, [isDrawing]);

    const handleQuickErase = useCallback(async () => {
        if (!imageCanvasRef.current || !maskCanvasRef.current) return;

        const imgCtx = imageCanvasRef.current.getContext('2d')!;
        const imageData = imgCtx.getImageData(0, 0, imageCanvasRef.current.width, imageCanvasRef.current.height);

        const maskCtx = maskCanvasRef.current.getContext('2d')!;
        const maskData = maskCtx.getImageData(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);

        await processImage(imageData, maskData, { passes: 50, blurRadius: 5 });
    }, [processImage]);

    const handleReset = useCallback(() => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        setImageLoaded(false);
        imageRef.current = null;
        reset();

        // Reset canvas
        if (imageRef.current) { // Reset logic...
            const img = imageRef.current;
            if (imageCanvasRef.current && maskCanvasRef.current) {
                const imgCtx = imageCanvasRef.current.getContext('2d')!;
                imgCtx.drawImage(img, 0, 0);

                const maskCtx = maskCanvasRef.current.getContext('2d')!;
                maskCtx.clearRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);
            }
        }
    }, [previewUrl, reset]);

    const clearMask = useCallback(() => {
        if (maskCanvasRef.current) {
            const ctx = maskCanvasRef.current.getContext('2d')!;
            ctx.clearRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);
        }
    }, []);

    const handleDownload = () => {
        downloadResult(`erased - ${Date.now()}.png`);
    };

    // Display result on canvas when ready
    useEffect(() => {
        if (result && imageCanvasRef.current) {
            const img = new Image();
            img.onload = () => {
                const ctx = imageCanvasRef.current!.getContext('2d')!;

                // Clear and draw the result
                ctx.clearRect(0, 0, imageCanvasRef.current!.width, imageCanvasRef.current!.height);
                ctx.drawImage(img, 0, 0);

                if (maskCanvasRef.current) {
                    const maskCtx = maskCanvasRef.current.getContext('2d')!;
                    maskCtx.clearRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);
                }
            };
            img.src = result;
        }
    }, [result]);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                    {t('magic_eraser.title', 'Magic Eraser')}
                </h1>
                <p className="text-slate-400">
                    {t('magic_eraser.subtitle', 'Remove unwanted objects from your photos instantly.')}
                </p>
            </div>

            {!selectedFile && <AdSpace slotId="ai-eraser-top" className="my-8" />}

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-10 space-y-6">
                {!selectedFile ? (
                    <ImageDropzone
                        onFileSelect={handleFileSelect}
                        title={t('magic_eraser.upload_prompt', 'Upload Image')}
                        description={t('magic_eraser.upload_desc', 'Select an image to remove objects from')}
                    />
                ) : (
                    <div className="space-y-6">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center gap-4 bg-zinc-800/50 rounded-xl p-4">
                            <div className="flex items-center gap-2">
                                <Eraser className="w-5 h-5 text-slate-400" />
                                <span className="text-sm text-slate-400">{t('magic_eraser.brush_size', 'Brush')}:</span>
                                <input
                                    type="range"
                                    min="5"
                                    max="100"
                                    value={brushSize}
                                    onChange={(e) => setBrushSize(Number(e.target.value))}
                                    className="w-32"
                                />
                                <span className="text-sm text-white w-8">{brushSize}px</span>
                            </div>

                            <div className="flex items-center gap-2 ml-auto">
                                <button
                                    onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                                    className="p-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
                                >
                                    <ZoomOut className="w-4 h-4 text-white" />
                                </button>
                                <span className="text-sm text-slate-400">{Math.round(zoom * 100)}%</span>
                                <button
                                    onClick={() => setZoom(z => Math.min(2, z + 0.25))}
                                    className="p-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
                                >
                                    <ZoomIn className="w-4 h-4 text-white" />
                                </button>

                                <button
                                    onClick={clearMask}
                                    className="ml-4 px-4 py-2 bg-zinc-700 rounded-lg text-sm text-white hover:bg-zinc-600 transition-colors"
                                >
                                    {t('magic_eraser.clear_mask', 'Clear Mask')}
                                </button>

                                <button
                                    onClick={handleReset}
                                    className="ml-2 px-4 py-2 bg-zinc-700 rounded-lg text-sm text-white hover:bg-zinc-600 transition-colors flex items-center gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    {t('common.reset', 'Reset')}
                                </button>
                            </div>
                        </div>

                        {/* Canvas Area */}
                        <div
                            ref={containerRef}
                            className="relative bg-zinc-800 rounded-xl overflow-auto border border-zinc-700"
                            style={{ maxHeight: '60vh' }}
                        >
                            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
                                <canvas ref={imageCanvasRef} className="block" />
                                <canvas
                                    ref={maskCanvasRef}
                                    className="absolute top-0 left-0 cursor-crosshair"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                />

                                {/* Processing Overlay */}
                                {isProcessing && (
                                    <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur-sm flex items-center justify-center z-20">
                                        <div className="text-center space-y-4 max-w-md p-8">
                                            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto" />
                                            <div className="space-y-2">
                                                <p className="text-white font-medium">
                                                    {t('magic_eraser.processing', 'Processing...')}
                                                </p>
                                                <div className="w-48 bg-zinc-700 rounded-full h-2 overflow-hidden mx-auto">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-sm text-slate-400">{Math.round(progress)}%</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="text-sm text-center text-slate-500">
                            {t('magic_eraser.instruction', 'Paint over the objects you want to remove, then click Erase.')}
                        </p>

                        <div className="flex flex-col items-center gap-4">
                            {/* Erase Button */}
                            {!result && (
                                <button
                                    onClick={handleQuickErase}
                                    disabled={!imageLoaded || isProcessing}
                                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg shadow-purple-500/25 font-bold text-lg"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            <span>{t('magic_eraser.processing', 'Processing...')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-6 h-6" />
                                            <span>{t('magic_eraser.erase', 'Erase Object')}</span>
                                        </>
                                    )}
                                </button>
                            )}

                            {/* Error Message */}
                            {quickError && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex items-center gap-2">
                                    <span className="text-xl">⚠️</span>
                                    <p>{String(quickError)}</p>
                                </div>
                            )}

                            {/* Result Actions */}
                            {result && (
                                <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4">
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all border border-zinc-700 font-semibold"
                                    >
                                        <Download className="w-5 h-5" />
                                        {t('common.download', 'Download Result')}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mt-8">
                            <AdSpace slotId="ai-eraser-result" />
                        </div>
                    </div>
                )}
            </div>

            <ToolDescription toolId="magic-eraser" />
            <AdSpace slotId="ai-eraser-bottom" className="mt-12" />
        </div>
    );
};

export default MagicEraserPage;

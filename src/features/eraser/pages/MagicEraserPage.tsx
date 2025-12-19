import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Loader2, Eraser, ZoomIn, ZoomOut, Zap, Undo, Redo, ArrowRight, X } from 'lucide-react';
import { AdSpace } from '../../../components/AdSpace';
import { ToolDescription } from '../../../components/ToolDescription';
import { ImageDropzone } from '../../../components/shared/ImageDropzone';
import { useInpainting } from '../hooks/useInpainting';

// Demo Images
import demoBefore from '../../../assets/eraser/demo-before.png';
import demoAfter from '../../../assets/eraser/demo-after.png';

const MagicEraserPage: React.FC = () => {
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [brushSize, setBrushSize] = useState(30);
    const [isDrawing, setIsDrawing] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [showDownloadModal, setShowDownloadModal] = useState(false);

    // History Management
    const [history, setHistory] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState(-1);

    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

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
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const MAX_DIMENSION = 1500;

        const setFileAndPreview = (f: File) => {
            setSelectedFile(f);
            const url = URL.createObjectURL(f);
            setPreviewUrl(url);

            // Init History
            setHistory([url]);
            setCurrentStep(0);
        };

        if (isMobile) {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
                    const scale = Math.min(MAX_DIMENSION / img.width, MAX_DIMENSION / img.height);
                    const newWidth = Math.round(img.width * scale);
                    const newHeight = Math.round(img.height * scale);

                    const canvas = document.createElement('canvas');
                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    const ctx = canvas.getContext('2d')!;
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const resizedFile = new File([blob], file.name, { type: file.type });
                            URL.revokeObjectURL(url);
                            setFileAndPreview(resizedFile);
                        } else {
                            setFileAndPreview(file);
                        }
                    }, file.type);
                } else {
                    setFileAndPreview(file);
                }
            };
            img.src = url;
        } else {
            setFileAndPreview(file);
        }
    }, []);

    // Initialize canvas when previewUrl changes
    useEffect(() => {
        if (!previewUrl || !imageCanvasRef.current || !maskCanvasRef.current || !containerRef.current) return;

        const img = new Image();
        img.onload = () => {
            imageRef.current = img;
            setImageLoaded(true);

            if (imageCanvasRef.current && maskCanvasRef.current && containerRef.current) {
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

                // Calculate fit zoom
                const maxHeight = window.innerHeight * 0.6;
                const maxWidth = containerRef.current.clientWidth;
                const fitScale = Math.min(
                    maxWidth / img.width,
                    maxHeight / img.height,
                    1
                );
                setZoom(fitScale);
            }
        };
        img.src = previewUrl;
    }, [previewUrl]);

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

    const getTouchCoords = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = maskCanvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const touch = e.touches[0];

        return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY
        };
    }, []);

    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!imageLoaded || isProcessing || result) return;
        // e.preventDefault(); // React synthetic events might complain, but valid for native listeners. 
        // Note: For React onTouchStart, we rely on CSS touch-action: none.
        setIsDrawing(true);
        const { x, y } = getTouchCoords(e);
        const maskCanvas = maskCanvasRef.current;
        if (maskCanvas) {
            const ctx = maskCanvas.getContext('2d')!;
            ctx.beginPath();
            ctx.moveTo(x, y);
            drawBrush(x, y);
        }
    }, [imageLoaded, isProcessing, result, getTouchCoords, drawBrush]);

    const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || isProcessing || result) return;
        // e.preventDefault();
        const { x, y } = getTouchCoords(e);
        drawBrush(x, y);
    }, [isDrawing, isProcessing, result, getTouchCoords, drawBrush]);

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
        if (isIOS) {
            setShowDownloadModal(true);
        } else {
            downloadResult(`erased-${Date.now()}.png`);
        }
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
                    {t('product.magic-eraser.title', 'Magic Eraser')}
                </h1>
                <p className="text-slate-400">
                    {t('product.magic-eraser.subtitle', 'Remove unwanted objects from your photos instantly.')}
                </p>
            </div>

            {!selectedFile && <AdSpace slotId="ai-eraser-top" className="my-8" />}

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-10 space-y-6">
                {!selectedFile ? (
                    <ImageDropzone
                        onFileSelect={handleFileSelect}
                        title={t('product.magic-eraser.upload_prompt', 'Upload Image')}
                        description={t('product.magic-eraser.upload_desc', 'Select an image to remove objects from')}
                    />
                ) : (
                    <div className="space-y-6">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center gap-4 bg-zinc-800/50 rounded-xl p-4">
                            <div className="flex items-center gap-2">
                                <Eraser className="w-5 h-5 text-slate-400" />
                                <span className="text-sm text-slate-400">{t('product.magic-eraser.brush_size', 'Brush')}:</span>
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

                            <div className="flex flex-wrap items-center gap-2 ml-auto justify-end">
                                <button
                                    onClick={() => {
                                        if (currentStep > 0) {
                                            const prevStep = currentStep - 1;
                                            setCurrentStep(prevStep);
                                            setPreviewUrl(history[prevStep]);
                                            reset(); // Clear result/mask
                                        }
                                    }}
                                    disabled={currentStep <= 0 || isProcessing}
                                    className="p-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title={t('common.undo', 'Undo')}
                                >
                                    <Undo className="w-4 h-4 text-white" />
                                </button>
                                <button
                                    onClick={() => {
                                        if (currentStep < history.length - 1) {
                                            const nextStep = currentStep + 1;
                                            setCurrentStep(nextStep);
                                            setPreviewUrl(history[nextStep]);
                                            reset();
                                        }
                                    }}
                                    disabled={currentStep >= history.length - 1 || isProcessing}
                                    className="p-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title={t('common.redo', 'Redo')}
                                >
                                    <Redo className="w-4 h-4 text-white" />
                                </button>
                                <div className="w-px h-6 bg-zinc-700 mx-2 hidden sm:block" />
                                <button
                                    onClick={() => setZoom(z => Math.max(0.1, z - 0.1))}
                                    className="p-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
                                >
                                    <ZoomOut className="w-4 h-4 text-white" />
                                </button>
                                <span className="text-sm text-slate-400 min-w-[3ch] text-center">{Math.round(zoom * 100)}%</span>
                                <button
                                    onClick={() => setZoom(z => Math.min(2, z + 0.25))}
                                    className="p-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
                                >
                                    <ZoomIn className="w-4 h-4 text-white" />
                                </button>

                                <button
                                    onClick={clearMask}
                                    className="ml-2 px-3 py-2 bg-zinc-700 rounded-lg text-sm text-white hover:bg-zinc-600 transition-colors whitespace-nowrap"
                                >
                                    {t('product.magic-eraser.clear_mask', 'Clear Mask')}
                                </button>

                                <button
                                    onClick={handleReset}
                                    className="ml-2 px-3 py-2 bg-zinc-700 rounded-lg text-sm text-white hover:bg-zinc-600 transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    <X className="w-4 h-4" />
                                    {t('product.magic-eraser.start_over', 'Start Over')}
                                </button>
                            </div>
                        </div>

                        {/* Canvas Area with Premium Frame */}
                        <div className="relative p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-purple-500/20">
                            <div
                                ref={containerRef}
                                className="relative bg-zinc-900/95 rounded-xl overflow-auto flex items-center justify-center backdrop-blur-sm"
                                style={{ maxHeight: '60vh', minHeight: '50vh' }}
                            >
                                <div style={{ transform: `scale(${zoom})` }}>
                                    <canvas ref={imageCanvasRef} className="block" />
                                    <canvas
                                        ref={maskCanvasRef}
                                        className="absolute top-0 left-0 cursor-crosshair touch-none"
                                        onMouseDown={handleMouseDown}
                                        onMouseMove={handleMouseMove}
                                        onMouseUp={handleMouseUp}
                                        onMouseLeave={handleMouseUp}
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleMouseUp}
                                    />

                                    {/* Processing Overlay */}
                                    {isProcessing && (
                                        <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur-sm flex items-center justify-center z-20">
                                            <div className="text-center space-y-4 max-w-md p-8">
                                                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto" />
                                                <div className="space-y-2">
                                                    <p className="text-white font-medium">
                                                        {t('product.magic-eraser.processing', 'Processing...')}
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
                        </div>

                        <p className="text-sm text-center text-slate-500">
                            {t('product.magic-eraser.instruction', 'Paint over the objects you want to remove, then click Erase.')}
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
                                            <span>{t('product.magic-eraser.processing', 'Processing...')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-6 h-6" />
                                            <span>{t('product.magic-eraser.erase', 'Erase Object')}</span>
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

                                    <button
                                        onClick={() => {
                                            if (result) {
                                                const newHistory = history.slice(0, currentStep + 1);
                                                newHistory.push(result);
                                                setHistory(newHistory);
                                                setCurrentStep(newHistory.length - 1);
                                                setPreviewUrl(result);
                                                reset();
                                            }
                                        }}
                                        className="flex items-center gap-2 px-8 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl transition-all border border-zinc-600 font-semibold"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                        {t('product.magic-eraser.continue', 'Erase More')}
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

            {/* Disclaimer & Demo Section */}
            <div className="max-w-4xl mx-auto space-y-8 mt-12 bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
                {/* Notice */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center space-y-2">
                    <h3 className="text-yellow-200 font-bold text-lg flex items-center justify-center gap-2">
                        <span className="text-2xl">⚠️</span>
                        {t('product.magic-eraser.limitations_title', 'Limitations')}
                    </h3>
                    <p className="text-yellow-100/80 leading-relaxed">
                        {t('product.magic-eraser.limitations_desc', 'This tool uses a lightweight browser-based algorithm. It works best for removing small objects, blemishes, or text. It is NOT suitable for removing people or large complex objects.')}
                    </p>
                </div>

                {/* Before/After Demo */}
                <div className="space-y-6">
                    <h3 className="text-center text-white font-bold text-xl">{t('product.magic-eraser.example', 'Example Usage')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-700/50 group">
                                <img src={demoBefore} alt="Before" className="w-full h-auto transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold border border-white/10">
                                    {t('common.before', 'Before')}
                                </div>
                            </div>
                            <p className="text-center text-slate-400 text-sm">{t('product.magic-eraser.demo_target', 'Target: Small flowers')}</p>
                        </div>
                        <div className="space-y-3">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30 group">
                                <img src={demoAfter} alt="After" className="w-full h-auto transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-purple-500/20">
                                    {t('common.after', 'After')}
                                </div>
                            </div>
                            <p className="text-center text-indigo-300 text-sm">{t('product.magic-eraser.demo_result', 'Result: Clean removal')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <ToolDescription toolId="magic-eraser" />
            <AdSpace slotId="ai-eraser-bottom" className="mt-12" />

            {/* iOS Download Modal */}
            {showDownloadModal && result && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowDownloadModal(false)}
                >
                    <div className="relative max-w-full max-h-full">
                        <img
                            src={result}
                            alt="Erased result"
                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 rounded-b-lg">
                            <p className="text-sm truncate">erased-result.png</p>
                            <p className="text-xs text-amber-400 mt-1">{t('common.ios_save_instruction', '📱 iOS: Long press to save')}</p>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        downloadResult(`erased-${Date.now()}.png`);
                                    }}
                                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    {t('common.download_pc', 'Download for PC')}
                                </button>
                                <button
                                    onClick={() => setShowDownloadModal(false)}
                                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm transition-colors"
                                >
                                    {t('common.close', 'Close')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MagicEraserPage;

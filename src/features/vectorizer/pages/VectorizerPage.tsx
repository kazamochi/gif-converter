import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, RotateCcw, Loader2, Wand2 } from 'lucide-react';
import { AdSpace } from '../../../components/AdSpace';
import { ToolDescription } from '../../../components/ToolDescription';
import { ImageDropzone } from '../../../components/shared/ImageDropzone';
import { useVectorizer } from '../hooks/useVectorizer';

const VectorizerPage: React.FC = () => {
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        isProcessing,
        progress,
        status: _status, // Reserved for future status display
        result,
        error: _error, // Reserved for future error display
        processImage,
        reset: resetVectorizer,
        downloadSvg
    } = useVectorizer();

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleExecute = async () => {
        if (!selectedFile) return;
        await processImage(selectedFile, {
            colorCount: 16,
            detail: 'medium'
        });
    };

    const handleReset = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        resetVectorizer();
    };


    const handleDownload = () => {
        downloadSvg(`vectorized-${Date.now()}.svg`);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                    {t('vectorizer.title', 'AI SVG Vectorizer')}
                </h1>
                <p className="text-slate-400">
                    {t('vectorizer.subtitle', 'Convert raster images to scalable vector graphics with AI precision.')}
                </p>
            </div>

            {/* Ad Space - Before Upload */}
            {!selectedFile && <AdSpace slotId="ai-vectorizer-top" className="my-8" />}

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-10 space-y-6">
                {!selectedFile ? (
                    <ImageDropzone
                        onFileSelect={handleFileSelect}
                        title={t('vectorizer.upload_prompt', 'Upload Image to Vectorize')}
                        description={t('vectorizer.upload_desc', 'Supports JPG, PNG, and WebP')}
                    />
                ) : (
                    <div className="space-y-6">
                        {/* Preview Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Original */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{t('vectorizer.original', 'Original')}</h3>
                                <div className="relative aspect-square bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
                                    {previewUrl && (
                                        <img
                                            src={previewUrl}
                                            alt="Original"
                                            className="w-full h-full object-contain"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Result */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{t('vectorizer.result', 'Vector Result')}</h3>
                                <div className="relative aspect-square bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 bg-white/5">
                                    {/* Checkerboard for transparency */}
                                    <div className="absolute inset-0 opacity-20" style={{
                                        backgroundImage: `
                                            linear-gradient(45deg, #000 25%, transparent 25%),
                                            linear-gradient(-45deg, #000 25%, transparent 25%),
                                            linear-gradient(45deg, transparent 75%, #000 75%),
                                            linear-gradient(-45deg, transparent 75%, #000 75%)
                                        `,
                                        backgroundSize: '20px 20px',
                                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                                    }} />

                                    {isProcessing && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm z-10">
                                            <div className="text-center space-y-4">
                                                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto" />
                                                <div className="space-y-2">
                                                    <p className="text-white font-medium">{t('vectorizer.processing', 'Tracing paths...')}</p>
                                                    <div className="w-48 bg-zinc-700 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {result?.svg ? (
                                        <div
                                            className="relative w-full h-full p-4"
                                            dangerouslySetInnerHTML={{ __html: result.svg }}
                                        />
                                    ) : (
                                        !isProcessing && (
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                                                <p className="text-sm">{t('vectorizer.waiting', 'Ready to process')}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Ad Space - Processing/Ready */}
                        {(isProcessing || (!isProcessing && !result?.svg)) &&
                            <AdSpace slotId={isProcessing ? "ai-vectorizer-processing" : "ai-vectorizer-ready"} className="my-6" />
                        }

                        {/* Controls */}
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors border border-zinc-700"
                            >
                                <RotateCcw className="w-5 h-5" />
                                <span className="hidden sm:inline">{t('common.reset', 'Reset')}</span>
                            </button>

                            {!result?.svg && !isProcessing && (
                                <button
                                    onClick={handleExecute}
                                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/25 font-semibold text-lg"
                                >
                                    <Wand2 className="w-6 h-6" />
                                    {t('vectorizer.execute', 'Vectorize')}
                                </button>
                            )}

                            {result?.svg && (
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/25 font-semibold"
                                >
                                    <Download className="w-5 h-5" />
                                    {t('common.download', 'Download SVG')}
                                </button>
                            )}
                        </div>

                        {/* Ad Space - Result */}
                        {result?.svg && <AdSpace slotId="ai-vectorizer-result" className="mt-6" />}
                    </div>
                )}
            </div>

            <ToolDescription toolId="svg-vectorizer" />
            <AdSpace slotId="ai-vectorizer-bottom" className="mt-12" />
        </div>
    );
};

export default VectorizerPage;

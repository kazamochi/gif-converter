import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, RotateCcw, Loader2, Play, Camera } from 'lucide-react';
import { AdSpace } from '../../../components/AdSpace';
import { ToolDescription } from '../../../components/ToolDescription';
import { ImageDropzone } from '../../../components/shared/ImageDropzone';
import { useBackgroundRemoval } from '../../../hooks/useBackgroundRemoval';
import { NextActionCard } from '../../../components/NextActionCard';

const BackgroundRemoverPage: React.FC = () => {
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        isProcessing,
        progress,
        status,
        result,
        error,
        processImage,
        reset,
        download
    } = useBackgroundRemoval({
        onStatus: (msg) => console.log('Status:', msg)
    });

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        // Don't auto-process - wait for user to click Execute button
    };

    const handleExecute = async () => {
        if (selectedFile) {
            await processImage(selectedFile);
        }
    };

    // Check if ready to execute (file selected but not yet processed)
    const isReadyToExecute = selectedFile && !isProcessing && !result && !error;

    const handleReset = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        reset();
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-500">
                    {t('remove_bg.title')}
                </h1>
                <p className="text-slate-400">
                    {t('remove_bg.subtitle')}
                </p>
            </div>

            {/* Ad Space - Before Upload */}
            {!selectedFile && <AdSpace slotId="ai-eraser-top" className="my-8" />}

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-10 space-y-6">
                {!selectedFile ? (
                    /* File Upload State */
                    <ImageDropzone
                        onFileSelect={handleFileSelect}
                        title={t('remove_bg.upload_prompt')}
                        description={t('remove_bg.upload_desc')}
                    />
                ) : (
                    /* Processing/Result State */
                    <div className="space-y-6">
                        {/* Preview Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Original Image */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{t('remove_bg.original')}</h3>
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

                            {/* Processed Image */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{t('remove_bg.processed')}</h3>
                                <div className="relative aspect-square bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
                                    {/* Checkerboard pattern for transparency */}
                                    <div className="absolute inset-0" style={{
                                        backgroundImage: `
                                            linear-gradient(45deg, #52525b 25%, transparent 25%),
                                            linear-gradient(-45deg, #52525b 25%, transparent 25%),
                                            linear-gradient(45deg, transparent 75%, #52525b 75%),
                                            linear-gradient(-45deg, transparent 75%, #52525b 75%)
                                        `,
                                        backgroundSize: '20px 20px',
                                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                                    }} />

                                    {isProcessing && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm z-10">
                                            <div className="text-center space-y-4">
                                                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto" />
                                                <div className="space-y-2">
                                                    <p className="text-white font-medium">{status}</p>
                                                    <div className="w-48 bg-zinc-700 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-300"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-sm text-slate-400">{progress}%</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {result && (
                                        <img
                                            src={result.imageUrl}
                                            alt="Processed"
                                            className="relative w-full h-full object-contain z-5"
                                        />
                                    )}

                                    {error && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/90">
                                            <div className="text-center space-y-2 px-4">
                                                <div className="text-red-500 text-4xl">⚠️</div>
                                                <p className="text-red-400 font-medium">{error}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Ad Space - Before Processing (visible while waiting for Execute) */}
                        {isReadyToExecute && <AdSpace slotId="ai-eraser-ready" className="my-6" />}

                        {/* Ad Space - During Processing */}
                        {isProcessing && <AdSpace slotId="ai-eraser-processing" className="my-6" />}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors border border-zinc-700"
                            >
                                <RotateCcw className="w-5 h-5" />
                                {t('remove_bg.btn_reset')}
                            </button>

                            {/* Execute Button - shown before processing starts */}
                            {isReadyToExecute && (
                                <button
                                    onClick={handleExecute}
                                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl transition-all shadow-lg shadow-orange-500/25 font-semibold text-lg"
                                >
                                    <Play className="w-6 h-6" />
                                    {t('remove_bg.btn_execute')}
                                </button>
                            )}

                            {result && (
                                <button
                                    onClick={() => download(`background-removed-${Date.now()}.png`)}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl transition-all shadow-lg shadow-orange-500/25 font-semibold"
                                >
                                    <Download className="w-5 h-5" />
                                    {t('remove_bg.btn_download')}
                                </button>
                            )}
                        </div>

                        {/* Ad Space - After Processing */}
                        {result && (
                            <>
                                <AdSpace slotId="ai-eraser-result" className="mt-6" />
                                <div className="mt-8">
                                    <NextActionCard
                                        title={t('next.editor.title', 'Edit this Image')}
                                        description={t('next.editor.desc', 'Enhance, filter, or crop your processed image in our Pro Image Editor.')}
                                        buttonText={t('next.editor.btn', 'Open Image Editor')}
                                        to="/image-tools"
                                        icon={Camera}
                                        color="text-rose-500"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            <ToolDescription toolId="background-remover" />
            <AdSpace slotId="ai-eraser-bottom" className="mt-12" />
        </div>
    );
};

export default BackgroundRemoverPage;

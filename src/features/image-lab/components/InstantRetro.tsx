import { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Download, Upload, Zap, Loader2 } from 'lucide-react';
import { processImage } from '../utils/imageProcessor';
import { useTranslation } from 'react-i18next';

const InstantRetro = () => {
    const { t } = useTranslation(); // Localization will be needed later
    const [image, setImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [flash, setFlash] = useState(false);
    const [dateValue, setDateValue] = useState<string>(new Date().toISOString().split('T')[0]);
    const [useDate, setUseDate] = useState(true);
    const [era, setEra] = useState<'90s' | '60s' | '20s' | '80s'>('90s');

    // Need to store original file for processing
    const fileRef = useRef<File | null>(null);

    const onDropWithRef = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;
        fileRef.current = file;

        const url = URL.createObjectURL(file);
        setImage(url);
        setProcessedImage(null);
    }

    // Re-run hook with correct handler
    const dropzone = useDropzone({
        onDrop: onDropWithRef,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        multiple: false
    });

    const process = async () => {
        if (!fileRef.current) return;

        // Flash Effect
        setFlash(true);
        setTimeout(() => setFlash(false), 300);

        setIsProcessing(true);

        // Simulate "developing" delay for effect?
        setTimeout(async () => {
            try {
                if (!fileRef.current) return;

                // Base options
                let opts: any = {
                    dateStamp: useDate,
                    dateValue: dateValue,
                    format: 'jpeg',
                    quality: 0.85
                };

                switch (era) {
                    case '90s': // 平成 (Standard Instant)
                        opts = { ...opts, contrast: 115, brightness: 100, saturation: 90, vignette: 0.6, grain: 0.1, bloom: 0.4 };
                        break;
                    case '60s': // 昭和 (Silver Screen)
                        opts = { ...opts, dateStamp: false, contrast: 140, brightness: 90, saturation: 0, grain: 0.2, vignette: 0.5 };
                        break;
                    case '20s': // 明治/大正 (Sepia)
                        opts = { ...opts, dateStamp: false, sepia: 0.8, scratches: 0.4, vignette: 0.8, contrast: 110 };
                        break;
                    case '80s': // Cinema (Letterbox)
                        opts = { ...opts, dateStamp: false, letterbox: true, contrast: 110, saturation: 120, brightness: 105, bloom: 0.2, vignette: 0.4 };
                        break;
                }

                const result = await processImage(fileRef.current, opts);

                setProcessedImage(result);
            } catch (e) {
                console.error(e);
            } finally {
                setIsProcessing(false);
            }
        }, 1200); // 1.2s delay for "mechanical" feel
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
            {/* Flash Overlay */}
            <div className={`fixed inset-0 bg-white z-50 pointer-events-none transition-opacity duration-300 ${flash ? 'opacity-100' : 'opacity-0'}`}></div>

            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
                {/* Viewfinder / Preview Area */}
                <div className="aspect-[4/3] bg-black rounded-lg mb-6 relative overflow-hidden flex items-center justify-center border-4 border-zinc-800">
                    {!image ? (
                        <div {...dropzone.getRootProps()} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-900/50 transition-colors">
                            <input {...dropzone.getInputProps()} />
                            <Camera className="w-12 h-12 text-zinc-600 mb-2" />
                            <p className="text-zinc-500 font-mono text-sm">{t('retro.insert_film')}</p>
                        </div>
                    ) : (
                        <div className="relative w-full h-full group">
                            <img
                                src={processedImage || image}
                                alt="Preview"
                                className={`w-full h-full object-contain transition-all duration-500 ${isProcessing ? 'blur-md grayscale' : ''}`}
                            />
                            {/* Re-upload overlay */}
                            <div {...dropzone.getRootProps()} className="absolute top-2 right-2 p-2 bg-black/50 rounded-full cursor-pointer hover:bg-black/80 transition-opacity opacity-0 group-hover:opacity-100">
                                <input {...dropzone.getInputProps()} />
                                <Upload className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    )}

                    {/* Processing Indicator */}
                    {isProcessing && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                            <div className="text-center">
                                <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-2" />
                                <p className="text-orange-500 font-mono text-xs animate-pulse">{t('retro.developing')}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="space-y-6">

                    {/* Film Selector (Era) */}
                    {!processedImage && (
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { id: '90s', icon: '✨', label: '90s' },
                                { id: '80s', icon: '🎬', label: '80s' },
                                { id: '60s', icon: '📺', label: '60s' },
                                { id: '20s', icon: '📜', label: '20s' },
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setEra(f.id as any)}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${era === f.id
                                        ? 'bg-zinc-800 border-orange-500 text-orange-500 shadow-lg scale-105'
                                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                                        }`}
                                >
                                    <span className="text-xl mb-1">{f.icon}</span>
                                    <span className="text-[10px] font-mono tracking-tighter">{f.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Date Control */}
                    <div className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-xl border border-zinc-700">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={useDate}
                                onChange={(e) => setUseDate(e.target.checked)}
                                className="w-5 h-5 rounded border-zinc-600 text-orange-500 focus:ring-orange-500 bg-zinc-700"
                            />
                            <span className="text-zinc-400 text-sm font-mono">{t('retro.date_stamp')}</span>
                        </div>
                        <input
                            type="date"
                            disabled={!useDate}
                            value={dateValue}
                            onChange={(e) => setDateValue(e.target.value)}
                            className="bg-zinc-900 text-white text-sm rounded border-zinc-600 focus:ring-orange-500 focus:border-orange-500 px-2 py-1 disabled:opacity-50"
                        />
                    </div>

                    {/* Shutter / Download Action */}
                    {!processedImage ? (
                        <button
                            onClick={process}
                            disabled={!image || isProcessing}
                            className="w-full h-16 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all active:scale-95 group"
                        >
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-wider">{t('retro.develop')}</span>
                        </button>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <a
                                href={processedImage}
                                download={`retro_${era}_${new Date().getTime()}.jpg`}
                                className="col-span-1 h-12 bg-green-600 hover:bg-green-500 rounded-xl flex items-center justify-center gap-2 text-white font-bold shadow-lg transition-transform active:scale-95"
                            >
                                <Download className="w-4 h-4" />
                                {t('retro.save')}
                            </a>
                            <button
                                onClick={() => {
                                    setProcessedImage(null);
                                    setImage(null);
                                    fileRef.current = null;
                                    setFlash(false);
                                }}
                                className="col-span-1 h-12 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-zinc-200 font-bold transition-transform active:scale-95"
                            >
                                {t('retro.new_film')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Trust Badge */}
                <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
                    <div className="inline-flex items-center gap-2 text-[10px] text-zinc-500 bg-zinc-800/50 px-3 py-1.5 rounded-full">
                        <span className="text-xs">🔒</span>
                        <span>{t('retro.trust_badge')}</span>
                    </div>
                </div>

                {/* Upsell Link */}
                <div className="mt-4 text-center">
                    <a href="/image-tools" className="text-xs text-zinc-600 hover:text-orange-400 underline underline-offset-2 transition-colors">
                        {t('retro.upsell')}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default InstantRetro;

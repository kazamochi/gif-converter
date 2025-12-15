import React, { useState } from 'react';
import { useFFmpeg } from '../hooks/useFFmpeg';
import { videoToGif } from '../utils/ffmpegHelper';
import { Dropzone } from './Dropzone';
import { Loader2, Download, ArrowRight, X, Settings2, FileVideo } from 'lucide-react';

export const Converter: React.FC = () => {
    const { ffmpeg, loaded, error } = useFFmpeg();
    const [file, setFile] = useState<File | null>(null);
    const [gifUrl, setGifUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [converting, setConverting] = useState(false);

    // Settings
    const [fps, setFps] = useState(15);
    const [width, setWidth] = useState(480);

    const handleConvert = async () => {
        if (!file || !loaded) return;

        setConverting(true);
        setProgress(0);
        setGifUrl(null);

        try {
            const url = await videoToGif(ffmpeg, file, { fps, width }, (p) => {
                // p is effectively unused in valid ffmpeg.wasm logic as progress parsing is complex,
                // but we can setup a listener on ffmpeg.on('progress') in the hook if needed.
                // For simplicity in this v1, we'll use a fake progress or indeterminant for now 
                // unless we parse logs. Let's rely on 'converting' state primarily.
                setProgress(Math.round(p * 100));
            });

            // Since progress callback isn't fully wired in helper without log parsing, 
            // we assume done when await finishes.
            setProgress(100);
            setGifUrl(url);
        } catch (e) {
            console.error(e);
            alert('Conversion failed. See console for details.');
        } finally {
            setConverting(false);
        }
    };

    const reset = () => {
        setFile(null);
        setGifUrl(null);
        setProgress(0);
    };

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-center text-red-200">
                <p>{error}</p>
                <p className="text-sm mt-2 opacity-70">
                    Note: This app requires a browser with SharedArrayBuffer support.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            {/* Main Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl">

                {/* Header */}
                <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        GIF Converter
                    </h2>
                    {!loaded && (
                        <div className="flex items-center gap-2 text-sm text-yellow-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Initializing Engine...
                        </div>
                    )}
                    {loaded && !converting && (
                        <div className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-medium">
                            Engine Ready
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 space-y-6">

                    {/* Step 1: Input */}
                    {!file ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Dropzone onFileSelect={setFile} />
                        </div>
                    ) : (
                        // Selected File View
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                            <div className="flex items-center justify-between bg-surface p-4 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className="p-2 bg-blue-500/20 rounded-md text-blue-400">
                                        <FileVideo size={20} />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="font-medium truncate text-white">{file.name}</p>
                                        <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={reset}
                                    disabled={converting}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
                                >
                                    <X size={18} className="text-slate-400" />
                                </button>
                            </div>

                            {!gifUrl && (
                                <div className="space-y-4">
                                    {/* Settings */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                                <Settings2 size={12} /> FPS
                                            </label>
                                            <select
                                                value={fps}
                                                onChange={(e) => setFps(Number(e.target.value))}
                                                disabled={converting}
                                                className="w-full bg-slate-800 border-none rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                            >
                                                <option value="10">10 (Low)</option>
                                                <option value="15">15 (Standard)</option>
                                                <option value="24">24 (Smooth)</option>
                                                <option value="30">30 (High)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                                <Settings2 size={12} /> Width
                                            </label>
                                            <select
                                                value={width}
                                                onChange={(e) => setWidth(Number(e.target.value))}
                                                disabled={converting}
                                                className="w-full bg-slate-800 border-none rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                            >
                                                <option value="320">320px</option>
                                                <option value="480">480px (SD)</option>
                                                <option value="720">720px (HD)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Convert Button */}
                                    <button
                                        onClick={handleConvert}
                                        disabled={converting || !loaded}
                                        className="w-full py-4 bg-primary hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl font-medium text-white shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                                    >
                                        {converting ? (
                                            <>
                                                <Loader2 className="animate-spin" />
                                                Converting... {progress}%
                                            </>
                                        ) : (
                                            <>
                                                Convert to GIF
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Result */}
                    {gifUrl && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8">
                            <div className="rounded-lg overflow-hidden border border-white/10 shadow-2xl">
                                <img src={gifUrl} alt="Generated GIF" className="w-full object-contain bg-black/50" />
                            </div>
                            <a
                                href={gifUrl}
                                download={`converted-${file?.name?.split('.')[0] || 'video'}.gif`}
                                className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl font-medium text-white flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 transition-all"
                            >
                                <Download size={18} /> Download GIF
                            </a>

                            <button
                                onClick={reset}
                                className="w-full text-sm text-slate-400 hover:text-white mt-2 mb-4"
                            >
                                Convert another video
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFFmpeg } from '../../shared/hooks/useFFmpeg';
import { videoToGif } from '../../../utils/ffmpegHelper';
import { Upload, FileVideo, Download, Loader2, Settings, RefreshCcw, Repeat, Play, Trash2, ArrowRight, Crop as CropIcon } from 'lucide-react';
import { RangeSlider } from '../../shared/components/RangeSlider';
import { CropOverlay } from './CropOverlay';
import { AdModal } from '../../../components/AdModal';

export const Converter: React.FC = () => {
    const { t } = useTranslation();
    const { ffmpeg, loaded, error } = useFFmpeg();
    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [gifUrl, setGifUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [converting, setConverting] = useState(false);
    const [videoDuration, setVideoDuration] = useState(0);

    // Settings
    const [fps, setFps] = useState(15);
    const [width, setWidth] = useState(480);
    const [trimRange, setTrimRange] = useState<[number, number]>([0, 10]);
    const [speed, setSpeed] = useState(1.0);
    const [mode, setMode] = useState<'normal' | 'reverse' | 'boomerang'>('normal');

    // v2.1 Crop

    const [crop, setCrop] = useState<{ x: number, y: number, width: number, height: number } | undefined>(undefined);

    // v2.1 Ads
    const [showAd, setShowAd] = useState(false);
    const convertCount = useRef(0);
    const AD_FREQUENCY = 3; // Show ad every 3 conversions

    const videoRef = useRef<HTMLVideoElement>(null);

    // Cleanup URL on unmount or file change
    useEffect(() => {
        return () => {
            if (fileUrl) URL.revokeObjectURL(fileUrl);
        };
    }, [fileUrl]);

    const handleFileChange = (selectedFile: File) => {
        if (fileUrl) URL.revokeObjectURL(fileUrl);

        const url = URL.createObjectURL(selectedFile);
        setFile(selectedFile);
        setFileUrl(url);
        setGifUrl(null);
        setProgress(0);

        // Reset crop/settings on new file?
        // Maybe keep settings for batch processing feel, but reset crop as dimentions might differ.
        setCrop(undefined);
        setAspectRatio('free');
    };

    // State for video dimensions to calculate aspect ratio for container
    const [videoDimensions, setVideoDimensions] = useState<{ w: number, h: number } | null>(null);
    const [zoom, setZoom] = useState(1);
    const [aspectRatio, setAspectRatio] = useState<'free' | '1:1' | '16:9' | '9:16' | '4:3' | '4:5' | '2.35:1'>('free'); // Updated type

    const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const video = e.currentTarget;
        setVideoDuration(video.duration);
        setVideoDimensions({ w: video.videoWidth, h: video.videoHeight });
        setTrimRange([0, video.duration]);
    };

    // Sync Trim Loop
    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const current = videoRef.current.currentTime;
        const [start, end] = trimRange;

        // Loop within trim range
        if (current >= end) {
            videoRef.current.currentTime = start;
            videoRef.current.play();
        }
    };

    // Update video playback speed
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
        }
    }, [speed]);

    // When trim changes, seek to start to give feedback
    const handleTrimChange = (newRange: [number, number]) => {
        setTrimRange(newRange);
        if (videoRef.current) {
            // If we moved the start handle, seek to it
            if (Math.abs(videoRef.current.currentTime - newRange[0]) > 0.5) {
                videoRef.current.currentTime = newRange[0];
            }
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const checkAdRequirement = () => {
        if (convertCount.current > 0 && convertCount.current % AD_FREQUENCY === 0) {
            setShowAd(true);
            return true;
        }
        return false;
    };

    const handleConvert = async () => {
        if (!file || !loaded) return;

        // Check Ad
        if (checkAdRequirement()) {
            return;
        }

        setConverting(true);
        setGifUrl(null);

        try {
            const url = await videoToGif(
                ffmpeg,
                file,
                {
                    fps,
                    width,
                    trimStart: trimRange[0],
                    trimEnd: trimRange[1],
                    speed,
                    mode,
                    crop
                },
                (p) => setProgress(Math.round(p * 100))
            );
            setGifUrl(url);
            convertCount.current += 1;
        } catch (e) {
            console.error(e);
            alert('Conversion failed. See console for details.');
        } finally {
            setConverting(false);
            setProgress(0);
        }
    };

    const reset = () => {
        if (fileUrl) URL.revokeObjectURL(fileUrl);
        setFile(null);
        setFileUrl(null);
        setGifUrl(null);
        setProgress(0);
        setVideoDuration(0);
        setTrimRange([0, 10]);
        setCrop(undefined);
        setAspectRatio('free');
        setVideoDimensions(null);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-8 relative z-10">
            {/* Ad Modal */}
            <AdModal
                isOpen={showAd}
                onClose={() => setShowAd(false)} // Allow close via X for prompt
                onComplete={() => {
                    setShowAd(false);
                    // Automatically trigger convert after ad? Or just unlock?
                    // User click 'Determine' in modal which triggers onComplete.
                    // Let's just unlock and maybe auto-start if UX friendly.
                    // For now just unlock.
                    convertCount.current = 1; // Reset cycle
                }}
            />

            {/* Glassmorphism Panel */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        GIF Converter <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">v2.1</span>
                    </h2>
                    {!loaded && (
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2 text-sm text-yellow-400">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t('loading')}
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] text-right leading-tight">
                                {t('vc.initial_download_note')}
                            </p>
                        </div>
                    )}
                    {loaded && !converting && (
                        <span className="text-xs font-mono text-green-400 border border-green-500/30 px-2 py-1 rounded bg-green-500/10">
                            Engine Ready
                        </span>
                    )}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {/* Main Content Area */}
                <div className="space-y-6">

                    {/* File Selection / Dropzone */}
                    {!file ? (
                        <div
                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            onDrop={handleDrop}
                            className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-indigo-500 hover:bg-slate-800/50 transition-all cursor-pointer group"
                        >
                            <input
                                type="file"
                                onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                                className="hidden"
                                id="video-upload"
                                name="video-upload"
                                aria-label="動画のアップロード"
                                accept="video/*"
                            />
                            <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-indigo-500/20">
                                    <Upload className="w-8 h-8 text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-200 mb-2">{t('upload_title')}</h3>
                                <p className="text-slate-400 text-sm">{t('upload_desc')}</p>
                            </label>
                        </div>
                    ) : (
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
                                        <FileVideo className="w-5 h-5" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="text-slate-200 font-medium truncate max-w-[200px]">{file.name}</div>
                                        <div className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                    </div>
                                </div>
                                <button onClick={reset} className="text-slate-500 hover:text-white transition-colors">
                                    <Trash2 className="w-5 h-5 hover:text-red-400" />
                                </button>
                            </div>

                            {/* Live Preview Video */}
                            {fileUrl && (
                                <div className="mb-6">
                                    {/* Zoom Control */}
                                    <div className="flex items-center justify-end mb-2 gap-2">
                                        <span className="text-xs text-slate-500 font-mono">ZOOM: {Math.round(zoom * 100)}%</span>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="2.0"
                                            step="0.05"
                                            value={zoom}
                                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                                            id="zoom-slider"
                                            name="zoom"
                                            aria-label="プレビュー拡大"
                                            className="w-32 accent-indigo-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    {/* Scrollable Container for Zoom */}
                                    <div className="w-full overflow-auto bg-slate-950/50 rounded-lg border border-slate-700/50 p-4 flex items-start justify-center min-h-[300px]">
                                        <div
                                            className="relative rounded-lg overflow-hidden border border-slate-700 bg-black shadow-inner group mx-auto transition-all duration-200 ease-out"
                                            style={{
                                                aspectRatio: videoDimensions ? `${videoDimensions.w} / ${videoDimensions.h}` : '16 / 9',
                                                height: 'auto',
                                                width: `${zoom * 100}%`, // Zoom based on width percentage of container? or fixed width?
                                                // Ideally relative to the parent available space. 
                                                // If zoom is 1, it matches parent width (minus padding).
                                                // If zoom is 2, it is 200% of parent width.
                                                maxWidth: 'none' // override existing if any
                                            }}
                                        >
                                            <video
                                                ref={videoRef}
                                                src={fileUrl}
                                                className="w-full h-full object-contain"
                                                controls={false}
                                                autoPlay
                                                loop
                                                muted
                                                onLoadedMetadata={handleVideoLoadedMetadata}
                                                onTimeUpdate={handleTimeUpdate}
                                            />

                                            {/* Crop Overlay */}
                                            <CropOverlay
                                                videoRef={videoRef}
                                                aspectRatio={aspectRatio}
                                                onCropChange={setCrop}
                                                zoom={zoom}
                                            />

                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white/80 border border-white/10 uppercase tracking-wider pointer-events-none">
                                                Live Preview
                                            </div>
                                        </div>
                                    </div>

                                    {/* Crop Controls */}
                                    <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-2">
                                        <CropIcon className="w-4 h-4 text-slate-500 min-w-[16px]" />
                                        <span className="text-sm text-slate-400 font-medium whitespace-nowrap">Crop:</span>
                                        <div className="flex gap-1.5">
                                            {[
                                                { id: 'free', label: 'Original' },
                                                { id: '1:1', label: '1:1' },
                                                { id: '4:5', label: '4:5' },
                                                { id: '16:9', label: '16:9' },
                                                { id: '9:16', label: '9:16' },
                                                { id: '4:3', label: '4:3' },
                                                { id: '2.35:1', label: 'Cinema' }
                                            ].map((ratio) => (
                                                <button
                                                    key={ratio.id}
                                                    onClick={() => setAspectRatio(ratio.id as any)}
                                                    className={`px-3 py-1 text-xs rounded-full border transition-all whitespace-nowrap ${aspectRatio === ratio.id
                                                        ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                                                        }`}
                                                >
                                                    {ratio.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Controls */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Left Column: Trim */}
                                <div className="space-y-4">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <Settings className="w-3 h-3" /> {t('trimming')}
                                    </label>
                                    <RangeSlider
                                        min={0}
                                        max={videoDuration}
                                        value={trimRange}
                                        onChange={handleTrimChange}
                                        disabled={converting}
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500">
                                        <span>{t('target')}: {(trimRange[1] - trimRange[0]).toFixed(1)}s</span>
                                        <span>{t('total')}: {videoDuration.toFixed(1)}s</span>
                                    </div>
                                </div>

                                {/* Right Column: Mode & Speed */}
                                <div className="space-y-4">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <RefreshCcw className="w-3 h-3" /> {t('playback_mode')}
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'normal', icon: Play, label: t('mode_normal') },
                                            { id: 'reverse', icon: RefreshCcw, label: t('mode_reverse') },
                                            { id: 'boomerang', icon: Repeat, label: t('mode_boomerang') }
                                        ].map((m) => (
                                            <button
                                                key={m.id}
                                                onClick={() => setMode(m.id as any)}
                                                className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs transition-all border ${mode === m.id ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-700/30 border-transparent text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                                            >
                                                <m.icon className="w-4 h-4 mb-1" />
                                                {m.label}
                                            </button>
                                        ))}
                                    </div>
                                    {mode !== 'normal' && (
                                        <p className="text-[10px] text-amber-500/80 leading-tight">
                                            {t('mode_warning')}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between gap-4">
                                        <div className="w-1/2">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">{t('speed')}</label>
                                            <select
                                                value={speed}
                                                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                                                id="speed-select"
                                                name="speed"
                                                aria-label="再生速度設定"
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                                            >
                                                <option value={0.5}>{t('speed_slow')}</option>
                                                <option value={1.0}>{t('speed_normal')}</option>
                                                <option value={1.5}>{t('speed_fast')}</option>
                                                <option value={2.0}>{t('speed_super')}</option>
                                            </select>
                                        </div>
                                        <div className="w-1/2">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">FPS</label>
                                            <select
                                                value={fps}
                                                onChange={(e) => setFps(Number(e.target.value))}
                                                id="fps-select"
                                                name="fps"
                                                aria-label="フレームレート設定"
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                                            >
                                                <option value={10}>10 FPS</option>
                                                <option value={15}>15 FPS (Default)</option>
                                                <option value={20}>20 FPS</option>
                                                <option value={24}>24 FPS</option>
                                                <option value={30}>30 FPS</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Loop Check */}
                                    <button
                                        onClick={() => {
                                            if (videoRef.current) {
                                                // Seek to 1s before end to check loop
                                                const end = trimRange[1];
                                                // if duration < 2s, just play
                                                videoRef.current.currentTime = Math.max(trimRange[0], end - 1.5);
                                                videoRef.current.play();
                                            }
                                        }}
                                        className="w-full mt-2 py-2 border border-slate-700 hover:bg-slate-800 text-xs text-slate-400 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Repeat className="w-3 h-3" /> {t('loop_preview')}
                                    </button>

                                    <div className="w-full">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">{t('width')}</label>
                                        {/* ... (Width Layout - already correct) ... */}
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={width}
                                                onChange={(e) => setWidth(Number(e.target.value))}
                                                id="width-input"
                                                name="width"
                                                aria-label="幅設定"
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                                                min={10}
                                                max={1920}
                                            />
                                            <div className="flex gap-1">
                                                {[128, 480, 640].map(size => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setWidth(size)}
                                                        className="px-2 py-1 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                                        title={`Set width to ${size}px`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ad Placeholder (Sidebar/Bottom) */}
                                    <div className="w-full h-24 bg-slate-900/50 border border-slate-800 border-dashed rounded-lg flex items-center justify-center text-slate-600 text-xs uppercase tracking-widest mt-4">
                                        {t('ad_space')}
                                    </div>

                                </div>
                            </div>

                            {/* Convert Button */}
                            {/* ... */}
                            <button
                                onClick={handleConvert}
                                disabled={converting || !loaded}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                            >
                                {converting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing... {progress > 0 && `${progress}%`}
                                    </>
                                ) : (
                                    <>
                                        {converting ? t('converting') : t('convert_button')}
                                        <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            {/* Processing Wait Ad Area */}
                            {converting && (
                                <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-slate-700/50">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-xs text-slate-500">
                                                広告を見ていただくことで無料サービスを提供できています
                                            </p>
                                        </div>
                                        {/* Ad Placeholder - Replace with AdSense code after approval */}
                                        <div className="aspect-video bg-slate-900/50 rounded-xl border border-dashed border-slate-600 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-full flex items-center justify-center">
                                                    <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                                                </div>
                                                <p className="text-sm text-slate-400">Creating your GIF...</p>
                                                <p className="text-xs text-slate-600 mt-1">Ad space reserved</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                                            <span>💡 Tip: Try our Video Converter tool!</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Result Video */}
                    {gifUrl && (
                        <div className="bg-slate-800/80 rounded-2xl p-8 border border-white/10 text-center animate-in zoom-in-95 duration-300">
                            <div className="mb-6 flex justify-center">
                                <img src={gifUrl} alt="Generated GIF" className="rounded-lg shadow-2xl max-h-[400px] border-4 border-slate-700" />
                            </div>
                            <div className="flex justify-center gap-4">
                                <a
                                    href={gifUrl}
                                    download="converted.gif"
                                    className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-xl"
                                >
                                    <Download className="w-5 h-5" />
                                    {t('download_button')}
                                </a>
                                <button
                                    onClick={reset}
                                    className="px-6 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors"
                                >
                                    {t('reset_button')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

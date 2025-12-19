import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFFmpeg } from '../../shared/hooks/useFFmpeg';
import { convertVideo, type VideoFormat, type VideoConversionSettings } from '../utils/videoConversionHelper';
import { RangeSlider } from '../../shared/components/RangeSlider';
import { Upload, FileVideo, Download, Loader2, ArrowRight, Trash2, Settings, VolumeX, Music, AlertTriangle, CheckCircle2, Share2 } from 'lucide-react';
import { AdModal } from '../../../components/AdModal';
import { NextActionCard } from '../../../components/NextActionCard';

export const VideoConverter: React.FC = () => {
    const { t } = useTranslation();
    const { ffmpeg, loaded, error } = useFFmpeg();
    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
    const [outputFilename, setOutputFilename] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [converting, setConverting] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState<VideoFormat>('mp4');
    const [videoDuration, setVideoDuration] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Preview Settings
    const [zoom, setZoom] = useState(0.4);
    const [videoDimensions, setVideoDimensions] = useState<{ w: number, h: number } | null>(null);

    // Advanced Settings State
    const [showAdvanced, setShowAdvanced] = useState(true);
    const [trimRange, setTrimRange] = useState<[number, number]>([0, 0]);
    const [mute, setMute] = useState(false);
    const [extractAudio, setExtractAudio] = useState(false);
    const [compress, setCompress] = useState(false);
    const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');

    // Ads state
    const [showAd, setShowAd] = useState(false);
    const convertCount = useRef(0);
    const AD_FREQUENCY = 3;

    // Cleanup
    useEffect(() => {
        return () => {
            if (fileUrl) URL.revokeObjectURL(fileUrl);
            if (convertedUrl) URL.revokeObjectURL(convertedUrl);
        };
    }, [fileUrl, convertedUrl]);

    const handleFileChange = (selectedFile: File) => {
        if (fileUrl) URL.revokeObjectURL(fileUrl);
        if (convertedUrl) URL.revokeObjectURL(convertedUrl);

        const url = URL.createObjectURL(selectedFile);
        setFile(selectedFile);
        setFileUrl(url);
        setConvertedUrl(null);
        setProgress(0);
        setTrimRange([0, 0]);
        setVideoDuration(0);
        setVideoDimensions(null);
    };

    const handleVideoLoad = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const video = e.currentTarget;
        const duration = video.duration;
        setVideoDuration(duration);
        setVideoDimensions({ w: video.videoWidth, h: video.videoHeight });
        setTrimRange([0, duration]);
    };

    // React to trim changes (seek to start)
    useEffect(() => {
        if (videoRef.current && Math.abs(videoRef.current.currentTime - trimRange[0]) > 0.5) {
            videoRef.current.currentTime = trimRange[0];
        }
    }, [trimRange[0]]);

    // Sync Trim Loop
    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const current = videoRef.current.currentTime;
        const [start, end] = trimRange;

        // Loop within trim range if we are previewing (and end is set)
        if (end > 0 && current >= end) {
            videoRef.current.currentTime = start;
            videoRef.current.play();
        }
    };

    const reset = () => {
        if (fileUrl) URL.revokeObjectURL(fileUrl);
        if (convertedUrl) URL.revokeObjectURL(convertedUrl);
        setFile(null);
        setFileUrl(null);
        setConvertedUrl(null);
        setProgress(0);
        setTrimRange([0, 0]);
        setVideoDuration(0);
        setShowAdvanced(false);
        setMute(false);
        setExtractAudio(false);
        setCompress(false);
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

        if (checkAdRequirement()) {
            return;
        }

        setConverting(true);
        setConvertedUrl(null);

        try {
            const settings: VideoConversionSettings = {
                format: extractAudio ? 'mp3' : selectedFormat,
                trimStart: trimRange[0] > 0 ? trimRange[0] : undefined,
                trimEnd: trimRange[1] < videoDuration ? trimRange[1] : undefined,
                mute: mute && !extractAudio,
                extractAudio,
                compress,
                compressionLevel: compress ? compressionLevel : undefined,
            };

            const { url, filename } = await convertVideo(
                ffmpeg,
                file,
                settings,
                (p) => setProgress(Math.round(p * 100))
            );
            setConvertedUrl(url);
            setOutputFilename(filename);
            convertCount.current += 1;
        } catch (e) {
            console.error(e);
            alert('Conversion failed. Please try a different format or file.');
        } finally {
            setConverting(false);
            setProgress(0);
        }
    };

    const formats: { id: VideoFormat; label: string }[] = [
        { id: 'mp4', label: 'MP4' },
        { id: 'mov', label: 'MOV' },
        { id: 'webm', label: 'WebM' },
        { id: 'avi', label: 'AVI' },
        { id: 'mkv', label: 'MKV' },
        { id: 'flv', label: 'FLV' },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto p-8 relative z-10">
            <AdModal
                isOpen={showAd}
                onClose={() => setShowAd(false)}
                onComplete={() => {
                    setShowAd(false);
                    convertCount.current = 1;
                }}
            />

            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-3">
                        {/* Dynamic Status Dot - Green when Ready, Yellow when Loading */}
                        <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-colors duration-500 ${loaded ? 'bg-green-500 shadow-green-500/50' : 'bg-yellow-500 animate-pulse'}`}></div>
                        {t('vc.title')}
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
                        <span className="text-xs font-mono text-green-400 border border-green-500/30 px-2 py-1 rounded bg-green-500/10 flex items-center gap-1 animate-in fade-in duration-500">
                            <CheckCircle2 className="w-3 h-3" />
                            {t('vc.ready')}
                        </span>
                    )}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {!file ? (
                        <div
                            className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-purple-500 hover:bg-slate-800/50 transition-all cursor-pointer group"
                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            onDrop={(e) => {
                                e.preventDefault(); e.stopPropagation();
                                if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
                            }}
                        >
                            <input
                                type="file"
                                onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                                className="hidden"
                                id="video-upload"
                                accept="video/*"
                            />
                            <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-purple-500/20">
                                    <Upload className="w-8 h-8 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-200 mb-2">{t('upload_title')}</h3>
                                <p className="text-slate-400 text-sm">{t('upload_desc')}</p>
                            </label>
                        </div>
                    ) : (
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5 animate-in fade-in slide-in-from-bottom-4">
                            {/* File Info & Video Preview */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">
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

                            {/* Hidden video for duration detection */}
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
                                            className="w-32 accent-purple-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    {/* Scrollable Container for Zoom */}
                                    <div className="w-full overflow-auto bg-slate-950/50 rounded-lg border border-slate-700/50 p-4 flex items-start justify-center min-h-[300px]">
                                        <div
                                            className="relative rounded-lg overflow-hidden border border-slate-700 bg-black shadow-inner mx-auto transition-all duration-200 ease-out"
                                            style={{
                                                aspectRatio: videoDimensions ? `${videoDimensions.w} / ${videoDimensions.h}` : '16 / 9',
                                                height: 'auto',
                                                width: `${zoom * 100}%`,
                                                maxWidth: 'none'
                                            }}
                                        >
                                            <video
                                                ref={videoRef}
                                                src={fileUrl || undefined}
                                                className="w-full h-full object-contain"
                                                controls={true} // Allow default controls for now for easy play/pause
                                                autoPlay
                                                muted={true}
                                                onLoadedMetadata={handleVideoLoad}
                                                onTimeUpdate={handleTimeUpdate}
                                            />

                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white/80 border border-white/10 uppercase tracking-wider pointer-events-none">
                                                Preview
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Format Selection (hidden if extracting audio) */}
                            {!extractAudio && (
                                <div className="mb-6">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">{t('vc.format_label')}</label>
                                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                        {formats.map((f) => (
                                            <button
                                                key={f.id}
                                                onClick={() => setSelectedFormat(f.id)}
                                                className={`py-2 px-1 rounded-lg text-sm font-medium transition-all ${selectedFormat === f.id
                                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 ring-1 ring-purple-400'
                                                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                                    }`}
                                            >
                                                {f.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Advanced Settings Toggle */}
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-400 hover:text-white transition-colors mb-4"
                            >
                                <Settings className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
                                {showAdvanced ? t('vc.advanced_hide') : t('vc.advanced_show')}
                            </button>

                            {/* Advanced Settings Panel */}
                            {showAdvanced && (
                                <div className="bg-slate-900/50 rounded-xl p-4 mb-6 space-y-5 border border-slate-700/50 animate-in slide-in-from-top-2">
                                    {/* Trim */}
                                    {videoDuration > 0 && (
                                        <div>
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">{t('vc.trim_label')}</label>
                                            <RangeSlider
                                                min={0}
                                                max={videoDuration}
                                                value={trimRange}
                                                onChange={setTrimRange}
                                            />
                                        </div>
                                    )}

                                    {/* Audio Options */}
                                    <div>
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">{t('vc.audio_label')}</label>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => { setMute(!mute); setExtractAudio(false); }}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mute
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                                                    }`}
                                            >
                                                <VolumeX className="w-4 h-4" />
                                                {t('vc.remove_audio')}
                                            </button>
                                            <button
                                                onClick={() => { setExtractAudio(!extractAudio); setMute(false); }}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${extractAudio
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                                                    }`}
                                            >
                                                <Music className="w-4 h-4" />
                                                {t('vc.extract_audio')}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Compression */}
                                    <div>
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">{t('vc.compression_label')}</label>
                                        <button
                                            onClick={() => setCompress(!compress)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${compress
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                                                }`}
                                        >
                                            {t('vc.compress_btn')}
                                        </button>
                                        {compress && (
                                            <div className="mt-3 space-y-2">
                                                <div className="flex gap-2">
                                                    {(['high', 'medium', 'low'] as const).map((level) => (
                                                        <button
                                                            key={level}
                                                            onClick={() => setCompressionLevel(level)}
                                                            className={`px-3 py-1 rounded text-xs font-medium transition-all ${compressionLevel === level
                                                                ? 'bg-orange-600 text-white'
                                                                : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                                                                }`}
                                                        >
                                                            {level === 'high' ? t('vc.level_light') : level === 'medium' ? t('vc.level_medium') : t('vc.level_heavy')}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
                                                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-xs text-red-300">
                                                        <span className="font-bold">{t('vc.warning')}</span> {t('vc.heavy_processing')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Convert Button */}
                            <button
                                onClick={handleConvert}
                                disabled={converting || !loaded}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-lg shadow-purple-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                            >
                                {converting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {t('converting')} {progress > 0 && `${progress}%`}
                                    </>
                                ) : (
                                    <>
                                        {extractAudio ? t('vc.extract_audio_btn') : t('vc.convert_video')}
                                        <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            {/* Processing Ad Area */}
                            {converting && (
                                <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                                    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-slate-700/50 text-center">
                                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
                                        <p className="text-slate-300 mb-4">{t('vc.processing')}</p>

                                        {/* AdSpace Integration */}
                                        <div className="border border-dashed border-slate-700 rounded-lg p-2 bg-slate-950/30">
                                            <div className="flex flex-col items-center justify-center min-h-[100px] text-slate-500 text-xs gap-1">
                                                <span className="font-semibold uppercase tracking-wider">Advertisement</span>
                                                <span className="opacity-70">{t('vc.ad_support')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Download Area */}
                            {convertedUrl && (
                                <div className="bg-slate-800/80 rounded-2xl p-8 border border-white/10 text-center animate-in zoom-in-95 duration-300 mt-6">
                                    <h3 className="text-xl font-bold text-white mb-6">{t('vc.complete')}</h3>
                                    <div className="flex justify-center gap-4 flex-wrap">
                                        <a
                                            href={convertedUrl}
                                            download={outputFilename || 'converted_video'}
                                            className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-xl"
                                        >
                                            <Download className="w-5 h-5" />
                                            {t('download_button')}
                                        </a>
                                        <button
                                            onClick={reset}
                                            className="px-6 py-4 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors"
                                        >
                                            {t('vc.convert_another')}
                                        </button>
                                    </div>

                                    <NextActionCard
                                        title={t('next.warp.title', 'Send to Smartphone')}
                                        description={t('next.warp.desc', 'Transfer this file instantly to your mobile device via Warp Share.')}
                                        buttonText={t('next.warp.btn', 'Open Warp Share')}
                                        to="/warp-share"
                                        icon={Share2}
                                        color="text-indigo-400"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

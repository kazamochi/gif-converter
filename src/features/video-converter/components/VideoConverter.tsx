import React, { useState, useRef, useEffect } from 'react';
import { useFFmpeg } from '../../shared/hooks/useFFmpeg';
import { convertVideo, type VideoFormat, type VideoConversionSettings } from '../utils/videoConversionHelper';
import { RangeSlider } from '../../shared/components/RangeSlider';
import { Upload, FileVideo, Download, Loader2, ArrowRight, Trash2, Settings, VolumeX, Music, AlertTriangle } from 'lucide-react';
import { AdModal } from '../../../components/AdModal';

export const VideoConverter: React.FC = () => {
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

    // Advanced Settings State
    const [showAdvanced, setShowAdvanced] = useState(false);
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
    };

    const handleVideoLoad = () => {
        if (videoRef.current) {
            const duration = videoRef.current.duration;
            setVideoDuration(duration);
            setTrimRange([0, duration]);
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
                        <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                        Video Converter
                    </h2>
                    {!loaded && (
                        <div className="flex items-center gap-2 text-sm text-yellow-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Initializing...
                        </div>
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
                                <h3 className="text-xl font-semibold text-slate-200 mb-2">Upload Video</h3>
                                <p className="text-slate-400 text-sm">Drag & drop or click to select</p>
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
                            <video
                                ref={videoRef}
                                src={fileUrl || undefined}
                                onLoadedMetadata={handleVideoLoad}
                                className="hidden"
                            />

                            {/* Format Selection (hidden if extracting audio) */}
                            {!extractAudio && (
                                <div className="mb-6">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Convert To</label>
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
                                {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
                            </button>

                            {/* Advanced Settings Panel */}
                            {showAdvanced && (
                                <div className="bg-slate-900/50 rounded-xl p-4 mb-6 space-y-5 border border-slate-700/50 animate-in slide-in-from-top-2">
                                    {/* Trim */}
                                    {videoDuration > 0 && (
                                        <div>
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Trim Video</label>
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
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Audio</label>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => { setMute(!mute); setExtractAudio(false); }}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mute
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                                                    }`}
                                            >
                                                <VolumeX className="w-4 h-4" />
                                                Remove Audio
                                            </button>
                                            <button
                                                onClick={() => { setExtractAudio(!extractAudio); setMute(false); }}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${extractAudio
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                                                    }`}
                                            >
                                                <Music className="w-4 h-4" />
                                                Extract Audio (MP3)
                                            </button>
                                        </div>
                                    </div>

                                    {/* Compression */}
                                    <div>
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Compression</label>
                                        <button
                                            onClick={() => setCompress(!compress)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${compress
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                                                }`}
                                        >
                                            Compress File Size
                                        </button>

                                        {compress && (
                                            <div className="mt-3 space-y-2">
                                                <div className="flex gap-2">
                                                    {(['high', 'medium', 'low'] as const).map((level) => (
                                                        <button
                                                            key={level}
                                                            onClick={() => setCompressionLevel(level)}
                                                            className={`px-3 py-1 rounded text-xs font-medium transition-all ${compressionLevel === level
                                                                ? 'bg-orange-500 text-white'
                                                                : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                                                                }`}
                                                        >
                                                            {level === 'high' ? 'Light' : level === 'medium' ? 'Medium' : 'Heavy'}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
                                                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-xs text-red-300">
                                                        <span className="font-bold">Warning:</span> Heavy processing. May cause device heating and high battery usage on mobile devices.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleConvert}
                                disabled={converting || !loaded}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-lg shadow-purple-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                            >
                                {converting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing... {progress > 0 && `${progress}%`}
                                    </>
                                ) : (
                                    <>
                                        {extractAudio ? 'Extract Audio' : 'Convert Video'}
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
                                                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                                                    <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                                                </div>
                                                <p className="text-sm text-slate-400">Processing your video...</p>
                                                <p className="text-xs text-slate-600 mt-1">Ad space reserved</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                                            <span>💡 Tip: Try our other tools while you wait!</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {convertedUrl && (
                        <div className="bg-slate-800/80 rounded-2xl p-8 border border-white/10 text-center animate-in zoom-in-95 duration-300">
                            <h3 className="text-xl font-bold text-white mb-6">Conversion Complete! 🎉</h3>
                            <div className="flex justify-center gap-4">
                                <a
                                    href={convertedUrl}
                                    download={outputFilename || 'converted_video'}
                                    className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-xl"
                                >
                                    <Download className="w-5 h-5" />
                                    Download {extractAudio ? 'MP3' : selectedFormat.toUpperCase()}
                                </a>
                                <button
                                    onClick={reset}
                                    className="px-6 py-4 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors"
                                >
                                    Convert Another
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

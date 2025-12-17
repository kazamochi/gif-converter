import { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Sliders, Eraser, Loader2, Save, ShoppingBag, Globe, Play, FileText, Shield, Grid, EyeOff, Monitor, Smartphone } from 'lucide-react';
import { processImage } from '../utils/imageProcessor';
import type { ProcessOptions } from '../utils/imageProcessor';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ProLab = () => {
    const { t } = useTranslation();
    const [image, setImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Mobile Check
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Privacy Mode State
    const [isPrivacyMode, setIsPrivacyMode] = useState(false);
    const [privacyType, setPrivacyType] = useState<'mosaic' | 'blur'>('mosaic');
    const [masks, setMasks] = useState<{ x: number, y: number, r: number }[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [showMaskOverlay, setShowMaskOverlay] = useState(false);

    // File Ref to keep original quality
    const fileRef = useRef<File | null>(null);

    // Default Options
    const defaultOptions: ProcessOptions = {
        contrast: 100,
        brightness: 100,
        saturation: 100,
        vignette: 0,
        grain: 0,
        dateStamp: false,
        dateValue: new Date().toISOString().split('T')[0],
        format: 'webp',
        quality: 0.9,
        resize: { maxWidth: 4096 },
        bloom: 0,
        sepia: 0,
        scratches: 0,
        letterbox: false,
        privacy: { type: 'mosaic', masks: [] }
    };

    // Filter Stats
    const [options, setOptions] = useState<ProcessOptions>(defaultOptions);

    // Presets Configuration
    const presets = [
        {
            id: 'mercari',
            icon: <ShoppingBag className="w-5 h-5" />,
            label: 'Mercari',
            apply: { brightness: 115, saturation: 105, contrast: 100, format: 'jpeg', quality: 0.9, dateStamp: false, resize: { maxWidth: 4096 } }
        },
        {
            id: 'seo',
            icon: <Globe className="w-5 h-5" />,
            label: 'Web / SEO',
            apply: { format: 'webp', quality: 0.8, resize: { maxWidth: 1200 }, dateStamp: false }
        },
        {
            id: 'youtube',
            icon: <Play className="w-5 h-5" />,
            label: 'YouTube',
            apply: { contrast: 120, saturation: 120, resize: { maxWidth: 1280 }, dateStamp: false, format: 'jpeg', quality: 0.9 } // YouTube usually prefers JPG/PNG
        },
        {
            id: 'doc',
            icon: <FileText className="w-5 h-5" />,
            label: 'Document',
            apply: { saturation: 0, contrast: 140, brightness: 110, format: 'png', dateStamp: false, resize: { maxWidth: 4096 } }
        }
    ];

    const applyPreset = (preset: any) => {
        // Reset to default then apply preset to ensure clean state
        setOptions({
            ...defaultOptions,
            ...preset.apply
        });
        setMasks([]); // Clear masks on preset change
    };

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        fileRef.current = file;
        const url = URL.createObjectURL(file);
        setImage(url);
        setMasks([]); // Clear masks new file
    };

    const dropzone = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        multiple: false
    });

    // Debounced processing
    useEffect(() => {
        if (!fileRef.current) return;

        const timer = setTimeout(async () => {
            setIsProcessing(true);
            try {
                if (fileRef.current) {
                    // Merge current options with masks
                    const currentOpts = {
                        ...options,
                        privacy: { type: privacyType, masks: masks }
                    };
                    const result = await processImage(fileRef.current, currentOpts);
                    setProcessedImage(result);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsProcessing(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [options, image, masks, privacyType]); // Re-run when masks change

    const updateOption = (key: keyof ProcessOptions, value: any) => {
        setOptions(prev => ({ ...prev, [key]: value }));
    };

    const getOutputInfo = () => {
        let info = `${options.format.toUpperCase()} / ${Math.round(options.quality * 100)}%`;
        if (options.resize?.maxWidth && options.resize.maxWidth < 4096) {
            info += ` / Max ${options.resize.maxWidth}px`;
        }
        return info;
    };

    // Helper for sliders
    const Slider = ({ label, prop, min, max, step = 1, unit = '' }: any) => (
        <div className="space-y-1">
            <div className="flex justify-between text-xs text-zinc-400 font-mono">
                <span>{label}</span>
                <span>{(options as any)[prop]}{unit}</span>
            </div>
            <input
                type="range"
                min={min} max={max} step={step}
                value={(options as any)[prop]}
                onChange={(e) => updateOption(prop, Number(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
        </div>
    );

    // Canvas Interaction Logic
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const handleCanvasDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !isPrivacyMode || !imageContainerRef.current) return;

        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Add point
        setMasks(prev => [...prev, { x, y, r: 0.03 }]); // Radius 3%
    };

    const handleMouseDown = () => setIsDrawing(true);
    const handleMouseUp = () => setIsDrawing(false);

    // Render local preview on canvas (Red brush)
    useEffect(() => {
        if (!canvasRef.current || !imageContainerRef.current) return;
        const cvs = canvasRef.current;
        const ctx = cvs.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        // Resize canvas to match container actual size for drawing overlay
        const rect = imageContainerRef.current.getBoundingClientRect();
        cvs.width = rect.width;
        cvs.height = rect.height;

        if (isPrivacyMode && masks.length > 0) {
            const colorBase = privacyType === 'mosaic' ? '0, 255, 100' : '0, 100, 255';

            // Only draw if we are actively drawing OR if the overlay is explicitly toggled on
            if (isDrawing || showMaskOverlay) {
                masks.forEach(m => {
                    ctx.beginPath();
                    ctx.arc(m.x * cvs.width, m.y * cvs.height, m.r * Math.min(cvs.width, cvs.height), 0, Math.PI * 2);

                    if (isDrawing) {
                        // While drawing, show faint fill to see path
                        ctx.fillStyle = `rgba(${colorBase}, 0.2)`;
                        ctx.fill();
                    } else {
                        // Static overlay mode (just outline)
                        ctx.strokeStyle = `rgba(${colorBase}, 0.5)`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            }
        }
    }, [masks, isPrivacyMode, privacyType, isDrawing, showMaskOverlay]); // Re-render canvas when masks update or drawing state changes

    if (isMobile) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-6">
                <div className="max-w-md text-center space-y-8 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                    <div className="flex justify-center gap-6 text-zinc-600">
                        <Smartphone className="w-16 h-16 opacity-30 stroke-1" />
                        <Monitor className="w-16 h-16 text-orange-500 stroke-1" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-3">
                            {t('pro.mobile_warning_title')}
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            {t('pro.mobile_warning_desc')}
                        </p>
                    </div>
                    <Link
                        to="/"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-orange-500/20"
                    >
                        {t('pro.mobile_warning_back')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Editor Controls */}
                <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-fit space-y-8 order-2 lg:order-1">

                    {/* Smart Presets */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-zinc-500 tracking-wider">SMART PRESETS</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {presets.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => applyPreset(p)}
                                    className="flex flex-col items-center justify-center p-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all active:scale-95 group h-24"
                                >
                                    <div className="p-2 bg-zinc-900 rounded-lg text-orange-500 group-hover:text-orange-400 mb-2">
                                        {p.icon}
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-300 group-hover:text-white text-center leading-tight">
                                        {p.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* NEW: Privacy Protection Tools */}
                    <div className="space-y-4 border-t border-zinc-800 pt-4">
                        <h3 className="text-sm font-bold text-zinc-500 tracking-wider flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            PRIVACY TOOLS
                        </h3>

                        <div className="flex items-center gap-4 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                            <button
                                onClick={() => setIsPrivacyMode(!isPrivacyMode)}
                                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${isPrivacyMode
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                    }`}
                            >
                                {isPrivacyMode ? t('pro.privacy_active') || 'EDITING MASK' : t('pro.privacy_mode') || 'ENABLE MASK'}
                            </button>
                        </div>

                        {isPrivacyMode && (
                            <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <button
                                    onClick={() => setPrivacyType('mosaic')}
                                    className={`flex flex-col items-center p-3 rounded-lg border transition-all ${privacyType === 'mosaic'
                                        ? 'bg-zinc-800 border-green-500 text-green-500'
                                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                                        }`}
                                >
                                    <Grid className="w-5 h-5 mb-1" />
                                    <span className="text-[10px]">MOSAIC</span>
                                </button>
                                <button
                                    onClick={() => setPrivacyType('blur')}
                                    className={`flex flex-col items-center p-3 rounded-lg border transition-all ${privacyType === 'blur'
                                        ? 'bg-zinc-800 border-blue-500 text-blue-500'
                                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                                        }`}
                                >
                                    <EyeOff className="w-5 h-5 mb-1" />
                                    <span className="text-[10px]">BLUR</span>
                                </button>
                                <div className="col-span-2 flex items-center justify-between pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showMaskOverlay}
                                            onChange={(e) => setShowMaskOverlay(e.target.checked)}
                                            className="rounded border-zinc-600 bg-zinc-800 text-orange-500"
                                        />
                                        <span className="text-xs text-zinc-400">Show Mask Area</span>
                                    </label>
                                    <button
                                        onClick={() => setMasks([])}
                                        className="text-xs text-zinc-500 hover:text-red-400 underline decoration-dotted"
                                    >
                                        {t('pro.clear_mask') || 'Clear Mask'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {isPrivacyMode && (
                            <p className="text-[10px] text-zinc-500 leading-tight">
                                * Drag on image to hide sensitive info.
                            </p>
                        )}
                    </div>

                    <h2 className="text-xl font-bold text-white flex items-center gap-2 pt-4 border-t border-zinc-800">
                        <Sliders className="w-5 h-5 text-orange-500" />
                        {t('pro.settings')}
                    </h2>

                    {/* Basic Corrections */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-zinc-500 tracking-wider">CORRECTION</h3>
                        <Slider label={t('pro.contrast')} prop="contrast" min={50} max={150} />
                        <Slider label={t('pro.brightness')} prop="brightness" min={50} max={150} />
                        <Slider label={t('pro.saturation')} prop="saturation" min={0} max={200} />
                    </div>

                    {/* Retro Effects */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-zinc-500 tracking-wider">RETRO FX</h3>
                        <Slider label={t('pro.vignette')} prop="vignette" min={0} max={1} step={0.05} />
                        <Slider label={t('pro.grain')} prop="grain" min={0} max={0.5} step={0.05} />

                        <div className="pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={options.dateStamp}
                                    onChange={(e) => updateOption('dateStamp', e.target.checked)}
                                    className="rounded border-zinc-600 bg-zinc-800 text-orange-500 focus:ring-orange-500"
                                />
                                <span className="text-zinc-300 text-sm">{t('pro.date_stamp')}</span>
                            </label>
                            {options.dateStamp && (
                                <input
                                    type="date"
                                    value={options.dateValue}
                                    onChange={(e) => updateOption('dateValue', e.target.value)}
                                    className="mt-2 w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-300 text-sm"
                                />
                            )}
                        </div>
                    </div>

                    {/* Output Settings */}
                    <div className="space-y-4 pt-4 border-t border-zinc-800">
                        <h3 className="text-sm font-bold text-zinc-500 tracking-wider">OUTPUT</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {['webp', 'png', 'jpeg'].map((fmt) => (
                                <button
                                    key={fmt}
                                    onClick={() => updateOption('format', fmt)}
                                    className={`py-2 text-xs font-bold rounded-lg uppercase transition-colors ${options.format === fmt
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                        }`}
                                >
                                    {fmt}
                                </button>
                            ))}
                        </div>
                        <Slider label={t('pro.quality')} prop="quality" min={0.1} max={1} step={0.05} />
                    </div>

                    <button
                        onClick={() => {
                            setImage(null);
                            fileRef.current = null;
                            setProcessedImage(null);
                            setOptions(defaultOptions);
                            setMasks([]);
                        }}
                        className="w-full flex items-center justify-center gap-2 text-zinc-500 hover:text-red-400 transition-colors text-sm"
                    >
                        <Eraser className="w-4 h-4" />
                        {t('pro.reset_all')}
                    </button>
                </div>

                {/* Preview Area (Right on Desktop) */}
                <div className="lg:col-span-2 order-1 lg:order-2">
                    <div
                        ref={imageContainerRef}
                        className="bg-black/50 border border-zinc-800 rounded-2xl p-2 min-h-[600px] flex items-center justify-center relative overflow-hidden group select-none"
                    >

                        {!image ? (
                            <div {...dropzone.getRootProps()} className="text-center cursor-pointer p-12 hover:bg-white/5 rounded-xl transition-colors w-full h-full flex flex-col items-center justify-center">
                                <input {...dropzone.getInputProps()} />
                                <Upload className="w-16 h-16 text-zinc-600 mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold text-zinc-300 mb-2">{t('pro.drop_title')}</h3>
                                <p className="text-zinc-500 text-sm max-w-sm mx-auto">{t('pro.drop_desc')}</p>
                            </div>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Compare Toggle could go here */}
                                <img
                                    src={processedImage || image}
                                    alt="Preview"
                                    className="max-w-full max-h-[80vh] object-contain shadow-2xl pointer-events-none" // prevent drag
                                    draggable={false}
                                />

                                {/* Privacy Overlay Canvas */}
                                <canvas
                                    ref={canvasRef}
                                    onMouseDown={handleMouseDown}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    onMouseMove={handleCanvasDraw}
                                    className={`absolute inset-0 w-full h-full z-10 ${isPrivacyMode ? 'cursor-crosshair' : 'pointer-events-none'
                                        }`}
                                />

                                {isProcessing && (
                                    <div className="absolute top-4 right-4 bg-black/80 text-orange-500 text-xs px-3 py-1 rounded-full flex items-center gap-2 backdrop-blur-md z-20">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        PROCESSING
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    {/* Action Bar */}
                    {processedImage && (
                        <div className="flex justify-end mt-6 gap-4">
                            <div className="text-right mr-auto">
                                <p className="text-xs text-zinc-500 font-mono">
                                    {fileRef.current?.name}
                                </p>
                                <p className="text-xs text-orange-500 font-mono">
                                    {getOutputInfo()}
                                </p>
                            </div>

                            <a
                                href={processedImage}
                                download={`image-editor-${Date.now()}.png`}
                                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-black text-white shadow-xl hover:shadow-orange-500/20 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                {t('pro.save_image')}
                            </a>
                        </div>
                    )}

                    {/* Re-upload Zone */}
                    {image && (
                        <div {...dropzone.getRootProps()} className="mt-4 text-center">
                            <input {...dropzone.getInputProps()} />
                            <p className="text-xs text-zinc-600 cursor-pointer hover:text-zinc-400 underline">{t('pro.open_new')}</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProLab;

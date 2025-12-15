import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Play, Loader2, CheckCircle2 } from 'lucide-react';

interface AdModalProps {
    isOpen: boolean;
    onComplete: () => void;
    onClose: () => void;
}

export const AdModal: React.FC<AdModalProps> = ({ isOpen, onComplete, onClose }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState<'prompt' | 'playing' | 'completed'>('prompt');
    const [timeLeft, setTimeLeft] = useState(5);
    const timerRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!isOpen) {
            setStep('prompt');
            setTimeLeft(5);
        }
    }, [isOpen]);

    const startAd = () => {
        setStep('playing');
        setTimeLeft(5);

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setStep('completed');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleComplete = () => {
        onComplete();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">

                {/* Close Button (Only in prompt or completed) */}
                {step !== 'playing' && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                {/* Content */}
                <div className="p-8 text-center">

                    {step === 'prompt' && (
                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Play className="w-8 h-8 text-white fill-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{t('ad_title')}</h3>
                                <p className="text-slate-400 text-sm">
                                    {t('ad_message')}
                                </p>
                            </div>
                            <button
                                onClick={startAd}
                                className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg active:scale-95"
                            >
                                Watch Video to Unlock
                            </button>
                            <p className="text-[10px] text-slate-600">
                                Supporting us converts into better servers!
                            </p>
                        </div>
                    )}

                    {step === 'playing' && (
                        <div className="space-y-6">
                            <div className="aspect-video bg-black rounded-xl border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group">
                                {/* Fake Ad Content */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center flex-col">
                                    <h4 className="text-2xl font-black text-white italic tracking-tighter mb-2 animate-bounce">
                                        SUPER DRINK
                                    </h4>
                                    <p className="text-blue-300 text-xs uppercase tracking-widest">Energy for Developers</p>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded">
                                    {t('ad_timer', { seconds: timeLeft })}
                                </div>
                            </div>
                            <div className="text-sm text-slate-300 flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                                Playing advertisement...
                            </div>
                        </div>
                    )}

                    {step === 'completed' && (
                        <div className="space-y-6 animate-in zoom-in-95 duration-300">
                            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                                <CheckCircle2 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                                <p className="text-slate-400 text-sm">
                                    You have unlocked <span className="text-green-400 font-bold">Unlimited Mode</span> for 10 minutes. Enjoy!
                                </p>
                            </div>
                            <button
                                onClick={handleComplete}
                                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/20 transition-all active:scale-95"
                            >
                                {t('ad_close')}
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

import React from 'react';

interface AdSpaceProps {
    slotId?: string;
    className?: string;
}

export const AdSpace: React.FC<AdSpaceProps> = ({ slotId, className }) => {
    // 開発環境では広告を非表示
    const isAdsEnabled = import.meta.env.VITE_ENABLE_ADS === 'true';

    if (!isAdsEnabled) {
        return null;
    }

    return (
        <div className={`w-full bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-lg overflow-hidden flex items-center justify-center ${className}`}>
            <div className="text-center p-4">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Advertisement</p>
                <div className="w-full h-[100px] md:h-[250px] bg-slate-700/30 rounded flex items-center justify-center text-slate-600 text-sm">
                    Ad Space {slotId ? `(${slotId})` : ''}
                </div>
            </div>
        </div>
    );
};

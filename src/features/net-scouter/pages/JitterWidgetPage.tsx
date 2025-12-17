import React, { useEffect } from 'react';
import { RadarView } from '../components/RadarView';
import { AdSpace } from '../../../components/AdSpace';

export const JitterWidgetPage: React.FC = () => {
    // Auto-refresh logic (every 60 seconds)
    // This helps clear memory and refresh the ad slot naturally
    useEffect(() => {
        const interval = setInterval(() => {
            window.location.reload();
        }, 60000); // 60 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-green-400 font-mono p-4 flex flex-col gap-4 overflow-hidden">
            {/* Minimalist Header */}
            <div className="flex justify-between items-center opacity-50 text-[10px] uppercase tracking-wider border-b border-green-500/20 pb-2">
                <div>Net Scouter Widget</div>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    LIVE
                </div>
            </div>

            {/* Main Radar */}
            <div className="flex-1">
                <RadarView />
            </div>

            {/* Ad Space (Square format for widget) */}
            <div className="h-[250px] w-full flex items-center justify-center border border-green-500/10 rounded bg-slate-900/30">
                <AdSpace slotId="net-scouter-widget" className="w-[300px] h-[250px]" />
            </div>

            {/* Footer */}
            <div className="text-center text-[9px] opacity-30 mt-auto">
                AUTO-REFRESH: 60s
            </div>
        </div>
    );
};

import React from 'react';
import { Activity } from 'lucide-react';
import { IpScouterCard } from './components/IpScouterCard';
import { PowerLevelGauge } from './components/PowerLevelGauge';
import { RadarView } from './components/RadarView';
import { AdSpace } from '../../components/AdSpace';
import { StreamerModeProvider } from './hooks/useStreamerMode';
import { SpeedTestProvider } from './contexts/SpeedTestContext';

const NetScouterContent: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-green-400">
            {/* Header */}
            <div className="border-b border-green-500/20 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-black tracking-wider flex items-center gap-3">
                        <Activity className="w-6 h-6" />
                        NET SCOUTER
                        <span className="text-xs opacity-40 font-normal tracking-normal">
                            Advanced Network Diagnostics
                        </span>
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: IP Info + Jitter */}
                    <div className="space-y-6">
                        <IpScouterCard />
                        <RadarView />
                    </div>

                    {/* Right Column: Speed Test */}
                    <div className="lg:col-span-2">
                        <PowerLevelGauge />
                    </div>
                </div>

                {/* Ad Space */}
                <div className="mt-8">
                    <AdSpace slotId="net-scouter-bottom" />
                </div>
            </div>
        </div>
    );
};

const NetScouter: React.FC = () => {
    return (
        <StreamerModeProvider>
            <SpeedTestProvider>
                <NetScouterContent />
            </SpeedTestProvider>
        </StreamerModeProvider>
    );
};

export default NetScouter;

import React from 'react';
import { Target, Pause, Play, Activity, ExternalLink } from 'lucide-react';
import { useJitterMonitor } from '../hooks/useJitterMonitor';

export const RadarView: React.FC = () => {
    const {
        currentLatency,
        avgJitter,
        stability,
        latencyHistory,
        isMonitoring,
        toggle
    } = useJitterMonitor();

    const hasData = avgJitter !== null;

    const openWidget = () => {
        window.open(
            '/tools/jitter-widget',
            'JitterWidget',
            'width=380,height=650,menubar=no,toolbar=no,location=no,status=no,scrollbars=no'
        );
    };

    return (
        <div className="bg-slate-900/50 border border-blue-500/20 rounded-lg p-6 backdrop-blur-md text-blue-400">
            {/* Header with toggle */}
            <div className="flex items-center justify-between mb-4 border-b border-blue-500/20 pb-2">
                <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                    <Target className="w-4 h-4" /> Jitter Radar
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={openWidget}
                        className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase transition-all bg-slate-700/50 text-slate-400 hover:bg-blue-500/20 hover:text-blue-400"
                        title="Pop-out widget"
                    >
                        <ExternalLink className="w-3 h-3" />
                        <span>WIDGET</span>
                    </button>
                    <button
                        onClick={toggle}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${isMonitoring
                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                            : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700/70'
                            }`}
                        title={isMonitoring ? 'Pause monitoring' : 'Resume monitoring'}
                    >
                        {isMonitoring ? (
                            <>
                                <Pause className="w-3 h-3" />
                                <span>ON</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-3 h-3" />
                                <span>OFF</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Radar Display */}
            <div className="h-40 flex flex-col items-center justify-center border border-blue-500/10 rounded relative overflow-hidden bg-slate-950/50">
                {/* Grid background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

                {/* Content */}
                <div className="relative z-10 text-center">
                    {!isMonitoring ? (
                        <>
                            <Pause className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <div className="text-xs opacity-40 uppercase tracking-widest">
                                Monitoring Paused
                            </div>
                            <div className="text-[10px] opacity-20 mt-1">
                                Click ON to resume
                            </div>
                        </>
                    ) : !hasData ? (
                        <>
                            <Activity className="w-8 h-8 animate-pulse mx-auto mb-2 text-blue-500" />
                            <div className="text-xs uppercase tracking-widest text-blue-400">
                                Initializing Monitor
                            </div>
                            <div className="text-[10px] opacity-40 mt-2">
                                Samples: {latencyHistory.length}/{2}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-2xl font-bold text-blue-400 mb-1">
                                {avgJitter} ms
                            </div>
                            <div className="text-[10px] opacity-60 uppercase tracking-widest">
                                Average Jitter
                            </div>
                            {currentLatency !== null && (
                                <div className="text-[9px] opacity-40 mt-1">
                                    Latest: {Math.round(currentLatency)}ms
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Scan line animation when active */}
                {isMonitoring && hasData && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-pulse" />
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
                <div className={`p-2 rounded border ${hasData ? 'bg-blue-950/30 border-blue-500/20' : 'bg-slate-800/30 border-blue-500/10'}`}>
                    <div className="opacity-40 mb-1">AVG JITTER</div>
                    <div className={`font-mono ${hasData ? 'text-blue-400 font-bold' : 'text-white'}`}>
                        {avgJitter !== null ? `${avgJitter} ms` : '-- ms'}
                    </div>
                </div>
                <div className={`p-2 rounded border ${hasData ? 'bg-blue-950/30 border-blue-500/20' : 'bg-slate-800/30 border-blue-500/10'}`}>
                    <div className="opacity-40 mb-1">STABILITY</div>
                    <div className={`font-mono ${stability === 'Good' ? 'text-green-400 font-bold' :
                        stability === 'Fair' ? 'text-yellow-400 font-bold' :
                            stability === 'Poor' ? 'text-red-400 font-bold' :
                                'text-white'
                        }`}>{stability || '--'}</div>
                </div>
            </div>

            {/* Monitoring status indicator */}
            {isMonitoring && (
                <div className="mt-2 text-center">
                    <div className="inline-flex items-center gap-1 text-[9px] opacity-30">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                        <span>Live monitoring</span>
                    </div>
                </div>
            )}
        </div>
    );
};

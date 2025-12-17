import React from 'react';
import { Zap, TrendingUp, Activity as ActivityIcon } from 'lucide-react';
import { useSpeedTest } from '../contexts/SpeedTestContext';

export const PowerLevelGauge: React.FC = () => {
    const { result, runSpeedTest, reset } = useSpeedTest();

    return (
        <div className="bg-slate-900/50 border border-green-500/20 rounded-lg p-8 backdrop-blur-md min-h-[400px] flex flex-col items-center justify-center relative">
            <div className="absolute top-4 left-4 text-[10px] opacity-30 uppercase tracking-widest">
                POWER_CORE_STATUS: {result.isRunning ? 'ACTIVE' : 'READY'}
            </div>

            {!result.isRunning && result.downloadSpeed === null ? (
                // Initial state - Start button
                <button
                    onClick={runSpeedTest}
                    className="group relative px-12 py-6 bg-green-500 text-slate-950 font-black text-xl rounded-full hover:scale-105 transition-transform overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12" />
                    <span className="relative flex items-center gap-3">
                        <Zap className="w-6 h-6" />
                        INITIATE SCAN
                    </span>
                </button>
            ) : result.isRunning ? (
                // Running state - Progress
                <div className="text-center w-full">
                    <div className="text-xs opacity-50 mb-4 uppercase tracking-[0.2em]">
                        Measuring Multi-threaded Power Level
                    </div>

                    {/* Progress bar */}
                    <div className="w-full max-w-md mx-auto mb-8">
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300"
                                style={{ width: `${result.progress}%` }}
                            />
                        </div>
                        <div className="text-xs mt-2 text-green-400">{Math.round(result.progress)}%</div>
                    </div>

                    {/* Animated bars */}
                    <div className="flex gap-2 justify-center">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className="w-3 h-16 rounded-sm bg-green-500 animate-pulse"
                                style={{
                                    animationDelay: `${i * 100}ms`,
                                    opacity: i < (result.progress / 10) ? 1 : 0.2,
                                }}
                            />
                        ))}
                    </div>
                </div>
            ) : result.error ? (
                // Error state
                <div className="text-center">
                    <div className="text-red-400 mb-4">{result.error}</div>
                    <button
                        onClick={reset}
                        className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
                    >
                        RETRY
                    </button>
                </div>
            ) : (
                // Results state
                <div className="text-center w-full">
                    <div className="text-xs opacity-50 mb-2 uppercase tracking-[0.2em]">Download Speed</div>
                    <div className="text-8xl font-black italic tracking-tighter text-green-400 mb-8">
                        {result.downloadSpeed}
                        <span className="text-2xl not-italic ml-2">Mbps</span>
                    </div>

                    {/* Additional metrics */}
                    <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                        <div className="bg-slate-800/50 p-4 rounded border border-green-500/10">
                            <div className="flex items-center justify-center gap-2 text-xs opacity-50 mb-1">
                                <TrendingUp className="w-3 h-3" />
                                LATENCY
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {result.latency}<span className="text-sm ml-1">ms</span>
                            </div>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded border border-green-500/10">
                            <div className="flex items-center justify-center gap-2 text-xs opacity-50 mb-1">
                                <ActivityIcon className="w-3 h-3" />
                                JITTER
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {result.jitter}<span className="text-sm ml-1">ms</span>
                            </div>
                        </div>
                        <div className={`p-4 rounded border ${result.bufferbloatGrade === 'A+' || result.bufferbloatGrade === 'A' ? 'bg-green-950/30 border-green-500/30' :
                                result.bufferbloatGrade === 'B' ? 'bg-yellow-950/30 border-yellow-500/30' :
                                    result.bufferbloatGrade === 'C' ? 'bg-orange-950/30 border-orange-500/30' :
                                        result.bufferbloatGrade === 'D' || result.bufferbloatGrade === 'F' ? 'bg-red-950/30 border-red-500/30' :
                                            'bg-slate-800/50 border-green-500/10'
                            }`}>
                            <div className="flex items-center justify-center gap-2 text-xs opacity-50 mb-1">
                                <Zap className="w-3 h-3" />
                                BUFFERBLOAT
                            </div>
                            <div className={`text-2xl font-bold ${result.bufferbloatGrade === 'A+' || result.bufferbloatGrade === 'A' ? 'text-green-400' :
                                    result.bufferbloatGrade === 'B' ? 'text-yellow-400' :
                                        result.bufferbloatGrade === 'C' ? 'text-orange-400' :
                                            result.bufferbloatGrade === 'D' || result.bufferbloatGrade === 'F' ? 'text-red-400' :
                                                'text-white'
                                }`}>
                                {result.bufferbloatGrade || '--'}
                            </div>
                            {result.loadedLatency !== null && (
                                <div className="text-[9px] opacity-40 mt-1">
                                    Loaded: {result.loadedLatency}ms
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <button
                        onClick={reset}
                        className="px-8 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-full text-sm font-bold transition-colors"
                    >
                        RUN AGAIN
                    </button>
                </div>
            )}

            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] opacity-30">
                <Zap className="w-3 h-3" />
                BUFFERBLOAT_ANALYZER: {result.isRunning ? 'MONITORING' : 'INACTIVE'}
            </div>
        </div>
    );
};

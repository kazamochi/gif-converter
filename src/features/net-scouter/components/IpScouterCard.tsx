import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useIpScouter } from '../hooks/useIpScouter';
import { useStreamerMode } from '../hooks/useStreamerMode';

export const IpScouterCard: React.FC = () => {
    const ipInfo = useIpScouter();
    const { maskIp, maskLocation, maskIsp, isStreamerMode, toggleStreamerMode } = useStreamerMode();

    return (
        <div className="bg-slate-900/50 border border-green-500/20 rounded-lg p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 border-b border-green-500/20 pb-2">
                <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                    <Shield className="w-4 h-4" /> IP SCOUTER
                </h2>
                <button
                    onClick={toggleStreamerMode}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${isStreamerMode
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700/70'
                        }`}
                    title={isStreamerMode ? 'Hide sensitive info (ON)' : 'Show all info (OFF)'}
                >
                    {isStreamerMode ? (
                        <>
                            <EyeOff className="w-3 h-3" />
                            <span>STREAMER</span>
                        </>
                    ) : (
                        <>
                            <Eye className="w-3 h-3" />
                            <span>SHOW ALL</span>
                        </>
                    )}
                </button>
            </div>

            {ipInfo.isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                    <span className="ml-2 text-xs opacity-50">SCANNING NETWORK...</span>
                </div>
            ) : ipInfo.error ? (
                <div className="text-red-400 text-xs p-4 border border-red-500/20 rounded bg-red-950/20">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    {ipInfo.error}
                </div>
            ) : (
                <div className="space-y-4 text-sm">
                    {/* Public IP */}
                    <div className="flex justify-between items-center">
                        <span className="opacity-50 text-xs uppercase tracking-wider">Public IP:</span>
                        <span className="text-white font-mono text-base">{maskIp(ipInfo.publicIp)}</span>
                    </div>

                    {/* ISP */}
                    <div className="flex justify-between items-start">
                        <span className="opacity-50 text-xs uppercase tracking-wider">ISP:</span>
                        <span className="text-white text-right text-xs max-w-[200px] truncate" title={ipInfo.isp || 'Unknown'}>
                            {maskIsp(ipInfo.isp)}
                        </span>
                    </div>

                    {/* Location */}
                    <div className="flex justify-between items-center">
                        <span className="opacity-50 text-xs uppercase tracking-wider">Location:</span>
                        <span className="text-white text-xs">
                            {maskLocation(ipInfo.city && ipInfo.country ? `${ipInfo.city}, ${ipInfo.country}` : null)}
                        </span>
                    </div>

                    {/* VPN Leak Detection */}
                    <div className="pt-4 border-t border-green-500/10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] opacity-40 uppercase tracking-widest">WebRTC Leak Status:</span>
                            {ipInfo.isVpnLeaking ? (
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span className="text-[10px] font-bold">DETECTED</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-green-500">
                                    <CheckCircle className="w-3 h-3" />
                                    <span className="text-[10px] font-bold">SECURE</span>
                                </div>
                            )}
                        </div>

                        {/* Local IPs (if leaked) */}
                        {ipInfo.localIps.length > 0 && (
                            <div className="mt-2 p-2 bg-yellow-950/20 border border-yellow-500/20 rounded text-[10px]">
                                <div className="text-yellow-400 font-bold mb-1">Local IPs Exposed:</div>
                                {ipInfo.localIps.map((ip, idx) => (
                                    <div key={idx} className="font-mono text-yellow-300/80">
                                        {maskIp(ip)}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Progress bar animation */}
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden mt-3">
                            <div
                                className={`h-full transition-all duration-500 ${ipInfo.isVpnLeaking ? 'bg-yellow-500 w-2/3' : 'bg-green-500 w-full'
                                    }`}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

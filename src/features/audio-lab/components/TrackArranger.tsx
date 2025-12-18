import React from 'react';
import { Lock, LockOpen, Volume2, VolumeX } from 'lucide-react';
import type { Track } from '../types';

interface TrackArrangerProps {
    tracks: Track[];
    selectedTrackId: string | null;
    onSelectTrack: (trackId: string) => void;
    onToggleLock: (trackId: string) => void;
    onToggleMute: (trackId: string) => void;
    onToggleSolo: (trackId: string) => void;
}

/**
 * 🎵 Track Arranger - Top Section of DAW
 * 
 * Displays all tracks in horizontal lanes.
 * User can select, lock, mute, solo each track.
 */
export const TrackArranger: React.FC<TrackArrangerProps> = ({
    tracks,
    selectedTrackId,
    onSelectTrack,
    onToggleLock,
    onToggleMute,
    onToggleSolo,
}) => {
    return (
        <div className="h-full overflow-y-auto">
            <div className="space-y-1 p-2">
                {tracks.map((track) => (
                    <div
                        key={track.id}
                        onClick={() => onSelectTrack(track.id)}
                        className={`
                            flex items-center gap-3 p-3 rounded-lg cursor-pointer
                            transition-all duration-150
                            ${selectedTrackId === track.id
                                ? 'bg-purple-500/20 border-2 border-purple-500/50'
                                : 'bg-slate-800/30 border-2 border-transparent hover:border-slate-700'
                            }
                        `}
                    >
                        {/* Track Name */}
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">
                                {track.name}
                            </div>
                            <div className="text-xs text-slate-500">
                                {track.notes.length} notes
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                            {/* Lock Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleLock(track.id);
                                }}
                                className={`
                                    p-2 rounded transition-colors
                                    ${track.locked
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : 'text-slate-500 hover:text-slate-300'
                                    }
                                `}
                                title={track.locked ? 'Locked' : 'Unlocked'}
                            >
                                {track.locked ? (
                                    <Lock className="w-4 h-4" />
                                ) : (
                                    <LockOpen className="w-4 h-4" />
                                )}
                            </button>

                            {/* Mute Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleMute(track.id);
                                }}
                                className={`
                                    p-2 rounded transition-colors
                                    ${track.muted
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'text-slate-500 hover:text-slate-300'
                                    }
                                `}
                                title={track.muted ? 'Muted' : 'Active'}
                            >
                                {track.muted ? (
                                    <VolumeX className="w-4 h-4" />
                                ) : (
                                    <Volume2 className="w-4 h-4" />
                                )}
                            </button>

                            {/* Solo Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleSolo(track.id);
                                }}
                                className={`
                                    px-3 py-1 rounded text-xs font-bold
                                    transition-colors
                                    ${track.soloed
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                        : 'text-slate-500 hover:text-slate-300 border border-transparent'
                                    }
                                `}
                                title={track.soloed ? 'Solo (Only this track plays)' : 'Not soloed'}
                            >
                                S
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {tracks.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No tracks yet. Click Generate to create music!
                    </div>
                )}
            </div>
        </div>
    );
};

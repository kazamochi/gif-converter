import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TrackArranger } from './TrackArranger';
import type { Track } from '../types';

/**
 * 🎹 Audio Lab - Main Entry Point
 * 
 * Layout Structure:
 * - Top: Arrangement View (Track Lanes)
 * - Bottom: Detail Editor (Piano Roll + Articulation)
 */

// Dummy data for testing
const DUMMY_TRACKS: Track[] = [
    {
        id: 'track-1',
        name: 'Melody',
        category: 'keyboard',
        notes: [
            { pitch: 60, velocity: 80, startTime: 0, endTime: 0.5 },
            { pitch: 62, velocity: 75, startTime: 0.5, endTime: 1.0 },
        ],
        muted: false,
        soloed: false,
        locked: false,
        volume: 0.8,
        pan: 0,
        useHumanization: false,
    },
    {
        id: 'track-2',
        name: 'Bass',
        category: 'plucked',
        notes: [
            { pitch: 48, velocity: 90, startTime: 0, endTime: 1.0 },
        ],
        muted: false,
        soloed: false,
        locked: false,
        volume: 0.9,
        pan: 0,
        useHumanization: false,
    },
    {
        id: 'track-3',
        name: 'Drums',
        category: 'percussion',
        notes: [],
        muted: false,
        soloed: false,
        locked: false,
        volume: 0.85,
        pan: 0,
        useHumanization: true,
    },
];

export const AudioLab: React.FC = () => {
    const [tracks, setTracks] = useState<Track[]>(DUMMY_TRACKS);
    const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

    const handleToggleLock = (trackId: string) => {
        setTracks(prev => prev.map(t =>
            t.id === trackId ? { ...t, locked: !t.locked } : t
        ));
    };

    const handleToggleMute = (trackId: string) => {
        setTracks(prev => prev.map(t =>
            t.id === trackId ? { ...t, muted: !t.muted } : t
        ));
    };

    const handleToggleSolo = (trackId: string) => {
        setTracks(prev => prev.map(t =>
            t.id === trackId ? { ...t, soloed: !t.soloed } : t
        ));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        🎹 Audio Lab
                    </h1>
                    <div className="w-32" /> {/* Spacer for centering */}
                </div>
            </header>

            {/* Main DAW Layout */}
            <div className="flex flex-col h-[calc(100vh-73px)]">
                {/* Top: Arrangement View (40% height) */}
                <div className="h-[40%] border-b border-slate-800 bg-slate-900/30">
                    <div className="p-4 h-full flex flex-col">
                        <h2 className="text-sm font-semibold text-slate-400 mb-2">
                            Arrangement View
                        </h2>
                        <div className="flex-1 bg-slate-800/50 rounded-lg overflow-hidden">
                            <TrackArranger
                                tracks={tracks}
                                selectedTrackId={selectedTrackId}
                                onSelectTrack={setSelectedTrackId}
                                onToggleLock={handleToggleLock}
                                onToggleMute={handleToggleMute}
                                onToggleSolo={handleToggleSolo}
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom: Detail Editor (60% height) */}
                <div className="h-[60%] flex flex-col">
                    {/* Piano Roll Area */}
                    <div className="flex-1 p-4">
                        <h2 className="text-sm font-semibold text-slate-400 mb-2">
                            Piano Roll
                        </h2>
                        <div className="bg-slate-800/50 rounded-lg p-8 text-center text-slate-500 h-full flex items-center justify-center">
                            Piano Roll Canvas (Coming Soon)
                        </div>
                    </div>

                    {/* Articulation Area */}
                    <div className="h-32 border-t border-slate-800 bg-slate-900/30 p-4">
                        <h2 className="text-sm font-semibold text-slate-400 mb-2">
                            Articulation (Velocity, Expression)
                        </h2>
                        <div className="bg-slate-800/50 rounded-lg p-4 text-center text-slate-500 h-full flex items-center justify-center">
                            Velocity / CC Editor (Coming Soon)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

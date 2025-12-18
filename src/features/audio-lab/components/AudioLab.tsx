import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Square, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TrackArranger } from './TrackArranger';
import { PianoRollCanvas } from './PianoRollCanvas';
import { AudioEngine } from '../engine/AudioEngine';
import { SimpleMusicGenerator } from '../ai/SimpleMusicGenerator';
import { magentaAI } from '../ai/MagentaGenerator';
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
        notes: [], // Start with empty drums
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
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioInitialized, setAudioInitialized] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [useAI, setUseAI] = useState(false);
    const [aiInitialized, setAiInitialized] = useState(false);

    // Initialize AudioEngine on mount
    useEffect(() => {
        return () => {
            AudioEngine.stopAll();
        };
    }, []);

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

    const handleGenerate = async () => {
        // Stop any current playback to prevent note accumulation in AudioEngine/Tone.Transport
        AudioEngine.stopAll();
        setIsPlaying(false);

        setIsGenerating(true);

        try {
            let generated: { melody: any[]; bass: any[]; drums: any[]; };

            if (useAI) {
                // Magenta.js AIによる生成
                try {
                    if (!aiInitialized) {
                        console.log('🧠 Initializing Magenta.js...');
                        await magentaAI.init();
                        setAiInitialized(true);
                        console.log('✅ Magenta.js initialized successfully');
                    }

                    console.log('🎵 Starting AI melody generation...');
                    // AIでメロディを生成
                    const aiMelody = await magentaAI.generateFromScratch({
                        temperature: 1.2,
                        steps: 64,
                    });

                    console.log('✅ AI generated', aiMelody.length, 'notes');

                    console.log('🎵 Starting AI bass generation...');
                    // AIでベースラインを生成
                    const aiBass = await magentaAI.generateBass({
                        temperature: 1.1,
                        steps: 64,
                    });

                    console.log('✅ AI generated melody & bass');


                    console.log('🎵 Starting AI drum generation...');
                    // AIでドラムパターンを生成
                    const aiDrums = await magentaAI.generateDrums({
                        temperature: 1.1,
                        steps: 64, // ドラマーは倍の解像度で刻むことが多いので長めに
                    });

                    console.log('✅ AI generated all tracks');

                    generated = {
                        melody: aiMelody,
                        bass: aiBass,
                        drums: aiDrums,
                    };

                    console.log('✨ AI-generated melody with', aiMelody.length, 'notes');
                } catch (aiError) {
                    console.error('❌ AI generation failed:', aiError);
                    alert('AI Generation Failed. Please try again. (Check console for details)');
                    setIsGenerating(false);
                    return; // Stop execution, do NOT fallback
                }
            } else {
                // SimpleMusicGeneratorによる生成
                generated = SimpleMusicGenerator.generateAllTracks({
                    vibe: 'jpop',
                    bars: 2,
                });
                console.log('✨ Rule-based generation completed');
            }

            // Update tracks with generated notes
            setTracks(prev => prev.map(track => {
                if (track.category === 'keyboard' || track.category === 'synth') {
                    return { ...track, notes: generated.melody };
                } else if (track.category === 'plucked' || track.category === 'sustained') {
                    return { ...track, notes: generated.bass };
                } else if (track.category === 'percussion') {
                    return { ...track, notes: generated.drums };
                }
                return track;
            }));

        } catch (error) {
            console.error('Failed to generate music:', error);
            alert('Failed to generate music. Check console for details.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePlay = async () => {
        // Initialize audio context on first play (browser requirement)
        if (!audioInitialized) {
            await AudioEngine.init();
            setAudioInitialized(true);
        }

        const selectedTrack = tracks.find(t => t.id === selectedTrackId);
        if (selectedTrack) {
            AudioEngine.playTrack(selectedTrack);
            setIsPlaying(true);
            // Auto-stop after track duration
            const maxDuration = Math.max(...selectedTrack.notes.map(n => n.endTime), 0);
            setTimeout(() => setIsPlaying(false), maxDuration * 1000 + 500);
        }
    };

    const handleStop = () => {
        AudioEngine.stopAll();
        setIsPlaying(false);
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
                    <div className="flex items-center gap-2">
                        {/* AI Toggle */}
                        <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={useAI}
                                onChange={(e) => setUseAI(e.target.checked)}
                                className="rounded border-slate-600 bg-slate-800 text-purple-500 focus:ring-purple-500/50"
                            />
                            <span>Use AI</span>
                        </label>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            title={useAI ? 'Generate with Magenta.js AI' : 'Generate with Rules'}
                        >
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-semibold text-purple-300">
                                {isGenerating ? 'Generating...' : useAI ? 'AI Generate' : 'Generate'}
                            </span>
                        </button>

                        {/* Play/Stop Button */}
                        {isPlaying ? (
                            <button
                                onClick={handleStop}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-colors"
                                title="Stop"
                            >
                                <Square className="w-5 h-5 text-red-400" />
                            </button>
                        ) : (
                            <button
                                onClick={handlePlay}
                                disabled={!selectedTrackId}
                                className="p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Play Selected Track"
                            >
                                <Play className="w-5 h-5 text-green-400" />
                            </button>
                        )}
                    </div>
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
                            Piano Roll {selectedTrackId && `- ${tracks.find(t => t.id === selectedTrackId)?.name}`}
                        </h2>
                        {selectedTrackId ? (
                            <PianoRollCanvas
                                notes={tracks.find(t => t.id === selectedTrackId)?.notes || []}
                                isLocked={tracks.find(t => t.id === selectedTrackId)?.locked || false}
                                trackId={selectedTrackId}
                            />
                        ) : (
                            <div className="bg-slate-800/50 rounded-lg p-8 text-center text-slate-500 h-full flex items-center justify-center">
                                <div>
                                    <p className="text-lg mb-2">Select a track to edit</p>
                                    <p className="text-sm">Click on a track in the arrangement view above</p>
                                </div>
                            </div>
                        )}
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

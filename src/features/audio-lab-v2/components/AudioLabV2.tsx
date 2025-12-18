import React, { useState } from 'react';
import { ArrowLeft, Play, Square, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PianoRollV2 } from './PianoRollV2';
import { AudioEngineV2 } from '../AudioEngineV2';
import { AIGeneratorV2 } from '../AIGeneratorV2';
import type { TrackV2 } from '../types';

/**
 * 🎹 Audio Lab V2 - Clean Rebuild
 * 
 * 1トラック（メロディ）のみでシンプルに開始。
 * AI 生成のみを使用し、手動生成は一切なし。
 */

export const AudioLabV2: React.FC = () => {
    // 初期状態: 空のドラムトラック
    const [track, setTrack] = useState<TrackV2>({
        id: 'drums-1',
        name: 'AI Drums',
        category: 'drums',
        notes: [],
        muted: false,
        volume: 0.8,
    });


    const [isPlaying, setIsPlaying] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    /**
     * AI 生成
     */
    const handleGenerate = async () => {
        setIsGenerating(true);

        try {
            // AI 初期化（初回のみ）
            if (!AIGeneratorV2.isReady()) {
                console.log('🤖 Initializing AI...');
                await AIGeneratorV2.init();
            }

            // 再生中なら停止
            if (isPlaying) {
                AudioEngineV2.stopAll();
                setIsPlaying(false);
            }

            // AI でドラム生成
            const newNotes = await AIGeneratorV2.generateDrums({
                temperature: 1.0,
                steps: 32,
            });

            // トラックを更新（完全に置き換え）
            setTrack(prev => ({
                ...prev,
                notes: newNotes,
            }));

            console.log(`✨ Generated ${newNotes.length} drum hits`);


        } catch (error) {
            console.error('❌ Generation failed:', error);
            alert('AI Generation failed. Check console.');
        } finally {
            setIsGenerating(false);
        }
    };

    /**
     * 再生
     */
    const handlePlay = async () => {
        try {
            if (!AudioEngineV2.isReady()) {
                console.log('🎹 Initializing audio engine...');
                await AudioEngineV2.init();
            }

            console.log('▶️ Starting playback...');
            AudioEngineV2.playTrack(track);
            setIsPlaying(true);

            // 自動的に停止状態に戻す
            if (track.notes.length > 0) {
                const maxTime = Math.max(...track.notes.map(n => n.startTime + 0.5)); // duration を適当に考慮
                setTimeout(() => setIsPlaying(false), maxTime * 1000 + 1000);
            }
        } catch (error) {
            console.error('❌ Playback failed:', error);
        }
    };


    /**
     * 停止
     */
    const handleStop = () => {
        AudioEngineV2.stopAll();
        setIsPlaying(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-900/50">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </Link>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        🎹 Audio Lab V2
                    </h1>
                    <div className="flex items-center gap-3">
                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-semibold text-purple-300">
                                {isGenerating ? 'Generating...' : 'AI Generate'}
                            </span>
                        </button>

                        {/* Play/Stop */}
                        {isPlaying ? (
                            <button
                                onClick={handleStop}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-colors"
                            >
                                <Square className="w-5 h-5 text-red-400" />
                            </button>
                        ) : (
                            <button
                                onClick={handlePlay}
                                disabled={track.notes.length === 0}
                                className="p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <Play className="w-5 h-5 text-green-400" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* Track Info */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-300">
                        {track.name}
                    </h2>
                    <span className="text-sm text-slate-500">
                        {track.notes.length} notes
                    </span>
                </div>

                {/* Piano Roll */}
                <PianoRollV2 notes={track.notes} />

                {/* Empty State */}
                {track.notes.length === 0 && (
                    <div className="mt-6 text-center text-slate-500">
                        <p className="text-lg">No notes yet.</p>
                        <p className="text-sm mt-1">Click "AI Generate" to create a melody.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

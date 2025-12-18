import * as mm from '@magenta/music';
import type { MIDINote } from '../types';

/**
 * 🧠 MagentaAI - 高度な音楽生成
 * 
 * Magenta.js の MusicRNN を使った継続生成。
 * SimpleMusicGenerator との違い：
 * - AI がメロディの「次の展開」を推測
 * - 人間らしい揺らぎとグルーヴ
 * - より自然な音楽的フレーズ
 */

interface MagentaGeneratorOptions {
    temperature?: number;  // 0.0-1.0: 低いほど安定、高いほど創造的
    steps?: number;        // 生成するステップ数
    seedNotes?: MIDINote[]; // 開始音符（AIが続きを考える）
}

export class MagentaGenerator {
    private musicRNN: mm.MusicRNN | null = null;
    private drumRNN: mm.MusicRNN | null = null;
    private initialized: boolean = false;

    /**
     * Magenta.js の MusicRNN モデルを初期化
     */
    async init(): Promise<void> {
        if (this.initialized) return;

        try {
            console.log('🧠 Initializing Magenta.js MusicRNN...');

            // MusicRNN モデルのロード（メロディ用）
            // 'basic_rnn' は軽量で高速、'melody_rnn' はより高品質
            this.musicRNN = new mm.MusicRNN(
                'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn'
            );
            await this.musicRNN.initialize();

            // DrumRNN モデルのロード（ドラム用）
            this.drumRNN = new mm.MusicRNN(
                'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/drum_kit_rnn'
            );
            await this.drumRNN.initialize();

            this.initialized = true;

            console.log('✅ Magenta.js initialized successfully!');
        } catch (error) {
            console.error('❌ Failed to initialize Magenta.js:', error);
            throw error;
        }
    }

    /**
     * メロディの継続生成
     * シード音符から「次の展開」をAIが推測
     */
    async continueSequence(
        seedNotes: MIDINote[],
        options: MagentaGeneratorOptions = {}
    ): Promise<MIDINote[]> {
        if (!this.initialized || !this.musicRNN) {
            throw new Error('Magenta.js not initialized. Call init() first.');
        }

        const { temperature = 1.0, steps = 32 } = options;

        try {
            // MIDINote を Magenta の NoteSequence 形式に変換
            const seedSequence: mm.INoteSequence = {
                notes: seedNotes.map((note) => ({
                    pitch: note.pitch,
                    velocity: note.velocity,
                    startTime: note.startTime,
                    endTime: note.endTime,
                })),
                totalTime: Math.max(...seedNotes.map(n => n.endTime)),
            };

            // AI による継続生成
            const continuation = await this.musicRNN.continueSequence(
                seedSequence,
                steps,
                temperature
            );

            // NoteSequence を MIDINote[] に変換
            if (!continuation.notes) {
                throw new Error('No notes returned from Magenta');
            }

            const generatedNotes: MIDINote[] = continuation.notes
                .filter(note => note.pitch != null && note.startTime != null && note.endTime != null)
                .map(note => ({
                    pitch: note.pitch!,
                    velocity: note.velocity ?? 80,
                    startTime: note.startTime!,
                    endTime: note.endTime!,
                }));

            console.log(`🎵 Generated ${generatedNotes.length} notes with Magenta.js`);
            return generatedNotes;

        } catch (error) {
            console.error('Failed to generate with Magenta:', error);
            throw error;
        }
    }

    /**
     * ゼロから新しいメロディを生成
     */
    async generateFromScratch(options: MagentaGeneratorOptions & { pitchOffset?: number } = {}): Promise<MIDINote[]> {
        const { pitchOffset = 0 } = options;

        // シンプルな開始音符を作成（Cメジャースケール）
        // pitchOffset で音域を調整（ベースなら -12 や -24）
        const basePitch = 60 + pitchOffset;

        const seedNotes: MIDINote[] = [
            { pitch: basePitch, velocity: 80, startTime: 0, endTime: 0.5 },      // root
            { pitch: basePitch + 4, velocity: 75, startTime: 0.5, endTime: 1.0 }, // 3rd
        ];

        return this.continueSequence(seedNotes, options);
    }

    /**
     * ベースラインを生成（Melody生成のラッパー、低音域指定）
     */
    async generateBass(options: MagentaGeneratorOptions = {}): Promise<MIDINote[]> {
        return this.generateFromScratch({
            ...options,
            pitchOffset: -24, // 2オクターブ下
            temperature: 1.1  // 少し安定させる
        });
    }

    /**
     * ドラムパターンを生成 (DrumRNN)
     */
    async generateDrums(options: MagentaGeneratorOptions = {}): Promise<MIDINote[]> {
        if (!this.initialized || !this.drumRNN) {
            throw new Error('Magenta.js not initialized');
        }

        const { temperature = 1.1, steps = 32 } = options;

        // ドラムのシード（シンプルな4つ打ち）
        // Note: DrumRNNのpitchはMIDIノート番号に対応
        const seedNotes: MIDINote[] = [
            { pitch: 36, velocity: 100, startTime: 0, endTime: 0.1 }, // Kick
            { pitch: 42, velocity: 80, startTime: 0.5, endTime: 0.1 }, // Hi-hat
        ];

        const seedSequence: mm.INoteSequence = {
            notes: seedNotes.map(n => ({
                pitch: n.pitch,
                startTime: n.startTime,
                endTime: n.endTime
            })),
            totalTime: 1.0,
        };

        try {
            // Note: MusicRNN requires quantized input
            // 4 steps per quarter note (16th notes)
            const quantizedSeed = mm.sequences.quantizeNoteSequence(seedSequence, 4);

            const continuation = await this.drumRNN.continueSequence(
                quantizedSeed,
                steps,
                temperature
            );

            if (!continuation.notes) return [];

            // Convert quantized output back to absolute time
            // We can treat each step as 0.125s (assuming 120 BPM, 16th note)
            // Or rely on the 'startTime' if unquantized, but RNN returns quantized steps usually.

            // Note: MusicRNN result usually has quantizedStartStep/EndStep.
            // We need to convert steps to seconds.
            // Assuming 120 BPM => 1 beat = 0.5s => 1 step (1/4 beat) = 0.125s
            const SECONDS_PER_STEP = 0.125;

            return continuation.notes.map(note => {
                // Use quantized steps if available, fallback to time (though RNN output usually has only steps)
                const startStep = note.quantizedStartStep || 0;
                // const endStep = note.quantizedEndStep || startStep + 1;

                return {
                    pitch: note.pitch!,
                    velocity: note.velocity ?? 90,
                    startTime: startStep * SECONDS_PER_STEP,
                    endTime: (startStep * SECONDS_PER_STEP) + 0.1, // Fixed duration for drums
                };
            });
        } catch (error) {
            console.error('Failed to generate drums with Magenta:', error);
            // Re-throw to trigger fallback in UI
            throw error;
        }
    }

    /**
     * クリーンアップ
     */
    dispose(): void {
        if (this.musicRNN) {
            this.musicRNN.dispose();
            this.musicRNN = null;
        }
        if (this.drumRNN) {
            this.drumRNN.dispose();
            this.drumRNN = null;
        }
        this.initialized = false;
    }
}

// Export singleton instance
export const magentaAI = new MagentaGenerator();

import * as mm from '@magenta/music';
import * as Tone from 'tone';
import type { MIDINoteV2, GenerationOptionsV2 } from './types';

/**
 * 🤖 AIGeneratorV2 - Magenta.js Drum Generator & Player
 * DrumRNN でパターンを生成し、Tone.js で即座に演奏します。
 */

const DRUM_MODEL_URL = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/drum_kit_rnn';

class AIGeneratorV2Class {
    private drumRNN: mm.MusicRNN | null = null;
    private initialized = false;
    private initializing = false;

    // 🎹 楽器（シンセサイザー）の定義
    private kick: Tone.MembraneSynth | null = null;
    private snare: Tone.NoiseSynth | null = null;
    private hihat: Tone.MetalSynth | null = null;

    /**
     * AIと楽器を初期化
     */
    async init(): Promise<void> {
        if (this.initialized || this.initializing) return;

        this.initializing = true;
        console.log('🥁 Loading AI & Instruments...');

        try {
            // 1. AIの脳みそをロード
            this.drumRNN = new mm.MusicRNN(DRUM_MODEL_URL);
            await this.drumRNN.initialize();

            // 2. 楽器（ドラム音源）を準備
            this.kick = new Tone.MembraneSynth().toDestination();
            this.snare = new Tone.NoiseSynth({
                volume: -10,
                envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
            }).toDestination();
            this.hihat = new Tone.MetalSynth({
                volume: -15,
                envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
                harmonicity: 5.1,
                modulationIndex: 32,
                resonance: 4000,
                octaves: 1.5
            }).toDestination();

            this.initialized = true;
            console.log('✅ AI & Instruments ready');
        } catch (error) {
            console.error('❌ Failed to initialize:', error);
            throw error;
        } finally {
            this.initializing = false;
        }
    }

    /**
     * ドラムパターンを生成して、そのまま演奏する
     */
    async generateDrums(options: GenerationOptionsV2 = {}): Promise<MIDINoteV2[]> {
        if (!this.initialized || !this.drumRNN) {
            await this.init();
            if (!this.initialized || !this.drumRNN) {
                throw new Error('AIGeneratorV2 failed to initialize.');
            }
        }

        // --- 1. AIによる作曲パート ---
        const { temperature = 1.0, steps = 32 } = options;

        const seedSequence: mm.INoteSequence = {
            notes: [
                { pitch: 36, startTime: 0, endTime: 0.5, velocity: 100 },
                { pitch: 42, startTime: 0.5, endTime: 1.0, velocity: 80 },
            ],
            totalTime: 1.0,
            quantizationInfo: { stepsPerQuarter: 4 },
        };

        const quantizedSeed = mm.sequences.quantizeNoteSequence(seedSequence, 4);
        console.log('🥁 Generating drum pattern...');

        const continuation = await this.drumRNN.continueSequence(
            quantizedSeed,
            steps,
            temperature
        );

        if (!continuation.notes || continuation.notes.length === 0) {
            console.warn('⚠️ AI returned empty pattern');
            return [];
        }

        const STEP_DURATION = 0.125; // 16th note at 120 BPM
        const notes: MIDINoteV2[] = continuation.notes.map(note => {
            const startStep = note.quantizedStartStep ?? 0;
            const endStep = note.quantizedEndStep ?? (startStep + 1);
            return {
                pitch: note.pitch ?? 36,
                velocity: note.velocity ?? 100,
                startTime: startStep * STEP_DURATION,
                duration: Math.max((endStep - startStep) * STEP_DURATION, 0.1),
            };
        });

        console.log(`✅ Generated ${notes.length} notes. Playing now...`);

        // --- 2. 演奏パート ---
        this.playNotes(notes);

        return notes;
    }

    /**
     * ノートデータを受け取って演奏する内部メソッド
     */
    private async playNotes(notes: MIDINoteV2[]) {
        await Tone.start();

        Tone.Transport.stop();
        Tone.Transport.cancel();

        const now = Tone.now() + 0.1;

        notes.forEach(note => {
            const time = now + note.startTime;
            const vel = note.velocity / 127;

            if (note.pitch === 36 || note.pitch === 35) {
                this.kick?.triggerAttackRelease("C1", "8n", time, vel);
            } else if (note.pitch === 38 || note.pitch === 40) {
                this.snare?.triggerAttackRelease("8n", time, vel);
            } else if (note.pitch >= 42) {
                this.hihat?.triggerAttackRelease("32n", time, vel * 0.8);
            }
        });

        Tone.Transport.start();
    }

    isReady(): boolean {
        return this.initialized;
    }
}

export const AIGeneratorV2 = new AIGeneratorV2Class();

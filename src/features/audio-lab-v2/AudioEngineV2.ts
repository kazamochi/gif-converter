import * as Tone from 'tone';
import type { TrackV2 } from './types';

/**
 * 🥁 AudioEngineV2 - Direct Synth Drum Engine
 * 
 * ユーザー指定の高品質シンセ設定を使用したドラムエンジン。
 * WAV サンプルは一切使用せず、計算によって音を生成。
 */

class AudioEngineV2Class {
    private kick: Tone.MembraneSynth | null = null;
    private snare: Tone.NoiseSynth | null = null;
    private hihat: Tone.MetalSynth | null = null;
    private tom: Tone.MembraneSynth | null = null;

    private initialized = false;

    /**
     * Tone.js を起動し、楽器をセットアップ
     */
    async init(): Promise<void> {
        if (this.initialized) return;

        await Tone.start();
        console.log('🎸 AudioEngineV2: Initializing high-quality synth drums...');

        // 1. KICK - 深い低音
        this.kick = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 10,
            oscillator: { type: 'sine' },
            envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
        }).toDestination();

        // 2. SNARE - スナッピーなノイズ
        this.snare = new Tone.NoiseSynth({
            noise: { type: 'white' },
            envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
        }).toDestination();

        // 3. HI-HAT - 金属的な響き (MetalSynth)
        this.hihat = new Tone.MetalSynth({
            envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5,
            volume: -10
        }).toDestination();

        // 4. TOM - ピッチ可変
        this.tom = new Tone.MembraneSynth({
            pitchDecay: 0.1,
            octaves: 4,
            envelope: { attack: 0.001, decay: 0.3, sustain: 0.02, release: 0.8 }
        }).toDestination();

        this.initialized = true;
        console.log('✅ AudioEngineV2: Ready to play');
    }

    /**
     * トラックデータを再生
     */
    playTrack(track: TrackV2): void {
        if (!this.initialized) {
            console.warn('⚠️ AudioEngineV2 not initialized. Click Play again.');
            return;
        }

        // 全停止 & キャンセル
        this.stopAll();

        const now = Tone.now();
        console.log(`🔊 Starting playback of ${track.notes.length} notes...`);

        track.notes.forEach(note => {
            const time = now + note.startTime;
            const velocity = note.velocity / 127;

            this.triggerDrum(note.pitch, time, velocity);
        });
    }

    /**
     * MIDI ピッチに応じてドラマーが楽器を叩く
     */
    private triggerDrum(pitch: number, time: number, velocity: number): void {
        if (velocity <= 0) return;

        // General MIDI Drum Map
        if (pitch === 35 || pitch === 36) {
            // KICK
            this.kick?.triggerAttackRelease("C1", "8n", time, velocity);
        } else if (pitch === 38 || pitch === 40) {
            // SNARE
            this.snare?.triggerAttackRelease("8n", time, velocity);
        } else if (pitch >= 42 && pitch <= 46) {
            // HI-HAT (Closed/Open)
            this.hihat?.triggerAttackRelease(0.1, time, velocity * 0.7);
        } else if (pitch >= 41 && pitch <= 50) {
            // TOMS
            this.tom?.triggerAttackRelease("G2", "8n", time, velocity);
        } else {
            // FALLBACK (Snare thin)
            this.snare?.triggerAttackRelease("16n", time, velocity * 0.5);
        }
    }

    /**
     * 完全に音を止める
     */
    stopAll(): void {
        Tone.Transport.stop();
        Tone.Transport.cancel();

        this.kick?.triggerRelease();
        this.snare?.triggerRelease();
        this.hihat?.triggerRelease();
        this.tom?.triggerRelease();

        console.log('🛑 Playback stopped');
    }

    isReady(): boolean {
        return this.initialized;
    }
}

export const AudioEngineV2 = new AudioEngineV2Class();

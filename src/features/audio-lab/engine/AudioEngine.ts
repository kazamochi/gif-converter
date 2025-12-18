import * as Tone from 'tone';
import type { Track, MIDINote } from '../types';

/**
 * 🎵 AudioEngine - Tone.js Singleton
 * 
 * Handles all audio playback for Audio Lab.
 * - Converts MIDI notes to actual sound
 * - Manages multiple tracks with different instruments
 * - Controls playback (play/stop)
 */

class AudioEngineClass {
    private synths: Map<string, Tone.PolySynth | any> = new Map();
    private initialized: boolean = false;

    /**
     * Initialize Tone.js (必ず最初に呼ぶ)
     * ブラウザのオーディオコンテキストを起動
     */
    async init(): Promise<void> {
        if (this.initialized) return;

        await Tone.start();
        console.log('🎵 AudioEngine initialized');
        this.initialized = true;
    }

    /**
     * トラックにシンセを割り当て
     */
    private getSynthForTrack(track: Track): any {
        if (!this.synths.has(track.id)) {
            let synth;

            if (track.category === 'percussion') {
                // ドラム用: 複数のノイズシンセを手動で管理
                synth = {
                    kick: new Tone.MembraneSynth({
                        pitchDecay: 0.05,
                        octaves: 10,
                        oscillator: { type: 'sine' },
                        envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
                    }).toDestination(),
                    snare: new Tone.NoiseSynth({
                        noise: { type: 'white' },
                        envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
                    }).toDestination(),
                    hihat: new Tone.NoiseSynth({
                        noise: { type: 'white' },
                        envelope: { attack: 0.001, decay: 0.05, sustain: 0 },
                        volume: -10
                    }).toDestination(),
                    releaseAll: () => { } // Compatibility with PolySynth interface
                };
            } else {
                // メロディ・ベース用: PolySynth
                synth = new Tone.PolySynth(Tone.Synth, {
                    oscillator: { type: 'triangle' },
                    envelope: {
                        attack: 0.005,
                        decay: 0.1,
                        sustain: 0.3,
                        release: 1
                    }
                }).toDestination();
            }

            this.synths.set(track.id, synth);
        }

        return this.synths.get(track.id)!;
    }

    /**
     * 単一トラックを再生
     */
    playTrack(track: Track): void {
        if (!this.initialized) {
            console.warn('AudioEngine not initialized. Call init() first.');
            return;
        }

        if (track.muted) {
            console.log(`Track "${track.name}" is muted, skipping`);
            return;
        }

        const synth = this.getSynthForTrack(track);

        // Stop any currently playing notes
        synth.releaseAll?.();

        // Schedule all notes
        const now = Tone.now();

        if (track.category === 'percussion') {
            // ドラムの場合: MIDI note 番号で楽器を判別
            track.notes.forEach((note: MIDINote) => {
                const startTime = now + note.startTime;
                const velocity = note.velocity / 127;

                if (note.pitch >= 35 && note.pitch <= 36) {
                    // KICK (Bass Drum)
                    synth.kick.triggerAttackRelease('C1', 0.1, startTime, velocity);
                } else if (note.pitch >= 38 && note.pitch <= 40) {
                    // SNARE
                    synth.snare.triggerAttackRelease(0.2, startTime, velocity);
                } else if (note.pitch >= 42 && note.pitch <= 46) {
                    // HI-HAT
                    synth.hihat.triggerAttackRelease(0.05, startTime, velocity * 0.5);
                }
            });
        } else {
            // メロディ・ベース: 通常のシンセ再生
            track.notes.forEach((note: MIDINote) => {
                const pitch = Tone.Frequency(note.pitch, 'midi').toNote();
                const duration = note.endTime - note.startTime;
                const startTime = now + note.startTime;

                synth.triggerAttackRelease(
                    pitch,
                    duration,
                    startTime,
                    note.velocity / 127
                );
            });
        }

        console.log(`Playing track "${track.name}" with ${track.notes.length} notes`);
    }

    /**
     * Stop all playback and cancel scheduled events
     * これがないと再生するたびにイベントが蓄積され、停止後も音が残る
     */
    stopAll() {
        // キャンセル: これまでスケジュールされた全イベントを破棄
        Tone.Transport.cancel();
        Tone.Transport.stop();

        this.synths.forEach(synth => {
            // Check if it's a PolySynth or a percussion object
            if (synth.releaseAll) {
                synth.releaseAll();
            } else if (synth.kick && synth.snare && synth.hihat) {
                // Percussion synths need individual release
                synth.kick.triggerRelease();
                synth.snare.triggerRelease();
                synth.hihat.triggerRelease();
            }
        });

        console.log('🛑 All tracks stopped');
    }

    /**
     * クリーンアップ
     */
    dispose(): void {
        this.synths.forEach((synth) => synth.dispose());
        this.synths.clear();
        this.initialized = false;
    }
}

// Export singleton instance
export const AudioEngine = new AudioEngineClass();

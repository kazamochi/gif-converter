import { MusicRNN } from '@magenta/music/esm/music_rnn';
import type { INoteSequence } from '@magenta/music/esm/protobuf';
import type { MIDINote } from '../types';

/**
 * 🤖 Audio Lab - AI Generation Service
 * Powered by Magenta.js (MusicRNN)
 */

const MODEL_CHECKPOINT = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn';

class AudioGenerator {
    private model: MusicRNN;
    private initialized: boolean = false;

    constructor() {
        this.model = new MusicRNN(MODEL_CHECKPOINT);
    }

    /**
     * Initialize the AI model
     */
    async init() {
        if (this.initialized) return;
        await this.model.initialize();
        this.initialized = true;
        console.log('🤖 Magenta MusicRNN Initialized');
    }

    /**
     * Generate notes based on a chord progression
     */
    async generateMelody(/* progression: ChordProgression, */ steps: number = 32, temperature: number = 1.0): Promise<MIDINote[]> {
        if (!this.initialized) await this.init();

        // 1. Create a quantized seed sequence (required by Magenta)
        const seedSeq: INoteSequence = {
            notes: [
                { pitch: 60, startTime: 0, endTime: 0.5, velocity: 80 }
            ],
            totalTime: 0.5,
            quantizationInfo: {
                stepsPerQuarter: 4  // 16th note quantization
            }
        };

        // 2. Generate the sequence (without chord conditioning)
        // Note: The basic_rnn model doesn't support chord conditioning
        // We'll use the Vibe selection for UI purposes but generate freely for now
        const generatedSeq = await this.model.continueSequence(seedSeq, steps, temperature);

        // 3. Convert Magenta NoteSequence to our MIDINote format
        return this.convertSequenceToMIDINotes(generatedSeq);
    }

    /**
     * Convert NoteSequence to Audio Lab MIDINote format
     */
    private convertSequenceToMIDINotes(seq: INoteSequence): MIDINote[] {
        if (!seq.notes) return [];

        return seq.notes.map(note => ({
            pitch: note.pitch || 60,
            velocity: note.velocity || 80,
            startTime: note.startTime || 0,
            endTime: note.endTime || 0.5,
        }));
    }
}

export const generator = new AudioGenerator();

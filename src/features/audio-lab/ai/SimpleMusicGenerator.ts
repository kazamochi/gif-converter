import type { MIDINote, Track } from '../types';

/**
 * 🎲 SimpleMusicGenerator
 * 
 * Magenta.js の代替として、シンプルな音楽理論ベースの生成ロジック。
 * 
 * 特徴:
 * - コード進行に基づいたメロディ生成
 * - ベースラインは root note を追従
 * - シンプルな4ビートドラムパターン
 * - 完全にクライアントサイド、依存関係なし
 */

// ============================================
// 音楽理論の基礎定数
// ============================================

const CHORD_PROGRESSIONS = {
    jpop: [
        { root: 5, type: 'major' },  // F (IV)
        { root: 7, type: 'major' },  // G (V)
        { root: 4, type: 'minor' },  // Em (iii)
        { root: 9, type: 'minor' },  // Am (vi)
    ],
    citypop: [
        { root: 5, type: 'maj7' },   // FM7 (IVM7)
        { root: 4, type: '7' },      // E7 (III7)
        { root: 9, type: 'min7' },   // Am7 (vim7)
        { root: 0, type: '7' },      // C7 (I7)
    ],
    simple: [
        { root: 0, type: 'major' },  // C (I)
        { root: 9, type: 'minor' },  // Am (vi)
        { root: 5, type: 'major' },  // F (IV)
        { root: 7, type: 'major' },  // G (V)
    ],
};

interface GeneratorOptions {
    vibe?: 'jpop' | 'citypop' | 'simple';
    bpm?: number;
    bars?: number;
    baseOctave?: number;
}

// ============================================
// メロディ生成
// ============================================

function generateMelody(options: GeneratorOptions = {}): MIDINote[] {
    const { vibe = 'simple', baseOctave = 5 } = options;
    const progression = CHORD_PROGRESSIONS[vibe];
    const notes: MIDINote[] = [];
    const beatsPerChord = 2; // 各コードを2拍

    progression.forEach((chord, chordIndex) => {
        const startTime = chordIndex * beatsPerChord * 0.5; // 0.5秒 = 1拍 (120 BPM)

        // コードトーンからランダムに選択
        const chordTones = getChordTones(chord.root, chord.type, baseOctave);

        // 2拍分のメロディ（8分音符4個 or 4分音符2個）
        const pattern = Math.random() > 0.5 ? 'eighth' : 'quarter';

        if (pattern === 'eighth') {
            // 8分音符パターン
            for (let i = 0; i < 4; i++) {
                notes.push({
                    pitch: chordTones[Math.floor(Math.random() * chordTones.length)],
                    velocity: 70 + Math.floor(Math.random() * 20),
                    startTime: startTime + (i * 0.25),
                    endTime: startTime + (i * 0.25) + 0.2,
                });
            }
        } else {
            // 4分音符パターン
            for (let i = 0; i < 2; i++) {
                notes.push({
                    pitch: chordTones[Math.floor(Math.random() * chordTones.length)],
                    velocity: 80 + Math.floor(Math.random() * 15),
                    startTime: startTime + (i * 0.5),
                    endTime: startTime + (i * 0.5) + 0.45,
                });
            }
        }
    });

    return notes;
}

// ============================================
// ベースライン生成
// ============================================

// ベースライン生成
function generateBass(options: GeneratorOptions = {}): MIDINote[] {
    const { vibe = 'simple', baseOctave = 3 } = options;
    const progression = CHORD_PROGRESSIONS[vibe];
    const notes: MIDINote[] = [];
    const beatsPerChord = 2;

    progression.forEach((chord, chordIndex) => {
        const startTime = chordIndex * beatsPerChord * 0.5;
        const rootNote = chord.root + (baseOctave * 12);

        // パターンA: ルート音キープ
        // パターンB: ルート -> オクターブ上
        const pattern = Math.random() > 0.7 ? 'octave' : 'root';

        if (pattern === 'root') {
            notes.push({
                pitch: rootNote,
                velocity: 95 + Math.floor(Math.random() * 10),
                startTime: startTime,
                endTime: startTime + 0.9,
            });
        } else {
            notes.push({
                pitch: rootNote,
                velocity: 95,
                startTime: startTime,
                endTime: startTime + 0.45,
            });
            notes.push({
                pitch: rootNote + 12,
                velocity: 90,
                startTime: startTime + 0.5,
                endTime: startTime + 0.9,
            });
        }
    });

    return notes;
}

// ============================================
// ドラムパターン生成
// ============================================

// ドラムパターン生成 (Disable manual generation as requested by user)
function generateDrums(): MIDINote[] {
    return []; // Return empty as user wants AI only or silent
}

// ============================================
// ヘルパー関数
// ============================================

function getChordTones(root: number, type: string, octave: number): number[] {
    const baseNote = root + (octave * 12);

    switch (type) {
        case 'major':
            return [baseNote, baseNote + 4, baseNote + 7];
        case 'minor':
            return [baseNote, baseNote + 3, baseNote + 7];
        case 'maj7':
            return [baseNote, baseNote + 4, baseNote + 7, baseNote + 11];
        case 'min7':
            return [baseNote, baseNote + 3, baseNote + 7, baseNote + 10];
        case '7':
            return [baseNote, baseNote + 4, baseNote + 7, baseNote + 10];
        default:
            return [baseNote, baseNote + 4, baseNote + 7];
    }
}

// ============================================
// メインAPI
// ============================================

export class SimpleMusicGenerator {
    static generateTrack(trackCategory: Track['category'], options: GeneratorOptions = {}): MIDINote[] {
        switch (trackCategory) {
            case 'keyboard':
            case 'synth':
                return generateMelody(options);
            case 'plucked':
            case 'sustained':
                return generateBass(options);
            case 'percussion':
                return generateDrums();
            default:
                return [];
        }
    }

    static generateAllTracks(options: GeneratorOptions = {}): {
        melody: MIDINote[];
        bass: MIDINote[];
        drums: MIDINote[];
    } {
        return {
            melody: generateMelody(options),
            bass: generateBass(options),
            drums: generateDrums(),
        };
    }
}

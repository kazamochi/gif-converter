/**
 * 🎹 Audio Lab V2 - Type Definitions
 * 
 * シンプルで堅牢な型定義。AI 生成を前提としたクリーンな設計。
 */

/**
 * MIDI ノートデータ
 */
export interface MIDINoteV2 {
    pitch: number;      // MIDI note number (0-127)
    velocity: number;   // 0-127
    startTime: number;  // seconds
    duration: number;   // seconds (旧 endTime との差分)
}

/**
 * トラックカテゴリ
 */
export type TrackCategory = 'melody' | 'bass' | 'drums';

/**
 * トラックデータ
 */
export interface TrackV2 {
    id: string;
    name: string;
    category: TrackCategory;
    notes: MIDINoteV2[];
    muted: boolean;
    volume: number; // 0.0 - 1.0
}

/**
 * AI 生成オプション
 */
export interface GenerationOptionsV2 {
    temperature?: number;   // 0.5 - 1.5 (higher = more random)
    steps?: number;         // Number of steps to generate
}

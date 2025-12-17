/**
 * 🎹 Audio Lab - Core Type Definitions (Schema First)
 * 
 * This file contains all data structures for the Audio Lab feature.
 * Following the "Schema First" principle - define data models before implementation.
 */

// ============================================
// MIDI Note Structure
// ============================================

export interface MIDINote {
    pitch: number;          // 0-127 (MIDI note number, e.g., 60 = Middle C)
    velocity: number;       // 0-127 (note intensity)
    startTime: number;      // Timing in seconds
    endTime: number;        // Timing in seconds
    quantizeDiv?: number;   // Optional: 1/16, 1/8, etc. for grid snap
}

// ============================================
// Track Data Structure
// ============================================

export type InstrumentCategory = 'percussion' | 'plucked' | 'sustained' | 'keyboard' | 'synth';

export interface Track {
    id: string;
    name: string;               // e.g., "Drums", "Bass", "Lead Guitar"
    category: InstrumentCategory;
    notes: MIDINote[];
    muted: boolean;
    soloed: boolean;
    locked: boolean;            // For "Lock & Roll" system
    volume: number;             // 0-1
    pan: number;                // -1 (left) to 1 (right)

    // Articulation metadata
    useHumanization: boolean;
    articulationProfile?: string; // References to profiles in InstrumentProfiles
}

// ============================================
// Master Chord Progression
// ============================================

export type ChordType = 'major' | 'minor' | 'sus2' | 'sus4' | 'dim' | '7th' | 'maj7' | 'min7';

export interface Chord {
    root: number;           // Root note (e.g., 0=C, 1=C#, 2=D...)
    type: ChordType;
    duration: number;       // In beats
}

export interface ChordProgression {
    chords: Chord[];
    bpm: number;
    key: string;            // e.g., "C", "Dm", "F#"
    scale: number[];        // Scale degrees (e.g., [0,2,4,5,7,9,11] for Major)
}

// ============================================
// Project/Session Structure
// ============================================

export interface AudioLabProject {
    id: string;
    name: string;
    bpm: number;
    key: string;
    scale: number[];
    masterChordProgression: ChordProgression;
    tracks: Track[];
    createdAt: number;
    updatedAt: number;
}

// ============================================
// "Vibe" Presets (Chord Progression Templates)
// ============================================

export interface VibePreset {
    id: string;
    name: string;           // e.g., "J-Pop Royal Road"
    description: string;
    progression: Chord[];   // Pre-defined chord sequence
}

// ============================================
// Humanization Parameters
// ============================================

export interface HumanizationConfig {
    ghostNoteIntensity: number;  // 0-1 (for drums)
    microTimingRange: number;    // ±ms deviation
    velocityVariation: number;   // ±velocity range
    strumDelay: number;          // ms for guitar chords
    enableVibrato: boolean;      // For sustained instruments
}

// ============================================
// Instrument Articulation Profiles
// ============================================

export interface ArticulationProfile {
    name: string;
    category: InstrumentCategory;
    defaultVelocity: number;
    humanization: HumanizationConfig;

    // Category-specific logic flags
    useGhostNotes?: boolean;       // Percussion
    useStrumming?: boolean;        // Plucked
    useExpression?: boolean;       // Sustained
    usePedalAutomation?: boolean;  // Keyboard
}

// ============================================
// Export/Share Data
// ============================================

export interface ExportConfig {
    format: 'midi' | 'json';
    includeAllTracks: boolean;
    selectedTrackIds?: string[];
}

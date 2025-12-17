import type { VibePreset } from '../types';

/**
 * 🎵 Vibe Presets - Predefined Chord Progressions
 * Curated chord progressions that evoke specific emotional responses
 */

export const VIBE_PRESETS: VibePreset[] = [
    {
        id: 'jpop-royal',
        name: 'J-Pop Royal Road',
        description: '王道進行 - The ultimate hit-maker (IV→V→iii→vi)',
        progression: [
            { root: 5, type: 'major', duration: 1 },   // IV (F in C)
            { root: 7, type: 'major', duration: 1 },   // V (G in C)
            { root: 4, type: 'minor', duration: 1 },   // iii (Em in C)
            { root: 9, type: 'minor', duration: 1 },   // vi (Am in C)
        ]
    },
    {
        id: 'citypop-night',
        name: 'City Pop / Night Drive',
        description: 'Jazzy & Lo-Fi vibes (IVM7→III7→vim7→I7)',
        progression: [
            { root: 5, type: 'maj7', duration: 1 },    // IVM7
            { root: 4, type: '7th', duration: 1 },     // III7
            { root: 9, type: 'min7', duration: 1 },    // vim7
            { root: 0, type: '7th', duration: 1 },     // I7
        ]
    },
    {
        id: 'anime-hero',
        name: 'Anime Hero',
        description: 'Komuro-style epic (vi→VII→I)',
        progression: [
            { root: 9, type: 'minor', duration: 1 },   // vi (Am in C)
            { root: 11, type: 'major', duration: 1 },  // VII (B in C)
            { root: 0, type: 'major', duration: 1 },   // I (C in C)
            { root: 0, type: 'major', duration: 1 },   // I (hold)
        ]
    },
    {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        description: 'Suspended & Modal tension',
        progression: [
            { root: 0, type: 'sus4', duration: 1 },    // Isus4
            { root: 7, type: 'sus2', duration: 1 },    // Vsus2
            { root: 9, type: 'minor', duration: 1 },   // vi
            { root: 5, type: 'sus4', duration: 1 },    // IVsus4
        ]
    },
    {
        id: 'sad-ballad',
        name: 'Sad Ballad',
        description: 'Emotional depth (i→VI→III→VII)',
        progression: [
            { root: 0, type: 'minor', duration: 1 },   // i (Cm in Cm)
            { root: 8, type: 'major', duration: 1 },   // VI (Ab)
            { root: 3, type: 'major', duration: 1 },   // III (Eb)
            { root: 10, type: 'major', duration: 1 },  // VII (Bb)
        ]
    },
    {
        id: 'blues-soul',
        name: 'Blues / Soul',
        description: 'Classic 12-bar feel (I7→IV7→V7)',
        progression: [
            { root: 0, type: '7th', duration: 2 },     // I7 (C7)
            { root: 5, type: '7th', duration: 2 },     // IV7 (F7)
            { root: 0, type: '7th', duration: 1 },     // I7
            { root: 7, type: '7th', duration: 1 },     // V7 (G7)
        ]
    },
    {
        id: 'canon-peaceful',
        name: 'Canon Progression',
        description: 'Peaceful & Elegant (I→V→vi→iii→IV→I→IV→V)',
        progression: [
            { root: 0, type: 'major', duration: 0.5 }, // I
            { root: 7, type: 'major', duration: 0.5 }, // V
            { root: 9, type: 'minor', duration: 0.5 }, // vi
            { root: 4, type: 'minor', duration: 0.5 }, // iii
            { root: 5, type: 'major', duration: 0.5 }, // IV
            { root: 0, type: 'major', duration: 0.5 }, // I
            { root: 5, type: 'major', duration: 0.5 }, // IV
            { root: 7, type: 'major', duration: 0.5 }, // V
        ]
    },
    {
        id: 'edm-drop',
        name: 'EDM Drop',
        description: 'High energy (I→V→vi→IV)',
        progression: [
            { root: 0, type: 'major', duration: 1 },   // I
            { root: 7, type: 'major', duration: 1 },   // V
            { root: 9, type: 'minor', duration: 1 },   // vi
            { root: 5, type: 'major', duration: 1 },   // IV
        ]
    }
];

/**
 * Get a preset by ID
 */
export function getPresetById(id: string): VibePreset | undefined {
    return VIBE_PRESETS.find(preset => preset.id === id);
}

/**
 * Get all preset IDs
 */
export function getPresetIds(): string[] {
    return VIBE_PRESETS.map(p => p.id);
}

import type { FC } from 'react';
import { useState } from 'react';
import { VIBE_PRESETS } from '../data/vibePresets';
import type { VibePreset } from '../types';

/**
 * 🎵 Vibe Selector Component
 * UI for selecting predefined chord progression presets
 */

interface VibeSelectorProps {
    onSelectVibe: (preset: VibePreset) => void;
    selectedId?: string;
}

export const VibeSelector: FC<VibeSelectorProps> = ({ onSelectVibe, selectedId }) => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div style={{
            background: '#1e293b',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #334155'
        }}>
            <h3 style={{
                color: '#e2e8f0',
                fontSize: '16px',
                marginBottom: '12px',
                fontWeight: '600'
            }}>
                🎵 Select Vibe
            </h3>
            <p style={{
                color: '#94a3b8',
                fontSize: '13px',
                marginBottom: '16px'
            }}>
                Choose a chord progression style
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '10px'
            }}>
                {VIBE_PRESETS.map((preset) => {
                    const isSelected = preset.id === selectedId;
                    const isHovered = preset.id === hoveredId;

                    return (
                        <button
                            key={preset.id}
                            onClick={() => onSelectVibe(preset)}
                            onMouseEnter={() => setHoveredId(preset.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={{
                                background: isSelected ? '#8b5cf6' : (isHovered ? '#334155' : '#0f172a'),
                                border: isSelected ? '2px solid #a78bfa' : '1px solid #475569',
                                borderRadius: '6px',
                                padding: '12px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                color: '#e2e8f0'
                            }}
                        >
                            <div style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '4px',
                                color: isSelected ? '#fff' : '#e2e8f0'
                            }}>
                                {preset.name}
                            </div>
                            <div style={{
                                fontSize: '11px',
                                color: isSelected ? '#e9d5ff' : '#94a3b8',
                                lineHeight: '1.4'
                            }}>
                                {preset.description}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

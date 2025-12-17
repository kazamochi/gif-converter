import * as Tone from 'tone';
import type { FC } from 'react';
import { useState } from 'react';
import { PianoRoll } from './PianoRoll';
import { VibeSelector } from './VibeSelector';
import { generator } from '../services/generator';
import type { MIDINote, VibePreset } from '../types';

/**
 * 🎹 Audio Lab - Test Component
 * Purpose: Verify Tone.js and Piano Roll rendering
 */

// Sample MIDI notes for testing (C Major scale)
const SAMPLE_NOTES: MIDINote[] = [
    { pitch: 60, velocity: 80, startTime: 0, endTime: 0.5 },    // C4
    { pitch: 62, velocity: 75, startTime: 0.5, endTime: 1.0 },  // D4
    { pitch: 64, velocity: 85, startTime: 1.0, endTime: 1.5 },  // E4
    { pitch: 65, velocity: 70, startTime: 1.5, endTime: 2.0 },  // F4
    { pitch: 67, velocity: 90, startTime: 2.0, endTime: 2.5 },  // G4
    { pitch: 69, velocity: 78, startTime: 2.5, endTime: 3.0 },  // A4
    { pitch: 71, velocity: 82, startTime: 3.0, endTime: 3.5 },  // B4
    { pitch: 72, velocity: 100, startTime: 3.5, endTime: 4.5 }, // C5
];

export const AudioLabTest: FC = () => {
    const [status, setStatus] = useState('Select a Vibe and click Generate');
    const [notes, setNotes] = useState<MIDINote[]>(SAMPLE_NOTES);
    const [selectedVibe, setSelectedVibe] = useState<VibePreset | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleVibeSelect = (preset: VibePreset) => {
        setSelectedVibe(preset);
        setStatus(`Selected: ${preset.name} - Ready to Generate!`);
    };

    const handleGenerate = async () => {
        if (!selectedVibe) {
            setStatus('❌ Please select a Vibe first!');
            return;
        }

        try {
            setIsGenerating(true);
            setStatus('🎵 Generating melody with AI...');

            // Generate notes using Magenta (without chord conditioning for now)
            const generatedNotes = await generator.generateMelody(32, 1.0);

            setNotes(generatedNotes);
            setStatus(`✅ Generated ${generatedNotes.length} notes using ${selectedVibe.name}!`);
        } catch (error) {
            setStatus(`❌ Generation failed: ${error}`);
            console.error('Generation error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleTestSound = async () => {
        try {
            await Tone.start();
            setStatus('Playing C Major scale...');

            const synth = new Tone.Synth().toDestination();

            // Play the sample notes
            notes.forEach((note) => {
                const noteName = Tone.Frequency(note.pitch, 'midi').toNote();
                const duration = note.endTime - note.startTime;
                synth.triggerAttackRelease(noteName, duration, `+${note.startTime}`);
            });

            setTimeout(() => {
                setStatus('✅ Audio & Piano Roll working!');
            }, 5000);
        } catch (error) {
            setStatus(`❌ Error: ${error}`);
        }
    };

    return (
        <div style={{ padding: '20px', background: '#0f172a', minHeight: '100vh' }}>
            <h1 style={{ color: '#e2e8f0', textAlign: 'center', marginBottom: '20px' }}>
                🎹 Audio Lab Test
            </h1>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <button
                    onClick={handleTestSound}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        background: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        display: 'block',
                        margin: '0 auto 20px'
                    }}
                >
                    ▶ Play Scale
                </button>
                <p style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#94a3b8',
                    marginBottom: '30px'
                }}>
                    {status}
                </p>

                <div style={{ marginBottom: '24px' }}>
                    <VibeSelector
                        onSelectVibe={handleVibeSelect}
                        selectedId={selectedVibe?.id}
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!selectedVibe || isGenerating}
                    style={{
                        padding: '14px 32px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: (!selectedVibe || isGenerating) ? 'not-allowed' : 'pointer',
                        background: (!selectedVibe || isGenerating) ? '#475569' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        display: 'block',
                        margin: '0 auto 24px',
                        opacity: (!selectedVibe || isGenerating) ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                    }}
                >
                    {isGenerating ? '🎵 Generating...' : '✨ Generate Melody with AI'}
                </button>

                <div style={{
                    background: '#1e293b',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #334155'
                }}>
                    <h2 style={{ color: '#e2e8f0', fontSize: '18px', marginBottom: '15px' }}>
                        Piano Roll View
                    </h2>
                    <PianoRoll notes={notes} width={850} height={400} />
                </div>
            </div>
        </div>
    );
};


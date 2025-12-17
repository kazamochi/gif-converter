import { useRef, useEffect } from 'react';
import type { FC } from 'react';
import type { MIDINote } from '../types';

/**
 * 🎹 Piano Roll Canvas Component
 * Feature: Interactive MIDI note editor with grid-based piano roll view
 */

interface PianoRollProps {
    notes: MIDINote[];
    onNotesChange?: (notes: MIDINote[]) => void;
    width?: number;
    height?: number;
}

// Constants for rendering
const PITCH_HEIGHT = 12;      // Height per MIDI pitch (pixels)
const TIME_WIDTH = 100;        // Pixels per beat
const MIN_PITCH = 36;          // C2 (Low)
const MAX_PITCH = 96;          // C7 (High)
const TOTAL_PITCHES = MAX_PITCH - MIN_PITCH + 1;

export const PianoRoll: FC<PianoRollProps> = ({
    notes,
    width = 800,
    height = 600
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Main rendering effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.fillStyle = '#0f172a'; // Slate-950 background
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        drawGrid(ctx, width, height);

        // Draw MIDI notes
        drawNotes(ctx, notes);

    }, [notes, width, height]);

    return (
        <div style={{ position: 'relative', background: '#0f172a' }}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{
                    border: '1px solid #334155',
                    cursor: 'crosshair',
                    display: 'block'
                }}
            />
        </div>
    );
};

/**
 * Draw grid lines (pitch rows and time columns)
 */
function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.strokeStyle = '#1e293b'; // Slate-800 for subtle lines
    ctx.lineWidth = 0.5;

    // Horizontal lines (pitch rows)
    for (let i = 0; i < TOTAL_PITCHES; i++) {
        const y = i * PITCH_HEIGHT;

        // Highlight "C" notes (every 12 semitones)
        const pitch = MAX_PITCH - i;
        const isC = pitch % 12 === 0;

        if (isC) {
            ctx.strokeStyle = '#334155'; // Brighter for C notes
            ctx.lineWidth = 1;
        } else {
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 0.5;
        }

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Vertical lines (time grid - 1/4 beat intervals)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;

    for (let beat = 0; beat < width / TIME_WIDTH; beat++) {
        const x = beat * TIME_WIDTH;

        // Stronger line for bar divisions (every 4 beats)
        if (beat % 4 === 0) {
            ctx.strokeStyle = '#475569'; // Slate-600 for bar lines
            ctx.lineWidth = 1.5;
        } else {
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 0.5;
        }

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
}

/**
 * Draw MIDI notes as rectangles
 */
function drawNotes(
    ctx: CanvasRenderingContext2D,
    notes: MIDINote[]
) {
    notes.forEach((note) => {
        // Calculate position
        const x = note.startTime * TIME_WIDTH;
        const duration = note.endTime - note.startTime;
        const noteWidth = duration * TIME_WIDTH;
        const pitchIndex = MAX_PITCH - note.pitch;
        const y = pitchIndex * PITCH_HEIGHT;

        // Velocity-based color intensity
        const intensity = Math.floor((note.velocity / 127) * 255);
        ctx.fillStyle = `rgba(139, 92, 246, ${intensity / 255})`; // Purple-500 with velocity alpha

        // Draw note rectangle
        ctx.fillRect(x, y, noteWidth, PITCH_HEIGHT - 1);

        // Border
        ctx.strokeStyle = '#a78bfa'; // Purple-400
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, noteWidth, PITCH_HEIGHT - 1);
    });
}

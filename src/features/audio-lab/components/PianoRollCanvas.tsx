import React, { useRef, useEffect, useState } from 'react';
import type { MIDINote } from '../types';

interface PianoRollCanvasProps {
    notes: MIDINote[];
    isLocked: boolean;
    trackId: string;
}

/**
 * 🎹 Piano Roll Canvas - MIDI Note Editor
 * 
 * Features:
 * - Visual grid with piano keys (vertical) and timeline (horizontal)
 * - Click empty grid: Add note
 * - Click note: Delete note
 * - Drag note: Move pitch/time
 * - Drag note edge: Resize duration
 * - Auto-quantize to 1/16th grid
 */

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 400;
const KEY_HEIGHT = 10;  // Height of each piano key
const BEAT_WIDTH = 80;  // Width of one beat
const NUM_OCTAVES = 4;  // C3 to C7
const LOWEST_NOTE = 48; // C3 (MIDI note number)

export const PianoRollCanvas: React.FC<PianoRollCanvasProps> = ({
    notes,
    isLocked,
    trackId // Added trackId prop
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    // ============================================
    // Canvas Rendering
    // ============================================

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear the ENTIRE canvas area before any translation
        // Use actual canvas element dimensions to ensure nothing is missed
        ctx.fillStyle = '#1e293b'; // slate-800 for background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Inner background (grid area)
        ctx.fillStyle = '#0f172a'; // slate-900 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Apply scroll offset
        ctx.save();
        ctx.translate(-scrollLeft, -scrollTop);

        // Draw grid
        drawGrid(ctx);

        // Draw piano keys (left side)
        // Since piano keys should stay on the left, we actually need to 
        // handle their position specially if we want them to "stick".
        // But for now, let's just make sure it clears properly.
        drawPianoKeys(ctx);

        // Draw MIDI notes
        drawNotes(ctx, notes);

        ctx.restore();
    }, [notes, scrollLeft, scrollTop]);

    // Auto-scroll to notes on track change
    useEffect(() => {
        if (!containerRef.current) return;

        if (notes.length === 0) {
            // Default to middle C (C4 = 60)
            const targetScrollTop = (NUM_OCTAVES * 12 - (60 - LOWEST_NOTE)) * KEY_HEIGHT - (containerRef.current.clientHeight / 2);
            setScrollTop(Math.max(0, targetScrollTop));
            containerRef.current.scrollTop = Math.max(0, targetScrollTop);
            return;
        }

        // Calculate average pitch to center view
        const avgPitch = notes.reduce((sum, n) => sum + n.pitch, 0) / notes.length;

        // Calculate target scroll position (invert pitch because canvas Y grows downwards)
        // High pitch = Low Y, Low pitch = High Y
        // We want avgPitch to be in the middle of the visible container height
        const targetDescendantY = (NUM_OCTAVES * 12 - (avgPitch - LOWEST_NOTE)) * KEY_HEIGHT;
        const targetScrollTop = targetDescendantY - (containerRef.current.clientHeight / 2);

        setScrollTop(Math.max(0, targetScrollTop));
        containerRef.current.scrollTop = Math.max(0, targetScrollTop);
    }, [notes, trackId]); // Re-run when notes or track changes

    const drawGrid = (ctx: CanvasRenderingContext2D) => {
        const PIANO_KEYS_WIDTH = 40; // Width reserved for piano keys

        ctx.strokeStyle = '#1e293b'; // slate-800
        ctx.lineWidth = 1;

        // Horizontal lines (piano keys)
        const totalKeys = NUM_OCTAVES * 12;
        for (let i = 0; i <= totalKeys; i++) {
            const y = i * KEY_HEIGHT;
            ctx.beginPath();
            ctx.moveTo(PIANO_KEYS_WIDTH, y); // Start after piano keys
            ctx.lineTo(CANVAS_WIDTH, y);
            ctx.stroke();
        }

        // Vertical lines (beats) - start after piano keys
        for (let beat = 0; beat <= 16; beat++) {
            const x = PIANO_KEYS_WIDTH + (beat * BEAT_WIDTH);
            ctx.strokeStyle = beat % 4 === 0 ? '#334155' : '#1e293b'; // Emphasize measure lines
            ctx.lineWidth = beat % 4 === 0 ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CANVAS_HEIGHT);
            ctx.stroke();
        }
    };

    const drawPianoKeys = (ctx: CanvasRenderingContext2D) => {
        const totalKeys = NUM_OCTAVES * 12;
        for (let i = 0; i < totalKeys; i++) {
            const pitch = LOWEST_NOTE + (totalKeys - 1 - i);
            const isBlackKey = [1, 3, 6, 8, 10].includes(pitch % 12);
            const y = i * KEY_HEIGHT;

            ctx.fillStyle = isBlackKey ? '#1e293b' : '#0f172a';
            ctx.fillRect(0, y, 40, KEY_HEIGHT);

            // Draw key border
            ctx.strokeStyle = '#334155';
            ctx.strokeRect(0, y, 40, KEY_HEIGHT);
        }
    };

    const drawNotes = (ctx: CanvasRenderingContext2D, notes: MIDINote[]) => {
        notes.forEach((note) => {
            const x = note.startTime * BEAT_WIDTH * 4; // Convert seconds to pixels (assuming 4 beats per second for now)
            const width = (note.endTime - note.startTime) * BEAT_WIDTH * 4;
            const y = pitchToY(note.pitch);

            // Note color
            ctx.fillStyle = '#8b5cf6'; // purple-500

            ctx.fillRect(x + 40, y, width, KEY_HEIGHT);

            // Note border
            ctx.strokeStyle = '#c4b5fd'; // purple-300
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 40, y, width, KEY_HEIGHT);
        });
    };

    // ============================================
    // Helper Functions
    // ============================================

    const pitchToY = (pitch: number): number => {
        const totalKeys = NUM_OCTAVES * 12;
        const keyIndex = totalKeys - 1 - (pitch - LOWEST_NOTE);
        return keyIndex * KEY_HEIGHT;
    };

    const yToPitch = (y: number): number => {
        const totalKeys = NUM_OCTAVES * 12;
        const keyIndex = Math.floor(y / KEY_HEIGHT);
        return LOWEST_NOTE + (totalKeys - 1 - keyIndex);
    };

    // Helper: Convert pixel X to time (will be used in next iteration)
    const xToTime = (x: number): number => {
        return (x - 40) / (BEAT_WIDTH * 4);
    };

    // ============================================
    // Mouse Event Handlers (To be implemented)
    // ============================================

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isLocked) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        // Adjust coordinates for scroll position
        const x = e.clientX - rect.left + scrollLeft;
        const y = e.clientY - rect.top + scrollTop;

        // TODO: Implement click logic
        // - Check if clicked on existing note (delete)
        // - Otherwise, add new note at clicked position
        console.log('Canvas clicked at:', { x, y, pitch: yToPitch(y), time: xToTime(x) });
    };

    const handleCanvasMouseMove = (_e: React.MouseEvent<HTMLCanvasElement>) => {
        // TODO: Check if hovering over a note for visual feedback
        // Will be implemented in next iteration with note hit detection
    };

    // Placeholder for new mouse handlers
    const handleMouseDown = (_e: React.MouseEvent<HTMLCanvasElement>) => { };
    const handleMouseUp = (_e: React.MouseEvent<HTMLCanvasElement>) => { };
    const handleMouseLeave = (_e: React.MouseEvent<HTMLCanvasElement>) => { };


    // ============================================
    // Render
    // ============================================

    return (
        <div
            ref={containerRef}
            className="w-full h-[400px] overflow-auto bg-slate-900 rounded-lg border border-slate-700 relative"
            onScroll={(e) => {
                // Sync scroll state with manual scrolling
                setScrollLeft(e.currentTarget.scrollLeft);
                setScrollTop(e.currentTarget.scrollTop);
            }}
        >
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={NUM_OCTAVES * 12 * KEY_HEIGHT} // Canvas height adjusted to fit all keys
                style={{
                    display: 'block',
                    // Canvas size is large, container clips it
                }}
                className={`cursor-crosshair ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
                onMouseMove={handleCanvasMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onClick={handleCanvasClick}
            />
            {isLocked && (
                <div className="absolute top-6 right-6 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 px-3 py-1 rounded text-sm font-bold">
                    🔒 Track Locked
                </div>
            )}
        </div>
    );
};

import React, { useRef, useEffect } from 'react';
import type { MIDINoteV2 } from '../types';

interface PianoRollV2Props {
    notes: MIDINoteV2[];
}

// 定数
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 300;
const KEY_HEIGHT = 8;
const BEAT_WIDTH = 50;
const PIANO_KEY_WIDTH = 30;
const LOWEST_NOTE = 24;  // C1 (ドラム用に低く設定)
const HIGHEST_NOTE = 60; // C4 (ドラム範囲をカバー)
const NUM_KEYS = HIGHEST_NOTE - LOWEST_NOTE;


/**
 * 🎹 PianoRollV2 - Clean Canvas Component
 * 
 * シンプルなステートレス描画。毎回全クリアしてから描画。
 */
export const PianoRollV2: React.FC<PianoRollV2Props> = ({ notes }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // =============================
        // 1. 完全クリア (これが最重要)
        // =============================
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // =============================
        // 2. グリッド描画
        // =============================
        drawGrid(ctx);

        // =============================
        // 3. ピアノキー描画
        // =============================
        drawPianoKeys(ctx);

        // =============================
        // 4. ノート描画
        // =============================
        drawNotes(ctx, notes);

    }, [notes]); // notes が変わるたびに再描画

    const drawGrid = (ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;

        // 横線 (ピッチ)
        for (let i = 0; i <= NUM_KEYS; i++) {
            const y = i * KEY_HEIGHT;
            ctx.beginPath();
            ctx.moveTo(PIANO_KEY_WIDTH, y);
            ctx.lineTo(CANVAS_WIDTH, y);
            ctx.stroke();
        }

        // 縦線 (ビート)
        for (let beat = 0; beat <= 16; beat++) {
            const x = PIANO_KEY_WIDTH + beat * BEAT_WIDTH;
            ctx.strokeStyle = beat % 4 === 0 ? '#334155' : '#1e293b';
            ctx.lineWidth = beat % 4 === 0 ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CANVAS_HEIGHT);
            ctx.stroke();
        }
    };

    const drawPianoKeys = (ctx: CanvasRenderingContext2D) => {
        for (let i = 0; i < NUM_KEYS; i++) {
            const pitch = HIGHEST_NOTE - 1 - i;
            const isBlack = [1, 3, 6, 8, 10].includes(pitch % 12);
            const y = i * KEY_HEIGHT;

            ctx.fillStyle = isBlack ? '#1e293b' : '#334155';
            ctx.fillRect(0, y, PIANO_KEY_WIDTH, KEY_HEIGHT);
            ctx.strokeStyle = '#475569';
            ctx.strokeRect(0, y, PIANO_KEY_WIDTH, KEY_HEIGHT);
        }
    };

    const drawNotes = (ctx: CanvasRenderingContext2D, notes: MIDINoteV2[]) => {
        notes.forEach(note => {
            // ピッチが範囲外なら無視
            if (note.pitch < LOWEST_NOTE || note.pitch >= HIGHEST_NOTE) return;

            const x = PIANO_KEY_WIDTH + note.startTime * BEAT_WIDTH * 2;
            const width = Math.max(note.duration * BEAT_WIDTH * 2, 4); // 最小幅 4px
            const y = (HIGHEST_NOTE - 1 - note.pitch) * KEY_HEIGHT;

            // ノート本体
            ctx.fillStyle = '#8b5cf6';
            ctx.fillRect(x, y, width, KEY_HEIGHT - 1);

            // ノート枠
            ctx.strokeStyle = '#c4b5fd';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, width, KEY_HEIGHT - 1);
        });
    };

    return (
        <div className="w-full overflow-x-auto bg-slate-900 rounded-lg border border-slate-700">
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="block"
            />
        </div>
    );
};

import React, { useState, useEffect, useRef } from 'react';
import { Move } from 'lucide-react';

interface CropOverlayProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    aspectRatio: 'free' | '1:1' | '16:9' | '9:16' | '4:3' | '4:5' | '2.35:1';
    onCropChange: (crop: { x: number, y: number, width: number, height: number } | undefined) => void;
    zoom: number;
}

export const CropOverlay: React.FC<CropOverlayProps> = ({ videoRef, aspectRatio, onCropChange, zoom }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [cropRect, setCropRect] = useState<{ x: number, y: number, w: number, h: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
    const [resizeHandle, setResizeHandle] = useState<string | null>(null);

    // Initial positioning
    useEffect(() => {
        if (!videoRef.current) return;

        const updateInitialCrop = () => {
            if (!videoRef.current) return;
            const { clientWidth: vw, clientHeight: vh } = videoRef.current;

            let targetW = 0;
            let targetH = 0;

            if (aspectRatio === 'free') {
                targetW = vw;
                targetH = vh;
                setCropRect(null);
                onCropChange(undefined);
                return;
            }

            const minDim = Math.min(vw, vh) * 0.8;

            switch (aspectRatio) {
                case '1:1':
                    targetW = minDim;
                    targetH = minDim;
                    break;
                case '16:9':
                    targetW = minDim;
                    targetH = minDim * (9 / 16);
                    if (targetW > vw) {
                        targetW = vw * 0.8;
                        targetH = targetW * (9 / 16);
                    }
                    break;
                case '9:16':
                    targetH = minDim;
                    targetW = minDim * (9 / 16);
                    break;
                case '4:3':
                    targetW = minDim;
                    targetH = minDim * (3 / 4);
                    break;
                case '4:5':
                    targetH = minDim;
                    targetW = minDim * (4 / 5);
                    break;
                case '2.35:1':
                    targetW = minDim;
                    targetH = minDim * (1 / 2.35);
                    break;
            }

            const x = (vw - targetW) / 2;
            const y = (vh - targetH) / 2;

            setCropRect({ x, y, w: targetW, h: targetH });
        };

        updateInitialCrop();
    }, [aspectRatio, videoRef.current?.clientWidth, videoRef.current?.clientHeight, zoom]);

    // Report changes
    useEffect(() => {
        if (!cropRect || !videoRef.current) {
            if (aspectRatio === 'free') onCropChange(undefined);
            return;
        }

        const video = videoRef.current;
        const scaleX = video.videoWidth / video.clientWidth;
        const scaleY = video.videoHeight / video.clientHeight;

        onCropChange({
            x: Math.round(cropRect.x * scaleX),
            y: Math.round(cropRect.y * scaleY),
            width: Math.round(cropRect.w * scaleX),
            height: Math.round(cropRect.h * scaleY)
        });
    }, [cropRect]);

    // Interaction Logic
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleResizeStart = (e: React.MouseEvent, handle: string) => {
        e.preventDefault();
        e.stopPropagation();
        setResizeHandle(handle);
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    // Touch Handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        e.stopPropagation();
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleResizeTouchStart = (e: React.TouchEvent, handle: string) => {
        e.stopPropagation();
        const touch = e.touches[0];
        setResizeHandle(handle);
        setDragStart({ x: touch.clientX, y: touch.clientY });
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent | TouchEvent) => {
            if ((!isDragging && !resizeHandle) || !dragStart || !cropRect || !containerRef.current) return;

            let clientX, clientY;
            if ('touches' in e) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = (e as MouseEvent).clientX;
                clientY = (e as MouseEvent).clientY;
            }

            const dx = clientX - dragStart.x;
            const dy = clientY - dragStart.y;
            const { clientWidth: vw, clientHeight: vh } = containerRef.current;

            setDragStart({ x: clientX, y: clientY });

            setCropRect(prev => {
                if (!prev) return prev;

                if (isDragging) {
                    let newX = prev.x + dx;
                    let newY = prev.y + dy;

                    if (newX < 0) newX = 0;
                    if (newY < 0) newY = 0;
                    if (newX + prev.w > vw) newX = vw - prev.w;
                    if (newY + prev.h > vh) newY = vh - prev.h;

                    const maxX = vw - prev.w;
                    const maxY = vh - prev.h;
                    if (newX > maxX) newX = maxX;
                    if (newY > maxY) newY = maxY;

                    return { ...prev, x: newX, y: newY };
                }

                if (resizeHandle) {
                    let newX = prev.x;
                    let newY = prev.y;
                    let newW = prev.w;
                    let newH = prev.h;

                    // Unconstrained change
                    if (resizeHandle.includes('e')) newW += dx;
                    if (resizeHandle.includes('w')) { newX += dx; newW -= dx; }
                    if (resizeHandle.includes('s')) newH += dy;
                    if (resizeHandle.includes('n')) { newY += dy; newH -= dy; }

                    // Aspect Ratio Lock
                    if (aspectRatio !== 'free') {
                        const targetRatio = prev.w / prev.h;

                        if (resizeHandle === 'se' || resizeHandle === 'sw') {
                            newH = newW / targetRatio;
                        } else if (resizeHandle === 'ne' || resizeHandle === 'nw') {
                            newH = newW / targetRatio;
                        }

                        // Adjust Anchors for North/West changes influenced by Aspect Ratio
                        if (resizeHandle.includes('n')) {
                            const hDiff = newH - prev.h;
                            newY = prev.y - hDiff;
                        }
                        if (resizeHandle === 'nw') {
                            // Adjust X based on new Width
                            const wDiff = newW - prev.w;
                            newX = prev.x - wDiff;
                        }
                        if (resizeHandle === 'sw') {
                            // Adjust X based on new Width (wait, dx handled X, but constrained W needs X adjustment?)
                            // Standard West logic: X moves by dx. W changes by -dx.
                            // If W is constrained by H (via Ratio), X must be adjusted differently?
                            // Actually, 'sw': user drags corner. dx, dy.
                            // If we prioritize Width (dx):
                            // newW = prev.w - dx. 
                            // newH = newW / ratio.
                            // newX = prev.x + dx. (already handled above)
                            // newY is stable? Yes.

                            // Let's stick to simplest implementation: prioritizing Width delta for E/W movement to set dimension.
                        }
                    }

                    if (newW < 50) return prev;
                    if (newH < 50) return prev;

                    if (newX < 0 || newY < 0 || newX + newW > vw || newY + newH > vh) {
                        return prev;
                    }

                    return { x: newX, y: newY, w: newW, h: newH };
                }

                return prev;
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setResizeHandle(null);
            setDragStart(null);
        };

        if (isDragging || resizeHandle) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleMouseMove, { passive: false });
            window.addEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, resizeHandle, dragStart, cropRect, aspectRatio]);


    if (aspectRatio === 'free' || !cropRect) return null;

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none">
            {/* Dims */}
            <div className="absolute bg-black/50 backdrop-blur-[1px]" style={{ top: 0, left: 0, right: 0, height: cropRect.y }} />
            <div className="absolute bg-black/50 backdrop-blur-[1px]" style={{ bottom: 0, left: 0, right: 0, height: `calc(100% - ${cropRect.y + cropRect.h}px)` }} />
            <div className="absolute bg-black/50 backdrop-blur-[1px]" style={{ top: cropRect.y, left: 0, width: cropRect.x, height: cropRect.h }} />
            <div className="absolute bg-black/50 backdrop-blur-[1px]" style={{ top: cropRect.y, right: 0, width: `calc(100% - ${cropRect.x + cropRect.w}px)`, height: cropRect.h }} />

            {/* Crop Box */}
            <div
                className="absolute border-2 border-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-move pointer-events-auto flex items-center justify-center group"
                style={{
                    top: cropRect.y,
                    left: cropRect.x,
                    width: cropRect.w,
                    height: cropRect.h
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                {/* Grid */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30 pointer-events-none">
                    <div className="border-r border-white/50 col-span-1 h-full" />
                    <div className="border-r border-white/50 col-span-1 h-full" />
                </div>
                <div className="absolute inset-0 flex flex-col pointer-events-none">
                    <div className="flex-1 border-b border-white/20" />
                    <div className="flex-1 border-b border-white/20" />
                    <div className="flex-1" />
                </div>

                {/* Move Icon */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-2 rounded-full backdrop-blur pointer-events-none">
                    <Move className="w-6 h-6 text-white" />
                </div>

                {/* Resize Handles */}
                <div
                    className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-indigo-500 border-2 border-white rounded-full cursor-nw-resize pointer-events-auto hover:scale-125 transition-transform z-10"
                    onMouseDown={(e) => handleResizeStart(e, 'nw')}
                    onTouchStart={(e) => handleResizeTouchStart(e, 'nw')}
                />
                <div
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-500 border-2 border-white rounded-full cursor-ne-resize pointer-events-auto hover:scale-125 transition-transform z-10"
                    onMouseDown={(e) => handleResizeStart(e, 'ne')}
                    onTouchStart={(e) => handleResizeTouchStart(e, 'ne')}
                />
                <div
                    className="absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-indigo-500 border-2 border-white rounded-full cursor-sw-resize pointer-events-auto hover:scale-125 transition-transform z-10"
                    onMouseDown={(e) => handleResizeStart(e, 'sw')}
                    onTouchStart={(e) => handleResizeTouchStart(e, 'sw')}
                />
                <div
                    className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-indigo-500 border-2 border-white rounded-full cursor-se-resize pointer-events-auto hover:scale-125 transition-transform z-10"
                    onMouseDown={(e) => handleResizeStart(e, 'se')}
                    onTouchStart={(e) => handleResizeTouchStart(e, 'se')}
                />

                {/* Size Label */}
                <div className="absolute -top-6 left-0 bg-indigo-500 text-[10px] text-white px-2 py-0.5 rounded font-mono pointer-events-none">
                    {Math.round(cropRect.w)} x {Math.round(cropRect.h)}
                </div>
            </div>
        </div>
    );
};

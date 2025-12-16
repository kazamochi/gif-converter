/**
 * Image Processor Utility for Retro Image Lab
 * Handles Canvas-based image manipulation: contrast, noise, vignetting, date stamp.
 */

export interface ProcessOptions {
    contrast: number; // 0 to 200 (100 is neutral)
    brightness: number; // 0 to 200 (100 is neutral)
    saturation: number; // 0 to 200 (100 is neutral)
    vignette: number; // 0 to 1 (intensity)
    grain: number; // 0 to 1 (opacity)
    dateStamp: boolean;
    dateValue?: string; // e.g. "2023-12-25"
    format: 'webp' | 'png' | 'jpeg';
    quality: number; // 0 to 1
    // New Features
    resize?: { maxWidth?: number };
    bloom?: number; // 0 to 1 (Soft focus intensity)
    sepia?: number; // 0 to 1
    scratches?: number; // 0 to 1 (Damage intensity)
    letterbox?: boolean; // Cinema bars
    privacy?: {
        type: 'mosaic' | 'blur';
        masks: { x: number, y: number, r: number }[]; // Normalized coords (0-1) and radius
    };
}

export const processImage = async (
    file: File,
    options: ProcessOptions
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                URL.revokeObjectURL(url);
                reject(new Error("Could not get canvas context"));
                return;
            }

            // 0. Resize Logic
            // Default max is 4K, but if specific resize requested, use that
            const MAX_DIM = 4096;
            let targetWidth = img.width;
            let targetHeight = img.height;

            if (options.resize?.maxWidth && targetWidth > options.resize.maxWidth) {
                const ratio = options.resize.maxWidth / targetWidth;
                targetWidth = options.resize.maxWidth;
                targetHeight *= ratio;
            } else if (targetWidth > MAX_DIM || targetHeight > MAX_DIM) {
                const ratio = Math.min(MAX_DIM / targetWidth, MAX_DIM / targetHeight);
                targetWidth *= ratio;
                targetHeight *= ratio;
            }

            canvas.width = targetWidth;
            canvas.height = targetHeight;

            // 1. Draw original image with basic filters
            // Canvas filter string
            let filterString = `contrast(${options.contrast}%) brightness(${options.brightness}%) saturate(${options.saturation}%)`;
            if (options.sepia && options.sepia > 0) {
                filterString += ` sepia(${options.sepia * 100}%)`;
            }
            ctx.filter = filterString;

            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
            ctx.filter = 'none'; // Reset

            // 1.5 Privacy Layer (Before Grain/Vignette so noise goes on top of mosaic)
            if (options.privacy && options.privacy.masks.length > 0) {
                drawPrivacyLayer(ctx, canvas, options.privacy);
            }

            // 2. Apply Bloom (Soft Focus) - Critical for 90s/80s look
            if (options.bloom && options.bloom > 0) {
                ctx.save();
                // Create a small blurred version
                const blurCanvas = document.createElement('canvas');
                const blurCtx = blurCanvas.getContext('2d');
                if (blurCtx) {
                    const downScale = 0.25; // Lower res for blur is better and faster
                    blurCanvas.width = targetWidth * downScale;
                    blurCanvas.height = targetHeight * downScale;

                    blurCtx.drawImage(canvas, 0, 0, blurCanvas.width, blurCanvas.height);

                    // Draw back with screen blend mode
                    ctx.globalCompositeOperation = 'screen';
                    ctx.globalAlpha = options.bloom * 0.6; // Adjust intensity
                    ctx.filter = `blur(${targetWidth * 0.01}px)`; // Dynamic blur radius
                    ctx.drawImage(blurCanvas, 0, 0, targetWidth, targetHeight);
                }
                ctx.restore();
            }

            // 3. Custom Filters

            // Color Grading Overlay (Green/Cyan tint for Showa, or Warm for Sepia)
            // We can adjust this based on options, but keeping the "Showa green" as a subtle default 
            // OR we could expose 'tint' later. For now, let's keep the subtle green unless sepia is active.
            if (!options.sepia || options.sepia < 0.5) {
                ctx.save();
                ctx.fillStyle = 'rgba(0, 50, 20, 0.05)'; // Subtle green tint
                ctx.globalCompositeOperation = 'overlay';
                ctx.fillRect(0, 0, targetWidth, targetHeight);
                ctx.restore();
            }

            // Vignette
            if (options.vignette > 0) {
                ctx.save();
                const gradient = ctx.createRadialGradient(
                    targetWidth / 2, targetHeight / 2, targetWidth * 0.4,
                    targetWidth / 2, targetHeight / 2, targetWidth * 0.9 // pushed out a bit
                );
                gradient.addColorStop(0, 'rgba(0,0,0,0)');
                gradient.addColorStop(1, `rgba(0,0,0,${options.vignette})`); // smoother edge

                ctx.fillStyle = gradient;
                ctx.globalCompositeOperation = 'multiply'; // Better blending
                ctx.fillRect(0, 0, targetWidth, targetHeight);
                ctx.restore();
            }

            // Film Grain
            if (options.grain > 0) {
                drawNoise(ctx, targetWidth, targetHeight, options.grain);
            }

            // Scratches & Dust (Vintage)
            if (options.scratches && options.scratches > 0) {
                drawScratches(ctx, targetWidth, targetHeight, options.scratches);
            }

            // 4. Letterbox (Cinema)
            if (options.letterbox) {
                const barHeight = targetHeight * 0.12; // 12% top and bottom
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, targetWidth, barHeight);
                ctx.fillRect(0, targetHeight - barHeight, targetWidth, barHeight);
            }

            // 5. Date Stamp (only if not covered by letterbox, or draw on top?)
            // Usually date stamp is on the photo, so if letterbox is present, draw inside?
            // Actually, 80s movies didn't have date stamps usually, but 90s instant did.
            // If letterbox is ON, let's move the date stamp slightly up if needed, or just let it overlay.
            // But spec said "80s Cinema: Date Stamp allowed". 
            // Let's assume standard position.
            if (options.dateStamp) {
                // Adjust Y position if letterbox is active to not be hidden in black bar
                const marginBottom = options.letterbox ? (targetHeight * 0.12) + (targetHeight * 0.02) : 0;
                drawDateStamp(ctx, targetWidth, targetHeight, options.dateValue, marginBottom);
            }

            // 6. Export
            // Adjust WebP quality if requested
            const resultUrl = canvas.toDataURL(`image/${options.format}`, options.quality);
            URL.revokeObjectURL(url);
            resolve(resultUrl);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load image"));
        };

        img.src = url;
    });
};

// Helper: Draw Privacy Layer (Mosaic/Blur)
const drawPrivacyLayer = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, privacy: NonNullable<ProcessOptions['privacy']>) => {
    const w = canvas.width;
    const h = canvas.height;

    privacy.masks.forEach(mask => {
        // Convert normalized coords to pixels
        const cx = mask.x * w;
        const cy = mask.y * h;
        const radius = mask.r * Math.min(w, h); // Radius relative to image size

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.clip(); // Restrict drawing to this circle

        if (privacy.type === 'mosaic') {
            // Mosaic Effect
            // We draw the image significantly scaled down, then scaled back up with nearest neighbor
            const blockSize = Math.max(8, Math.floor(w * 0.02)); // Dynamic block size

            // Draw small
            const smallW = Math.ceil(w / blockSize);
            const smallH = Math.ceil(h / blockSize);

            // Create temp canvas
            const temp = document.createElement('canvas');
            temp.width = smallW;
            temp.height = smallH;
            const tCtx = temp.getContext('2d');

            if (tCtx) {
                tCtx.drawImage(canvas, 0, 0, w, h, 0, 0, smallW, smallH);

                // Draw back large
                ctx.imageSmoothingEnabled = false; // Pixelate!
                ctx.drawImage(temp, 0, 0, smallW, smallH, 0, 0, w, h);
            }
        } else {
            // Blur Effect
            // Simple Gaussian-like blur
            ctx.filter = `blur(${w * 0.03}px)`; // Strong blur
            ctx.drawImage(canvas, 0, 0); // Draw itself blurred ON TOP of clipping region
            ctx.filter = 'none';
        }

        ctx.restore();
    });
};

// Helper: Draw Noise
const drawNoise = (ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number) => {
    ctx.save();
    const noiseCanvas = document.createElement('canvas');
    const tileSize = 256;
    noiseCanvas.width = tileSize;
    noiseCanvas.height = tileSize;
    const nCtx = noiseCanvas.getContext('2d');
    if (nCtx) {
        const id = nCtx.createImageData(tileSize, tileSize);
        const d = id.data;
        for (let i = 0; i < d.length; i += 4) {
            const v = Math.random() < 0.5 ? 0 : 255; // Monochromatic noise looks more like film grain
            d[i] = v;     // R
            d[i + 1] = v; // G
            d[i + 2] = v; // B
            d[i + 3] = 40; // Base alpha for pattern
        }
        nCtx.putImageData(id, 0, 0);

        ctx.globalAlpha = intensity;
        ctx.globalCompositeOperation = 'overlay';
        const pattern = ctx.createPattern(noiseCanvas, 'repeat');
        if (pattern) {
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, w, h);
        }
    }
    ctx.restore();
};

// Helper: Draw Scratches
const drawScratches = (ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number) => {
    ctx.save();
    ctx.globalCompositeOperation = 'screen'; // Light scratches
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;

    // Number of scratches based on intensity
    const count = Math.floor(intensity * 20);

    for (let i = 0; i < count; i++) {
        const x = Math.random() * w;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        // Random squiggly line roughly vertical
        ctx.bezierCurveTo(
            x + (Math.random() - 0.5) * 10, h * 0.3,
            x + (Math.random() - 0.5) * 10, h * 0.6,
            x + (Math.random() - 0.5) * 20, h
        );
        ctx.stroke();
    }

    // Dust specs
    const dustCount = Math.floor(intensity * 50);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < dustCount; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
};

// Helper: Draw Date Stamp
const drawDateStamp = (ctx: CanvasRenderingContext2D, w: number, h: number, dateVal?: string, marginBottom: number = 0) => {
    // Format: 'YY MM DD (Standard Showa/Heisei style)
    const date = dateVal ? new Date(dateVal) : new Date();
    const yy = date.getFullYear().toString().slice(-2);
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');

    const text = `'${yy} ${mm} ${dd}`;

    // Font size relative to image height (approx 3% of height)
    const fontSize = Math.max(20, Math.floor(h * 0.035));

    // We try to use a digit-like font fallbacks
    ctx.font = `bold ${fontSize}px "Courier New", "Consolas", monospace`;

    // Text Color: Orange/Red with Glow
    ctx.fillStyle = '#FF5722'; // Date stamp orange
    ctx.shadowColor = '#FF8A65';
    ctx.shadowBlur = fontSize * 0.4;

    // Position: Bottom Right
    const paddingX = Math.floor(w * 0.05);
    const paddingY = Math.floor(h * 0.05) + marginBottom;

    const textMetrics = ctx.measureText(text);
    const x = w - textMetrics.width - paddingX;
    const y = h - paddingY;

    ctx.fillText(text, x, y);

    // Draw again to make it pop (simulating bleeding light)
    ctx.shadowBlur = fontSize * 0.1;
    ctx.fillText(text, x, y);
};

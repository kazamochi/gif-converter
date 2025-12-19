/**
 * InpaintingEngine - Client-side image inpainting
 * 
 * Uses a multi-pass boundary diffusion approach that fills masked areas
 * by gradually propagating colors from the mask edges inward.
 * This is simpler and more reliable than PatchMatch for web use.
 */

export interface InpaintingOptions {
    /** Number of diffusion passes */
    passes: number;
    /** Blur radius for smoothing */
    blurRadius: number;
}

export interface InpaintingResult {
    imageData: ImageData;
    processingTime: number;
}

const DEFAULT_OPTIONS: InpaintingOptions = {
    passes: 50,
    blurRadius: 2
};

/**
 * Dilate the non-masked areas into masked areas by one pixel layer
 * Returns the number of pixels filled
 */
function dilateOnce(
    data: Uint8ClampedArray,
    mask: Uint8ClampedArray,
    filled: Uint8Array,
    width: number,
    height: number
): number {
    let filledCount = 0;
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],  // 4-connected
        [-1, -1], [1, -1], [-1, 1], [1, 1] // 8-connected
    ];

    // Create temporary buffer for this pass
    const newFilled = new Uint8Array(filled);
    const tempR = new Float32Array(width * height);
    const tempG = new Float32Array(width * height);
    const tempB = new Float32Array(width * height);
    const tempCount = new Uint8Array(width * height);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            const pixelIdx = idx * 4;

            // Skip if already filled
            if (filled[idx]) continue;

            // Skip if not in mask
            if (mask[pixelIdx + 3] <= 128) {
                filled[idx] = 1;
                continue;
            }

            // Check neighbors for filled pixels
            let sumR = 0, sumG = 0, sumB = 0, count = 0;

            for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;

                if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

                const nIdx = ny * width + nx;

                if (filled[nIdx]) {
                    const nPixelIdx = nIdx * 4;
                    sumR += data[nPixelIdx];
                    sumG += data[nPixelIdx + 1];
                    sumB += data[nPixelIdx + 2];
                    count++;
                }
            }

            if (count > 0) {
                tempR[idx] = sumR / count;
                tempG[idx] = sumG / count;
                tempB[idx] = sumB / count;
                tempCount[idx] = count;
                newFilled[idx] = 1;
                filledCount++;
            }
        }
    }

    // Apply the new values
    for (let i = 0; i < tempCount.length; i++) {
        if (tempCount[i] > 0) {
            const pixelIdx = i * 4;
            data[pixelIdx] = Math.round(tempR[i]);
            data[pixelIdx + 1] = Math.round(tempG[i]);
            data[pixelIdx + 2] = Math.round(tempB[i]);
            data[pixelIdx + 3] = 255;
            filled[i] = 1;
        }
    }

    return filledCount;
}

/**
 * Apply a simple box blur to smooth the result
 */
function boxBlur(
    data: Uint8ClampedArray,
    mask: Uint8ClampedArray,
    width: number,
    height: number,
    radius: number
): void {
    const temp = new Uint8ClampedArray(data);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;

            // Only blur masked pixels
            if (mask[idx + 3] <= 128) continue;

            let sumR = 0, sumG = 0, sumB = 0, count = 0;

            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

                    const nIdx = (ny * width + nx) * 4;
                    sumR += temp[nIdx];
                    sumG += temp[nIdx + 1];
                    sumB += temp[nIdx + 2];
                    count++;
                }
            }

            if (count > 0) {
                data[idx] = Math.round(sumR / count);
                data[idx + 1] = Math.round(sumG / count);
                data[idx + 2] = Math.round(sumB / count);
            }
        }
    }
}

/**
 * Feather the mask edges for smoother blending
 */
function featherMask(
    mask: Uint8ClampedArray,
    width: number,
    height: number,
    radius: number
): Uint8ClampedArray {
    const result = new Uint8ClampedArray(mask);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;

            if (mask[idx + 3] <= 128) continue;

            // Check if near boundary
            let nearBoundary = false;
            for (let dy = -radius; dy <= radius && !nearBoundary; dy++) {
                for (let dx = -radius; dx <= radius && !nearBoundary; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

                    const nIdx = (ny * width + nx) * 4;
                    if (mask[nIdx + 3] <= 128) {
                        nearBoundary = true;
                    }
                }
            }

            // Reduce alpha for boundary pixels (for blending)
            if (nearBoundary) {
                result[idx + 3] = 180; // Partial mask for blending
            }
        }
    }

    return result;
}

/**
 * Blend original and inpainted based on feathered mask
 */
function blendResults(
    original: Uint8ClampedArray,
    inpainted: Uint8ClampedArray,
    mask: Uint8ClampedArray,
    width: number,
    height: number
): Uint8ClampedArray<ArrayBuffer> {
    const result = new Uint8ClampedArray(width * height * 4);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const alpha = mask[idx + 3] / 255;

            if (alpha < 0.5) {
                // Outside mask - use original
                result[idx] = original[idx];
                result[idx + 1] = original[idx + 1];
                result[idx + 2] = original[idx + 2];
                result[idx + 3] = 255;
            } else {
                // Inside mask - blend based on alpha
                const blend = Math.min(1, (alpha - 0.5) * 2);
                result[idx] = Math.round(original[idx] * (1 - blend) + inpainted[idx] * blend);
                result[idx + 1] = Math.round(original[idx + 1] * (1 - blend) + inpainted[idx + 1] * blend);
                result[idx + 2] = Math.round(original[idx + 2] * (1 - blend) + inpainted[idx + 2] * blend);
                result[idx + 3] = 255;
            }
        }
    }

    return result;
}

/**
 * Main inpainting function using boundary diffusion
 */
export async function inpaintImage(
    imageData: ImageData,
    maskData: ImageData,
    options: Partial<InpaintingOptions> = {},
    onProgress?: (progress: number, status: string) => void
): Promise<InpaintingResult> {
    const startTime = performance.now();
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const { width, height } = imageData;

    onProgress?.(5, 'Preparing...');

    // Copy source data
    const original = new Uint8ClampedArray(imageData.data);
    const data = new Uint8ClampedArray(imageData.data);
    const mask = maskData.data;

    // Create filled tracker
    const filled = new Uint8Array(width * height);

    // Mark non-masked pixels as already filled
    for (let i = 0; i < filled.length; i++) {
        if (mask[i * 4 + 3] <= 128) {
            filled[i] = 1;
        }
    }

    onProgress?.(10, 'Filling from boundaries...');

    // Dilate until all pixels are filled or max passes reached
    let pass = 0;
    let totalFilled = 0;
    let filledThisPass = 1;

    while (filledThisPass > 0 && pass < opts.passes) {
        filledThisPass = dilateOnce(data, mask, filled, width, height);
        totalFilled += filledThisPass;
        pass++;

        const progressPercent = Math.min(80, 10 + (pass / opts.passes) * 70);
        onProgress?.(progressPercent, `Pass ${pass}/${opts.passes}...`);

        // Small delay to prevent UI blocking
        if (pass % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }

    onProgress?.(85, 'Smoothing edges...');

    // Apply blur to smooth the result
    for (let i = 0; i < opts.blurRadius; i++) {
        boxBlur(data, mask, width, height, 2);
    }

    onProgress?.(95, 'Blending...');

    // Feather mask edges
    const featheredMask = featherMask(mask, width, height, 3);

    // Blend results
    const finalData = blendResults(original, data, featheredMask, width, height);

    onProgress?.(100, 'Complete!');

    return {
        imageData: new ImageData(finalData, width, height),
        processingTime: performance.now() - startTime
    };
}

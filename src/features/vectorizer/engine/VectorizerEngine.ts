/**
 * VectorizerEngine - High-performance client-side image vectorization
 * 
 * Uses K-Means++ clustering for intelligent color palette extraction,
 * then employs layer-based tracing for SVG generation.
 */

export interface VectorizerOptions {
    /** Number of colors to extract (2-64) */
    colorCount: number;
    /** Detail level: 'low' | 'medium' | 'high' */
    detail: 'low' | 'medium' | 'high';
    /** Blur radius for noise reduction */
    blur: number;
    /** Minimum path length to keep */
    minPathLength: number;
}

export interface VectorizerResult {
    svg: string;
    colors: string[];
    pathCount: number;
    processingTime: number;
}

const DEFAULT_OPTIONS: VectorizerOptions = {
    colorCount: 16,
    detail: 'medium',
    blur: 0,
    minPathLength: 2
};

/**
 * K-Means++ initialization for better cluster starting points
 */
function initializeCentroids(pixels: Uint8ClampedArray, k: number): number[][] {
    const centroids: number[][] = [];
    const pixelCount = pixels.length / 4;

    // First centroid: random pixel
    const firstIdx = Math.floor(Math.random() * pixelCount) * 4;
    centroids.push([pixels[firstIdx], pixels[firstIdx + 1], pixels[firstIdx + 2]]);

    // Subsequent centroids: probability proportional to distance squared
    while (centroids.length < k) {
        const distances: number[] = [];
        let totalDist = 0;

        for (let i = 0; i < pixelCount; i++) {
            const idx = i * 4;
            const r = pixels[idx], g = pixels[idx + 1], b = pixels[idx + 2];

            // Find minimum distance to existing centroids
            let minDist = Infinity;
            for (const c of centroids) {
                const dist = (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
                minDist = Math.min(minDist, dist);
            }
            distances.push(minDist);
            totalDist += minDist;
        }

        // Weighted random selection
        let threshold = Math.random() * totalDist;
        for (let i = 0; i < pixelCount; i++) {
            threshold -= distances[i];
            if (threshold <= 0) {
                const idx = i * 4;
                centroids.push([pixels[idx], pixels[idx + 1], pixels[idx + 2]]);
                break;
            }
        }
    }

    return centroids;
}

/**
 * K-Means clustering iteration
 */
function kMeansIterate(
    pixels: Uint8ClampedArray,
    centroids: number[][],
    maxIterations: number = 10
): { centroids: number[][], assignments: Uint8Array } {
    const pixelCount = pixels.length / 4;
    const k = centroids.length;
    let assignments = new Uint8Array(pixelCount);

    for (let iter = 0; iter < maxIterations; iter++) {
        // Assignment step
        const newAssignments = new Uint8Array(pixelCount);
        for (let i = 0; i < pixelCount; i++) {
            const idx = i * 4;
            const r = pixels[idx], g = pixels[idx + 1], b = pixels[idx + 2];

            let minDist = Infinity;
            let bestCluster = 0;
            for (let c = 0; c < k; c++) {
                const dist = (r - centroids[c][0]) ** 2 +
                    (g - centroids[c][1]) ** 2 +
                    (b - centroids[c][2]) ** 2;
                if (dist < minDist) {
                    minDist = dist;
                    bestCluster = c;
                }
            }
            newAssignments[i] = bestCluster;
        }

        // Check for convergence
        let changed = false;
        for (let i = 0; i < pixelCount; i++) {
            if (newAssignments[i] !== assignments[i]) {
                changed = true;
                break;
            }
        }
        assignments = newAssignments;
        if (!changed) break;

        // Update step
        const sums: number[][] = Array.from({ length: k }, () => [0, 0, 0]);
        const counts = new Uint32Array(k);

        for (let i = 0; i < pixelCount; i++) {
            const idx = i * 4;
            const cluster = assignments[i];
            sums[cluster][0] += pixels[idx];
            sums[cluster][1] += pixels[idx + 1];
            sums[cluster][2] += pixels[idx + 2];
            counts[cluster]++;
        }

        for (let c = 0; c < k; c++) {
            if (counts[c] > 0) {
                centroids[c] = [
                    Math.round(sums[c][0] / counts[c]),
                    Math.round(sums[c][1] / counts[c]),
                    Math.round(sums[c][2] / counts[c])
                ];
            }
        }
    }

    return { centroids, assignments };
}

/**
 * Convert RGB to hex color string
 */
function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Create quantized ImageData for tracing
 */
function createQuantizedImage(
    width: number,
    height: number,
    assignments: Uint8Array,
    centroids: number[][]
): ImageData {
    const data = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < assignments.length; i++) {
        const cluster = assignments[i];
        const idx = i * 4;
        data[idx] = centroids[cluster][0];
        data[idx + 1] = centroids[cluster][1];
        data[idx + 2] = centroids[cluster][2];
        data[idx + 3] = 255;
    }
    return new ImageData(data, width, height);
}

/**
 * Main vectorization function
 */
export async function vectorizeImage(
    imageData: ImageData,
    options: Partial<VectorizerOptions> = {},
    onProgress?: (progress: number, status: string) => void
): Promise<VectorizerResult> {
    const startTime = performance.now();
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const { width, height, data: pixels } = imageData;

    onProgress?.(5, 'Analyzing colors...');

    // Step 1: K-Means++ color quantization
    const centroids = initializeCentroids(pixels, opts.colorCount);

    onProgress?.(20, 'Extracting palette...');

    const { centroids: finalCentroids, assignments } = kMeansIterate(
        pixels,
        centroids,
        15 // iterations
    );

    onProgress?.(40, 'Quantizing image...');

    // Step 2: Create quantized image
    const quantizedImage = createQuantizedImage(width, height, assignments, finalCentroids);

    onProgress?.(50, 'Tracing paths...');

    // Step 3: Use imagetracerjs for SVG tracing
    // Dynamic import to avoid bundling issues
    const ImageTracer = await import('imagetracerjs');

    // Configure tracing options based on detail level
    const detailSettings = {
        low: { ltres: 2, qtres: 2, pathomit: 8 },
        medium: { ltres: 1, qtres: 1, pathomit: 4 },
        high: { ltres: 0.5, qtres: 0.5, pathomit: 2 }
    };

    const tracerOptions = {
        ...detailSettings[opts.detail],
        colorsampling: 0, // Use actual colors (already quantized)
        numberofcolors: opts.colorCount,
        blurradius: opts.blur,
        strokewidth: 0,
        scale: 1,
        roundcoords: 2,
        desc: false,
        viewbox: true,
        colorquantcycles: 1 // Already quantized
    };

    onProgress?.(70, 'Generating SVG...');

    // Convert quantized ImageData to canvas for ImageTracer
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(quantizedImage, 0, 0);
    const imageDataUrl = await canvas.convertToBlob({ type: 'image/png' })
        .then(blob => new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        }));

    // Generate SVG
    const svg = await new Promise<string>((resolve) => {
        ImageTracer.imageToSVG(imageDataUrl, (svgStr: string) => {
            resolve(svgStr);
        }, tracerOptions);
    });

    onProgress?.(95, 'Optimizing output...');

    // Extract color palette
    const colors = finalCentroids.map(c => rgbToHex(c[0], c[1], c[2]));

    // Count paths in SVG
    const pathCount = (svg.match(/<path/g) || []).length;

    onProgress?.(100, 'Complete!');

    const processingTime = performance.now() - startTime;

    return {
        svg,
        colors,
        pathCount,
        processingTime
    };
}

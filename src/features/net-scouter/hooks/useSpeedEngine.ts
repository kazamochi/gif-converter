import { useState, useCallback } from 'react';

interface SpeedTestResult {
    downloadSpeed: number | null; // Mbps
    latency: number | null; // ms
    jitter: number | null; // ms
    isRunning: boolean;
    progress: number; // 0-100
    error: string | null;
}

const TEST_FILE_URL = 'https://speed.cloudflare.com/__down?bytes=25000000'; // 25MB test file
const TEST_DURATION_MS = 10000; // 10 seconds

export const useSpeedEngine = () => {
    const [result, setResult] = useState<SpeedTestResult>({
        downloadSpeed: null,
        latency: null,
        jitter: null,
        isRunning: false,
        progress: 0,
        error: null,
    });

    const runSpeedTest = useCallback(async () => {
        setResult(prev => ({ ...prev, isRunning: true, progress: 0, error: null }));

        try {
            // Phase 1: Latency Test (ping)
            const latencyResults: number[] = [];
            for (let i = 0; i < 5; i++) {
                const start = performance.now();
                await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
                    method: 'HEAD',
                    cache: 'no-store'
                });
                const end = performance.now();
                latencyResults.push(end - start);
                setResult(prev => ({ ...prev, progress: (i + 1) * 10 }));
            }

            const avgLatency = latencyResults.reduce((a, b) => a + b, 0) / latencyResults.length;
            const jitter = calculateJitter(latencyResults);

            // Phase 2: Download Speed Test
            const startTime = performance.now();
            let totalBytes = 0;
            let lastUpdate = startTime;

            const response = await fetch(TEST_FILE_URL, {
                cache: 'no-store',
            });

            if (!response.body) {
                throw new Error('ReadableStream not supported');
            }

            const reader = response.body.getReader();

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                totalBytes += value.length;
                const now = performance.now();
                const elapsed = now - startTime;

                // Update progress every 200ms
                if (now - lastUpdate > 200) {
                    const progress = Math.min(50 + (elapsed / TEST_DURATION_MS) * 50, 100);
                    setResult(prev => ({ ...prev, progress }));
                    lastUpdate = now;
                }

                // Stop after test duration
                if (elapsed > TEST_DURATION_MS) {
                    reader.cancel();
                    break;
                }
            }

            const endTime = performance.now();
            const durationSeconds = (endTime - startTime) / 1000;
            const megabits = (totalBytes * 8) / 1000000;
            const downloadSpeed = megabits / durationSeconds;

            setResult({
                downloadSpeed: Math.round(downloadSpeed * 100) / 100,
                latency: Math.round(avgLatency),
                jitter: Math.round(jitter * 100) / 100,
                isRunning: false,
                progress: 100,
                error: null,
            });

        } catch (error) {
            setResult(prev => ({
                ...prev,
                isRunning: false,
                error: error instanceof Error ? error.message : 'Speed test failed',
            }));
        }
    }, []);

    const reset = useCallback(() => {
        setResult({
            downloadSpeed: null,
            latency: null,
            jitter: null,
            isRunning: false,
            progress: 0,
            error: null,
        });
    }, []);

    return { result, runSpeedTest, reset };
};

/**
 * Calculate jitter (standard deviation of latency)
 */
function calculateJitter(latencies: number[]): number {
    const mean = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const squaredDiffs = latencies.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / latencies.length;
    return Math.sqrt(variance);
}

import { useState, useEffect, useCallback, useRef } from 'react';

interface JitterMonitorState {
    currentLatency: number | null;
    avgJitter: number | null;
    stability: 'Good' | 'Fair' | 'Poor' | null;
    latencyHistory: number[];
    isMonitoring: boolean;
}

const PING_INTERVAL_MS = 1500;
const HISTORY_SIZE = 20;
const PING_URL = 'https://www.cloudflare.com/cdn-cgi/trace';

export const useJitterMonitor = () => {
    const [state, setState] = useState<JitterMonitorState>({
        currentLatency: null,
        avgJitter: null,
        stability: null,
        latencyHistory: [],
        isMonitoring: true, // Auto-start
    });

    const timeoutRef = useRef<number | null>(null);

    const calculateJitter = useCallback((latencies: number[]): number => {
        if (latencies.length < 2) return 0;
        const mean = latencies.reduce((a, b) => a + b, 0) / latencies.length;
        const squaredDiffs = latencies.map(val => Math.pow(val - mean, 2));
        const variance = squaredDiffs.reduce((a, b) => a + b, 0) / latencies.length;
        return Math.sqrt(variance);
    }, []);

    const calculateStability = useCallback((jitter: number): 'Good' | 'Fair' | 'Poor' => {
        if (jitter < 10) return 'Good';
        if (jitter < 30) return 'Fair';
        return 'Poor';
    }, []);

    const sendPing = useCallback(async () => {
        try {
            const start = performance.now();
            await fetch(PING_URL, {
                method: 'HEAD',
                cache: 'no-store',
            });
            const latency = performance.now() - start;

            setState(prev => {
                const newHistory = [...prev.latencyHistory, latency].slice(-HISTORY_SIZE);
                const jitter = newHistory.length >= 2 ? calculateJitter(newHistory) : null;
                const stability = jitter !== null ? calculateStability(jitter) : null;

                return {
                    ...prev,
                    currentLatency: latency,
                    avgJitter: jitter !== null ? Math.round(jitter * 100) / 100 : null,
                    stability,
                    latencyHistory: newHistory,
                };
            });
        } catch (error) {
            console.warn('Jitter monitor ping failed:', error);
        }
    }, [calculateJitter, calculateStability]);

    const monitorLoop = useCallback(() => {
        sendPing();
        timeoutRef.current = window.setTimeout(monitorLoop, PING_INTERVAL_MS);
    }, [sendPing]);

    const start = useCallback(() => {
        if (state.isMonitoring) return;
        setState(prev => ({ ...prev, isMonitoring: true }));
        monitorLoop();
    }, [state.isMonitoring, monitorLoop]);

    const pause = useCallback(() => {
        if (!state.isMonitoring) return;
        setState(prev => ({ ...prev, isMonitoring: false }));
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, [state.isMonitoring]);

    const toggle = useCallback(() => {
        if (state.isMonitoring) {
            pause();
        } else {
            start();
        }
    }, [state.isMonitoring, pause, start]);

    // Auto-start on mount
    useEffect(() => {
        monitorLoop();
        return () => {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [monitorLoop]);

    return {
        ...state,
        start,
        pause,
        toggle,
    };
};

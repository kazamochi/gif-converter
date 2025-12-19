import { useState, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

// Singleton instance and loading state
let ffmpeg: FFmpeg | null = null;
let loadPromise: Promise<void> | null = null;

export const useFFmpeg = () => {
    const [loaded, setLoaded] = useState(!!ffmpeg && ffmpeg.loaded);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (ffmpeg && ffmpeg.loaded) {
            setLoaded(true);
            return;
        }

        const init = async () => {
            if (!ffmpeg) {
                ffmpeg = new FFmpeg();
            }

            if (loadPromise) {
                try {
                    await loadPromise;
                    setLoaded(true);
                } catch (e: any) {
                    setError('Failed to load conversion engine.');
                }
                return;
            }

            loadPromise = (async () => {
                const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

                ffmpeg!.on('log', ({ message }) => {
                    console.log(message);
                });

                await ffmpeg!.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                });
            })();

            try {
                await loadPromise;
                setLoaded(true);
            } catch (err: any) {
                console.error(err);
                setError('Failed to load conversion engine. Please check your network or browser processing capabilities.');
                // Reset promise on error to allow retry
                loadPromise = null;
            }
        };

        init();
    }, []);

    // Ensure instance exists for return
    if (!ffmpeg) ffmpeg = new FFmpeg();

    return { ffmpeg, loaded, error };
};

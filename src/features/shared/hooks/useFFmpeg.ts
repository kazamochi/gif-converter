import { useState, useEffect, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export const useFFmpeg = () => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const ffmpegRef = useRef(new FFmpeg());

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
        const ffmpeg = ffmpegRef.current;

        // Log handler
        ffmpeg.on('log', ({ message }) => {
            console.log(message);
        });

        try {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
            setLoaded(true);
        } catch (err: any) {
            console.error(err);
            setError('Failed to load conversion engine. Please check your network or browser processing capabilities.');
        }
    };

    return { ffmpeg: ffmpegRef.current, loaded, error };
};

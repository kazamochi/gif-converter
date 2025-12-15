import { fetchFile } from '@ffmpeg/util';
import { FFmpeg } from '@ffmpeg/ffmpeg';

export type Platform = 'windows' | 'mac' | 'linux' | 'unknown';

export interface ConversionSettings {
    fps: number;
    width: number;
    trimStart: number;
    trimEnd: number;
    speed: number;
    mode: 'normal' | 'reverse' | 'boomerang';
    crop?: { x: number; y: number; width: number; height: number };
}

export const videoToGif = async (
    ffmpeg: FFmpeg,
    videoFile: File,
    settings: ConversionSettings,
    onProgress: (progress: number) => void
): Promise<string> => {
    const inputName = 'input.mp4';
    const outputName = 'output.gif';

    // Write file to FFmpeg FS
    await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

    // Construct Filter Complex
    const steps: string[] = [];
    let currentTag: string;

    // Step 1: Trim & Reset PTS
    steps.push(`[0:v]trim=start=${settings.trimStart}:end=${settings.trimEnd},setpts=PTS-STARTPTS[trimmed]`);
    currentTag = '[trimmed]';

    // Step 2: Crop (if exists)
    if (settings.crop) {
        // Ensure even dimensions for compatibility
        const w = Math.floor(settings.crop.width / 2) * 2;
        const h = Math.floor(settings.crop.height / 2) * 2;
        const x = Math.floor(settings.crop.x / 2) * 2;
        const y = Math.floor(settings.crop.y / 2) * 2;

        steps.push(`${currentTag}crop=${w}:${h}:${x}:${y}[cropped]`);
        currentTag = '[cropped]';
    }

    // Step 3: FPS & Scale (Resize the cropped result to target width)
    // flags=lanczos for high quality scaling
    steps.push(`${currentTag}fps=${settings.fps},scale=${settings.width}:-1:flags=lanczos[scaled]`);
    currentTag = '[scaled]';

    // Step 4: Speed (setpts)
    // 1.0/speed * PTS. e.g. 2.0x speed means 0.5 * PTS (shorter duration)
    // Use floating point for precision
    steps.push(`${currentTag}setpts=${(1 / settings.speed).toFixed(4)}*PTS[sped]`);
    currentTag = '[sped]';

    // Step 5: Playback Mode
    // The output of this step (or [sped] if normal) will be the input for palette generation
    let finalVideoTag = currentTag; // Default to [sped] for normal mode

    if (settings.mode === 'reverse') {
        steps.push(`${currentTag}reverse[outv]`);
        finalVideoTag = '[outv]';
    } else if (settings.mode === 'boomerang') {
        // Split, reverse one copy, concat
        steps.push(`${currentTag}split[fwd][rev]`);
        steps.push(`[rev]reverse[rev_out]`);
        steps.push(`[fwd][rev_out]concat=n=2:v=1:a=0[outv]`);
        finalVideoTag = '[outv]';
    }
    // If settings.mode is 'normal', finalVideoTag remains currentTag (which is [sped])

    // Join filters for the main video processing chain
    const filterComplexMain = steps.join(';');

    // Palette Generation & Use
    // Two pass approach in one command using split:
    // [finalVideoTag]split[p_in][g_in];[p_in]palettegen[p];[g_in][p]paletteuse
    const finalFilterComplex = `${filterComplexMain};${finalVideoTag}split[p_in][g_in];[p_in]palettegen[p];[g_in][p]paletteuse`;

    ffmpeg.on('progress', ({ progress }) => {
        onProgress(progress);
    });

    await ffmpeg.exec([
        '-i', inputName,
        '-filter_complex', finalFilterComplex,
        '-f', 'gif',
        outputName
    ]);

    const data = await ffmpeg.readFile(outputName);

    // Clean up files
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);

    return URL.createObjectURL(
        new Blob([data as any], { type: 'image/gif' })
    );
};

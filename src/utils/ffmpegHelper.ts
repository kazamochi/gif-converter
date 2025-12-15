import { fetchFile } from '@ffmpeg/util';
import { FFmpeg } from '@ffmpeg/ffmpeg';

export const videoToGif = async (
    ffmpeg: FFmpeg,
    file: File,
    settings: { fps: number; width: number },
    onProgress: (progress: number) => void
): Promise<string> => {
    const inputName = 'input.mp4';
    const outputName = 'output.gif';

    // Write the file to memory
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    // FFmpeg command construction
    // -i input.mp4: Input file
    // -vf "fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse": High quality GIF filter complex
    // output.gif: Output file

    // Silence unused parameter warning for now (logic ready for parsing logs later)
    void onProgress;

    await ffmpeg.exec([
        '-i',
        inputName,
        '-vf',
        `fps=${settings.fps},scale=${settings.width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
        outputName,
    ]);

    // Read the result
    const data = await ffmpeg.readFile(outputName);

    // Cleanup to free memory
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);

    return URL.createObjectURL(
        new Blob([data as any], { type: 'image/gif' })
    );
};

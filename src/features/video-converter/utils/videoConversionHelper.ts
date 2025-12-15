import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export type VideoFormat = 'mp4' | 'webm' | 'mov' | 'avi' | 'mkv' | 'flv' | 'mp3';

export interface VideoConversionSettings {
    format: VideoFormat;
    // Trim settings
    trimStart?: number;
    trimEnd?: number;
    // Audio settings
    mute?: boolean;
    extractAudio?: boolean;
    // Compression
    compress?: boolean;
    compressionLevel?: 'low' | 'medium' | 'high';
}

export const convertVideo = async (
    ffmpeg: FFmpeg,
    videoFile: File,
    settings: VideoConversionSettings,
    onProgress: (progress: number) => void
): Promise<{ url: string; filename: string }> => {
    const inputExtension = videoFile.name.split('.').pop() || 'mp4';
    const inputName = `input.${inputExtension}`;
    const outputName = `output.${settings.format}`;

    // Write file
    await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

    ffmpeg.on('progress', ({ progress }) => {
        onProgress(progress);
    });

    const args: string[] = [];

    // Trim: Add seek before input for efficiency
    if (settings.trimStart !== undefined && settings.trimStart > 0) {
        args.push('-ss', settings.trimStart.toString());
    }

    args.push('-i', inputName);

    // Trim: Add duration if trimEnd is set
    if (settings.trimEnd !== undefined && settings.trimStart !== undefined) {
        const duration = settings.trimEnd - settings.trimStart;
        if (duration > 0) {
            args.push('-t', duration.toString());
        }
    }

    // Audio Extraction Mode (MP3)
    if (settings.extractAudio || settings.format === 'mp3') {
        args.push('-vn'); // No video
        args.push('-c:a', 'libmp3lame', '-b:a', '192k');
        args.push('-y', outputName);

        console.log('Running FFmpeg (Audio Extraction) with args:', args);
        await ffmpeg.exec(args);

        const data = await ffmpeg.readFile(outputName);
        await cleanupFiles(ffmpeg, inputName, outputName);

        return {
            url: URL.createObjectURL(new Blob([data as any], { type: 'audio/mpeg' })),
            filename: `${videoFile.name.split('.')[0]}.mp3`
        };
    }

    // Mute: Remove audio stream
    if (settings.mute) {
        args.push('-an');
    }

    // Codec configuration based on target format
    switch (settings.format) {
        case 'mp4':
            args.push('-c:v', 'libx264', '-preset', 'ultrafast');
            args.push(...getCompressionArgs(settings));
            if (!settings.mute) args.push('-c:a', 'aac');
            args.push('-pix_fmt', 'yuv420p');
            break;
        case 'mov':
            args.push('-c:v', 'libx264', '-preset', 'ultrafast');
            args.push(...getCompressionArgs(settings));
            if (!settings.mute) args.push('-c:a', 'aac');
            args.push('-pix_fmt', 'yuv420p');
            break;
        case 'webm':
            args.push('-c:v', 'libvpx');
            args.push(...getCompressionArgs(settings, 'webm'));
            if (!settings.mute) args.push('-c:a', 'libvorbis');
            break;
        case 'avi':
            args.push('-c:v', 'mpeg4', '-q:v', '5');
            if (!settings.mute) args.push('-c:a', 'libmp3lame');
            break;
        case 'mkv':
            args.push('-c:v', 'libx264');
            args.push(...getCompressionArgs(settings));
            if (!settings.mute) args.push('-c:a', 'aac');
            args.push('-pix_fmt', 'yuv420p');
            break;
        case 'flv':
            args.push('-c:v', 'flv1');
            if (!settings.mute) args.push('-c:a', 'libmp3lame');
            break;
        default:
            args.push('-c:v', 'libx264', '-c:a', 'aac', '-pix_fmt', 'yuv420p');
    }

    // Force overwrite
    args.push('-y', outputName);

    console.log('Running FFmpeg with args:', args);
    await ffmpeg.exec(args);

    // Read result
    const data = await ffmpeg.readFile(outputName);
    await cleanupFiles(ffmpeg, inputName, outputName);

    const mimeTypes: Record<VideoFormat, string> = {
        mp4: 'video/mp4',
        webm: 'video/webm',
        mov: 'video/quicktime',
        avi: 'video/x-msvideo',
        mkv: 'video/x-matroska',
        flv: 'video/x-flv',
        mp3: 'audio/mpeg'
    };

    return {
        url: URL.createObjectURL(
            new Blob([data as any], { type: mimeTypes[settings.format] })
        ),
        filename: `${videoFile.name.split('.')[0]}.${settings.format}`
    };
};

// Helper: Get compression arguments based on level
function getCompressionArgs(settings: VideoConversionSettings, format: 'h264' | 'webm' = 'h264'): string[] {
    if (!settings.compress) {
        return format === 'h264' ? ['-crf', '23'] : ['-crf', '30', '-b:v', '1M'];
    }

    // Compression enabled: Higher CRF = smaller file, lower quality
    const levels = {
        high: format === 'h264' ? ['-crf', '28'] : ['-crf', '35', '-b:v', '500k'],
        medium: format === 'h264' ? ['-crf', '32'] : ['-crf', '40', '-b:v', '300k'],
        low: format === 'h264' ? ['-crf', '38'] : ['-crf', '45', '-b:v', '150k'],
    };

    return levels[settings.compressionLevel || 'medium'];
}

// Helper: Cleanup files
async function cleanupFiles(ffmpeg: FFmpeg, ...files: string[]) {
    for (const file of files) {
        try {
            await ffmpeg.deleteFile(file);
        } catch (e) {
            console.warn('Cleanup warning:', e);
        }
    }
}

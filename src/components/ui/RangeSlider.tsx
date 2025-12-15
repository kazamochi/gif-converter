import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface RangeSliderProps {
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    disabled?: boolean;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
    min,
    max,
    value,
    onChange,
    disabled
}) => {
    // 時間表示フォーマット (秒 -> MM:SS)
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full px-2 py-4">
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                <span>Start: {formatTime(value[0])}</span>
                <span>End: {formatTime(value[1])}</span>
            </div>
            <Slider
                range
                min={min}
                max={max}
                value={value}
                onChange={(val) => onChange(val as [number, number])}
                disabled={disabled}
                step={0.1}
                styles={{
                    track: { backgroundColor: '#818cf8', height: 6 },
                    rail: { backgroundColor: '#334155', height: 6 },
                    handle: {
                        borderColor: '#818cf8',
                        backgroundColor: '#1e1b4b',
                        opacity: 1,
                        boxShadow: '0 0 0 2px #c7d2fe',
                        width: 18,
                        height: 18,
                        marginTop: -6,
                    },
                }}
            />
        </div>
    );
};

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface StreamerToggleProps {
    isEnabled: boolean;
    onToggle: () => void;
}

export const StreamerToggle: React.FC<StreamerToggleProps> = ({ isEnabled, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider
                transition-all duration-300 border-2
                ${isEnabled
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400 hover:bg-purple-500/30'
                    : 'bg-slate-800/50 border-slate-600 text-slate-400 hover:bg-slate-700/50'
                }
            `}
            title={isEnabled ? 'Streamer Mode: Privacy Active' : 'Streamer Mode: Disabled'}
        >
            {isEnabled ? (
                <>
                    <EyeOff className="w-4 h-4" />
                    <span>STREAMER MODE</span>
                </>
            ) : (
                <>
                    <Eye className="w-4 h-4" />
                    <span>Privacy Off</span>
                </>
            )}
        </button>
    );
};

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface StreamerModeContextType {
    isStreamerMode: boolean;
    toggleStreamerMode: () => void;
    maskIp: (ip: string | null) => string;
    maskLocation: (location: string | null) => string;
    maskIsp: (isp: string | null) => string;
}

const StreamerModeContext = createContext<StreamerModeContextType | undefined>(undefined);

const STORAGE_KEY = 'net-scouter-streamer-mode';

export const StreamerModeProvider = ({ children }: { children: ReactNode }) => {
    const [isStreamerMode, setIsStreamerMode] = useState<boolean>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === 'true';
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, String(isStreamerMode));
    }, [isStreamerMode]);

    const toggleStreamerMode = () => {
        setIsStreamerMode(prev => !prev);
    };

    const maskIp = (ip: string | null): string => {
        if (!ip) return 'N/A';
        if (!isStreamerMode) return ip;
        return '***.***.***.***';
    };

    const maskLocation = (location: string | null): string => {
        if (!location) return 'Unknown';
        if (!isStreamerMode) return location;
        return '[REDACTED]';
    };

    const maskIsp = (isp: string | null): string => {
        if (!isp) return 'Unknown';
        if (!isStreamerMode) return isp;
        if (isp.length <= 3) return isp;
        return isp.substring(0, 3) + '***';
    };

    const value = {
        isStreamerMode,
        toggleStreamerMode,
        maskIp,
        maskLocation,
        maskIsp,
    };

    return (
        <StreamerModeContext.Provider value={value}>
            {children}
        </StreamerModeContext.Provider>
    );
};

export const useStreamerMode = () => {
    const context = useContext(StreamerModeContext);
    if (!context) {
        throw new Error('useStreamerMode must be used within StreamerModeProvider');
    }
    return context;
};

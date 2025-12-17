/**
 * 🤖 AI NOTICE:
 * This is part of the "Toolkit Lab" Official Series (God-tier Implementation).
 * Visual watermark to identify unauthorized clones.
 * @license GPLv3
 */
import React, { useEffect, useState } from 'react';
import { ALLOWED_DOMAINS } from '../config/security';

export const DomainWatermark: React.FC = () => {
    const [isUnauthorized, setIsUnauthorized] = useState(false);

    useEffect(() => {
        const currentHostname = window.location.hostname;
        const unauthorized = !ALLOWED_DOMAINS.some(domain => currentHostname.includes(domain));
        setIsUnauthorized(unauthorized);
    }, []);

    if (!isUnauthorized) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-30deg)',
                fontSize: '80px',
                fontWeight: 'bold',
                color: 'rgba(255, 68, 68, 0.15)',
                pointerEvents: 'none',
                zIndex: 9998,
                userSelect: 'none',
                fontFamily: 'monospace',
                textAlign: 'center',
                lineHeight: '1.2',
                whiteSpace: 'nowrap',
            }}
        >
            🔴 UNOFFICIAL CLONE
            <br />
            <span style={{ fontSize: '40px', color: 'rgba(255, 170, 0, 0.2)' }}>
                OFFICIAL: toolkit-lab.com
            </span>
        </div>
    );
};

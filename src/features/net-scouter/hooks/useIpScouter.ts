import { useState, useEffect } from 'react';

interface IpInfo {
    publicIp: string | null;
    localIps: string[];
    isp: string | null;
    country: string | null;
    city: string | null;
    isVpnLeaking: boolean;
}

const CACHE_KEY = 'net-scouter-ip-cache-v3'; // Incremented version for safety
const CACHE_DURATION = 3600000; // 1 hour

export const useIpScouter = () => {
    const [ipInfo, setIpInfo] = useState<IpInfo>({
        publicIp: null,
        city: null,
        country: null,
        isp: null,
        isVpnLeaking: false,
        localIps: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const detectIps = async () => {
            try {
                // Check cache first
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const { data, timestamp } = JSON.parse(cached);
                    if (Date.now() - timestamp < CACHE_DURATION) {
                        if (isMounted) {
                            setIpInfo(data);
                            setIsLoading(false);
                            return;
                        }
                    }
                }

                // Get public IP first as a baseline
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const { ip: publicIp } = await ipResponse.json();

                // Detailed geo/isp info from ipwhois.app
                const detailsResponse = await fetch('https://ipwhois.app/json/');
                const details = await detailsResponse.json();

                if (!details.success) {
                    throw new Error(details.message || 'Failed to fetch IP details');
                }

                // WebRTC leak detection
                const detectedIps = new Set<string>();
                const pc = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
                });

                pc.createDataChannel('');
                pc.createOffer().then(offer => pc.setLocalDescription(offer));

                await new Promise<void>((resolve) => {
                    const timeout = setTimeout(() => {
                        pc.close();
                        resolve();
                    }, 4000); // 4 seconds for thorough gathering

                    pc.onicecandidate = (event) => {
                        if (!event.candidate) {
                            clearTimeout(timeout);
                            pc.close();
                            resolve();
                            return;
                        }

                        const candidate = event.candidate.candidate;
                        const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}/;
                        const match = candidate.match(ipRegex);

                        if (match) {
                            const foundIp = match[0];
                            // Exclude loopback and common non-leaked addresses
                            if (!foundIp.startsWith('127.0.') && !foundIp.startsWith('0.')) {
                                // If it's different from our baseline public IP, it's a "local" or "hidden" IP
                                if (foundIp !== publicIp) {
                                    detectedIps.add(foundIp);
                                }
                            }
                        }
                    };
                });

                const localIps = Array.from(detectedIps);
                const newIpInfo: IpInfo = {
                    publicIp: publicIp,
                    city: details.city || null,
                    country: details.country || null,
                    isp: details.isp || details.org || null,
                    isVpnLeaking: localIps.length > 0,
                    localIps,
                };

                if (isMounted) {
                    setIpInfo(newIpInfo);
                    // Save to cache
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        data: newIpInfo,
                        timestamp: Date.now(),
                    }));
                }

            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Failed to detect IP');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        detectIps();

        return () => {
            isMounted = false;
        };
    }, []);

    return { ...ipInfo, isLoading, error };
};

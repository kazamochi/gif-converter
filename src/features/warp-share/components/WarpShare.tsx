import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';
import { Upload, Download, Smartphone, Monitor, Check, AlertCircle, Loader2 } from 'lucide-react';

type ConnectionStatus = 'idle' | 'waiting' | 'connected' | 'transferring' | 'error';
type TransferDirection = 'sending' | 'receiving' | null;

interface FileTransfer {
    name: string;
    size: number;
    progress: number;
}

export const WarpShare = () => {
    const { t } = useTranslation();
    const [peer, setPeer] = useState<Peer | null>(null);
    const [peerId, setPeerId] = useState<string>('');
    const [connection, setConnection] = useState<DataConnection | null>(null);
    const [status, setStatus] = useState<ConnectionStatus>('idle');
    const [transferDirection, setTransferDirection] = useState<TransferDirection>(null);
    const [currentTransfer, setCurrentTransfer] = useState<FileTransfer | null>(null);
    const [receivedFiles, setReceivedFiles] = useState<File[]>([]);
    const [isHost, setIsHost] = useState<boolean>(false);
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chunksRef = useRef<ArrayBuffer[]>([]);
    const fileMetaRef = useRef<{ name: string; size: number; type: string } | null>(null);
    const peerRef = useRef<Peer | null>(null);
    const connectionRef = useRef<DataConnection | null>(null);

    // Initialize PeerJS
    const initializePeer = useCallback(() => {
        const newPeer = new Peer();

        newPeer.on('open', (id) => {
            setPeerId(id);
            setStatus('waiting');
            setIsHost(true);
        });

        newPeer.on('connection', (conn) => {
            setupConnection(conn);
        });

        newPeer.on('error', (err) => {
            console.error('Peer error:', err);
            setStatus('error');
        });

        setPeer(newPeer);
        peerRef.current = newPeer;
    }, []);

    // Setup data connection handlers
    const setupConnection = useCallback((conn: DataConnection) => {
        conn.on('open', () => {
            setConnection(conn);
            connectionRef.current = conn;
            setStatus('connected');
        });

        conn.on('data', (data: unknown) => {
            handleIncomingData(data);
        });

        conn.on('close', () => {
            setConnection(null);
            setStatus('waiting');
        });

        conn.on('error', (err) => {
            console.error('Connection error:', err);
            setStatus('error');
        });
    }, []);

    // Handle incoming data (file chunks or metadata)
    const handleIncomingData = useCallback((data: unknown) => {
        if (typeof data === 'object' && data !== null) {
            const msg = data as { type: string;[key: string]: unknown };

            if (msg.type === 'file-meta') {
                fileMetaRef.current = {
                    name: msg.name as string,
                    size: msg.size as number,
                    type: msg.fileType as string
                };
                chunksRef.current = [];
                setTransferDirection('receiving');
                setCurrentTransfer({
                    name: msg.name as string,
                    size: msg.size as number,
                    progress: 0
                });
            } else if (msg.type === 'file-chunk') {
                const chunk = msg.data as ArrayBuffer;
                chunksRef.current.push(chunk);

                const receivedSize = chunksRef.current.reduce((acc, c) => acc + c.byteLength, 0);
                const progress = Math.round((receivedSize / (fileMetaRef.current?.size || 1)) * 100);

                setCurrentTransfer(prev => prev ? { ...prev, progress } : null);
            } else if (msg.type === 'file-end') {
                // Combine chunks and create file
                const blob = new Blob(chunksRef.current, { type: fileMetaRef.current?.type });
                const file = new File([blob], fileMetaRef.current?.name || 'file', { type: fileMetaRef.current?.type });

                setReceivedFiles(prev => [...prev, file]);
                setTransferDirection(null);
                setCurrentTransfer(null);
                chunksRef.current = [];
                fileMetaRef.current = null;

                // No auto download - show in list instead
                // User can download manually from the file list
            }
        }
    }, []);

    // Connect to a peer (client mode)
    const connectToPeer = useCallback((targetId: string) => {
        if (!peer) {
            const newPeer = new Peer();
            newPeer.on('open', () => {
                const conn = newPeer.connect(targetId);
                setupConnection(conn);
            });
            newPeer.on('error', (err) => {
                console.error('Peer error:', err);
                setStatus('error');
            });
            setPeer(newPeer);
        } else {
            const conn = peer.connect(targetId);
            setupConnection(conn);
        }
        setIsHost(false);
    }, [peer, setupConnection]);

    // Send file
    const sendFile = useCallback(async (file: File) => {
        if (!connection) return;

        setTransferDirection('sending');
        setCurrentTransfer({ name: file.name, size: file.size, progress: 0 });

        // Send metadata
        connection.send({
            type: 'file-meta',
            name: file.name,
            size: file.size,
            fileType: file.type
        });

        // Chunk and send file
        const CHUNK_SIZE = 16 * 1024; // 16KB chunks
        const arrayBuffer = await file.arrayBuffer();
        const totalChunks = Math.ceil(arrayBuffer.byteLength / CHUNK_SIZE);

        for (let i = 0; i < totalChunks; i++) {
            const start = i * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, arrayBuffer.byteLength);
            const chunk = arrayBuffer.slice(start, end);

            connection.send({
                type: 'file-chunk',
                data: chunk
            });

            const progress = Math.round(((i + 1) / totalChunks) * 100);
            setCurrentTransfer(prev => prev ? { ...prev, progress } : null);

            // Small delay to prevent overwhelming the connection
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        connection.send({ type: 'file-end' });
        setTransferDirection(null);
        setCurrentTransfer(null);
    }, [connection]);

    // Download file helper
    const downloadFile = (file: File) => {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            sendFile(file);
        }
    };

    // Check URL hash for peer ID (client mode)
    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (hash) {
            connectToPeer(hash);
        } else {
            initializePeer();
        }

        return () => {
            // Clean up using refs (not stale state)
            if (connectionRef.current) {
                connectionRef.current.close();
                connectionRef.current = null;
            }
            if (peerRef.current) {
                peerRef.current.destroy();
                peerRef.current = null;
            }
        };
    }, []);

    // Generate share URL
    const shareUrl = peerId ? `${window.location.origin}/warp-share#${peerId}` : '';

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {t('warp.title')}
                </h1>
                <p className="text-slate-400 mt-2">
                    {t('warp.subtitle')}
                </p>
            </div>

            {/* Status Card */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-6">
                {/* Waiting for connection - Show QR */}
                {status === 'waiting' && isHost && (
                    <div className="text-center">
                        <div className="inline-block p-4 bg-white rounded-xl mb-4">
                            <QRCodeSVG value={shareUrl} size={200} />
                        </div>
                        <p className="text-slate-300 mb-2">{t('warp.scan_qr')}</p>
                        <p className="text-xs text-slate-500 break-all">{shareUrl}</p>
                        <div className="mt-6 flex items-center justify-center gap-2 text-indigo-400">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>{t('warp.waiting')}</span>
                        </div>
                    </div>
                )}

                {/* Connected */}
                {status === 'connected' && (
                    <div className="space-y-6">
                        {/* Connection status */}
                        <div className="flex items-center justify-center gap-2 text-emerald-400">
                            <Check className="w-5 h-5" />
                            <span>{t('warp.connected')}</span>
                        </div>

                        {/* Transfer progress */}
                        {currentTransfer && (
                            <div className="bg-slate-900/50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    {transferDirection === 'sending' ? (
                                        <Upload className="w-4 h-4 text-blue-400" />
                                    ) : (
                                        <Download className="w-4 h-4 text-green-400" />
                                    )}
                                    <span className="text-sm text-slate-300">{currentTransfer.name}</span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                                        style={{ width: `${currentTransfer.progress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1 text-right">{currentTransfer.progress}%</p>
                            </div>
                        )}

                        {/* Send/Receive buttons */}
                        {!currentTransfer && (
                            <div className="grid grid-cols-2 gap-4">
                                {/* Send to other device */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl hover:border-indigo-400/50 transition-all"
                                >
                                    {isHost ? (
                                        <Smartphone className="w-8 h-8 text-indigo-400" />
                                    ) : (
                                        <Monitor className="w-8 h-8 text-indigo-400" />
                                    )}
                                    <span className="text-sm text-slate-300">
                                        {isHost ? t('warp.send_to_phone') : t('warp.send_to_pc')}
                                    </span>
                                </button>

                                {/* Received files list */}
                                <div className="flex flex-col gap-3 p-4 bg-slate-900/30 border border-slate-700 rounded-xl max-h-64 overflow-y-auto">
                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                        <Download className="w-4 h-4" />
                                        <span>受信ファイル</span>
                                    </div>
                                    {receivedFiles.length === 0 ? (
                                        <p className="text-xs text-slate-500 text-center py-4">ファイル待機中...</p>
                                    ) : (
                                        receivedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                                                {/* Thumbnail/Icon */}
                                                {file.type.startsWith('image/') ? (
                                                    <button
                                                        onClick={() => setPreviewFile(file)}
                                                        className="flex-shrink-0"
                                                    >
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt={file.name}
                                                            className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                                        />
                                                    </button>
                                                ) : (
                                                    <div className="w-12 h-12 bg-slate-700 rounded flex items-center justify-center text-slate-400">
                                                        📄
                                                    </div>
                                                )}
                                                {/* File info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-white truncate">{file.name}</p>
                                                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                                {/* Download button */}
                                                <button
                                                    onClick={() => downloadFile(file)}
                                                    className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
                                                >
                                                    <Download className="w-4 h-4 text-white" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                    </div>
                )}

                {/* Error state */}
                {status === 'error' && (
                    <div className="text-center text-red-400">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                        <p>{t('warp.error_title')}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                        >
                            {t('warp.error_retry')}
                        </button>
                    </div>
                )}

                {/* Idle/Loading state */}
                {status === 'idle' && (
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{t('warp.initializing')}</span>
                    </div>
                )}
            </div>

            {/* Trust badge */}
            <div className="text-center text-xs text-slate-500">
                <p>{t('warp.trust_badge')}</p>
            </div>

            {/* Image Preview Modal */}
            {previewFile && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setPreviewFile(null)}
                >
                    <div className="relative max-w-full max-h-full">
                        <img
                            src={URL.createObjectURL(previewFile)}
                            alt={previewFile.name}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 rounded-b-lg">
                            <p className="text-sm truncate">{previewFile.name}</p>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        downloadFile(previewFile);
                                    }}
                                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    ダウンロード
                                </button>
                                <button
                                    onClick={() => setPreviewFile(null)}
                                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm transition-colors"
                                >
                                    閉じる
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WarpShare;

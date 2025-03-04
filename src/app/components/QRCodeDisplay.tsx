// components/QRCodeDisplay.tsx
'use client';

import { Copy, DownloadIcon } from 'lucide-react';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'sonner';

interface QRCodeDisplayProps {
    sessionId: string;
    onEvent: (value: boolean) => void;
}

export default function QRCodeDisplay({ sessionId, onEvent }: QRCodeDisplayProps) {
    const copyToClipboard = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        onEvent(false);
    };

    const downloadQR = () => {
        const canvas = document.querySelector('.qrcode-canvas>canvas') as HTMLCanvasElement;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `session-${sessionId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success('QR code downloaded!');
        onEvent(false);
    };

    return (
        <div
            className="bg-white dark:bg-slate-950
                shadow-lg transition-all duration-300 
                ease-in-out w-96"
        >
            {/* Content */}
            <div className="h-full overflow-auto transition-opacity duration-300 opacity-100">
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm text-gray-700 dark:text-gray-300 mb-2 px-3 py-2">
                            Share this grocery list
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={copyToClipboard}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md flex items-center gap-2"
                        >
                            <Copy size={16} />
                            Copy link
                        </button>
                        <Link
                            href={`/qr/${sessionId}`}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md flex items-center gap-2"
                            onClick={downloadQR}
                        >
                            <DownloadIcon size={16} />
                            Download QR Code
                        </Link>
                        <div className="bg-white p-4 rounded-md border border-gray-200 flex justify-center qrcode-canvas">
                            <QRCodeCanvas value={window.location.href} size={256} marginSize={4}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// components/QRCodeDisplay.tsx
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import SessionIdDisplay from './SessionIdDisplay';

interface QRCodeDisplayProps {
    sessionId: string;
}

export default function QRCodeDisplay({ sessionId }: QRCodeDisplayProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const downloadQR = () => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `session-${sessionId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div
            className={`fixed top-0 right-0 h-full bg-white dark:bg-slate-950
                shadow-lg transition-all duration-300 
                ease-in-out ${isExpanded ? 'w-96' : 'w-12'
                }`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                title="Get QR Code"
                className="absolute top-1/2 -left-3 transform -translate-y-1/2 bg-gray-500 rounded-full p-1 shadow-md hover:bg-gray-600"
            >
                {isExpanded ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* Content */}
            <div className={`h-full overflow-auto transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'
                }`}>
                {isExpanded && (
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                                Session QR Code
                            </h1>
                        </div>

                        <div className="space-y-4">
                            <SessionIdDisplay sessionId={sessionId}></SessionIdDisplay>

                            <div className="bg-white p-4 rounded-md border border-gray-200 flex justify-center">
                                <QRCode value={window.location.href} />
                            </div>

                            <button
                                onClick={downloadQR}
                                className="w-full bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors"
                            >
                                Download QR Code
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
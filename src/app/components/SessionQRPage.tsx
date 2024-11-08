import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createSession, generateUUID, getSession } from '../services/sessionManager';
import QRCodeReader from './QRCodeReader';

const SessionQRPage = () => {
    const router = useRouter();
    const [manualInput, setManualInput] = useState('');

    const createNewSession = () => {
        // Generate a unique session ID using our UUID function
        const newSessionId = generateUUID();
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 30);
        createSession({ sessionId: newSessionId, expiresAt: expireDate }).then(() => {
            router.push(`/qr/${newSessionId}`);
        })
    };
    const handleManualSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (manualInput.trim()) {
            getSession(manualInput.trim()).then((data) => {
                if (data) router.push(`/qr/${manualInput.trim()}`);
            }).catch(error => console.error(error))
        }
    };

    return (
        <div className="min-h-screen bg-gray-300 dark:bg-gray-800 py-12 px-4">
            <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-500 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">
                        Grocery List
                    </h1>

                    <div className="text-gray-600 dark:text-gray-200 mb-1">
                        Scan or upload QR
                        <QRCodeReader></QRCodeReader>
                    </div>
                    {/* Manual Input */}
                    <div className="text-gray-600 dark:text-gray-200 mb-1">
                        Or enter manually
                    </div>
                    <form onSubmit={handleManualSubmit} className="mb-6 space-y-2">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={manualInput}
                                onChange={(e) => setManualInput(e.target.value)}
                                placeholder="Enter session ID manually"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-900 dark:border-gray-600 dark:text-gray-400"
                            />
                            <button
                                type="submit"
                                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors whitespace-nowrap"
                            >
                                Resume
                            </button>
                        </div>
                    </form>
                    <div className="text-gray-600 dark:text-gray-200 mb-1">
                        Or create new session
                    </div>
                    <div>
                        <button
                            onClick={createNewSession}
                            className="mb-2 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            Create New Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionQRPage;
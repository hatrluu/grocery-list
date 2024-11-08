import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const SessionIdDisplay = ({ sessionId }: {sessionId: string}) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(sessionId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-slate-500 p-4 rounded-md">
            <div className="flex justify-between items-start mb-1">
                <p className="text-sm text-gray-500 dark:text-gray-300">Session ID:</p>
                <button
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <p className="font-mono text-lg break-all text-gray-600">
                {sessionId}
            </p>
        </div>
    );
};

export default SessionIdDisplay;
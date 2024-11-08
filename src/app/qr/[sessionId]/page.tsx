// app/[sessionId]/page.tsx
import QRCodeDisplay from '@/app/components/QRCodeDisplay';
import MainPage from '@/app/components/main';
import { SessionProvider } from '@/app/contexts/SessionContext';
import { UIProvider } from '@/app/contexts/UIContext';

export default async function QRPage({ params }: { params: { sessionId: string } }) {
    const {sessionId} = await params;
    const userId = 1;
    return (
        <UIProvider>
            <SessionProvider sessionId={sessionId} userId={userId}>
                <div className="min-h-screen bg-gray-300 dark:bg-slate-800">
                    {/* Main Content */}
                    <div className={`p-6 transition-all duration-300`}>
                        <MainPage />
                    </div>

                    {/* Collapsible QR Code Panel */}
                    <QRCodeDisplay sessionId={sessionId} />
                </div>
            </SessionProvider>
        </UIProvider>
    );
}
// app/[sessionId]/page.tsx
import ActionBar from '@/app/components/ActionBar';
import MainPage from '@/app/components/MainPage';
import { SessionProvider } from '@/app/contexts/SessionContext';

export default async function QRPage({ params }: { params: { sessionId: string } }) {
    const { sessionId } = await params;
    const userId = 1;
    return (
        <SessionProvider sessionId={sessionId} userId={userId}>
            <div className="min-h-screen bg-gray-300 dark:bg-slate-700">
                {/* Main Content */}
                <div className={`transition-all duration-300`}>
                    <MainPage />
                </div>
            </div>
            <ActionBar></ActionBar>
        </SessionProvider>
    );
}
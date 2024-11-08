// contexts/SessionContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

interface SessionContextType {
    sessionId: string;
    userId: number;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ 
    children,
    sessionId,
    userId 
}: { 
    children: ReactNode;
    sessionId: string;
    userId: number;
}) {
    return (
        <SessionContext.Provider value={{ sessionId, userId }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within SessionProvider');
    }
    return context;
}
// contexts/UIContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';

interface UIContextType {
    isPanelExpanded: boolean;
    setIsPanelExpanded: (value: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isPanelExpanded, setIsPanelExpanded] = useState(false);

    return (
        <UIContext.Provider value={{ isPanelExpanded, setIsPanelExpanded }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
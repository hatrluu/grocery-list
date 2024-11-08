import { toast } from "sonner";

// Simple UUID v4 generator
export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
export async function createSession(sessionData: { sessionId: string, expiresAt: Date }) {
    try {
        const response = await fetch('/api/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        toast.error(error.message);
    }
}
export async function getSession(sessionId: string) {
    try {
        const response = await fetch('/api/sessions/'+sessionId);
        if (!response.ok) {
            throw new Error('Session not found');
        }
        return response.json();
    } catch (error) {
        toast.error(error.message);
    }
}
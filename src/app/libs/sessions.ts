import sql from 'better-sqlite3';
import { ISession } from '../interfaces/session.interface';

const db = sql('db.db');

export function getSessions(): ISession[] {
    return db.prepare('SELECT * FROM sessions').all() as ISession[];
}

// Create a new session
export function createSession(sessionId: string, expiresAt: Date) {
    const stmt = db.prepare(`
        INSERT INTO sessions (session_id, created_at, expires_at, is_active)
        VALUES (?, datetime('now'), ?, 1)
    `);

    return stmt.run(sessionId, expiresAt);
}

// Get a single session by ID
export function getSessionById(sessionId: string) {
    const stmt = db.prepare('SELECT * FROM sessions WHERE session_id = ?');
    return stmt.get(sessionId);
}

// Update a session
export function updateSession(sessionId: string, updates: ISession) {
    const validColumns = ['expires_at', 'is_active'];
    const updates_filtered = Object.keys(updates)
        .filter(key => validColumns.includes(key))
        .map(key => `${key} = @${key}`)
        .join(', ');

    if (!updates_filtered) return null;

    const stmt = db.prepare(`
        UPDATE sessions 
        SET ${updates_filtered}
        WHERE session_id = @sessionId
    `);

    return stmt.run({ ...updates, sessionId });
}

// Delete a session
export function deleteSession(sessionId: string) {
    const stmt = db.prepare('DELETE FROM sessions WHERE session_id = ?');
    return stmt.run(sessionId);
}

// Get active sessions
export function getActiveSessions() {
    return db.prepare(`
        SELECT * FROM sessions 
        WHERE is_active = 1 
        AND datetime('now') < datetime(expires_at)
    `).all();
}

// Deactivate expired sessions
export function deactivateExpiredSessions() {
    return db.prepare(`
        UPDATE sessions 
        SET is_active = 0 
        WHERE datetime('now') >= datetime(expires_at)
    `).run();
}

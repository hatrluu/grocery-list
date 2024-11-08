// app/api/stores/route.ts
import sql from 'better-sqlite3';
import { NextResponse } from 'next/server';

const db = sql('db.db');

// GET all stores for a session
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json(
                { error: 'Session ID is required' },
                { status: 400 }
            );
        }

        const stores = db.prepare(`
            SELECT s.store_id, s.name, s.created_at, s.created_by, s.total_price, u.name as created_by_name
            FROM stores s
            LEFT JOIN users u ON s.created_by = u.user_id
            WHERE session_id = ?
            ORDER BY s.created_at DESC
        `).all(sessionId);

        return NextResponse.json(stores);
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// POST new store
export async function POST(request: Request) {
    try {
        const { name, sessionId, totalPrice, userId } = await request.json();

        if (!name?.trim() || !sessionId || !userId) {
            return NextResponse.json(
                { error: 'Store name, session ID, and user ID are required' },
                { status: 400 }
            );
        }

        // Verify session exists and is active
        const session = db.prepare(`
            SELECT session_id 
            FROM sessions 
            WHERE session_id = ? 
            AND is_active = TRUE 
            AND datetime('now') < datetime(expires_at)
        `).get(sessionId);

        if (!session) {
            return NextResponse.json(
                { error: 'Invalid or expired session' },
                { status: 400 }
            );
        }

        // Verify user is part of the session
        const sessionUser = db.prepare(`
            SELECT session_id 
            FROM session_users 
            WHERE session_id = ? AND user_id = ?
        `).get(sessionId, userId);

        if (!sessionUser) {
            return NextResponse.json(
                { error: 'User is not part of this session' },
                { status: 403 }
            );
        }

        const stmt = db.prepare(`
            INSERT INTO stores (name, session_id, total_price, created_by)
            VALUES (?, ?, ?, ?)
        `);

        const result = stmt.run(name, sessionId, totalPrice, userId);

        const newStore = db.prepare(`
            SELECT store_id, name, created_at, created_by, total_price
            FROM stores
            WHERE store_id = ?
        `).get(result.lastInsertRowid);

        return NextResponse.json(newStore);
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
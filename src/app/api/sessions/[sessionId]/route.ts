import sql from 'better-sqlite3';
import { NextResponse } from 'next/server';

// // Move your database operations to API routes
// export async function GET() {
//     try {
//         const db = sql('db.db');
//         const sessions = db.prepare('SELECT * FROM sessions').all();
//         return NextResponse.json(sessions);
//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }

export async function GET(request: Request,{ params }: { params: { sessionId: string } }) {
    try {
        const db = sql('db.db');
        const { sessionId } = await params;
        if(!sessionId) {
            const sessions = db.prepare('SELECT * FROM sessions').all();
            return NextResponse.json(sessions);
        }
        const stmt = db.prepare('SELECT * FROM sessions WHERE session_id = ?');
        const session = stmt.get(sessionId);
        
        if (!session) {
            return NextResponse.json(
                { error: 'Session not found' }, 
                { status: 404 }
            );
        }
        
        return NextResponse.json(session);
    } catch (error) {
        return NextResponse.json(
            { error: error.message }, 
            { status: 500 }
        );
    }
}
export async function POST(request: Request) {
    try {
        const db = sql('db.db');
        const { sessionId, expiresAt } = await request.json();
        
        const stmt = db.prepare(`
            INSERT INTO sessions (session_id, created_at, expires_at, is_active)
            VALUES (?, datetime('now'), ?, 1)
        `);
        
        const result = stmt.run(sessionId, expiresAt);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
// app/api/stores/[storeId]/route.ts
import sql from 'better-sqlite3';
import { NextResponse } from 'next/server';

const db = sql('db.db');

// GET single store
export async function GET(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { storeId } = await params;
        const store = db.prepare(`
            SELECT 
                s.store_id,
                s.name,
                s.total_price
                s.created_at,
                s.session_id,
                u.name as created_by_name
            FROM stores s
            LEFT JOIN users u ON s.created_by = u.user_id
            WHERE s.store_id = ?
        `).get(storeId);

        if (!store) {
            return NextResponse.json(
                { error: 'Store not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(store);
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// UPDATE store
export async function PATCH(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { storeId } = await params;
        const { name, userId, totalPrice } = await request.json();

        if (!name?.trim() || !userId) {
            return NextResponse.json(
                { error: 'Store name and user ID are required' },
                { status: 400 }
            );
        }

        // Verify user has access to this store
        const userAccess = db.prepare(`
            SELECT s.store_id
            FROM stores s
            JOIN session_users su ON s.session_id = su.session_id
            WHERE s.store_id = ? AND su.user_id = ?
        `).get(storeId, userId);

        if (!userAccess) {
            return NextResponse.json(
                { error: 'Unauthorized to update this store' },
                { status: 403 }
            );
        }

        const stmt = db.prepare(`
            UPDATE stores 
            SET name = ?,
                total_price = ?
            WHERE store_id = ?
        `);

        const result = stmt.run(name, totalPrice, storeId);

        if (result.changes === 0) {
            return NextResponse.json(
                { error: 'Store not found' },
                { status: 404 }
            );
        }

        const updatedStore = db.prepare(`
            SELECT store_id, name, total_price, created_at, created_by
            FROM stores
            WHERE store_id = ?
        `).get(storeId);

        return NextResponse.json(updatedStore);
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// DELETE store
export async function DELETE(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { storeId } = await params;
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Verify user has access to this store
        const userAccess = db.prepare(`
            SELECT s.store_id
            FROM stores s
            JOIN session_users su ON s.session_id = su.session_id
            WHERE s.store_id = ? AND su.user_id = ?
        `).get(storeId, userId);

        if (!userAccess) {
            return NextResponse.json(
                { error: 'Unauthorized to delete this store' },
                { status: 403 }
            );
        }

        // Begin transaction to delete store and related items
        db.prepare('BEGIN TRANSACTION').run();

        try {
            // Delete store items first
            db.prepare('DELETE FROM store_items WHERE store_id = ?').run(storeId);

            // Then delete the store
            const result = db.prepare('DELETE FROM stores WHERE store_id = ?').run(storeId);

            if (result.changes === 0) {
                db.prepare('ROLLBACK').run();
                return NextResponse.json(
                    { error: 'Store not found' },
                    { status: 404 }
                );
            }

            db.prepare('COMMIT').run();
            return NextResponse.json({ message: 'Store deleted successfully' });
        } catch (error) {
            db.prepare('ROLLBACK').run();
            throw error;
        }
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
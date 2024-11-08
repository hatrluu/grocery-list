// app/api/stores/[storeId]/items/route.ts
import { NextResponse } from 'next/server';
import sql from 'better-sqlite3';

const db = sql('db.db');

// GET all items for a store
export async function GET(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { storeId } = await params;

        // Verify the store exists
        const store = db.prepare('SELECT store_id FROM stores WHERE store_id = ?').get(storeId);
        if (!store) {
            return NextResponse.json(
                { error: 'Store not found' },
                { status: 404 }
            );
        }

        // Get all items for the store with user information
        const items = db.prepare(`
            SELECT 
                i.item_id,
                i.name,
                i.description,
                si.quantity,
                si.price,
                si.is_checked,
                si.added_by,
                u_added.name as added_by_name,
                si.added_at,
                si.last_updated_at,
                si.last_updated_by,
                u_updated.name as last_updated_by_name
            FROM store_items si
            JOIN items i ON si.item_id = i.item_id
            JOIN users u_added ON si.added_by = u_added.user_id
            LEFT JOIN users u_updated ON si.last_updated_by = u_updated.user_id
            WHERE si.store_id = ?
            ORDER BY si.added_at DESC
        `).all(storeId);

        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// POST new item to store
export async function POST(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { storeId } = await params;
        const { name, description, quantity, price, userId } = await request.json();

        if (!name?.trim() || !userId) {
            return NextResponse.json(
                { error: 'Name and user ID are required' },
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
                { error: 'Unauthorized to add items to this store' },
                { status: 403 }
            );
        }

        db.prepare('BEGIN TRANSACTION').run();

        try {
            // First, insert or get the item from the items table
            const existingItem = db.prepare(
                'SELECT item_id FROM items WHERE LOWER(name) = LOWER(?)'
            ).get(name);

            let itemId;
            if (existingItem) {
                itemId = existingItem.item_id;
            } else {
                const itemResult = db.prepare(`
                    INSERT INTO items (name, description)
                    VALUES (?, ?)
                `).run(name, description);
                itemId = itemResult.lastInsertRowid;
            }

            // Then, create the store-item relationship
            const storeItemResult = db.prepare(`
                INSERT INTO store_items (
                    store_id,
                    item_id,
                    quantity,
                    price,
                    is_checked,
                    added_by,
                    last_updated_by
                )
                VALUES (?, ?, ?, ?, 0, ?, ?)
            `).run(storeId, itemId, quantity, price || null, userId, userId);

            // Get the newly created item with all its information
            const newItem = db.prepare(`
                SELECT 
                    i.item_id,
                    i.name,
                    i.description,
                    si.quantity,
                    si.price,
                    si.is_checked,
                    si.added_by,
                    u_added.name as added_by_name,
                    si.added_at,
                    si.last_updated_at,
                    si.last_updated_by,
                    u_updated.name as last_updated_by_name
                FROM store_items si
                JOIN items i ON si.item_id = i.item_id
                JOIN users u_added ON si.added_by = u_added.user_id
                LEFT JOIN users u_updated ON si.last_updated_by = u_updated.user_id
                WHERE si.store_id = ? AND si.item_id = ?
            `).get(storeId, itemId);

            db.prepare('COMMIT').run();
            return NextResponse.json(newItem);
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
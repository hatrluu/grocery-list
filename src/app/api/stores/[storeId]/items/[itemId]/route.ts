// app/api/stores/[storeId]/items/[itemId]/route.ts
import { NextResponse } from 'next/server';
import sql from 'better-sqlite3';

const db = sql('db.db');

// GET single item
export async function GET(
    request: Request,
    { params }: { params: { storeId: string; itemId: string } }
) {
    try {
        const { storeId, itemId } = await params;

        const item = db.prepare(`
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

        if (!item) {
            return NextResponse.json(
                { error: 'Item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// UPDATE item
export async function PATCH(
    request: Request,
    { params }: { params: { storeId: string; itemId: string } }
) {
    try {
        const { storeId, itemId } = await params;
        const updates = await request.json();
        const { name, description, quantity, price, is_checked, userId } = updates;

        console.log(is_checked);
        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Verify user has access
        const userAccess = db.prepare(`
            SELECT s.store_id
            FROM stores s
            JOIN session_users su ON s.session_id = su.session_id
            WHERE s.store_id = ? AND su.user_id = ?
        `).get(storeId, userId);

        if (!userAccess) {
            return NextResponse.json(
                { error: 'Unauthorized to update this item' },
                { status: 403 }
            );
        }

        db.prepare('BEGIN TRANSACTION').run();

        try {
            // Update item details if provided
            if (name || description) {
                db.prepare(`
                    UPDATE items
                    SET 
                        name = COALESCE(?, name),
                        description = COALESCE(?, description)
                    WHERE item_id = ?
                `).run(name, description, itemId);
            }

            // Prepare updates object with converted boolean
            const updateData = {
                ...updates,
                is_checked: typeof is_checked === 'boolean' ? (is_checked ? 1 : 0) : undefined,
                storeId,
                itemId,
                userId
            };

            // Update store_items details
            const validColumns = ['quantity', 'price', 'is_checked'];
            const updates_filtered = Object.keys(updates)
                .filter(key => validColumns.includes(key))
                .map(key => `${key} = @${key}`)
                .join(', ');

            if (updates_filtered) {
                const stmt = db.prepare(`
                    UPDATE store_items
                    SET ${updates_filtered},
                        last_updated_at = datetime('now'),
                        last_updated_by = @userId
                    WHERE store_id = @storeId AND item_id = @itemId
                `);

                const result = stmt.run({
                    ...updateData,
                    storeId,
                    itemId,
                    userId
                });

                if (result.changes === 0) {
                    db.prepare('ROLLBACK').run();
                    return NextResponse.json(
                        { error: 'Item not found' },
                        { status: 404 }
                    );
                }
            }

            // Get updated item
            const updatedItem = db.prepare(`
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
            return NextResponse.json(updatedItem);
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

// DELETE item
export async function DELETE(
    request: Request,
    { params }: { params: { storeId: string; itemId: string } }
) {
    try {
        const { storeId, itemId } = await params;
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Verify user has access
        const userAccess = db.prepare(`
            SELECT s.store_id
            FROM stores s
            JOIN session_users su ON s.session_id = su.session_id
            WHERE s.store_id = ? AND su.user_id = ?
        `).get(storeId, userId);

        if (!userAccess) {
            return NextResponse.json(
                { error: 'Unauthorized to delete this item' },
                { status: 403 }
            );
        }

        // Delete the store_items relationship
        const stmt = db.prepare(`
            DELETE FROM store_items 
            WHERE store_id = ? AND item_id = ?
        `);

        const result = stmt.run(storeId, itemId);

        if (result.changes === 0) {
            return NextResponse.json(
                { error: 'Item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Item deleted successfully' });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
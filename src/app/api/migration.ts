import { db } from "./database";

export const migrate = () => {
    db.serialize(() => {
        db.run(
            `
            -- Sessions table to manage QR code connections
            CREATE TABLE sessions (
                session_id TEXT PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE
            );

            -- Users table to track family members
            CREATE TABLE users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Session-User mapping for multiple users in a session
            CREATE TABLE session_users (
                session_id TEXT,
                user_id INTEGER,
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (session_id, user_id),
                FOREIGN KEY (session_id) REFERENCES sessions(session_id),
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            );

            -- Stores table
            CREATE TABLE stores (
                store_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                session_id TEXT,
                created_by INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES sessions(session_id),
                FOREIGN KEY (created_by) REFERENCES users(user_id)
            );

            -- Items table for the master list of all possible items
            CREATE TABLE items (
                item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Store-Items mapping with quantity and price
            CREATE TABLE store_items (
                store_id INTEGER,
                item_id INTEGER,
                quantity INTEGER DEFAULT 1,
                price DECIMAL(10,2),
                is_checked BOOLEAN DEFAULT FALSE,
                added_by INTEGER,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_updated_by INTEGER,
                PRIMARY KEY (store_id, item_id),
                FOREIGN KEY (store_id) REFERENCES stores(store_id),
                FOREIGN KEY (item_id) REFERENCES items(item_id),
                FOREIGN KEY (added_by) REFERENCES users(user_id),
                FOREIGN KEY (last_updated_by) REFERENCES users(user_id)
            );

            -- Create indexes for better query performance
            CREATE INDEX idx_sessions_active ON sessions(is_active);
            CREATE INDEX idx_store_items_store ON store_items(store_id);
            CREATE INDEX idx_store_items_item ON store_items(item_id);
            CREATE INDEX idx_stores_session ON stores(session_id);
            `,
            (err: Error) => {
                if (err) console.error(err);
                console.log('tables created');
            }
        )
    })
}
// components/store.tsx
'use client';

import { useSession } from "@/app/contexts/SessionContext";
import { useState, useEffect } from "react";
import GroceryItem from "./item";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { IStore } from "../interfaces/store.interface";
import { IItem } from "../interfaces/item.interface";

interface IStoreItem extends IItem {
    store_id: number;
}

const GroceryStore = ({ groceryStore }: { groceryStore: IStore }) => {
    const { sessionId, userId } = useSession();
    const [newItemName, setNewItemName] = useState<string>('');
    const [newItemQuantity, setNewItemQuantity] = useState<number|undefined>();
    const [storeItems, setStoreItems] = useState<IStoreItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch items for this store
    const fetchStoreItems = async () => {
        try {
            const response = await fetch(`/api/stores/${groceryStore.store_id}/items`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch items');
            }
            const data = await response.json();
            setStoreItems(data);
        } catch (error) {
            toast.error(error.message || 'Failed to load items');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStoreItems();
    }, [groceryStore.store_id]);

    const addItem = async () => {
        if (!newItemName.trim()) return;

        try {
            const response = await fetch(`/api/stores/${groceryStore.store_id}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newItemName,
                    sessionId,
                    userId,
                    quantity: newItemQuantity,
                    is_checked: false
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to add item');
            }

            const newItem = await response.json();
            setStoreItems(prevItems => [...prevItems, newItem]);
            setNewItemName('');
            toast.success('Item added successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to add item');
        }
    };

    const updateItem = async (itemId: number, updates: Partial<IStoreItem>) => {
        try {
            const response = await fetch(`/api/stores/${groceryStore.store_id}/items/${itemId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...updates,
                    userId
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update item');
            }

            const updatedItem = await response.json();
            setStoreItems(prevItems =>
                prevItems.map(item =>
                    item.item_id === itemId ? updatedItem : item
                )
            );
        } catch (error) {
            toast.error(error.message || 'Failed to update item');
        }
    };

    const deleteItem = async (itemId: number) => {
        try {
            const response = await fetch(`/api/stores/${groceryStore.store_id}/items/${itemId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete item');
            }

            setStoreItems(prevItems =>
                prevItems.filter(item => item.item_id !== itemId)
            );
            toast.success('Item deleted successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to delete item');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Add Item Section */}
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Add new item"
                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             dark:bg-slate-800 dark:border-gray-600 dark:text-gray-400"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') addItem();
                    }}
                />
                <input
                    type="number"
                    value={newItemQuantity}
                    placeholder="Quantity"
                    onChange={(e) => setNewItemQuantity(parseInt(e.target.value))}
                    className="flex-0.5 rounded-md border border-gray-300 px-4 py-2 
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                                dark:bg-slate-800 dark:border-gray-600 dark:text-gray-400">
                </input>
                <button
                    onClick={addItem}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 
                             py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Add Item
                </button>
            </div>

            {/* Items List */}
            <div className="space-y-2">
                {storeItems.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">
                            No items added yet. Add your first item above!
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {storeItems.map(item => (
                            <GroceryItem
                                key={item.item_id}
                                groceryItem={item}
                                onUpdate={(updates) => updateItem(item.item_id, updates)}
                                onDelete={() => deleteItem(item.item_id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroceryStore;
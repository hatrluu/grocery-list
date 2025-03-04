'use client';

import { useSession } from "@/app/contexts/SessionContext";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { IStore } from "../interfaces/store.interface";
import { IItem } from "../interfaces/item.interface";
import StoreAddItem from "./StoreAddItem";
import GroceryItem from "./GroceryItem";
import { useStoreService } from '../libs/store.service';

interface IStoreItem extends IItem {
}

interface GroceryStoreProps {
    groceryStore: IStore;
    onRefreshItems?: (item: IItem) => void;
}

const GroceryStore = ({ groceryStore, onRefreshItems }: GroceryStoreProps) => {
    const storeService = useStoreService();
    const { userId } = useSession();
    const [storeItems, setStoreItems] = useState<IItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchItems = async () => {
        try {
            setIsLoading(true);
            const items = await storeService.getStoreItems(groceryStore.store_id);
            setStoreItems(items);
        } catch (error) {
            console.error('Error fetching items:', error);
            // Error is already handled by service
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [groceryStore.store_id, storeService]);

    useEffect(() => {
        if (onRefreshItems) {
            onRefreshItems = fetchItems;
        }
    }, []);
    const updateItem = async (itemId: number, updates: Partial<IItem>) => {
        try {
            const updatedItem = await storeService.updateItem(
                groceryStore.store_id,
                itemId,
                updates,
                userId
            );
            setStoreItems(prevItems =>
                prevItems.map(item =>
                    item.item_id === itemId ? updatedItem : item
                )
            );
        } catch (error) {
            // Error is already handled by service
        }
    };

    const deleteItem = async (itemId: number) => {
        try {
            await storeService.deleteItem(groceryStore.store_id, itemId, userId);
            setStoreItems(prevItems =>
                prevItems.filter(item => item.item_id !== itemId)
            );
        } catch (error) {
            // Error is already handled by service
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
        <div className="py-2 px-4">
            {/* Add Item Button */}
            {/* <div className="flex justify-end">
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md 
                             hover:bg-blue-700 transition-colors"
                >
                    Add New Item
                    <Plus size={20} />
                </button>
            </div> */}

            {/* Add Item Modal */}
            {/* <StoreAddItem
                onAdd={addItem}
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            /> */}

            {/* Items List */}
            <div className="space-y-2">
                {storeItems.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">
                            No items added yet. Click the button above to add your first item!
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
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
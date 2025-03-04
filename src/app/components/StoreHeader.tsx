'use client';

import { Edit2, Plus, Trash2 } from 'lucide-react';
import { IStore } from '../interfaces/store.interface';
import TotalPrice from './TotalPrice';
import { useState } from 'react';
import StoreAddItem from "./StoreAddItem";
import { useStoreService } from '../libs/store.service';
import { useSession } from '../contexts/SessionContext';

interface StoreHeaderProps {
    store: IStore;
    editingStore: number | null;
    editName: string;
    onEditNameChange: (name: string) => void;
    onTotalPriceChange: (price: number) => void;
    onSave: (storeId: number) => void;
    onCancel: () => void;
    onEdit: (storeId: number, name: string) => void;
    onDelete: (storeId: number) => void;
    onItemAdded: () => void;
}

export default function StoreHeader({
    store,
    editingStore,
    editName,
    onEditNameChange,
    onTotalPriceChange,
    onSave,
    onCancel,
    onEdit,
    onDelete,
    onItemAdded
}: StoreHeaderProps) {
    const storeService = useStoreService();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const isEditing = editingStore === store.store_id;
    const { sessionId, userId } = useSession();

    const addItem = async (name: string, quantity: number) => {
        try {
            const newItem = await storeService.addItem(store.store_id, {
                name,
                quantity,
                sessionId,
                userId
            });
            onItemAdded(newItem);
            setIsAddModalOpen(false);
        } catch (error) {
            // Error is already handled by service
        }
    };

    return (
        <div className="flex items-center justify-between p-4 border-b">
            {isEditing ? (
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 flex-1">
                    <div>
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => onEditNameChange(e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-1
                                    dark:bg-slate-800 dark:border-gray-600 dark:text-gray-400"
                            autoFocus
                        />
                        <TotalPrice
                            currentPrice={store.total_price || 0}
                            onTotalPriceChange={onTotalPriceChange}
                        />
                    </div>
                    <div className="flex gap-2 md:justify-end md:gap-4">
                        <button
                            onClick={onCancel}
                            className="px-3 py-1 text-sm bg-gray-200 rounded-md dark:bg-gray-500 dark:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave(store.store_id)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => onDelete(store.store_id)}
                            className="p-2 text-gray-500 hover:text-red-600 
                                    rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="Delete store"
                        >
                            Remove <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 flex-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-300">
                                {store.name}
                            </h2>
                            <button
                                onClick={() => onEdit(store.store_id, store.name)}
                                className="text-gray-500 hover:text-blue-600
                                        rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                aria-label="Edit store"
                            >
                                <Edit2 size={18} />
                            </button>
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                            Total Price: {store.total_price}
                        </div>
                    </div>
                    <div>
                        {/* Add Item Button */}
                        <div>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md 
                             hover:bg-blue-700 transition-colors"
                            >
                                Add New Item
                                <Plus size={20} />
                            </button>
                        </div>

                        {/* Add Item Modal */}
                        <StoreAddItem
                            onAdd={addItem}
                            isOpen={isAddModalOpen}
                            onClose={() => setIsAddModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

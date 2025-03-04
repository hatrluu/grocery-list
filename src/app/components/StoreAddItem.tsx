'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface StoreAddItemProps {
    onAdd: (name: string, quantity: number) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function StoreAddItem({ onAdd, isOpen, onClose }: StoreAddItemProps) {
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState(1);

    const handleSubmit = () => {
        if (newItemName.trim()) {
            onAdd(newItemName.trim(), newItemQuantity);
            handleClose();
        }
    };

    const handleClose = () => {
        setNewItemName('');
        setNewItemQuantity(1);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-900 rounded-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold dark:text-white">Add New Item</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Item name"
                        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                                dark:bg-slate-800 dark:border-gray-600 dark:text-gray-400"
                        autoFocus
                    />
                    <input
                        type="number"
                        value={newItemQuantity}
                        onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
                        placeholder="Quantity"
                        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                                dark:bg-slate-800 dark:border-gray-600 dark:text-gray-400"
                    />
                    
                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md
                                    hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400
                                    dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md
                                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                                    flex items-center justify-center gap-2"
                        >
                            <Plus size={16} />
                            Add Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
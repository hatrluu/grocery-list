// components/GroceryItem.tsx
'use client';

import { Check, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { IItem } from "../interfaces/item.interface";

interface GroceryItemProps {
    groceryItem: IItem;
    onUpdate: (updates: Partial<IItem>) => Promise<void>;
    onDelete: () => Promise<void>;
}

const GroceryItem = ({ groceryItem, onUpdate, onDelete }: GroceryItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(groceryItem.name);
    const [editDescription, setEditDescription] = useState(groceryItem.description || '');
    const [editQuantity, setEditQuantity] = useState(groceryItem.quantity || 0);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleToggleCheck = async () => {
        try {
            await onUpdate({ is_checked: !groceryItem.is_checked });
        } catch (error) {
            toast.error('Failed to update item status');
        }
    };

    const handleSaveEdit = async () => {
        if (!editName.trim()) {
            toast.error('Item name cannot be empty');
            return;
        }

        try {
            const updates: Partial<IItem> = {
                name: editName,
                description: editDescription,
                quantity: editQuantity
            };

            await onUpdate(updates);
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update item');
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await onDelete();
        } catch (error) {
            toast.error('Failed to delete item');
            setIsDeleting(false);
        }
    };

    const readableDateTime = (dateString: string) => {
        // Use a fixed locale to ensure consistent formatting between server and client
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // Use 24-hour format for consistency
        }).format(new Date(dateString));
    }
    if (isEditing) {
        return (
            <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="space-y-3 w-full">
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                                dark:bg-slate-800 dark:border-gray-600 dark:text-gray-400"
                        placeholder="Item name"
                        autoFocus
                    />
                    <input
                        type="number"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(parseInt(e.target.value))}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                                    dark:bg-slate-800 dark:border-gray-600 dark:text-gray-400"
                        placeholder="Quantity"
                    />
                    <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                                    dark:bg-slate-800 dark:border-gray-600 dark:text-gray-400"
                        placeholder="Note (optional)"
                    />
                </div>
                <div className="flex justify-between gap-2 mt-3">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-500 dark:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-4 py-4 ${groceryItem.is_checked ? 'bg-gray-200 dark:bg-slate-600' : ''}`}>
            <button
                onClick={handleToggleCheck}
                className={`border-2 border-gray-300 rounded-md transition-colors ${groceryItem.is_checked
                    ? 'bg-green-100 text-green-600'
                    : 'hover:bg-gray-400 text-gray-50 dark:bg-slate-700'
                    }`}
            >
                <Check className="dark:text-slate-700 hover:bg-gray-400" size={16} />
            </button>
            <div className="flex-1 flex flex-col gap-1">
                <span className={`font-bold ${groceryItem.is_checked ?
                    'line-through text-gray-400' : 'text-gray-700 dark:text-slate-300'
                    }`}>
                    {groceryItem.name}
                    {groceryItem.quantity && (
                        <>
                            &nbsp;
                            x
                            {groceryItem.quantity}
                        </>
                    )}
                </span>

                {groceryItem.description && (
                    <p className="text-sm text-gray-500">
                        Note: {groceryItem.description}
                    </p>
                )}

                <div className="flex flex-col gap-0.5 text-xs text-gray-400">
                    <span>Edited by {groceryItem.added_by_name} at {readableDateTime(groceryItem.added_at)}</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Action buttons */}
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md text-sm bg-red-600 text-white
                        hover:bg-red-700 transition-colors"
                >
                    <Trash2 size={16} />
                </button>
                <button
                    onClick={() => {
                        setIsEditing(true);
                        setEditName(groceryItem.name);
                        setEditDescription(groceryItem.description || '');
                    }}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                >
                    <Edit2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default GroceryItem;
// components/item.tsx
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

    if (isEditing) {
        return (
            <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="space-y-3">
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                                dark:bg-slate-800 dark:border-gray-600 dark:text-gray-400"
                        placeholder="Item name"
                        autoFocus
                    />
                    <input
                        type="number"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                                    dark:bg-slate-800 dark:border-gray-600 dark:text-gray-400"
                        placeholder="Quantity"
                    />
                    <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                                    dark:bg-slate-800 dark:border-gray-600 dark:text-gray-400"
                        placeholder="Note (optional)"
                    />
                </div>
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-500 dark:text-white"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-4 p-4 ${groceryItem.is_checked ? 'bg-gray-200 dark:bg-slate-600' : ''
            }`}>
            <button
                onClick={handleToggleCheck}
                className={`p-2 border-2 border-gray-300 rounded-md transition-colors ${groceryItem.is_checked
                    ? 'bg-green-100 text-green-600'
                    : 'hover:bg-gray-400 text-gray-50 dark:bg-slate-700'
                    }`}
            >
                <Check size={20} />
            </button>

            <div className="flex-1">
                <div className="flex items-start gap-2">
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
                        <p className="text-sm text-gray-500 mt-1">
                            Note: {groceryItem.description}
                        </p>
                    )}
                </div>

                <div className="flex gap-4 text-xs text-gray-400 mt-1">
                    <span>Added by {groceryItem.added_by_name}</span>
                    <span>
                        {groceryItem.added_at}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Action buttons */}
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
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default GroceryItem;
// components/MainPage.tsx
'use client';

import { useSession } from "@/app/contexts/SessionContext";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IStore } from "../interfaces/store.interface";
import GroceryStore from "./store";
import Link from "next/link";
import TotalPrice from "./TotalPrice";
import Toggle from "./Toggle";


const MainPage = () => {
    const { sessionId, userId } = useSession();
    const [stores, setStores] = useState<IStore[]>([]);
    const [newStoreName, setNewStoreName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [editingStore, setEditingStore] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [totalPrice, setTotalPrice] = useState<number>(0);

    // Fetch stores
    const fetchStores = async () => {
        try {
            const response = await fetch(`/api/stores?sessionId=${sessionId}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch stores');
            }
            const data = await response.json();
            setStores(data);
        } catch (error) {
            toast.error(error.message || 'Failed to load stores');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [sessionId]);

    // Add store
    const addStore = async () => {
        if (!newStoreName.trim()) return;

        try {
            const response = await fetch('/api/stores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newStoreName,
                    sessionId,
                    userId
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create store');
            }

            const newStore = await response.json();
            setStores(prevStores => [...prevStores, newStore]);
            setNewStoreName('');
            toast.success('Store added successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to add store');
        }
    };

    // Update store
    const updateStore = async (storeId: number) => {
        if (!editName.trim()) return;

        try {
            const response = await fetch(`/api/stores/${storeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editName,
                    totalPrice: totalPrice,
                    userId
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update store');
            }

            const updatedStore = await response.json();
            setStores(prevStores => prevStores.map(store =>
                store.store_id === storeId ? updatedStore : store
            ));
            setEditingStore(null);
            toast.success('Store updated successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to update store');
        }
    };

    // Delete store
    const deleteStore = async (storeId: number) => {
        if (!confirm('Are you sure you want to delete this store? All items in this store will also be deleted.')) return;

        try {
            const response = await fetch(`/api/stores/${storeId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete store');
            }

            setStores(prevStores => prevStores.filter(store => store.store_id !== storeId));
            toast.success('Store deleted successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to delete store');
        }
    };
    const handleTotalPriceChange = (data: any) => {
        setTotalPrice(data);
    };
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
                        Shared Grocery List
                    </h1>
                    <Link
                        href="/"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        Return Home
                    </Link>
                </div>

                <div className="flex gap-3 mb-6">
                    <input
                        type="text"
                        value={newStoreName}
                        onChange={(e) => setNewStoreName(e.target.value)}
                        placeholder="Add new store"
                        className="flex-1 rounded-md border border-gray-300 px-4 py-2 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500
                                dark:bg-slate-800 dark:border-gray-600 dark:text-gray-400"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') addStore();
                        }}
                    />
                    <button
                        onClick={addStore}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 
                                 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Add Store
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {stores.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-slate-600 rounded-lg">
                        <p className="text-gray-500 dark:text-slate-300">
                            No stores added yet. Add your first store above!
                        </p>
                    </div>
                ) : (
                    stores.map(store => (
                        <div key={store.store_id} className="bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between p-4 border-b">
                                {editingStore === store.store_id ? (
                                    <div className="flex gap-2 flex-1">
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="flex-1 rounded-md border border-gray-300 px-3 py-1 
                                                    dark:bg-slate-800 dark:border-gray-600 dark:text-gray-400"
                                            autoFocus
                                        />
                                        <TotalPrice currentPrice={store.total_price || 0} onTotalPriceChange={handleTotalPriceChange}></TotalPrice>
                                        <button
                                            onClick={() => updateStore(store.store_id)}
                                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingStore(null)}
                                            className="px-3 py-1 text-sm bg-gray-200 rounded-md dark:bg-gray-500 dark:text-white"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-300">
                                                {store.name}
                                            </h2>
                                            {store.created_by && (
                                                <p className="text-sm text-gray-500">
                                                    Added by {store.created_by_name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-gray-600 dark:text-gray-300" htmlFor="total_price">Total Price: {store.total_price}</label>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingStore(store.store_id);
                                                    setEditName(store.name);
                                                }}
                                                className="p-2 text-gray-500 hover:text-blue-600 
                                                         rounded-md hover:bg-gray-100"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteStore(store.store_id)}
                                                className="p-2 text-gray-500 hover:text-red-600 
                                                         rounded-md hover:bg-gray-100"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <GroceryStore key={store.store_id} groceryStore={store} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MainPage;
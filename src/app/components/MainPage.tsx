// components/MainPage.tsx
'use client';

import { useSession } from "@/app/contexts/SessionContext";
import { Plus, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { IStore } from "../interfaces/store.interface";
import QRCodeDisplay from "./QRCodeDisplay";
import GroceryStore from "./GroceryStore";
import StoreHeader from './StoreHeader';

const MainPage = () => {
    const { sessionId, userId } = useSession();
    const [stores, setStores] = useState<IStore[]>([]);
    const [newStoreName, setNewStoreName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [editingStore, setEditingStore] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [showSharePopover, setShowSharePopover] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [refreshItems, setRefreshItems] = useState<(() => void)>();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && buttonRef.current && 
                !popoverRef.current.contains(event.target as Node) && 
                !buttonRef.current.contains(event.target as Node)) {
                setShowSharePopover(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load stores';
            toast.error(errorMessage);
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
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to add store';
            toast.error(errorMessage);
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
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update store';
            toast.error(errorMessage);
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
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load stores';
            toast.error(errorMessage);
        }
    };
    const handleTotalPriceChange = (data: number) => {
        setTotalPrice(data);
    };
    const handleSaveStore = (storeId: number) => {
        updateStore(storeId);
    };
    const handleCancelEdit = () => {
        setEditingStore(null);
    };
    const handleEditStore = (storeId: number, name: string) => {
        setEditingStore(storeId);
        setEditName(name);
    };
    const handleDeleteStore = (storeId: number) => {
        deleteStore(storeId);
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
                    <h1 className="flex align-middle text-3xl font-bold text-gray-900 dark:text-gray-200">
                        Shared Grocery List 
                        <button 
                                ref={buttonRef}
                                className="ml-4 flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                                onClick={() => setShowSharePopover(!showSharePopover)}
                            >
                                <Share2 size={16} />
                            </button>
                        <div className="relative md:fixed">
                            {showSharePopover && (
                                <div 
                                    ref={popoverRef}
                                    className="absolute left-0 mt-2 w-full bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-2 z-50"
                                >
                                    <QRCodeDisplay sessionId={sessionId} onEvent={(value: boolean) => setShowSharePopover(value)} />
                                </div>
                            )}
                        </div>
                    </h1>
                </div>

                <div className="flex gap-3 mb-6">
                    <div className="block relative grow">
                        <input
                            id="floating_filled"
                            type="text"
                            value={newStoreName}
                            onChange={(e) => setNewStoreName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') addStore();
                            }}
                            className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "
                        />
                        <label htmlFor="floating_filled" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Store name</label>
                    </div>
                    <div className="block relative grow">
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
                            <StoreHeader
                                store={store}
                                editingStore={editingStore}
                                editName={editName}
                                onEditNameChange={setEditName}
                                onTotalPriceChange={handleTotalPriceChange}
                                onSave={handleSaveStore}
                                onCancel={handleCancelEdit}
                                onEdit={handleEditStore}
                                onDelete={handleDeleteStore}
                                onItemAdded={refreshItems}
                            />
                            <GroceryStore 
                                key={store.store_id} 
                                groceryStore={store} 
                                onRefreshItems={(refresh) => setRefreshItems(() => refresh)}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MainPage;

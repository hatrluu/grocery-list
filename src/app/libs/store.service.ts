'use client';

import { IStore } from '../interfaces/store.interface';
import { IItem } from '../interfaces/item.interface';
import { toast } from 'sonner';

export class StoreService {
    private static instance: StoreService;
    private baseUrl = '/api/stores';

    private constructor() {}

    public static getInstance(): StoreService {
        if (!StoreService.instance) {
            StoreService.instance = new StoreService();
        }
        return StoreService.instance;
    }

    async getStoreItems(storeId: number): Promise<IItem[]> {
        try {
            const response = await fetch(`${this.baseUrl}/${storeId}/items`);
            
            if (!response.ok) {
                const error = await response.json();
                console.error('API Error:', error);
                throw new Error(error.error || 'Failed to fetch items');
            }
            
            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error('Service Error:', error);
            toast.error(error.message || 'Failed to load items');
            throw error;
        }
    }

    async addItem(storeId: number, data: { 
        name: string, 
        quantity: number, 
        sessionId: string, 
        userId: number 
    }): Promise<IItem> {
        try {
            const response = await fetch(`${this.baseUrl}/${storeId}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    is_checked: false
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to add item');
            }

            const newItem = await response.json();
            toast.success('Item added successfully');
            return newItem;
        } catch (error: any) {
            toast.error(error.message || 'Failed to add item');
            throw error;
        }
    }

    async updateItem(storeId: number, itemId: number, updates: Partial<IItem>, userId: number): Promise<IItem> {
        try {
            const response = await fetch(`${this.baseUrl}/${storeId}/items/${itemId}`, {
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

            return await response.json();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update item');
            throw error;
        }
    }

    async deleteItem(storeId: number, itemId: number, userId: number): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/${storeId}/items/${itemId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete item');
            }

            toast.success('Item deleted successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete item');
            throw error;
        }
    }
}

// Custom hook to use the service in components
export function useStoreService() {
    return StoreService.getInstance();
}
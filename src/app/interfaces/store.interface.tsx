export interface IStore {
    store_id: number;
    name: string;
    session_id: string;
    created_by?: string;
    created_at?: Date
    created_by_name?: string;
    total_price?: number;
}

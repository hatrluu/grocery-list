export interface IItem {
    item_id: number;
    name: string;
    description?: string;
    quantity: number;
    price?: number;
    is_checked: boolean;
    added_by: number;
    added_by_name?: string;
    added_at: string;
    last_updated_at: string;
    last_updated_by: number;
    last_updated_by_name?: string;
}
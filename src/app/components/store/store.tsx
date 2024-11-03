import { Item } from "@/app/interfaces/item.interface";
import { useState } from "react";
import GroceryItem from "../item/item";


const GroceryStore = ({ groceryStore }) => {
    const [newItemName, setNewItemName] = useState<string>('');
    const [groceryItems, setGroceryItems] = useState<Item[]>([]);

    const addItem = () => {
        if (!newItemName.trim()) return;

        const newItem = {
            id: Math.random().toString(36).substring(7),
            name: newItemName,
            quantity: 1,
            store: groceryStore,
            completed: false
        };

        setGroceryItems([...groceryItems, newItem]);
        setNewItemName('');
        localStorage.setItem('groceryItems', JSON.stringify([...groceryItems, newItem]));
    };
    return (
        <div className="storeSection">
            <div className="addSection">
                <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Add new item"
                />
                <button onClick={addItem}>Add Item</button>
            </div>
            <h2>{groceryStore.name}</h2>
            <ul>
                {groceryItems
                    .filter(item => item.store === groceryStore.id)
                    .map(item => (
                        <li key={item.id} className={item.completed ? 'completed' : ''}>
                            <GroceryItem groceryItem={item} ></GroceryItem>
                        </li>
                    ))}
            </ul>
        </div>
    )
}
export default GroceryStore;
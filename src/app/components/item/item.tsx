import { Item } from "@/app/interfaces/item.interface";
import { useState } from "react";

const GroceryItem = ({groceryItem}) => {
    const [groceryItems, setGroceryItems] = useState<Item[]>([]);

    const updateQuantity = (itemId: string, change: number) => {
        const updatedItems = groceryItems.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    quantity: Math.max(1, item.quantity + change)
                };
            }
            return item;
        });

        setGroceryItems(updatedItems);
        localStorage.setItem('groceryItems', JSON.stringify(updatedItems));
    };
    const toggleComplete = (itemId: string) => {
        const updatedItems = groceryItems.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    completed: !item.completed
                };
            }
            return item;
        });

        setGroceryItems(updatedItems);
        localStorage.setItem('groceryItems', JSON.stringify(updatedItems));
    };

    return (
        <div>
            <input
                type="checkbox"
                checked={groceryItem.completed}
                onChange={() => toggleComplete(groceryItem.id)}
            />
            <span>{groceryItem.name}</span>
            <div className="quantity">
                <button onClick={() => updateQuantity(groceryItem.id, -1)}>-</button>
                <span>{groceryItem.quantity}</span>
                <button onClick={() => updateQuantity(groceryItem.id, 1)}>+</button>
            </div>
        </div>
    )
}

export default GroceryItem;
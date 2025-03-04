'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Plus, ShoppingBag, Store } from "lucide-react";
import { useState } from "react";

const ActionBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleAddStore = () => {
        console.log('Add store clicked');
        setIsMenuOpen(false);
        // Add your store logic here
    };

    const handleAddItem = () => {
        console.log('Add item clicked');
        setIsMenuOpen(false);
        // Add your item logic here
    };

    return (
        <div className="relative">

            {/* Fixed bottom navbar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex items-center justify-center z-20">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">
                            <Plus size={24} className='text-blue-500' />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full">
                        <Button
                            variant="outline"
                            onClick={handleAddStore}
                            className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-300 transition-colors"
                        >
                            <Store size={20} className="mr-3 text-blue-500" />
                            <span>Add Store</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleAddItem}
                            className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-300 transition-colors"
                        >
                            <ShoppingBag size={20} className="mr-3 text-green-500" />
                            <span>Add Item</span>
                        </Button>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

export default ActionBar;
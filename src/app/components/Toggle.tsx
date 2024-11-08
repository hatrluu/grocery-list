'use client'
import { useState } from 'react';

const Toggle = ({ label = "Toggle", defaultChecked = false}) => {
    const [isLightMode, setIsLightMode] = useState(defaultChecked);

    const handleToggle = () => {
        const newValue = !isLightMode;
        setIsLightMode(newValue);
        if(isLightMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <div className="flex items-center gap-4">
            {label && <span className="text-sm font-medium text-black dark:text-gray-300">{label}</span>}
            <button
                role="switch"
                aria-checked={isLightMode}
                onClick={handleToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLightMode ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isLightMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );
};

export default Toggle;
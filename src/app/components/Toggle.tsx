'use client'
import { MoonIcon, SunIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const Toggle = ({ isToggle = true, label, labelPosition }: { isToggle: boolean; label?: string, labelPosition?: 'left' | 'right' }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    useEffect(() => {
        const getPreferTheme = () => {
            if (typeof window !== 'undefined') {
                return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            return false;
        };
        setIsDarkTheme(getPreferTheme());
    }, []);

    useEffect(() => {
        if(isDarkTheme) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkTheme]);

    const handleToggle = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    return (
        <div className="flex items-center gap-4">
            {label && labelPosition == 'left' && <span className="text-sm font-medium text-black dark:text-gray-300">{label}</span>}
            {isToggle ? 
                <>
                    <button
                        role="switch"
                        aria-checked={isDarkTheme}
                        onClick={handleToggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDarkTheme ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkTheme ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </>
                :
                <div className="dark:text-white" onClick={handleToggle}>
                    {isDarkTheme ? 
                        <MoonIcon data-tooltip-target="tooltip-default"></MoonIcon> :
                        <SunIcon data-tooltip-target="tooltip-default"></SunIcon>
                    }
                    <div id="tooltip-default" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                        Tooltip content
                        <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                </div>
            }
            {label && labelPosition == 'right' && <span className="text-sm font-medium text-black dark:text-gray-300">{label}</span>}
        </div>
    );
};

export default Toggle;
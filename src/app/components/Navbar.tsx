import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import Toggle from "./Toggle";

const Navbar = () => {
    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link
                    href="/"
                    className="flex items-center space-x-3 rtl:space-x-reverse"
                >
                    <ShoppingBagIcon size={32} className="dark:text-white"></ShoppingBagIcon>
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">MyList</span>
                </Link>
                <div className="m-2">
                    <Toggle isToggle={false}></Toggle>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;

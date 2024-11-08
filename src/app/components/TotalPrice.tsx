import { useState } from "react"

const TotalPrice = ({currentPrice, onTotalPriceChange}: {currentPrice: any, onTotalPriceChange: any}) => {
    const [totalPrice, setTotalPrice] = useState(currentPrice);
    const handleOnChange = (value:string) => {
        setTotalPrice(value)
        onTotalPriceChange(value);
    }
    return (
        <input type="number"
            name="total_price"
            value={totalPrice}
            placeholder="Total Price"
            className="rounded-md border border-gray-300 px-4 py-2
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        dark:bg-slate-800 dark:border-gray-600 dark:text-gray-400"
            onChange={(e) => {handleOnChange(e.target.value)}}
            />
    )
}
export default TotalPrice
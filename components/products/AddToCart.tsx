'use client'

import useCartService from "@/lib/hooks/useCartStore"
import { OrderItem } from "@/lib/models/OrderModel"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AddToCart({ item }: { item: OrderItem }) {
    const router = useRouter()
    const { items, increase, decrease } = useCartService()
    const [existItem, setExistItem] = useState<OrderItem | undefined>()

    useEffect(() => {
        setExistItem(items.find((x) => x.slug === item.slug))
    }, [item, items])

    const addToCartHandler = () => {
        increase(item)
    }

    return existItem ? (
        <div className="flex items-center gap-4 justify-center">
            <button
                className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out uppercase text-sm tracking-widest"
                onClick={() => { decrease(existItem) }}
            >
                -
            </button>
            <span className="text-lg uppercase tracking-tighter">{existItem.qty}</span>
            <button
                className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out uppercase text-sm tracking-widest"
                onClick={() => increase(existItem)}
            >
                +
            </button>
        </div>
    ) : (
        <button
            className="bg-black text-white py-3 px-6 uppercase text-sm tracking-widest hover:bg-white hover:text-black hover:outline  hover:outline-black transition-all duration-200 ease-in-out w-full"
            type="button"
            onClick={addToCartHandler}
        >
            "ADD TO CART"
        </button>
    )
}
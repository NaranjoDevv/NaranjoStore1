'use client'

import useCartService from "@/lib/hooks/useCartStore";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/formatPrice";

export default function CartDetails() {
    const router = useRouter();
    const { items, itemsPrice, taxPrice, shippingPrice, totalPrice, decrease, increase, removeItem } = useCartService();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, [])

    if (!mounted) return <></>

    return (
        <div className="py-4 md:py-8 font-mono tracking-tighter">
            <h1 className="text-2xl md:text-3xl uppercase mb-4 md:mb-8">"YOUR CART"</h1>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 md:py-12">
                    <p className="text-lg md:text-xl uppercase mb-6 md:mb-8">"YOUR CART IS EMPTY"</p>
                    <Link
                        href="/"
                        className="bg-black text-white py-3 px-6 uppercase text-sm tracking-widest hover:bg-white hover:text-black hover:outline hover:outline-black transition-all duration-200 ease-in-out"
                    >
                        "CONTINUE SHOPPING"
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                    <div className="lg:col-span-2">
                        <div className="border-b border-gray-200 pb-2 mb-4 uppercase text-sm tracking-widest grid grid-cols-12 gap-2 md:gap-4 hidden md:grid">
                            <div className="col-span-6">PRODUCT</div>
                            <div className="col-span-2 text-center">QUANTITY</div>
                            <div className="col-span-2 text-center">PRICE</div>
                            <div className="col-span-2 text-center">TOTAL</div>
                        </div>

                        {/* Versión móvil con diseño de tarjetas */}
                        <div className="md:hidden">
                            {items.map((item) => (
                                <div key={item.variantId || item.slug} className="border border-gray-200 rounded-sm p-4 mb-4 shadow-sm">
                                    <div className="flex gap-3 items-center mb-3">
                                        <div className="w-16 h-16 bg-gradient-to-b from-white to-gray-300 p-1">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={64}
                                                height={64}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Link
                                                href={`/product/${item.slug}`}
                                                className="font-medium hover:line-through transition-all duration-200 ease-in-out"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="text-xs uppercase tracking-widest mt-1">
                                                {item.color || 'Default'} | {item.size || 'One Size'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="uppercase text-xs text-gray-500">Price:</span>
                                            <div className="font-medium">${formatPrice(item.price)}</div>
                                        </div>
                                        <div>
                                            <span className="uppercase text-xs text-gray-500">Total:</span>
                                            <div className="font-medium">${formatPrice(item.price * item.qty)}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={() => decrease(item)}
                                                disabled={item.qty <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="w-6 text-center">{item.qty}</span>
                                            <button
                                                className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={() => increase(item)}
                                                disabled={item.qty >= 10}
                                            >
                                                +
                                            </button>
                                        </div>
                                        
                                        <button
                                            onClick={() => removeItem(item)}
                                            className="text-sm uppercase tracking-widest hover:text-red-500 transition-all duration-200 ease-in-out"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Versión desktop (tabla) */}
                        <div className="hidden md:block">
                            {items.map((item) => (
                                <div key={item.variantId || item.slug} className="grid grid-cols-12 gap-4 py-4 border-b border-gray-200">
                                    <div className="col-span-6 flex gap-4 items-center">
                                        <div className="w-20 h-20 bg-gradient-to-b from-white to-gray-300 p-1">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={80}
                                                height={80}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <Link
                                                    href={`/product/${item.slug}`}
                                                    className="hover:line-through transition-all duration-200 ease-in-out"
                                                >
                                                    {item.name}
                                                </Link>
                                            </div>
                                            <p className="text-xs uppercase tracking-widest mt-1">
                                                {item.color || 'Default'} | {item.size || 'One Size'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex items-center justify-center gap-2">
                                        <button
                                            className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => decrease(item)}
                                            disabled={item.qty <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center">{item.qty}</span>
                                        <button
                                            className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => increase(item)}
                                            disabled={item.qty >= 10}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="col-span-2 text-center">
                                        <span className="text-lg font-medium">
                                            ${formatPrice(item.price)}
                                        </span>
                                    </div>

                                    <div className="col-span-2 text-center">
                                        <span className="text-lg font-medium">
                                            ${formatPrice(item.price * item.qty)}
                                        </span>
                                    </div>

                                    <div className="col-span-12 flex justify-end mt-2">
                                        <button
                                            onClick={() => removeItem(item)}
                                            className="text-sm uppercase tracking-widest hover:line-through transition-all duration-200 ease-in-out text-gray-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-8">
                                <Link
                                    href="/"
                                    className="uppercase text-sm tracking-widest hover:line-through transition-all duration-200 ease-in-out"
                                >
                                    "CONTINUE SHOPPING"
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 text-black">
                        <div className="bg-gradient-to-b from-white to-gray-200 p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-xl uppercase mb-6 border-b border-gray-200 pb-2">"ORDER SUMMARY"</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="uppercase text-sm tracking-widest">SUBTOTAL</span>
                                    <span>${formatPrice(itemsPrice)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="uppercase text-sm tracking-widest">TAX</span>
                                    <span>${formatPrice(taxPrice)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="uppercase text-sm tracking-widest">SHIPPING</span>
                                    <span>${formatPrice(shippingPrice)}</span>
                                </div>

                                <div className="flex justify-between border-t border-gray-200 pt-4 font-bold">
                                    <span className="uppercase text-sm tracking-widest">TOTAL</span>
                                    <span>${formatPrice(totalPrice)}</span>
                                </div>
                            </div>

                            <button
                                className="w-full mt-8 bg-black text-white py-3 uppercase text-sm tracking-widest hover:bg-white hover:text-black hover:outline  hover:outline-black transition-all duration-200 ease-in-out"
                                onClick={() => { router.push("/shipping") }}
                            >
                                "CHECKOUT"
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
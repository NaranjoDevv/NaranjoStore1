'use client'

import useCartService from "@/lib/hooks/useCartStore";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/formatPrice";

export default function CartDetails() {
    const router = useRouter();
    const { items, itemsPrice, taxPrice, shippingPrice, totalPrice, decrease, increase } = useCartService();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, [])

    if (!mounted) return <></>

    return (
        <div className="py-8 font-mono tracking-tighter">
            <h1 className="text-3xl uppercase mb-8">"YOUR CART"</h1>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-xl uppercase mb-8">"YOUR CART IS EMPTY"</p>
                    <Link
                        href="/"
                        className="bg-black text-white py-3 px-6 uppercase text-sm tracking-widest hover:bg-white hover:text-black hover:outline hover:outline-2 hover:outline-black transition-all duration-200 ease-in-out"
                    >
                        "CONTINUE SHOPPING"
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="border-b border-gray-200 pb-2 mb-4 uppercase text-sm tracking-widest grid grid-cols-12 gap-4">
                            <div className="col-span-6">PRODUCT</div>
                            <div className="col-span-2 text-center">QUANTITY</div>
                            <div className="col-span-2 text-center">PRICE</div>
                            <div className="col-span-2 text-center">TOTAL</div>
                        </div>

                        {items.map((item) => (
                            <div key={item.slug} className="grid grid-cols-12 gap-4 py-4 border-b border-gray-200 items-center">
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
                                    <div>
                                        <Link
                                            href={`/product/${item.slug}`}
                                            className="hover:line-through transition-all duration-200 ease-in-out"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="text-xs uppercase tracking-widest mt-1">{item.color || 'Default'} | {item.size || 'One Size'}</p>
                                    </div>
                                </div>

                                <div className="col-span-2 flex items-center justify-center gap-2">
                                    <button
                                        className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 ease-in-out"
                                        onClick={() => decrease(item)}
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center">{item.qty}</span>
                                    <button
                                        className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 ease-in-out"
                                        onClick={() => increase(item)}
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="col-span-2 text-center">
                                    ${formatPrice(item.price)}
                                </div>

                                <div className="col-span-2 text-center">
                                    ${formatPrice(item.price * item.qty)}
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
                                className="w-full mt-8 bg-black text-white py-3 uppercase text-sm tracking-widest hover:bg-white hover:text-black hover:outline hover:outline-2 hover:outline-black transition-all duration-200 ease-in-out"
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
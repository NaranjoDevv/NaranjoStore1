'use client'

import data from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import ZoomableImage from "@/lib/ZoomableImage";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductDetails() {
    const { slug } = useParams(); // <- usa el hook para acceder a params
    const [isMediumScreen, setIsMediumScreen] = useState(false);

    const product = data.products.find((x) => x.slug === slug);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMediumScreen(window.innerWidth >= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="p-8 max-w-md w-full font-mono tracking-tighter">
                    <h2 className="text-2xl uppercase mb-4 text-center">
                        PRODUCT NOT FOUND
                    </h2>
                    <div className="flex justify-center mt-8">
                        <Link
                            href="/"
                            className="uppercase text-sm tracking-widest hover:line-through transition-all duration-200 ease-in-out"
                        >
                            BACK TO PRODUCTS
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 font-mono tracking-tighter">
            <div className="mb-8">
                <Link href={"/"} className="uppercase text-sm tracking-widest hover:line-through transition-all duration-200 ease-in-out">
                    BACK TO PRODUCTS
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {isMediumScreen ? (
                    <ZoomableImage
                        src={product.image}
                        alt={product.name}
                        width={640}
                        height={640}
                    />
                ) : (
                    <div className="relative bg-gradient-to-b from-white to-gray-300 p-4">
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={640}
                            height={640}
                            className="object-cover w-full aspect-square"
                        />
                    </div>
                )}

                <div className="space-y-8">
                    {/* Sección superior: Nombre, categoría y marca */}
                    <div className="border-b border-gray-200 pb-6">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl uppercase">"{product.name}"</h1>
                            <span className="uppercase text-xs tracking-widest bg-black text-white px-3 py-1">
                                "{product.category}"
                            </span>
                        </div>
                        <p className="uppercase text-sm tracking-widest">"{product.brand}"</p>
                    </div>

                    {/* Sección de precio */}
                    <div className="text-3xl font-light">"${product.price}"</div>

                    {/* Sección de colores */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-sm uppercase tracking-widest mb-4">"COLORS"</h3>
                        <div className="flex gap-2">
                            {['#000000', '#FFFFFF', '#FF0000', '#0000FF'].map((color, index) => (
                                <div
                                    key={index}
                                    className="w-8 h-8 border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Sección de tallas */}
                    <div className="pt-2">
                        <h3 className="text-sm uppercase tracking-widest mb-4">"SIZES"</h3>
                        <div className="flex flex-wrap gap-2">
                            {['S', 'M', 'L', 'XL'].map((size, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 border border-gray-300 cursor-pointer hover:bg-white hover:text-black transition-all duration-200 ease-in-out uppercase text-xs tracking-widest"
                                >
                                    {size}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sección de descripción */}
                    <div className="border-t border-gray-200 pt-6">
                        <h2 className="text-xl uppercase mb-4">"DESCRIPTION"</h2>
                        <p className="text-white">"{product.description}"</p>
                    </div>

                    {/* Sección de stock y reviews */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
                        {/* Stock */}
                        <div>
                            <h3 className="text-sm uppercase tracking-widest mb-4">"AVAILABILITY"</h3>
                            <div className={`inline-block text-sm uppercase tracking-widest ${product.countInStock > 0 ? 'text-white' : 'text-red-500'} border border-gray-300 px-4 py-2`}>
                                "{product.countInStock > 0 ? `${product.countInStock} IN STOCK` : 'OUT OF STOCK'}"
                            </div>
                        </div>

                        {/* Reviews */}
                        <div>
                            <h3 className="text-sm uppercase tracking-widest mb-4">"REVIEWS"</h3>
                            <div className="border border-gray-300 p-4 inline-block">
                                <div className="flex items-center gap-4">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-xl ${i < Math.floor(product.rating) ? 'text-white' : 'text-gray-500'}`}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-sm uppercase tracking-widest text-white">
                                        "{product.numReviews} REVIEWS"
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botón de añadir al carrito */}
                    {product.countInStock > 0 && (
                        <div className="pt-6 border-t border-gray-200">
                            <button className="bg-black text-white py-3 px-6 uppercase text-sm tracking-widest hover:bg-white hover:text-black hover:outline hover:outline-2 hover:outline-black transition-all duration-200 ease-in-out w-full">
                                "ADD TO CART"
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

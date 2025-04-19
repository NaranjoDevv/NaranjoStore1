'use client'

import data from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import ZoomableImage from "@/lib/ZoomableImage";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AddToCart from "@/components/products/AddToCart";
import { formatPrice } from "@/lib/formatPrice";
import { OrderItem } from "@/lib/models/OrderModel";
import useCartService from "@/lib/hooks/useCartStore";

export default function ProductDetails() {
    const { slug } = useParams();
    const [isMediumScreen, setIsMediumScreen] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const { findCartItem } = useCartService();

    const product = data.products.find((x) => x.slug === slug);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMediumScreen(window.innerWidth >= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        // Establecer valores predeterminados para color y talla
        if (product) {
            if (product.colors && product.colors.length > 0) {
                setSelectedColor(product.colors[0]);
            }
            if (product.sizes && product.sizes.length > 0) {
                setSelectedSize(product.sizes[0]);
            }
        }

        return () => window.removeEventListener('resize', checkScreenSize);
    }, [product]);

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

    // Crear el item para el carrito con la variante seleccionada
    const cartItem: OrderItem = {
        name: product.name,
        slug: product.slug,
        qty: 1,
        image: product.image,
        price: product.price,
        color: selectedColor,
        size: selectedSize,
        variantId: `${product.slug}-${selectedColor || 'default'}-${selectedSize || 'onesize'}`
    };

    // Verificar si esta variante ya está en el carrito
    const existingItem = findCartItem(product.slug, selectedColor, selectedSize);

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
                    <div className="text-3xl font-light">"${formatPrice(product.price)}"</div>

                    {/* Sección de colores */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-sm uppercase tracking-widest mb-4">"COLORS"</h3>
                            <div className="flex gap-2">
                                {product.colors.map((color, index) => (
                                    <div
                                        key={index}
                                        className={`w-8 h-8 border cursor-pointer transition-all duration-200 ${
                                            selectedColor === color 
                                                ? 'border-black ring-1 ring-black' 
                                                : 'border-gray-300 hover:scale-110'
                                        }`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setSelectedColor(color)}
                                        title={color}
                                    />
                                ))}
                            </div>
                            <p className="text-xs uppercase tracking-widest mt-2">
                                "SELECTED: {selectedColor || 'NONE'}"
                            </p>
                        </div>
                    )}

                    {/* Sección de tallas */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="pt-2">
                            <h3 className="text-sm uppercase tracking-widest mb-4">"SIZES"</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size, index) => (
                                    <div
                                        key={index}
                                        className={`w-10 h-10 border flex items-center justify-center cursor-pointer transition-all duration-200 ${
                                            selectedSize === size 
                                                ? 'border-black bg-black text-white' 
                                                : 'border-gray-300 hover:bg-gray-100'
                                        }`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs uppercase tracking-widest mt-2">
                                "SELECTED: {selectedSize || 'NONE'}"
                            </p>
                        </div>
                    )}

                    {/* Sección de descripción */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-sm uppercase tracking-widest mb-4">"DESCRIPTION"</h3>
                        <p className="text-sm leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Botón de añadir al carrito */}
                    <div className="pt-6">
                        <AddToCart item={cartItem} existingItem={existingItem} />
                    </div>
                </div>
            </div>
        </div>
    );
}

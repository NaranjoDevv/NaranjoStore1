import { Product } from "@/lib/models/ProductModel";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";

export default function ProductItem({ product }: { product: Product }) {
    return (
        <div className="relative bg-gradient-to-b from-white to-gray-400 hover:from-gray-900 hover:to-black hover:text-white transition-all duration-300 ease-in-out p-4 group hover:transform hover:translate-y-[-5px] hover:outline  hover:outline-white hover:outline-offset-4">
            <figure className="relative overflow-hidden">
                <Link href={`/product/${product.slug}`}>
                    <div className="aspect-square overflow-hidden">
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={300}
                            height={300}
                            className="object-cover w-full h-full transition-all duration-300 ease-in-out group-hover:scale-[1.03]"
                        />
                    </div>
                </Link>
            </figure>
            <div className="mt-4 font-mono">
                <div className="flex justify-between items-start">
                    <Link href={`/product/${product.slug}`}>
                        <h2 className="text-xl tracking-tighter hover:line-through transition-all duration-200 ease-in-out text-black group-hover:text-white">
                            "{product.name}"
                        </h2>
                    </Link>
                    <span className="uppercase text-xs tracking-widest bg-black text-white group-hover:bg-white group-hover:text-black px-2 py-1">
                        "{product.category}"
                    </span>
                </div>




                <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-light text-black group-hover:text-white">
                        "${formatPrice(product.price)}"
                    </span>

                    <span className={`text-xs uppercase tracking-widest ${product.countInStock > 0 ? 'text-black group-hover:text-white' : 'text-red-500 group-hover:text-red-300'}`}>
                        "{product.countInStock > 0 ? `${product.countInStock} IN STOCK` : 'OUT OF STOCK'}"
                    </span>
                </div>
            </div>
        </div>
    )
}
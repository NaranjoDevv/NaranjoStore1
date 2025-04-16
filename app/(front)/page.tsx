import ProductItem from "@/components/products/ProductItem";
import data from "@/lib/data";
import productService from "@/lib/services/productService";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: process.env.NEXT_PUBLIC_APP_DESC || 'NextJS, Server Components , Next Auth , Zustand , DaisyUI',
}

export default async function Home() {

  const featuredProducts = await productService.getFeatured()
  const latestProducts = await productService.getLatestProducts()

  return (
    <>
      <h2 className="text-3xl py-8 font-mono tracking-tighter uppercase">
        "LATEST PRODUCTS"
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {latestProducts.map((product) => <ProductItem key={product.slug} product={product} />)}
      </div>
    </>
  );
}

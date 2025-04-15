import ProductItem from "@/components/products/ProductItem";
import data from "@/lib/data";

export default function Home() {
  return (
    <>
      <h2 className="text-3xl py-8 font-mono tracking-tighter uppercase">
        "LATEST PRODUCTS"
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.products.map((product) => <ProductItem key={product.slug} product={product} />)}
      </div>
    </>
  );
}

import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export const metadata = {
  title: "Shop",
  description: "Browse the full Vercel Merch Co. collection.",
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
      <p className="mt-2 text-neutral-400">
        Everything you need to represent the modern web.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

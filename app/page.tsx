import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default function Home() {
  const featured = getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0070F3]/20 blur-[120px]" />
        </div>

        <div className="relative">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-[#0070F3]">
            Vercel Merch Co.
          </p>
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Ship merch.
            <br />
            <span className="text-[#0070F3]">Ship fast.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg text-neutral-400">
            Premium gear for developers who deploy on Fridays and live on the edge.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-105"
            >
              Browse the Shop
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured</h2>
          <Link
            href="/shop"
            className="text-sm text-neutral-400 transition-colors hover:text-white"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

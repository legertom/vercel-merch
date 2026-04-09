import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group rounded-xl border border-white/10 bg-neutral-950 transition-all hover:border-white/20 hover:bg-neutral-900"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-neutral-900">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-white">{product.name}</h3>
        <p className="mt-1 text-sm text-neutral-400">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

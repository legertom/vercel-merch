"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "./cart-provider";
import type { Product } from "@/lib/products";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[1] ?? ""
  );
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: selectedSize || undefined,
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="space-y-4">
      {product.sizes && (
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-400">
            Size
          </label>
          <div className="flex gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? "border-[#0070F3] bg-[#0070F3]/10 text-[#0070F3]"
                    : "border-white/10 text-neutral-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleAdd}
        disabled={product.sizes && !selectedSize}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
      >
        {added ? (
          <>
            <Check className="h-4 w-4" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}

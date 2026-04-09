"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/utils";
import { createCheckoutSession } from "@/actions/checkout";
import { useState } from "react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const result = await createCheckoutSession(items);
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-32 text-center">
        <ShoppingBag className="h-16 w-16 text-neutral-600" />
        <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-neutral-400">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-105"
        >
          Browse the Shop
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>

      <div className="mt-10 divide-y divide-white/10">
        {items.map((item) => {
          const key = item.size ? `${item.id}:${item.size}` : item.id;
          return (
            <div key={key} className="flex gap-4 py-6 sm:gap-6">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 bg-neutral-950 sm:h-32 sm:w-32">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <Link
                      href={`/shop/${item.slug}`}
                      className="font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    {item.size && (
                      <p className="mt-0.5 text-sm text-neutral-400">
                        Size: {item.size}
                      </p>
                    )}
                  </div>
                  <p className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-white/10">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.quantity - 1)
                      }
                      className="px-3 py-1.5 text-neutral-400 transition-colors hover:text-white"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.quantity + 1)
                      }
                      className="px-3 py-1.5 text-neutral-400 transition-colors hover:text-white"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id, item.size)}
                    className="text-neutral-500 transition-colors hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="mt-8 border-t border-white/10 pt-8">
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#0070F3] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#0060df] disabled:opacity-60"
        >
          {loading ? "Redirecting..." : "Proceed to Checkout"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
        <p className="mt-3 text-center text-xs text-neutral-500">
          Powered by Stripe &middot; Test mode
        </p>
      </div>
    </div>
  );
}

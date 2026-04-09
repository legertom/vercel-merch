"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./cart-provider";

export function Nav() {
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="text-[#0070F3] text-xl">&#9650;</span>
          <span>Vercel Merch Co.</span>
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="/shop"
            className="text-sm text-neutral-400 transition-colors hover:text-white"
          >
            Shop
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-1 text-sm text-neutral-400 transition-colors hover:text-white"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-2.5 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0070F3] text-[11px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

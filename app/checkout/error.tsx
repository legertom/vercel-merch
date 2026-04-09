"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function CheckoutError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h1 className="mt-6 text-2xl font-bold">Something went wrong</h1>
      <p className="mt-3 text-neutral-400">
        There was an issue processing your checkout. Please try again.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/5"
        >
          Try Again
        </button>
        <Link
          href="/cart"
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
        >
          Return to Cart
        </Link>
      </div>
    </div>
  );
}

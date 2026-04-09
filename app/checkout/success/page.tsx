import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { stripe } from "@/lib/stripe";

export const metadata = {
  title: "Order Confirmed",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  let session = null;

  if (session_id) {
    try {
      session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items"],
      });
    } catch {
      // Session not found — still show a generic success page
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle className="h-8 w-8 text-emerald-500" />
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        Thank you for your order!
      </h1>
      <p className="mt-3 text-neutral-400">
        Your order has been confirmed and will be shipped soon. We&apos;ll send
        you an email with tracking details.
      </p>

      {session && (
        <div className="mt-8 w-full rounded-xl border border-white/10 bg-neutral-950 p-6 text-left">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Order Summary
          </h2>
          <div className="mt-4 space-y-3">
            {session.line_items?.data.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-neutral-300">
                  {item.description}{" "}
                  <span className="text-neutral-500">x{item.quantity}</span>
                </span>
                <span className="font-medium">
                  ${((item.amount_total ?? 0) / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>
                ${((session.amount_total ?? 0) / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 flex gap-4">
        <Link
          href="/shop"
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-105"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

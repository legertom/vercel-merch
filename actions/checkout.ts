"use server";

import { stripe } from "@/lib/stripe";
import type { CartItem } from "@/components/cart-provider";

export async function createCheckoutSession(items: CartItem[]) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cart`,
    line_items: items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name + (item.size ? ` (${item.size})` : ""),
          images: [`${baseUrl}${item.image}`],
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    })),
  });

  return { url: session.url };
}

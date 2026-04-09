import { streamText, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export const runtime = "edge";

const catalog = products
  .map(
    (p) =>
      `- ${p.name}: ${p.description} Price: ${formatPrice(p.price)}.${
        p.sizes ? ` Sizes: ${p.sizes.join(", ")}.` : ""
      } Category: ${p.category}.`
  )
  .join("\n");

const systemPrompt = `You are a friendly and helpful shopping assistant for Vercel Merch Co., the official merch store for developers who love Vercel, Next.js, and modern web development.

You know the full product catalog and can help customers:
- Find products that match what they're looking for
- Recommend gifts for developer friends
- Answer questions about sizing, materials, and shipping
- Share enthusiasm about the Vercel ecosystem

Keep responses concise, friendly, and on-brand. Use developer humor when appropriate. If someone asks about actual Vercel products (the platform, not the merch), you can briefly explain but redirect to the merch store.

Product catalog:
${catalog}

Shipping: Free shipping on orders over $50. Standard shipping is $5.99 (3-5 business days). Express shipping is $12.99 (1-2 business days).

Returns: 30-day return policy. Items must be unworn with tags attached. Stickers are non-refundable.

When recommending products, mention specific product names and prices. Be enthusiastic but not pushy.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toTextStreamResponse();
}

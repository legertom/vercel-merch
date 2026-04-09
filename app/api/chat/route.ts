import { streamText, convertToModelMessages, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import {
  createConversation,
  getConversation,
  addMessage,
  addFeedback,
  updateConversation,
} from "@/lib/db";
import { sendFeedbackNotification } from "@/lib/email";

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

When recommending products, mention specific product names and prices. Be enthusiastic but not pushy.

IMPORTANT — FEEDBACK DETECTION:
When a user does any of the following, you should acknowledge it AND call the saveFeedback tool:

1. **Product requests** — asks for a product we don't carry ("do you have laptop sleeves?", "I wish you had Next.js socks")
   → Respond warmly: "We don't have that yet, but that's a great idea! I've passed it along to the team."
   → Call saveFeedback with type: "product_request"

2. **Feature feedback** — suggests improvements to the store or products ("the checkout is slow", "would be cool if you had gift cards")
   → Acknowledge: "Thanks for the feedback! I've noted that for the team."
   → Call saveFeedback with type: "feature_feedback"

3. **Complaints** — expresses frustration or a problem ("this is confusing", "I can't find what I need")
   → Be empathetic: "I'm sorry about that. Let me help, and I've flagged this for the team to improve."
   → Call saveFeedback with type: "complaint"

4. **Compliments** — says something positive ("love this store", "great design")
   → Thank them: "That means a lot, thank you!"
   → Call saveFeedback with type: "compliment"

Always be natural about it. Don't make the user feel like they're filling out a feedback form.`;

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, conversationId } = body;

  // Ensure conversation exists
  if (conversationId && !getConversation(conversationId)) {
    createConversation(conversationId, req.headers.get("user-agent") ?? undefined);
  }

  // Save the latest user message
  const lastMessage = messages[messages.length - 1];
  if (conversationId && lastMessage?.role === "user") {
    const textPart = lastMessage.parts?.find((p: { type: string }) => p.type === "text");
    const content = textPart?.text || "";
    if (content) {
      addMessage({
        id: lastMessage.id || crypto.randomUUID(),
        conversation_id: conversationId,
        role: "user",
        content,
      });
    }
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools: {
      saveFeedback: tool({
        description:
          "Save user feedback, product requests, complaints, or compliments. Call this whenever the user provides feedback or requests a product we do not carry.",
        inputSchema: z.object({
          type: z.enum([
            "product_request",
            "feature_feedback",
            "complaint",
            "compliment",
            "general",
          ]),
          content: z.string().describe("A concise summary of the feedback"),
          originalMessage: z.string().describe("The user's exact message"),
          productMentioned: z
            .string()
            .optional()
            .describe("If they mentioned a specific product idea, what was it"),
        }),
        execute: async ({ type, content, originalMessage, productMentioned }) => {
          const fbId = crypto.randomUUID();
          const convId = conversationId || "unknown";

          addFeedback({
            id: fbId,
            conversation_id: convId,
            type,
            content,
            original_message: originalMessage,
            product_mentioned: productMentioned ?? null,
          });

          // Send email notification (non-blocking)
          sendFeedbackNotification({
            type,
            content,
            originalMessage,
            productMentioned,
            conversationId: convId,
          }).catch(() => {});

          return { saved: true, feedbackId: fbId };
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}

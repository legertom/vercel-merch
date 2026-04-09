import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendFeedbackNotification(feedback: {
  type: string;
  content: string;
  originalMessage: string;
  productMentioned?: string;
  conversationId: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !process.env.RESEND_API_KEY) return;

  const typeEmoji: Record<string, string> = {
    product_request: "🛍️",
    feature_feedback: "💡",
    complaint: "⚠️",
    compliment: "💚",
    general: "💬",
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    await resend.emails.send({
      from: "Vercel Merch Co <onboarding@resend.dev>",
      to: adminEmail,
      subject: `${typeEmoji[feedback.type] || "💬"} New ${feedback.type.replace("_", " ")} from customer`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px;">
          <h2 style="color: #0070F3;">▲ Vercel Merch Co — Customer Feedback</h2>
          <p><strong>Type:</strong> ${feedback.type.replace("_", " ")}</p>
          <p><strong>Summary:</strong> ${feedback.content}</p>
          <p><strong>Original message:</strong> "${feedback.originalMessage}"</p>
          ${feedback.productMentioned ? `<p><strong>Product mentioned:</strong> ${feedback.productMentioned}</p>` : ""}
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 14px;">
            <a href="${baseUrl}/admin/conversations/${feedback.conversationId}">
              View full conversation →
            </a>
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send feedback email:", err);
  }
}

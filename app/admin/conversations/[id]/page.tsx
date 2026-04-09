import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getConversation, getMessages, getFeedbackForConversation } from "@/lib/db";

export const dynamic = "force-dynamic";

const typeColors: Record<string, string> = {
  product_request: "text-blue-400 bg-blue-400/10",
  feature_feedback: "text-yellow-400 bg-yellow-400/10",
  complaint: "text-red-400 bg-red-400/10",
  compliment: "text-emerald-400 bg-emerald-400/10",
  general: "text-neutral-400 bg-neutral-400/10",
};

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversation = getConversation(id);
  if (!conversation) notFound();

  const messages = getMessages(id);
  const feedback = getFeedbackForConversation(id);

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/conversations"
        className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to conversations
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">
            Conversation {id.slice(0, 8)}...
          </h1>
          <p className="mt-1 text-xs text-neutral-500">
            Started {new Date(conversation.started_at).toLocaleString()} &middot;{" "}
            {conversation.message_count} messages
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Chat thread */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-sm text-neutral-500">No messages recorded.</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#0070F3] text-white"
                          : "bg-white/5 text-neutral-300"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar — feedback */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Extracted Feedback
          </h2>
          <div className="mt-3 space-y-3">
            {feedback.length === 0 ? (
              <p className="text-xs text-neutral-500">
                No feedback from this conversation.
              </p>
            ) : (
              feedback.map((fb) => (
                <div
                  key={fb.id}
                  className="rounded-lg border border-white/5 bg-neutral-950 p-3"
                >
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeColors[fb.type]}`}
                  >
                    {fb.type.replace("_", " ")}
                  </span>
                  <p className="mt-2 text-sm text-neutral-300">{fb.content}</p>
                  {fb.product_mentioned && (
                    <p className="mt-1 text-xs text-blue-400">
                      Product: {fb.product_mentioned}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

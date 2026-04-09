import Link from "next/link";
import { getConversations } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function ConversationsPage() {
  const conversations = getConversations();

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold">Conversations</h1>
      <p className="mt-1 text-sm text-neutral-400">
        All chatbot conversations.
      </p>

      <div className="mt-6 space-y-2">
        {conversations.length === 0 ? (
          <p className="py-12 text-center text-sm text-neutral-500">
            No conversations yet.
          </p>
        ) : (
          conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/admin/conversations/${conv.id}`}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-neutral-950 p-4 transition-colors hover:border-white/10"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {conv.id.slice(0, 8)}...
                  </span>
                  {conv.has_feedback && (
                    <span className="rounded-full bg-blue-400/10 px-2 py-0.5 text-[10px] text-blue-400">
                      has feedback
                    </span>
                  )}
                  {conv.has_product_request && (
                    <span className="rounded-full bg-yellow-400/10 px-2 py-0.5 text-[10px] text-yellow-400">
                      product request
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      conv.status === "new"
                        ? "bg-white/10 text-white"
                        : conv.status === "reviewed"
                          ? "bg-blue-400/10 text-blue-400"
                          : "bg-emerald-400/10 text-emerald-400"
                    }`}
                  >
                    {conv.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  {conv.message_count} messages &middot;{" "}
                  {new Date(conv.started_at).toLocaleString()}
                </p>
                {conv.summary && (
                  <p className="mt-1 text-xs text-neutral-400 line-clamp-1">
                    {conv.summary}
                  </p>
                )}
              </div>
              <span className="text-xs text-neutral-600">&rarr;</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

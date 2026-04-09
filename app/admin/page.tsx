import Link from "next/link";
import { MessageSquare, ThumbsUp, ShoppingBag, AlertCircle } from "lucide-react";
import { getStats, getFeedback } from "@/lib/db";

const typeColors: Record<string, string> = {
  product_request: "text-blue-400 bg-blue-400/10",
  feature_feedback: "text-yellow-400 bg-yellow-400/10",
  complaint: "text-red-400 bg-red-400/10",
  compliment: "text-emerald-400 bg-emerald-400/10",
  general: "text-neutral-400 bg-neutral-400/10",
};

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const stats = getStats();
  const recentFeedback = getFeedback().slice(0, 10);

  const statCards = [
    {
      label: "Conversations (7d)",
      value: stats.totalConversations,
      icon: MessageSquare,
    },
    { label: "Total Feedback", value: stats.totalFeedback, icon: ThumbsUp },
    {
      label: "Product Requests",
      value: stats.productRequests,
      icon: ShoppingBag,
    },
    {
      label: "Unreviewed",
      value: stats.unreviewedCount,
      icon: AlertCircle,
    },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Overview of chatbot activity and customer feedback.
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-white/10 bg-neutral-950 p-4"
          >
            <div className="flex items-center gap-2 text-neutral-400">
              <card.icon className="h-4 w-4" />
              <span className="text-xs">{card.label}</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Recent Feedback */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Feedback</h2>
            <Link
              href="/admin/feedback"
              className="text-xs text-neutral-400 hover:text-white"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentFeedback.length === 0 ? (
              <p className="text-sm text-neutral-500">
                No feedback yet. Chat with the bot to generate some!
              </p>
            ) : (
              recentFeedback.map((fb) => (
                <div
                  key={fb.id}
                  className="rounded-lg border border-white/5 bg-neutral-950 p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeColors[fb.type]}`}
                    >
                      {fb.type.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-neutral-600">
                      {new Date(fb.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-300">{fb.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Requested Products */}
        <div>
          <h2 className="text-lg font-semibold">Top Requested Products</h2>
          <div className="mt-4 space-y-2">
            {stats.topRequested.length === 0 ? (
              <p className="text-sm text-neutral-500">
                No product requests yet.
              </p>
            ) : (
              stats.topRequested.map((item, i) => (
                <div
                  key={item.product}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-neutral-950 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-neutral-500">
                      {i + 1}
                    </span>
                    <span className="text-sm text-neutral-300">
                      {item.product}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {item.count} request{item.count !== 1 ? "s" : ""}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Check, X, Eye, MessageSquare } from "lucide-react";
import {
  markFeedbackReviewed,
  markFeedbackActioned,
  dismissFeedback,
} from "@/actions/admin";
import type { Feedback } from "@/lib/db";

const typeColors: Record<string, string> = {
  product_request: "text-blue-400 bg-blue-400/10",
  feature_feedback: "text-yellow-400 bg-yellow-400/10",
  complaint: "text-red-400 bg-red-400/10",
  compliment: "text-emerald-400 bg-emerald-400/10",
  general: "text-neutral-400 bg-neutral-400/10",
};

const statusColors: Record<string, string> = {
  new: "text-white bg-white/10",
  reviewed: "text-blue-400 bg-blue-400/10",
  actioned: "text-emerald-400 bg-emerald-400/10",
  dismissed: "text-neutral-500 bg-neutral-500/10",
};

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  async function loadFeedback() {
    const res = await fetch("/api/admin/feedback");
    const data = await res.json();
    setFeedback(data);
  }

  useEffect(() => {
    loadFeedback();
  }, []);

  async function handleAction(
    id: string,
    action: "reviewed" | "actioned" | "dismissed"
  ) {
    if (action === "reviewed") await markFeedbackReviewed(id);
    else if (action === "actioned") await markFeedbackActioned(id);
    else await dismissFeedback(id);
    loadFeedback();
  }

  const filtered = feedback.filter((fb) => {
    if (typeFilter !== "all" && fb.type !== typeFilter) return false;
    if (statusFilter !== "all" && fb.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold">Feedback</h1>
      <p className="mt-1 text-sm text-neutral-400">
        All customer feedback captured by the chatbot.
      </p>

      {/* Filters */}
      <div className="mt-6 flex gap-3">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-300"
        >
          <option value="all">All types</option>
          <option value="product_request">Product requests</option>
          <option value="feature_feedback">Feature feedback</option>
          <option value="complaint">Complaints</option>
          <option value="compliment">Compliments</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-300"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="actioned">Actioned</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      {/* List */}
      <div className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-neutral-500">
            No feedback found.
          </p>
        ) : (
          filtered.map((fb) => (
            <div
              key={fb.id}
              className="rounded-xl border border-white/5 bg-neutral-950 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeColors[fb.type]}`}
                  >
                    {fb.type.replace("_", " ")}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[fb.status]}`}
                  >
                    {fb.status}
                  </span>
                  <span className="text-[10px] text-neutral-600">
                    {new Date(fb.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-1">
                  {fb.status === "new" && (
                    <>
                      <button
                        onClick={() => handleAction(fb.id, "reviewed")}
                        title="Mark reviewed"
                        className="rounded p-1 text-neutral-500 hover:bg-white/5 hover:text-blue-400"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleAction(fb.id, "actioned")}
                        title="Mark actioned"
                        className="rounded p-1 text-neutral-500 hover:bg-white/5 hover:text-emerald-400"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleAction(fb.id, "dismissed")}
                        title="Dismiss"
                        className="rounded p-1 text-neutral-500 hover:bg-white/5 hover:text-red-400"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                  <a
                    href={`/admin/conversations/${fb.conversation_id}`}
                    title="View conversation"
                    className="rounded p-1 text-neutral-500 hover:bg-white/5 hover:text-white"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
              <p className="mt-2 text-sm font-medium text-neutral-200">
                {fb.content}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Original: &ldquo;{fb.original_message}&rdquo;
              </p>
              {fb.product_mentioned && (
                <p className="mt-1 text-xs text-blue-400">
                  Product: {fb.product_mentioned}
                </p>
              )}
              {fb.admin_notes && (
                <p className="mt-2 text-xs text-neutral-400">
                  Notes: {fb.admin_notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

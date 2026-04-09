"use server";

import { updateFeedback, updateConversation } from "@/lib/db";
import { isAdminAuthenticated } from "./auth";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export async function markFeedbackReviewed(id: string) {
  await requireAdmin();
  updateFeedback(id, { status: "reviewed", reviewed_at: new Date().toISOString() });
}

export async function markFeedbackActioned(id: string) {
  await requireAdmin();
  updateFeedback(id, { status: "actioned", reviewed_at: new Date().toISOString() });
}

export async function dismissFeedback(id: string) {
  await requireAdmin();
  updateFeedback(id, { status: "dismissed", reviewed_at: new Date().toISOString() });
}

export async function addAdminNotes(id: string, notes: string) {
  await requireAdmin();
  updateFeedback(id, { admin_notes: notes });
}

export async function markConversationReviewed(id: string) {
  await requireAdmin();
  updateConversation(id, { status: "reviewed" });
}

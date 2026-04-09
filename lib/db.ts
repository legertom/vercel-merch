import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

export type Conversation = {
  id: string;
  started_at: string;
  ended_at: string | null;
  message_count: number;
  has_feedback: boolean;
  has_product_request: boolean;
  summary: string | null;
  user_agent: string | null;
  status: "new" | "reviewed" | "actioned";
};

export type Message = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};

export type Feedback = {
  id: string;
  conversation_id: string;
  type: "product_request" | "feature_feedback" | "complaint" | "compliment" | "general";
  content: string;
  original_message: string;
  product_mentioned: string | null;
  status: "new" | "reviewed" | "actioned" | "dismissed";
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
};

type Store = {
  conversations: Conversation[];
  messages: Message[];
  feedback: Feedback[];
};

const STORE_PATH = join(process.cwd(), "data", "store.json");

function readStore(): Store {
  try {
    return JSON.parse(readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return { conversations: [], messages: [], feedback: [] };
  }
}

function writeStore(store: Store) {
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

// Conversations
export function createConversation(id: string, userAgent?: string): Conversation {
  const store = readStore();
  const conv: Conversation = {
    id,
    started_at: new Date().toISOString(),
    ended_at: null,
    message_count: 0,
    has_feedback: false,
    has_product_request: false,
    summary: null,
    user_agent: userAgent ?? null,
    status: "new",
  };
  store.conversations.push(conv);
  writeStore(store);
  return conv;
}

export function getConversation(id: string): Conversation | undefined {
  return readStore().conversations.find((c) => c.id === id);
}

export function getConversations(): Conversation[] {
  return readStore().conversations.sort(
    (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
  );
}

export function updateConversation(id: string, updates: Partial<Conversation>) {
  const store = readStore();
  const idx = store.conversations.findIndex((c) => c.id === id);
  if (idx !== -1) {
    store.conversations[idx] = { ...store.conversations[idx], ...updates };
    writeStore(store);
  }
}

// Messages
export function addMessage(msg: Omit<Message, "created_at">): Message {
  const store = readStore();
  const message: Message = { ...msg, created_at: new Date().toISOString() };
  store.messages.push(message);
  // Update conversation message count
  const conv = store.conversations.find((c) => c.id === msg.conversation_id);
  if (conv) conv.message_count += 1;
  writeStore(store);
  return message;
}

export function getMessages(conversationId: string): Message[] {
  return readStore()
    .messages.filter((m) => m.conversation_id === conversationId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

// Feedback
export function addFeedback(fb: Omit<Feedback, "created_at" | "reviewed_at" | "status" | "admin_notes">): Feedback {
  const store = readStore();
  const feedback: Feedback = {
    ...fb,
    status: "new",
    admin_notes: null,
    created_at: new Date().toISOString(),
    reviewed_at: null,
  };
  store.feedback.push(feedback);
  // Mark conversation as having feedback
  const conv = store.conversations.find((c) => c.id === fb.conversation_id);
  if (conv) {
    conv.has_feedback = true;
    if (fb.type === "product_request") conv.has_product_request = true;
  }
  writeStore(store);
  return feedback;
}

export function getFeedback(): Feedback[] {
  return readStore().feedback.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getFeedbackForConversation(conversationId: string): Feedback[] {
  return readStore().feedback.filter((f) => f.conversation_id === conversationId);
}

export function updateFeedback(id: string, updates: Partial<Feedback>) {
  const store = readStore();
  const idx = store.feedback.findIndex((f) => f.id === id);
  if (idx !== -1) {
    store.feedback[idx] = { ...store.feedback[idx], ...updates };
    writeStore(store);
  }
}

// Stats
export function getStats() {
  const store = readStore();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const recentConversations = store.conversations.filter(
    (c) => c.started_at >= sevenDaysAgo
  );

  const productRequests = store.feedback.filter((f) => f.type === "product_request");
  const unreviewedCount = store.feedback.filter((f) => f.status === "new").length;

  // Top requested products
  const productCounts: Record<string, number> = {};
  for (const fb of productRequests) {
    const product = fb.product_mentioned || fb.content;
    productCounts[product] = (productCounts[product] || 0) + 1;
  }
  const topRequested = Object.entries(productCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([product, count]) => ({ product, count }));

  return {
    totalConversations: recentConversations.length,
    totalFeedback: store.feedback.length,
    productRequests: productRequests.length,
    unreviewedCount,
    topRequested,
  };
}

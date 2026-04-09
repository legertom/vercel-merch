import Link from "next/link";
import { LayoutDashboard, MessageSquare, ThumbsUp, LogOut } from "lucide-react";
import { isAdminAuthenticated, adminLogout } from "@/actions/auth";
import { AdminLoginGate } from "./login";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return <AdminLoginGate />;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-white/10 bg-neutral-950 p-4">
        <div className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Admin
          </h2>
        </div>
        <nav className="space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/feedback"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ThumbsUp className="h-4 w-4" />
            Feedback
          </Link>
          <Link
            href="/admin/conversations"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <MessageSquare className="h-4 w-4" />
            Conversations
          </Link>
        </nav>
        <div className="mt-auto pt-8">
          <form action={adminLogout}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-500 transition-colors hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}

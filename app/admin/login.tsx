"use client";

import { useState } from "react";
import { adminLogin } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export function AdminLoginGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const result = await adminLogin(password);
    if (result.success) {
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border border-white/10 bg-neutral-950 p-8"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
            <Lock className="h-5 w-5 text-neutral-400" />
          </div>
          <h1 className="text-lg font-semibold">Admin Access</h1>
          <p className="text-sm text-neutral-500">
            Enter the admin password to continue.
          </p>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#0070F3]"
          autoFocus
        />

        {error && (
          <p className="text-center text-sm text-red-400">
            Incorrect password. Try again.
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-black transition-opacity disabled:opacity-50"
        >
          {loading ? "Checking..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

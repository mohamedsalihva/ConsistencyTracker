"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import type { AxiosError } from "axios";
import api from "@/lib/axios";
import API from "@/lib/apiRoutes";
import { setUser } from "@/store/authSlice";
import { setStoredToken } from "@/lib/authToken";
import { setSessionCookieFromToken } from "@/lib/sessionCookie";

type CompletePayload = {
  role: "manager" | "member";
  workspaceName?: string;
  inviteCode?: string;
};

export default function GoogleCompletePage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [role, setRole] = useState<"manager" | "member">("member");
  const [workspaceName, setWorkspaceName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (loading) return;
    setError("");

    if (role === "manager" && !workspaceName.trim()) {
      setError("Workspace name is required for managers.");
      return;
    }

    const payload: CompletePayload = {
      role,
      workspaceName: role === "manager" ? workspaceName.trim() : undefined,
      inviteCode: role === "member" && inviteCode.trim() ? inviteCode.trim().toUpperCase() : undefined,
    };

    setLoading(true);
    try {
      const res = await api.post<{
        success: boolean;
        user?: {
          role?: "manager" | "member";
          subscriptionStatus?: "none" | "pending" | "active" | "failed";
        };
        token?: string;
      }>(API.AUTH.GOOGLE_COMPLETE, payload);

      if (res.data?.token) {
        setStoredToken(res.data.token);
        setSessionCookieFromToken(res.data.token);
        void fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: res.data.token }),
          credentials: "include",
        });
      }

      if (res.data?.user) {
        dispatch(setUser(res.data.user));
      }
      const next =
        res.data?.user?.role === "manager" && res.data?.user?.subscriptionStatus !== "active"
          ? "/billing"
          : "/dashboard";
      router.replace(next);
      window.location.href = next;
    } catch (err: unknown) {
      const apiError = err as AxiosError<{ message?: string }>;
      const message = apiError.response?.data?.message || "Failed to complete account setup.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-foreground" style={{ background: "var(--gradient-page)" }}>
      <div className="mx-auto flex min-h-screen w-full max-w-[1560px] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-card w-full max-w-md p-6 sm:p-8"
        >
          <div className="mb-6 text-center">
            <span className="chip chip-active inline-flex">Google Setup</span>
            <h1 className="mt-3 font-serif text-3xl">Complete Account</h1>
            <p className="mt-2 text-sm text-muted-foreground">Choose your role and finish onboarding.</p>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-card/70 p-1">
            <button
              type="button"
              onClick={() => setRole("member")}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                role === "member" ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Member
            </button>
            <button
              type="button"
              onClick={() => setRole("manager")}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                role === "manager" ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Manager
            </button>
          </div>

          {role === "manager" ? (
            <input
              className="mt-3 w-full rounded-xl border border-border bg-card/70 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              placeholder="Workspace name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          ) : (
            <div className="mt-3 space-y-1">
              <input
                className="w-full rounded-xl border border-border bg-card/70 px-3 py-2.5 text-sm uppercase text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                placeholder="Invite code (optional)"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              />
              <p className="text-xs text-muted-foreground">Leave empty to join a workspace later.</p>
            </div>
          )}

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="btn-cta mt-5 w-full py-2.5 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </motion.div>
      </div>
    </main>
  );
}


"use client";

import { UserPlus } from "lucide-react";

type Props = {
  inviteCode: string;
  setInviteCode: (v: string) => void;
  loading?: boolean;
  error?: string;
  success?: string;
  onJoin: () => void | Promise<void>;
};

export function JoinWorkspaceCard({
  inviteCode,
  setInviteCode,
  loading,
  error,
  success,
  onJoin,
}: Props) {
  return (
    <section className="glass-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <UserPlus className="h-4 w-4 text-primary" />
        <h3 className="text-base font-bold text-foreground">Join Workspace</h3>
      </div>

      <p className="mb-3 text-sm text-muted-foreground">
        Enter your manager invite code to join a workspace.
      </p>

      <div className="flex gap-2">
        <input
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          placeholder="JOIN-ABC123"
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={onJoin}
          disabled={loading}
          className="btn-cta whitespace-nowrap px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Joining..." : "Join"}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      {success && <p className="mt-2 text-xs text-mint">{success}</p>}
    </section>
  );
}

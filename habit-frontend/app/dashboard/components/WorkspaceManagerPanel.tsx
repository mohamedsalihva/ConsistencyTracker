"use client";

import { Users, RefreshCcw, Trash2, Copy } from "lucide-react";

type WorkspaceMember = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
};

type Props = {
  workspaceName?: string;
  inviteCode?: string;
  memberCount?: number;
  members: WorkspaceMember[];
  loading?: boolean;
  error?: string;
  actionLoading?: boolean;
  onRegenerateInvite: () => void | Promise<void>;
  onRemoveMember: (memberId: string) => void | Promise<void>;
  onCopyInvite: () => void | Promise<void>;
};

export function WorkspaceManagerPanel({
  workspaceName,
  inviteCode,
  memberCount,
  members,
  loading,
  error,
  actionLoading,
  onRegenerateInvite,
  onRemoveMember,
  onCopyInvite,
}: Props) {
  return (
    <section className="glass-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        <h3 className="text-base font-bold text-foreground">Workspace Management</h3>
      </div>

      <div className="rounded-xl border border-border/80 bg-card/70 p-3">
        <p className="text-xs text-muted-foreground">Workspace</p>
        <p className="text-sm font-semibold text-foreground">{workspaceName || "No workspace"}</p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Invite code</p>
            <p className="font-mono text-sm font-bold text-primary">{inviteCode || "-"}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCopyInvite}
              className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-secondary"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onRegenerateInvite}
              disabled={actionLoading}
              className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-secondary disabled:opacity-60"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">Members: {memberCount ?? members.length}</p>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Members</p>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading members...</p>
        ) : members.length === 0 ? (
          <p className="text-sm text-muted-foreground">No members joined yet.</p>
        ) : (
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m._id} className="flex items-center justify-between rounded-lg border border-border/70 bg-card/60 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveMember(m._id)}
                  disabled={actionLoading}
                  className="rounded-md border border-rose/40 bg-rose/10 px-2 py-1 text-xs text-rose hover:bg-rose/20 disabled:opacity-60"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>
    </section>
  );
}

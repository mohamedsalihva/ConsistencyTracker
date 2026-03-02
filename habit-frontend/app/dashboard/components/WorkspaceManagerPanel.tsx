"use client";

import { Copy, RefreshCcw, Trash2, Users } from "lucide-react";

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
  members?: WorkspaceMember[];
  loading?: boolean;
  error?: string;
  actionLoading?: boolean;
  onRegenerateInvite: () => void | Promise<void>;
  onRemoveMember: (memberId: string) => void | Promise<void>;
  onCopyInvite: () => void | Promise<void>;
  showMembers?: boolean;
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
  showMembers = true,
}: Props) {
  const safeMembers = members ?? [];
  const totalMembers = memberCount ?? safeMembers.length;

  return (
    <section className="glass-card overflow-hidden p-0">
      <div className="border-b border-white/10 bg-[linear-gradient(120deg,rgba(255,123,26,0.2),rgba(255,76,45,0.08))] px-5 py-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="text-base font-bold text-foreground">Workspace Management</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Manage members, rotate invite code, and monitor access.</p>
      </div>

      <div className="space-y-4 p-4">
        <div className="rounded-2xl border border-border/80 bg-card/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Workspace</p>
              <p className="text-sm font-semibold text-foreground">{workspaceName || "No workspace"}</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {totalMembers} members
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary/10 p-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-primary/80">Invite code</p>
              <p className="font-mono text-sm font-bold text-primary">{inviteCode || "-"}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCopyInvite}
                className="rounded-lg border border-border/70 px-2.5 py-1.5 text-xs text-foreground hover:bg-secondary"
                title="Copy invite code"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onRegenerateInvite}
                disabled={actionLoading}
                className="rounded-lg border border-border/70 px-2.5 py-1.5 text-xs text-foreground hover:bg-secondary disabled:opacity-60"
                title="Regenerate invite code"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showMembers && (
        <div className="px-4 pb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Team Members</p>
          <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {loading ? (
              <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground">Loading members...</p>
            ) : safeMembers.length === 0 ? (
              <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground">No members joined yet.</p>
            ) : (
              safeMembers.map((m) => (
                <div
                  key={m._id}
                  className="flex items-center justify-between rounded-xl border border-border/70 bg-card/60 px-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
                      {(m.name?.trim().slice(0, 1) || "?").toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{m.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveMember(m._id)}
                    disabled={actionLoading}
                    className="rounded-md border border-rose/40 bg-rose/10 px-2 py-1 text-xs text-rose hover:bg-rose/20 disabled:opacity-60"
                    title="Remove member"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        </div>
      )}
    </section>
  );
}

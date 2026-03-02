"use client";

import { Trash2, Users2 } from "lucide-react";

type WorkspaceMember = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
};

type Props = {
  members: WorkspaceMember[];
  memberCount?: number;
  loading?: boolean;
  error?: string;
  actionLoading?: boolean;
  onRemoveMember: (memberId: string) => void | Promise<void>;
};

export function WorkspaceMembersPanel({
  members,
  memberCount,
  loading,
  error,
  actionLoading,
  onRemoveMember,
}: Props) {
  const totalMembers = memberCount ?? members.length;

  return (
    <section className="glass-card overflow-hidden p-0">
      <div className="border-b border-white/10 bg-[linear-gradient(120deg,rgba(255,123,26,0.18),rgba(255,76,45,0.06))] px-5 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users2 className="h-4 w-4 text-primary" />
            <h3 className="text-base font-bold text-foreground">Workspace Members</h3>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {totalMembers} members
          </span>
        </div>
      </div>

      <div className="max-h-[340px] space-y-2 overflow-y-auto p-4 pr-3">
        {loading ? (
          <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground">Loading members...</p>
        ) : members.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground">No members joined yet.</p>
        ) : (
          members.map((m) => (
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

      {error && <p className="px-4 pb-4 text-xs text-destructive">{error}</p>}
    </section>
  );
}

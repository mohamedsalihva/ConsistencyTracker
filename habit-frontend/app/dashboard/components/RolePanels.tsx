"use client";

import { motion } from "framer-motion";

type Role = "manager" | "member";

type Props = {
  role?: Role;
  workspaceId?: string | null;
  inviteCode: string;
  copied: boolean;
  onCopyInvite: () => void;
};

const sectionMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25 },
};

export function RolePanels({ role, workspaceId, inviteCode, copied, onCopyInvite }: Props) {
  return (
    <>
      {role === "manager" && inviteCode && (
        <motion.section {...sectionMotion} className="glass-card flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div>
            <p className="text-xs text-muted-foreground">Workspace Invite Code</p>
            <p className="mt-1 font-mono text-sm font-semibold text-foreground sm:text-base">{inviteCode}</p>
          </div>
          <button
            onClick={onCopyInvite}
            className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
          >
            {copied ? "Copied" : "Copy code"}
          </button>
        </motion.section>
      )}

      {role === "member" && workspaceId && (
        <motion.section {...sectionMotion} className="glass-card px-4 py-3 sm:px-5">
          <p className="text-xs text-muted-foreground">Workspace Status</p>
          <p className="mt-1 text-sm font-medium text-foreground">You joined a workspace successfully.</p>
        </motion.section>
      )}
    </>
  );
}

"use client";

import { motion } from "framer-motion";
import { Rocket, Users } from "lucide-react";

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
        <motion.section {...sectionMotion} className="glass-card glass-card-hover border-primary/20 p-6">
          <div className="mb-5 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="text-xl font-black text-foreground">Manager Insights</h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#ff8b5f,#f9b57f)] text-[#1b1207]">
                  <Rocket className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">Workspace Mentoring</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Invite members with code</p>
                </div>
              </div>
              <span className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-bold text-primary">Live</span>
            </div>

            <div className="mt-4 rounded-xl border border-primary/25 bg-primary/10 p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-primary/85">Workspace Invite Code</p>
              <p className="mt-1 font-mono text-base font-bold text-primary">{inviteCode}</p>
              <button
                onClick={onCopyInvite}
                className="mt-3 rounded-lg border border-primary/30 bg-primary/20 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/30"
              >
                {copied ? "Copied" : "Copy code"}
              </button>
            </div>
          </div>
        </motion.section>
      )}

      {role === "member" && workspaceId && (
        <motion.section {...sectionMotion} className="glass-card border-mint/25 px-4 py-3 sm:px-5">
          <p className="text-xs text-muted-foreground">Workspace Status</p>
          <p className="mt-1 text-sm font-medium text-mint">You joined a workspace successfully.</p>
        </motion.section>
      )}
    </>
  );
}

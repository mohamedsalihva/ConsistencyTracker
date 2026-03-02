"use client";

import { BellRing, Clock3 } from "lucide-react";
import type { NotificationHistoryItem } from "../hooks/useManagerInsights";

type Props = {
  logs: NotificationHistoryItem[];
  loading?: boolean;
};

function formatLogTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ManagerLogsPanel({ logs, loading }: Props) {
  return (
    <section className="glass-card overflow-hidden p-0">
      <div className="border-b border-white/10 bg-[linear-gradient(120deg,rgba(255,123,26,0.18),rgba(255,76,45,0.06))] px-5 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BellRing className="h-4 w-4 text-primary" />
            <h3 className="text-base font-bold text-foreground">Manager Logs</h3>
          </div>
          <span className="rounded-full border border-primary/30 bg-primary/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
            {logs.length} entries
          </span>
        </div>
      </div>

      <div className="max-h-64 space-y-2 overflow-y-auto p-4">
        {loading ? (
          <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground">No manager logs yet.</p>
        ) : (
          logs.slice(0, 8).map((item) => (
            <div key={item._id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
              <p className="text-xs font-semibold text-foreground">Daily incomplete-habit alert sent</p>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                <span>{formatLogTime(item.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

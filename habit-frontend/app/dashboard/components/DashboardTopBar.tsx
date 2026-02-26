"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Bell, ChevronDown, LayoutDashboard, ListTodo, LogOut, Plus } from "lucide-react";
import type { NotificationHistoryItem } from "../hooks/useManagerInsights";

type Props = {
  displayName: string;
  displayEmail: string;
  initials: string;
  role?: "manager" | "member";
  notifyLoading: boolean;
  notifyHistory: NotificationHistoryItem[];
  onCreateHabit: () => void;
  onSignOut: () => void;
};

const navTabs = [
  { label: "Overview", icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
  { label: "Habits", icon: <ListTodo className="h-3.5 w-3.5" /> },
  { label: "Analytics", icon: <BarChart3 className="h-3.5 w-3.5" /> },
];

export function DashboardTopBar({
  displayName,
  displayEmail,
  initials,
  role,
  notifyLoading,
  notifyHistory,
  onCreateHabit,
  onSignOut,
}: Props) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!userMenuRef.current) return;
      const target = event.target as Node;
      if (!userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(target)) {
        setIsAlertsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
        setIsAlertsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card relative z-20 mb-6 flex flex-wrap items-center justify-between gap-3 overflow-visible border-white/10 bg-[#1a0f0b]/80 px-5 py-3"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/40 bg-primary/20 shadow-[0_0_20px_rgba(255,123,26,.35)]">
          <span className="text-sm font-bold text-primary-foreground">H</span>
        </div>
        <span className="font-serif text-xl text-foreground">HabitFlow</span>
      </div>

      <div className="hidden gap-1.5 sm:flex">
        {navTabs.map((tab, i) => (
          <button key={tab.label} className={`chip flex items-center gap-1.5 ${i === 0 ? "chip-active" : "chip-inactive"}`}>
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          onClick={onCreateHabit}
          className="btn-cta hidden items-center gap-1.5 sm:flex"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus className="h-4 w-4" />
          New Habit
        </motion.button>

        {role === "manager" && (
          <div ref={alertsRef} className="relative">
            <button
              onClick={() => setIsAlertsOpen((prev) => !prev)}
              className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-[0_8px_18px_rgba(0,0,0,.28)] backdrop-blur transition hover:scale-[1.03] hover:bg-white/10"
              aria-haspopup="menu"
              aria-expanded={isAlertsOpen}
              title="Alerts"
            >
              <Bell className="h-4 w-4 text-foreground" />
              {notifyHistory.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 min-w-[16px] rounded-full bg-destructive px-1 text-center text-[10px] font-semibold text-white">
                  {Math.min(notifyHistory.length, 9)}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isAlertsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 top-[calc(100%+12px)] z-50 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#1a0f0b] shadow-[0_20px_38px_rgba(0,0,0,.35)]"
                  role="menu"
                >
                  <div className="border-b border-white/10 bg-white/5 px-3 py-2.5">
                    <p className="text-xs font-semibold text-foreground">Manager Alerts</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto p-2">
                    {notifyLoading ? (
                      <p className="px-2 py-3 text-xs text-muted-foreground">Loading alerts...</p>
                    ) : notifyHistory.length ? (
                      <div className="space-y-1">
                        {notifyHistory.slice(0, 6).map((item) => (
                          <div key={item._id} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
                            <p className="text-xs font-medium text-foreground">Daily incomplete-habit alert sent</p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">{item.dateKey}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="px-2 py-3 text-xs text-muted-foreground">No alerts yet.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-[0_8px_18px_rgba(0,0,0,.28)] backdrop-blur transition hover:scale-[1.03] hover:bg-white/10"
            aria-haspopup="menu"
            aria-expanded={isUserMenuOpen}
            title={displayName}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-[10px] font-semibold text-primary shadow-[0_8px_16px_rgba(255,123,26,.3)]">
              {initials}
            </span>
            <span className="pointer-events-none absolute -bottom-1 -right-1 rounded-full border border-border/80 bg-white p-0.5 shadow-sm">
              <ChevronDown className={`h-2.5 w-2.5 text-muted-foreground transition ${isUserMenuOpen ? "rotate-180" : ""}`} />
            </span>
          </button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.16 }}
                className="absolute right-0 top-[calc(100%+12px)] z-50 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#1a0f0b] shadow-[0_20px_38px_rgba(0,0,0,.35)]"
                role="menu"
              >
                <div className="bg-white/5 px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-semibold text-primary shadow-[0_8px_20px_rgba(255,123,26,.3)]">
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">{displayName}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{displayEmail}</p>
                    </div>
                  </div>
                </div>

                <div className="p-1.5 pt-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onSignOut();
                    }}
                    className="flex w-full items-center justify-between rounded-full px-3 py-2 text-left text-xs font-medium text-foreground transition hover:bg-destructive/10 hover:text-destructive"
                    role="menuitem"
                  >
                    <span className="flex items-center gap-2">
                      <LogOut className="h-3.5 w-3.5" />
                      Logout
                    </span>
                    <span className="rounded-md border border-border bg-white px-1 py-0.5 text-[9px] text-muted-foreground">ESC</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}

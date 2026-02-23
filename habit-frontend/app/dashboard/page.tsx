"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, LayoutDashboard, ListTodo, BarChart3, LogOut, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useDashboard } from "./hooks/useDashboard";
import { Hero } from "./components/Hero";
import { DailyChart } from "./components/DailyChart";
import { KpiGrid } from "./components/KpiGrid";
import { RingSection } from "./components/RingSection";
import { Matrix } from "./components/Matrix";
import { TopHabits } from "./components/TopHabits";
import { WeekStrip } from "./components/WeekStrip";
import { CreateHabitModal } from "./components/CreateHabitModal";
import { CoachChat } from "./components/CoachChat";


const navTabs = [
  { label: "Overview", icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
  { label: "Habits", icon: <ListTodo className="h-3.5 w-3.5" /> },
  { label: "Analytics", icon: <BarChart3 className="h-3.5 w-3.5" /> },
];

export default function DashboardPage() {
  const user = useSelector((s: RootState) => s.auth.user as { name?: string; email?: string } | null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const {
    habits,
    loading,
    error,
    chartMode,
    setChartMode,
    showCreateModal,
    newHabitTitles,
    setNewHabitTitles,
    createError,
    creatingHabit,
    view,
    remainingSlots,
    openCreateModal,
    closeCreateModal,
    handleCreateHabit,
    completeToday,
    renameHabit,
    deleteHabit,
    toggleCheckin,
    signOut,
  } = useDashboard();

  const displayName = user?.name?.trim() || "User";
  const displayEmail = user?.email?.trim() || "No email";
  const initials = useMemo(() => {
    const parts = displayName.split(/\s+/).filter(Boolean);
    if (!parts.length) return "U";
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [displayName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!userMenuRef.current) return;
      const target = event.target as Node;
      if (!userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
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
    <div className="min-h-screen text-foreground" style={{ background: "var(--gradient-page)" }}>
      <div className="mx-auto max-w-[1560px] px-4 pb-10 pt-5 sm:px-6 sm:pb-14 sm:pt-7 lg:px-8 lg:pb-20 lg:pt-9">
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card relative z-20 mb-6 flex flex-wrap items-center justify-between gap-3 overflow-visible px-5 py-3"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#8d67c8,#d8759f)]">
              <span className="text-sm font-bold text-primary-foreground">H</span>
            </div>
            <span className="font-serif text-xl text-foreground">Habit Tracker</span>
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
              onClick={openCreateModal}
              className="btn-cta hidden items-center gap-1.5 sm:flex"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus className="h-4 w-4" />
              New Habit
            </motion.button>

            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-white/85 shadow-[0_8px_18px_rgba(70,44,110,.14)] backdrop-blur transition hover:scale-[1.03] hover:bg-white"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                title={displayName}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8d67c8,#d8759f)] text-[10px] font-semibold text-white shadow-[0_8px_16px_rgba(141,103,200,.45)]">
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
                    className="absolute right-0 top-[calc(100%+12px)] z-50 w-56 overflow-hidden rounded-2xl border border-border/85 bg-card shadow-[0_20px_38px_rgba(34,24,60,.2)]"
                    role="menu"
                  >
                    <div className="bg-[radial-gradient(circle_at_top_left,#f3eaff_0%,#fff_62%)] px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8d67c8,#d8759f)] text-[10px] font-semibold text-white shadow-[0_8px_20px_rgba(141,103,200,.45)]">
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
                          signOut();
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

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Hero today={view.today} habitsCount={habits.length} todayPct={view.todayPct} maxStreak={view.maxStreak} activeDays={view.activeDays} />
          <DailyChart chartMode={chartMode} setChartMode={setChartMode} chartData={view.chartData} maxBar={view.maxBar} />
        </div>

        <KpiGrid habitsCount={habits.length} todayCount={view.todayCount} maxStreak={view.maxStreak} totalDone={view.totalDone} />

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-5">
            <RingSection todayPct={view.todayPct} weekPct={view.weekPct} monthPct={view.monthPct} allPct={view.allPct} />
            <Matrix
              habits={habits}
              last35={view.last35}
              todayKey={view.todayKey}
              completedToday={completeToday}
              onToggleCheckin={toggleCheckin}
              onRenameHabit={renameHabit}
              onDeleteHabit={deleteHabit}
            />
          </div>
          <TopHabits topHabits={view.topHabits} />
        </div>

        <WeekStrip last7={view.last7} map={view.map} habitsCount={habits.length} todayKey={view.todayKey} />
        <CoachChat
  context={`todayPct=${view.todayPct}, habits=${habits.length}, maxStreak=${view.maxStreak}, activeDays=${view.activeDays}, totalDone=${view.totalDone}`}
/>


        {loading && <p className="mt-4 text-sm text-muted-foreground">Loading habits...</p>}
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      </div>

      <motion.button
        onClick={openCreateModal}
        className="btn-cta fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full p-0 shadow-xl sm:hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
      >
        <Plus className="h-6 w-6" />
      </motion.button>

      <CreateHabitModal
        show={showCreateModal}
        onClose={closeCreateModal}
        onSubmit={handleCreateHabit}
        titles={newHabitTitles}
        setTitles={setNewHabitTitles}
        createError={createError}
        creatingHabit={creatingHabit}
        currentHabitsCount={habits.length}
        remainingSlots={remainingSlots}
      />
    </div>
  );
}

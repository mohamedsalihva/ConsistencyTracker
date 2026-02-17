"use client";

import { motion } from "framer-motion";
import { Plus, LayoutDashboard, ListTodo, BarChart3 } from "lucide-react";
import { useDashboard } from "./hooks/useDashboard";
import { Hero } from "./components/Hero";
import { DailyChart } from "./components/DailyChart";
import { KpiGrid } from "./components/KpiGrid";
import { RingSection } from "./components/RingSection";
import { Matrix } from "./components/Matrix";
import { TopHabits } from "./components/TopHabits";
import { WeekStrip } from "./components/WeekStrip";
import { CreateHabitModal } from "./components/CreateHabitModal";

const navTabs = [
  { label: "Overview", icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
  { label: "Habits", icon: <ListTodo className="h-3.5 w-3.5" /> },
  { label: "Analytics", icon: <BarChart3 className="h-3.5 w-3.5" /> },
];

export default function DashboardPage() {
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
  } = useDashboard();

  return (
    <div className="min-h-screen text-foreground" style={{ background: "var(--gradient-page)" }}>
      <div className="mx-auto max-w-[1560px] px-4 pb-10 pt-5 sm:px-6 sm:pb-14 sm:pt-7 lg:px-8 lg:pb-20 lg:pt-9">
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card mb-6 flex flex-wrap items-center justify-between gap-3 px-5 py-3"
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

          <motion.button onClick={openCreateModal} className="btn-cta flex items-center gap-1.5" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Plus className="h-4 w-4" />
            New Habit
          </motion.button>
        </motion.nav>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Hero today={view.today} habitsCount={habits.length} todayPct={view.todayPct} maxStreak={view.maxStreak} activeDays={view.activeDays} />
          <DailyChart chartMode={chartMode} setChartMode={setChartMode} chartData={view.chartData} maxBar={view.maxBar} />
        </div>

        <KpiGrid habitsCount={habits.length} todayCount={view.todayCount} maxStreak={view.maxStreak} totalDone={view.totalDone} />

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-5">
            <RingSection todayPct={view.todayPct} weekPct={view.weekPct} monthPct={view.monthPct} allPct={view.allPct} />
            <Matrix habits={habits} last35={view.last35} todayKey={view.todayKey} completedToday={completeToday} />
          </div>
          <TopHabits topHabits={view.topHabits} />
        </div>

        <WeekStrip last7={view.last7} map={view.map} habitsCount={habits.length} todayKey={view.todayKey} />

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

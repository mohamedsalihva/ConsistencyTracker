"use client";

import { useDashboard } from "./hooks/useDashboard";
import { Hero } from "./components/Hero";
import { DailyChart } from "./components/DailyChart";
import { KpiGrid } from "./components/KpiGrid";
import { RingSection } from "./components/RingSection";
import { Matrix } from "./components/Matrix";
import { TopHabits } from "./components/TopHabits";
import { WeekStrip } from "./components/WeekStrip";
import { CreateHabitModal } from "./components/CreateHabitModal";

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
    <div
      className="min-h-screen text-[#2d2a26]"
      style={{
        background:
          "radial-gradient(circle at 8% 4%, #ffe8f2 0%, transparent 35%), radial-gradient(circle at 92% 0%, #e5efff 0%, transparent 34%), linear-gradient(180deg, #f3edfb 0%, #f7f2ff 100%)",
      }}
    >
      <div className="mx-auto max-w-[1560px] px-3 pb-8 pt-4 sm:px-5 sm:pb-12 sm:pt-6 lg:px-7 lg:pb-16 lg:pt-8">
        <nav className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e5dcf2] bg-gradient-to-br from-white to-[#f7efff] px-4 py-3 shadow-[0_10px_30px_rgba(130,102,176,.14)]">
          <div className="font-serif text-xl sm:text-2xl">Habit Tracker</div>

          <div className="hidden gap-2 sm:flex">
            {["Overview", "Habits", "Analytics"].map((tab, i) => (
              <button
                key={tab}
                className={`rounded-full border px-3 py-1.5 text-xs ${
                  i === 0
                    ? "border-[#b8a9d9] bg-[#ede8f7] text-[#8b77c2]"
                    : "border-[#e5dcf2] bg-transparent text-[#6b6560]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={openCreateModal}
            className="rounded-full border-0 bg-[linear-gradient(135deg,#b8a9d9,#f4a7b9)] px-4 py-2 text-sm font-semibold text-white"
          >
            + New Habit
          </button>
        </nav>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Hero
            today={view.today}
            habitsCount={habits.length}
            todayPct={view.todayPct}
            maxStreak={view.maxStreak}
            activeDays={view.activeDays}
          />
          <DailyChart chartMode={chartMode} setChartMode={setChartMode} chartData={view.chartData} maxBar={view.maxBar} />
        </div>

        <KpiGrid habitsCount={habits.length} todayCount={view.todayCount} maxStreak={view.maxStreak} totalDone={view.totalDone} />

        <div className="mt-4 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-4">
            <RingSection todayPct={view.todayPct} weekPct={view.weekPct} monthPct={view.monthPct} allPct={view.allPct} />
            <Matrix habits={habits} last35={view.last35} todayKey={view.todayKey} completedToday={completeToday} />
          </div>
          <TopHabits topHabits={view.topHabits} />
        </div>

        <WeekStrip last7={view.last7} map={view.map} habitsCount={habits.length} todayKey={view.todayKey} />

        {loading && <p className="mt-4 text-sm text-[#a09990]">Loading habits...</p>}
        {error && <p className="mt-4 text-sm text-[#e8798f]">{error}</p>}
      </div>

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


"use client";

import type { CSSProperties } from "react";
import { DASHBOARD_STYLES, T } from "./utils/theme";
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
  } = useDashboard();

  const card: CSSProperties = {
    background: "linear-gradient(145deg, rgba(255,255,255,.96), rgba(247,240,255,.92))",
    border: `1px solid ${T.border}`,
    borderRadius: 14,
    boxShadow: "0 10px 30px rgba(130,102,176,.14)",
  };

  return (
    <div
      style={{
        background: "radial-gradient(circle at 8% 4%, #ffe8f2 0%, transparent 35%), radial-gradient(circle at 92% 0%, #e5efff 0%, transparent 34%), linear-gradient(180deg, #f3edfb 0%, #f7f2ff 100%)",
        color: T.text,
        minHeight: "100vh",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <style>{DASHBOARD_STYLES}</style>

      <div className="page-wrap">
        <nav className="topbar reveal" style={{ ...card, background: "linear-gradient(135deg,#ffffff,#f7efff)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", marginBottom: 20, ["--d" as string]: "0ms" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22 }}>Habit Tracker</div>
          <div className="topnav" style={{ display: "flex", gap: 6 }}>
            {["Overview", "Habits", "Analytics"].map((t, i) => (
              <button key={t} style={{ borderRadius: 999, border: `1px solid ${i === 0 ? T.lavender : T.border}`, background: i === 0 ? T.lavL : "transparent", color: i === 0 ? T.lavD : T.text2, padding: "6px 12px", fontSize: 12 }}>
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={openCreateModal}
            style={{
              background: `linear-gradient(135deg,${T.lavender},${T.pink})`,
              color: "#fff",
              borderRadius: 999,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            + New Habit
          </button>
        </nav>

        <div className="hero">
          <Hero
            today={view.today}
            habitsCount={habits.length}
            todayPct={view.todayPct}
            maxStreak={view.maxStreak}
            activeDays={view.activeDays}
            cardStyle={card}
          />
          <DailyChart
            chartMode={chartMode}
            setChartMode={setChartMode}
            chartData={view.chartData}
            maxBar={view.maxBar}
            cardStyle={card}
          />
        </div>

        <KpiGrid
          habitsCount={habits.length}
          todayCount={view.todayCount}
          maxStreak={view.maxStreak}
          totalDone={view.totalDone}
        />

        <div className="mid-grid reveal" style={{ marginTop: 16, ["--d" as string]: "300ms" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <RingSection
              todayPct={view.todayPct}
              weekPct={view.weekPct}
              monthPct={view.monthPct}
              allPct={view.allPct}
              cardStyle={card}
            />
            <Matrix habits={habits} last35={view.last35} todayKey={view.todayKey} cardStyle={card} />
          </div>
          <TopHabits topHabits={view.topHabits} cardStyle={card} />
        </div>

        <WeekStrip
          last7={view.last7}
          map={view.map}
          habitsCount={habits.length}
          todayKey={view.todayKey}
          cardStyle={card}
        />

        {loading && <p style={{ marginTop: 18, color: T.text3 }}>Loading habits...</p>}
        {error && <p style={{ marginTop: 18, color: T.pinkD }}>{error}</p>}
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


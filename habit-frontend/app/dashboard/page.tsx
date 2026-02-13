"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AxiosError } from "axios";
import { setHabits, type Habit } from "@/store/habitSlice";
import type { AppDispatch, RootState } from "@/store";
import api from "@/lib/axios";
import API from "@/lib/apiRoutes";

function formatDay(date: Date) {
  return date.toISOString().split("T")[0];
}

function shortDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getLastNDates(days: number) {
  return Array.from({ length: days }, (_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - idx));
    return d;
  });
}

function completionsByDate(habits: Habit[]) {
  const map = new Map<string, number>();

  habits.forEach((habit) => {
    habit.history?.forEach((entry) => {
      if (!entry.completed) return;
      map.set(entry.date, (map.get(entry.date) ?? 0) + 1);
    });
  });

  return map;
}

function heatClass(value: number) {
  if (value >= 4) return "bg-emerald-600";
  if (value === 3) return "bg-emerald-500";
  if (value === 2) return "bg-emerald-400";
  if (value === 1) return "bg-emerald-200";
  return "bg-slate-200";
}

type MetricCardProps = {
  title: string;
  value: string | number;
  hint: string;
  color: string;
};

function MetricCard({ title, value, hint, color }: MetricCardProps) {
  return (
    <article className={`rounded-2xl p-4 text-white shadow-sm ${color}`}>
      <p className="text-xs uppercase tracking-wide text-white/80">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-white/80">{hint}</p>
    </article>
  );
}

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const habits = useSelector((state: RootState) => state.habits.list);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHabits = async () => {
      try {
        setError("");
        const res = await api.get<Habit[] | { habits: Habit[] }>(API.HABITS.GET_ALL);
        const data = Array.isArray(res.data) ? res.data : (res.data.habits ?? []);
        dispatch(setHabits(data));
      } catch (err: unknown) {
        const e = err as AxiosError<{ message?: string }>;
        setError(e.response?.data?.message ?? "Unable to load habits");
      } finally {
        setLoading(false);
      }
    };

    loadHabits();
  }, [dispatch]);

  const view = useMemo(() => {
    const map = completionsByDate(habits);
    const last30 = getLastNDates(30);
    const last14 = getLastNDates(14);
    const last35 = getLastNDates(35);

    const activeDays = last30.filter((d) => (map.get(formatDay(d)) ?? 0) > 0).length;
    const completionRate = Math.round((activeDays / 30) * 100);
    const todayCount = map.get(formatDay(new Date())) ?? 0;
    const weekCount = getLastNDates(7).reduce((acc, d) => acc + (map.get(formatDay(d)) ?? 0), 0);

    const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak ?? 0), 0);
    const totalStreak = habits.reduce((sum, h) => sum + (h.streak ?? 0), 0);

    const bars = last14.map((d) => {
      const key = formatDay(d);
      return { key, label: d.getDate(), value: map.get(key) ?? 0 };
    });

    const maxBar = Math.max(...bars.map((b) => b.value), 1);

    const topHabits = habits
      .slice()
      .sort((a, b) => (b.streak ?? 0) - (a.streak ?? 0))
      .slice(0, 6);

    return {
      map,
      last35,
      bars,
      maxBar,
      topHabits,
      activeDays,
      completionRate,
      todayCount,
      weekCount,
      bestStreak,
      totalStreak,
      totalHabits: habits.length,
    };
  }, [habits]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-rose-50 to-amber-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Habit Center</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Professional Habit Dashboard</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
                Track progress quickly: cards for summary, bars for daily output, and heatmap for long-term consistency.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Today</p>
              <p>{shortDate(new Date())}</p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <MetricCard title="Habits" value={view.totalHabits} hint="Active items" color="bg-indigo-600" />
          <MetricCard title="Consistency" value={`${view.completionRate}%`} hint="Last 30 days" color="bg-cyan-600" />
          <MetricCard title="Active Days" value={`${view.activeDays}/30`} hint="Days with activity" color="bg-emerald-600" />
          <MetricCard title="Today" value={view.todayCount} hint="Completions today" color="bg-rose-600" />
          <MetricCard title="This Week" value={view.weekCount} hint="Completions in 7d" color="bg-amber-500" />
          <MetricCard title="Best Streak" value={`${view.bestStreak}d`} hint="Top performer" color="bg-fuchsia-600" />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Daily Output</h2>
                  <p className="text-sm text-slate-500">Last 14 days of completed habits</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Trend</span>
              </div>

              <div className="flex h-52 items-end gap-2 md:gap-3">
                {view.bars.map((bar, i) => {
                  const h = Math.max(10, Math.round((bar.value / view.maxBar) * 170));
                  const tone = i % 2 === 0 ? "bg-indigo-500" : "bg-cyan-500";

                  return (
                    <div key={bar.key} className="flex flex-1 flex-col items-center gap-2">
                      <div className={`w-full rounded-t-md ${tone}`} style={{ height: h }} title={`${bar.key}: ${bar.value}`} />
                      <span className="text-[10px] text-slate-500 md:text-xs">{bar.label}</span>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Consistency Heatmap</h2>
                  <p className="text-sm text-slate-500">35-day view. Darker = more completions.</p>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {view.last35.map((d) => {
                  const key = formatDay(d);
                  const value = view.map.get(key) ?? 0;
                  return (
                    <div
                      key={key}
                      className={`h-8 rounded-md transition-transform hover:scale-105 ${heatClass(value)}`}
                      title={`${key}: ${value} completions`}
                    />
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <span>Low</span>
                <span className="h-3 w-3 rounded bg-slate-200" />
                <span className="h-3 w-3 rounded bg-emerald-200" />
                <span className="h-3 w-3 rounded bg-emerald-400" />
                <span className="h-3 w-3 rounded bg-emerald-500" />
                <span className="h-3 w-3 rounded bg-emerald-600" />
                <span>High</span>
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Consistency Score</h2>
              <p className="mt-1 text-sm text-slate-500">How regularly you showed up in 30 days</p>

              <div className="mt-6 flex items-center justify-center">
                <div
                  className="grid h-44 w-44 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(#4f46e5 ${view.completionRate}%, #e2e8f0 ${view.completionRate}% 100%)`,
                  }}
                >
                  <div className="grid h-32 w-32 place-items-center rounded-full bg-white">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-slate-900">{view.completionRate}%</p>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Consistency</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-800">Total streak:</span> {view.totalStreak} days</p>
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Top Habits</h2>
              <p className="mt-1 text-sm text-slate-500">Highest streak habits first</p>

              <div className="mt-4 space-y-3">
                {view.topHabits.map((habit, idx) => (
                  <div key={habit._id} className="rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800">{idx + 1}. {habit.title}</p>
                      <span className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-700">{habit.streak ?? 0}d</span>
                    </div>
                  </div>
                ))}

                {!habits.length && !loading && !error && (
                  <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                    No habits yet. Create one and your dashboard will populate automatically.
                  </p>
                )}
              </div>
            </article>
          </aside>
        </section>

        {loading && (
          <section className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">Loading dashboard data...</section>
        )}

        {error && (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</section>
        )}
      </div>
    </div>
  );
}

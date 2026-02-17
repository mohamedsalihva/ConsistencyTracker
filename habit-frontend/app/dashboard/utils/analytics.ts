import type { Habit } from "@/store/habitSlice";
import { DAYS, PALETTE } from "./theme";
import { formatDay, getLast } from "./date";

export function completionMap(habits: Habit[]) {
  const map: Record<string, number> = {};
  habits.forEach((h) =>
    h.history?.forEach((e) => {
      if (e.completed) map[e.date] = (map[e.date] ?? 0) + 1;
    }),
  );
  return map;
}

export function habitStreak(h: Habit) {
  let s = 0;
  const d = new Date();
  while (true) {
    const key = formatDay(d);
    if (h.history?.some((e) => e.date === key && e.completed)) {
      s++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return s;
}

export function buildDashboardView(habits: Habit[], chartMode: "14d" | "7d") {
  const today = new Date();
  const todayKey = formatDay(today);
  const map = completionMap(habits);
  const last35 = getLast(35);
  const last14 = getLast(14);
  const last7 = getLast(7);

  const todayCount = map[todayKey] ?? 0;
  const todayPct = habits.length ? Math.round((todayCount / habits.length) * 100) : 0;
  const totalDone = habits.flatMap((h) => h.history ?? []).filter((e) => e.completed).length;
  const activeDays = Object.keys(map).length;
  const maxStreak = Math.max(...habits.map(habitStreak), 0);
  const weekActive = last7.filter((d) => (map[formatDay(d)] ?? 0) > 0).length;
  const weekPct = Math.round((weekActive / 7) * 100);
  const monthStart = formatDay(new Date(today.getFullYear(), today.getMonth(), 1));
  const monthDone = habits.flatMap((h) => (h.history ?? []).filter((e) => e.completed && e.date >= monthStart)).length;
  const monthPct = Math.min(Math.round((monthDone / Math.max(habits.length * 30, 1)) * 100), 100);
  const allPct = Math.min(Math.round((totalDone / Math.max(habits.length * 90, 1)) * 100), 100);

  const chartData =
    chartMode === "14d"
      ? last14.map((d, i) => ({ label: `${d.getDate()}`, count: map[formatDay(d)] ?? 0, col: PALETTE[i % PALETTE.length] }))
      : last7.map((d, i) => ({ label: DAYS[d.getDay()].slice(0, 2), count: map[formatDay(d)] ?? 0, col: PALETTE[i % PALETTE.length] }));
  const maxBar = Math.max(...chartData.map((d) => d.count), 1);

  const topHabits = [...habits]
    .map((h) => {
      const total = h.history?.length ?? 0;
      const done = h.history?.filter((e) => e.completed).length ?? 0;
      return { ...h, pct: total ? Math.round((done / total) * 100) : 0, streak: habitStreak(h) };
    })
    .sort((a, b) => b.pct - a.pct);

  return { today, todayKey, map, last35, last7, todayCount, todayPct, totalDone, activeDays, maxStreak, weekPct, monthPct, allPct, chartData, maxBar, topHabits };
}



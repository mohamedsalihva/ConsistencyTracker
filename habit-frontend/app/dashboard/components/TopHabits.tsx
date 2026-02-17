import type { Habit } from "@/store/habitSlice";
import { PALETTE } from "../utils/theme";

type TopHabit = Habit & { pct: number; streak: number };

type TopHabitsProps = {
  topHabits: TopHabit[];
};

export function TopHabits({ topHabits }: TopHabitsProps) {
  return (
    <aside className="self-start overflow-hidden rounded-2xl border border-[#d6e6f8] bg-gradient-to-br from-[#fffafd] to-[#eaf5ff] shadow-[0_10px_30px_rgba(130,102,176,.14)]">
      <div className="border-b border-[#e5dcf2] px-4 py-4">
        <p className="text-sm font-bold">Top Habits</p>
        <p className="text-xs text-[#a09990]">ranked by completion rate</p>
      </div>

      {topHabits.map((habit, idx) => {
        const col = PALETTE[idx % PALETTE.length];
        return (
          <div key={habit._id} className="flex items-center gap-2 border-b border-[#e5dcf2] px-4 py-3 last:border-b-0 hover:bg-[#f4eefc]">
            <span className="w-4 text-[10px] text-[#a09990]">{String(idx + 1).padStart(2, "0")}</span>
            <span className={`h-2 w-2 rounded-full ${col.dotClass}`} />
            <span className="flex-1 truncate text-xs">{habit.title}</span>
            <span className={`text-xs ${col.textClass}`}>{habit.pct}%</span>
          </div>
        );
      })}
    </aside>
  );
}

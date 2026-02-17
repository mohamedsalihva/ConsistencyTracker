import { motion } from "framer-motion";
import type { Habit } from "@/store/habitSlice";
import { PALETTE } from "../utils/theme";
import { Medal, TrendingUp } from "lucide-react";

type TopHabit = Habit & { pct: number; streak: number };

type TopHabitsProps = {
  topHabits: TopHabit[];
};

export function TopHabits({ topHabits }: TopHabitsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.45 }}
      className="glass-card p-6"
    >
      <div className="mb-5 flex items-center gap-2">
        <Medal className="h-4 w-4 text-peach" />
        <div>
          <p className="text-sm font-bold text-foreground">Top Habits</p>
          <p className="text-xs text-muted-foreground">ranked by completion rate</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {topHabits.map((habit, idx) => {
          const col = PALETTE[idx % PALETTE.length];
          const isTop = idx === 0;
          return (
            <motion.div
              key={habit._id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.08 }}
              whileHover={{ x: 4, transition: { duration: 0.15 } }}
              className={`group flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-200 ${
                isTop ? "border-peach/30 bg-peach-soft/50 shadow-sm" : "border-border bg-card/50 hover:bg-card/80 hover:shadow-sm"
              }`}
            >
              <span className={`font-serif text-lg ${isTop ? "text-peach" : "text-muted-foreground"}`}>{String(idx + 1).padStart(2, "0")}</span>
              <div className="h-3 w-3 rounded-full transition-transform duration-200 group-hover:scale-125" style={{ background: col.fill }} />
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">{habit.title}</span>
                {habit.streak > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                    <TrendingUp className="h-2.5 w-2.5" /> {habit.streak}d streak
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="font-serif text-lg font-semibold" style={{ color: col.fill }}>
                  {habit.pct}%
                </span>
              </div>
            </motion.div>
          );
        })}

        {topHabits.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No habits yet. Create one to get started.</p>}
      </div>
    </motion.section>
  );
}

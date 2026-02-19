import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Pencil, Trash2 } from "lucide-react";
import type { Habit } from "@/store/habitSlice";
import { habitStreak } from "../utils/analytics";
import { formatDay } from "../utils/date";
import { PALETTE } from "../utils/theme";

type MatrixProps = {
  habits: Habit[];
  last35: Date[];
  todayKey: string;
  completedToday: (habitId: string) => void | Promise<void>;
  onRenameHabit: (habitId: string, title: string) => void | Promise<void>;
  onDeleteHabit: (habitId: string) => void | Promise<void>;
};

export function Matrix({
  habits,
  last35,
  todayKey,
  completedToday,
  onDeleteHabit,
  onRenameHabit,
}: MatrixProps) {
  const [celebrateId, setCelebrateId] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.45 }}
      className="glass-card overflow-hidden p-6"
    >
      <style>{`
        @keyframes confetti-pop {
          from { transform: translateY(0) scale(1); opacity:1; }
          to { transform: translateY(-18px) scale(.3); opacity:0; }
        }
      `}</style>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-foreground">
            35-Day Consistency Matrix
          </p>
          <p className="text-xs text-muted-foreground">
            click today&apos;s cell to mark complete
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-lavender" />{" "}
            Done
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-border" />{" "}
            Missed
          </span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <table className="w-full border-collapse" style={{ minWidth: 600 }}>
          <thead>
            <tr>
              <th className="w-[130px]" />
              {last35.map((d, i) => {
                const isToday = formatDay(d) === todayKey;
                return (
                  <th
                    key={i}
                    className={`px-px text-center text-[8px] font-normal ${isToday ? "font-bold text-primary" : "text-muted-foreground"}`}
                  >
                    {d.getDate()}
                  </th>
                );
              })}
              <th className="w-[40px]" />
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, rowIdx) => {
              const col = PALETTE[rowIdx % PALETTE.length];
              const streak = habitStreak(habit);
              return (
                <tr key={habit._id} className="group/row">
                  <td className="py-1 pr-2">
                    <div className="group/title flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: col.fill }}
                      />
                      <span className="truncate text-xs font-medium text-foreground">
                        {habit.title}
                      </span>

                      <div className="ml-auto flex items-center gap-1 rounded-lg border border-border/70 bg-card/80 p-0.5 opacity-0 shadow-sm transition-opacity group-hover/row:opacity-100">
                        <button
                          type="button"
                          aria-label="Rename habit"
                          title="Rename"
                          onClick={() => {
                            const next = window.prompt(
                              "Rename habit",
                              habit.title,
                            );
                            if (!next || !next.trim()) return;
                            void onRenameHabit(habit._id, next);
                          }}
                          className="rounded-md p-1 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          aria-label="Delete habit"
                          title="Delete"
                          onClick={() => {
                            if (!window.confirm("Delete this habit?")) return;
                            void onDeleteHabit(habit._id);
                          }}
                          className="rounded-md p-1 text-muted-foreground transition-all hover:bg-rose-soft hover:text-destructive focus:outline-none focus:ring-2 focus:ring-destructive/20"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {last35.map((d, i) => {
                    const dayKey = formatDay(d);
                    const isToday = dayKey === todayKey;
                    const done = !!habit.history?.some(
                      (e) => e.date === dayKey && e.completed,
                    );
                    const cellKey = `${habit._id}-${i}`;
                    const isHovered = hoveredCell === cellKey;

                    return (
                      <td key={i} className="px-px py-0.5">
                        <motion.div
                          className={`relative mx-auto flex h-[16px] w-[16px] items-center justify-center rounded-[4px] transition-all duration-150 ${
                            isToday && !done
                              ? "cursor-pointer ring-2 ring-primary/30 ring-offset-1"
                              : ""
                          }`}
                          style={{
                            background: done
                              ? col.fill
                              : isToday && isHovered
                                ? `${col.fill}40`
                                : "hsl(var(--border))",
                            opacity: done ? 1 : isToday ? 0.7 : 0.3,
                          }}
                          animate={
                            celebrateId === habit._id && isToday
                              ? { scale: [1, 1.6, 1] }
                              : {}
                          }
                          transition={{ duration: 0.4 }}
                          onMouseEnter={() => setHoveredCell(cellKey)}
                          onMouseLeave={() => setHoveredCell(null)}
                          onClick={() => {
                            if (!isToday || done) return;
                            setCelebrateId(habit._id);
                            void completedToday(habit._id);
                            setTimeout(() => setCelebrateId(null), 700);
                          }}
                        >
                          {done && (
                            <Check
                              className="h-2.5 w-2.5 text-primary-foreground"
                              strokeWidth={3}
                            />
                          )}
                          {celebrateId === habit._id && isToday && (
                            <>
                              <span
                                className="absolute -left-1.5 -top-1.5 h-2 w-2 rounded-full bg-peach"
                                style={{
                                  animation: "confetti-pop .6s forwards",
                                }}
                              />
                              <span
                                className="absolute -right-1.5 -top-1.5 h-2 w-2 rounded-full bg-mint"
                                style={{
                                  animation: "confetti-pop .6s .1s forwards",
                                }}
                              />
                              <span
                                className="absolute -top-2.5 left-0.5 h-2 w-2 rounded-full bg-rose"
                                style={{
                                  animation: "confetti-pop .6s .2s forwards",
                                }}
                              />
                              <span
                                className="absolute -bottom-1 left-1 h-1.5 w-1.5 rounded-full bg-sky"
                                style={{
                                  animation: "confetti-pop .6s .15s forwards",
                                }}
                              />
                            </>
                          )}
                          {isToday && !done && isHovered && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-[7px] font-bold"
                              style={{ color: col.fill }}
                            >
                              +
                            </motion.span>
                          )}
                        </motion.div>
                      </td>
                    );
                  })}
                  <td className="pl-2">
                    {streak > 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] font-semibold text-primary">
                        🔥 {streak}d
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

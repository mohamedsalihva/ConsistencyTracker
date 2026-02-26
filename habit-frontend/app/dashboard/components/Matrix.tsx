import { motion } from "framer-motion";
import { CheckCircle2, Droplets, Pencil, PlusCircle, Sparkles, Sun, Trash2 } from "lucide-react";
import type { Habit } from "@/store/habitSlice";
import { PALETTE } from "../utils/theme";

type MatrixProps = {
  habits: Habit[];
  last35: Date[];
  todayKey: string;
  completedToday: (habitId: string) => void | Promise<void>;
  onToggleCheckin: (
    habitId: string,
    date: string,
    completed: boolean,
  ) => void | Promise<void>;
  onRenameHabit: (habitId: string, title: string) => void | Promise<void>;
  onDeleteHabit: (habitId: string) => void | Promise<void>;
};

const icons = [Droplets, Sparkles, Sun];

export function Matrix({
  habits,
  todayKey,
  completedToday,
  onDeleteHabit,
  onRenameHabit,
  onToggleCheckin,
}: MatrixProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.45 }}
      className="glass-card overflow-hidden p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-black tracking-tight text-foreground">Daily Habits Matrix</h2>
          <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Grid View
          </span>
        </div>
        <p className="text-xs font-semibold text-primary">Tap tile to toggle today</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit, idx) => {
          const palette = PALETTE[idx % PALETTE.length];
          const Icon = icons[idx % icons.length];
          const doneToday = !!habit.history?.some((e) => e.date === todayKey && e.completed);

          return (
            <motion.div
              key={habit._id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (doneToday) {
                  void onToggleCheckin(habit._id, todayKey, false);
                } else {
                  void completedToday(habit._id);
                }
              }}
              className={`glass-card-hover relative cursor-pointer rounded-2xl border p-5 ${
                doneToday ? "border-primary/55 bg-primary/15 shadow-[0_10px_0_0_rgba(166,72,18,.72)]" : "border-white/10 bg-white/5"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className="rounded-xl p-2.5"
                  style={{
                    background: doneToday ? "rgba(255,123,26,0.24)" : "rgba(255,255,255,0.06)",
                    boxShadow: doneToday ? "inset 0 1px 1px rgba(255,255,255,0.2)" : "none",
                  }}
                >
                  <Icon className="h-4 w-4" style={{ color: doneToday ? "var(--color-primary)" : palette.fill }} />
                </div>
                {doneToday ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-white/25" />
                )}
              </div>

              <h3 className="text-2xl font-black leading-tight text-foreground">{habit.title}</h3>
              <p className={`mt-1 text-sm font-medium ${doneToday ? "text-primary" : "text-muted-foreground"}`}>
                {doneToday ? "Completed today" : "Tap to mark complete"}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const next = window.prompt("Rename habit", habit.title);
                    if (!next || !next.trim()) return;
                    void onRenameHabit(habit._id, next);
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
                  aria-label="Rename habit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!window.confirm("Delete this habit?")) return;
                    void onDeleteHabit(habit._id);
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-muted-foreground transition hover:bg-destructive/20 hover:text-destructive"
                  aria-label="Delete habit"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}

        <div className="flex min-h-[188px] items-center justify-center rounded-2xl border-2 border-dashed border-white/12 bg-white/5 text-muted-foreground">
          <div className="text-center">
            <PlusCircle className="mx-auto h-7 w-7" />
            <p className="mt-2 text-sm font-semibold">Add Habit</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

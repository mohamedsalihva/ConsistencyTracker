import { useState } from "react";
import type { Habit } from "@/store/habitSlice";
import { habitStreak } from "../utils/analytics";
import { formatDay } from "../utils/date";
import { PALETTE } from "../utils/theme";

type MatrixProps = {
  habits: Habit[];
  last35: Date[];
  todayKey: string;
  completedToday: (habitId: string) => Promise<void>;
};

export function Matrix({ habits, last35, todayKey, completedToday }: MatrixProps) {
  const [celebrateId, setCelebrateId] = useState<string | null>(null);

  return (
    <section className="overflow-hidden rounded-2xl border border-[#ddd3f0] bg-gradient-to-br from-[#fffcff] to-[#f0ecfb] shadow-[0_10px_30px_rgba(130,102,176,.14)]">
      <style>{`
        @keyframes confetti {
          from { transform: translateY(0) scale(1); opacity:1; }
          to { transform: translateY(-12px) scale(.5); opacity:0; }
        }
      `}</style>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5dcf2] px-5 py-4">
        <div>
          <p className="text-sm font-bold">35-Day Consistency Matrix</p>
          <p className="text-xs text-[#a09990]">each square = one day</p>
        </div>
      </div>

      <div className="overflow-x-auto px-5 pb-5 pt-4">
        <div className="min-w-[860px]">
          <div className="mb-2 flex gap-[5px] pl-44">
            {last35.map((d, i) => (
              <div key={i} className="w-[18px] text-center text-[8px] text-[#a09990]">
                {d.getDate()}
              </div>
            ))}
          </div>

          {habits.map((habit, rowIdx) => {
            const col = PALETTE[rowIdx % PALETTE.length];
            const streak = habitStreak(habit);

            return (
              <div key={habit._id} className="flex items-center gap-[5px] rounded-lg px-1.5 py-1 hover:bg-[#f4eefc]">
                <div className="flex w-[170px] items-center gap-2">
                  <div className={`h-4 w-[3px] rounded-full ${col.dotClass}`} />
                  <span className="truncate text-xs text-[#6b6560]">{habit.title}</span>
                </div>

                {last35.map((d, i) => {
                  const dayKey = formatDay(d);
                  const isToday = dayKey === todayKey;
                  const doneToday = !!habit.history?.some((entry) => entry.date === dayKey && entry.completed);

                  return (
                    <div
                      key={i}
                      className={`relative h-[18px] w-[18px] rounded ${
                        doneToday ? col.fillClass : "bg-[#e5dcf2]"
                      } ${isToday ? `outline outline-2 ${col.outlineClass}` : ""} ${isToday && !doneToday ? "cursor-pointer" : ""}`}
                      onClick={() => {
                        if (!isToday || doneToday) return;
                        setCelebrateId(habit._id);
                        void completedToday(habit._id);
                        setTimeout(() => setCelebrateId(null), 600);
                      }}
                      style={{
                        transition: "transform .15s",
                        transform: celebrateId === habit._id && isToday ? "scale(1.6)" : "scale(1)",
                      }}
                    >
                      {celebrateId === habit._id && isToday && (
                        <>
                          <span className={`absolute left-[4px] top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full ${col.dotClass}`} style={{ animation: "confetti .6s ease forwards" }} />
                          <span className={`absolute left-[10px] top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full ${col.fillClass}`} style={{ animation: "confetti .6s ease forwards" }} />
                          <span className="absolute left-[16px] top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full bg-[#f7c5a0]" style={{ animation: "confetti .6s ease forwards" }} />
                        </>
                      )}
                    </div>
                  );
                })}

                {streak > 0 && <span className="ml-1 text-[10px] text-[#e8925a]">{streak}d</span>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

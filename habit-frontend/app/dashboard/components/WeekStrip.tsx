import { motion } from "framer-motion";
import { DAYS, PALETTE } from "../utils/theme";
import { formatDay } from "../utils/date";
import { Star } from "lucide-react";

type WeekStripProps = {
  last7: Date[];
  map: Record<string, number>;
  habitsCount: number;
  todayKey: string;
};

export function WeekStrip({ last7, map, habitsCount, todayKey }: WeekStripProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.45 }}
      className="glass-card mt-5 overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2 px-6 pb-2 pt-5">
        <p className="text-sm font-bold text-foreground">This Week</p>
        <p className="text-xs text-muted-foreground">daily completion %</p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 xl:grid-cols-7">
        {last7.map((d, i) => {
          const count = map[formatDay(d)] ?? 0;
          const pct = habitsCount ? Math.round((count / habitsCount) * 100) : 0;
          const col = PALETTE[i % PALETTE.length];
          const isToday = formatDay(d) === todayKey;
          const isPerfect = pct === 100;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 + i * 0.04 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className={`relative rounded-xl border px-3 py-4 text-center transition-all duration-200 ${
                isToday ? "border-primary/30 bg-secondary shadow-md ring-2 ring-primary/10" : "border-border bg-card/50 hover:bg-card/80 hover:shadow-sm"
              }`}
            >
              {isToday && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-primary shadow-sm">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
                </span>
              )}
              {isPerfect && <Star className="absolute -left-1 -top-1 h-3.5 w-3.5 fill-peach text-peach" />}
              <p className="text-[9px] font-semibold uppercase text-muted-foreground">{DAYS[d.getDay()]}</p>
              <p className="font-serif text-3xl leading-none text-foreground">{d.getDate()}</p>
              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-border/60">
                <motion.div className="h-full rounded-full" style={{ background: col.fill }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.7 + i * 0.05, duration: 0.5 }} />
              </div>
              <p className="mt-1.5 text-[10px] font-semibold" style={{ color: col.fill }}>
                {pct}%
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

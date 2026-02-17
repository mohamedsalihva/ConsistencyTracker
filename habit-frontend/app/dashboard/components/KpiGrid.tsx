import { motion } from "framer-motion";
import { Target, CheckCircle, Flame, Trophy } from "lucide-react";

type KpiGridProps = {
  habitsCount: number;
  todayCount: number;
  maxStreak: number;
  totalDone: number;
};

type CardTone = "lavender" | "rose" | "mint" | "peach";

const cards: { label: string; sub: string; tone: CardTone; key: keyof KpiGridProps; icon: React.ReactNode }[] = [
  { label: "Total Habits", sub: "being tracked", tone: "lavender", key: "habitsCount", icon: <Target className="h-5 w-5" /> },
  { label: "Done Today", sub: "habits", tone: "rose", key: "todayCount", icon: <CheckCircle className="h-5 w-5" /> },
  { label: "Best Streak", sub: "consecutive days", tone: "mint", key: "maxStreak", icon: <Flame className="h-5 w-5" /> },
  { label: "All-Time Done", sub: "total completions", tone: "peach", key: "totalDone", icon: <Trophy className="h-5 w-5" /> },
];

const toneMap = {
  lavender: {
    card: "border-lavender/20 bg-gradient-to-br from-lavender-soft/60 to-lavender-soft",
    bar: "from-lavender to-lavender/30",
    icon: "text-lavender bg-lavender/10",
  },
  rose: {
    card: "border-rose/20 bg-gradient-to-br from-rose-soft/60 to-rose-soft",
    bar: "from-rose to-rose/30",
    icon: "text-rose bg-rose/10",
  },
  mint: {
    card: "border-mint/20 bg-gradient-to-br from-mint-soft/60 to-mint-soft",
    bar: "from-mint to-mint/30",
    icon: "text-mint bg-mint/10",
  },
  peach: {
    card: "border-peach/20 bg-gradient-to-br from-peach-soft/60 to-peach-soft",
    bar: "from-peach to-peach/30",
    icon: "text-peach bg-peach/10",
  },
};

export function KpiGrid(props: KpiGridProps) {
  return (
    <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c, i) => {
        const t = toneMap[c.tone];
        const val = props[c.key];
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`group relative cursor-default overflow-hidden rounded-2xl border ${t.card} px-5 pb-5 pt-6 shadow-lg backdrop-blur-xl transition-shadow duration-300 hover:shadow-xl`}
          >
            <div className={`absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r ${t.bar}`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-muted-foreground">{c.label}</p>
                <motion.p key={String(val)} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-1.5 font-serif text-4xl leading-none text-foreground">
                  {val}
                </motion.p>
                <p className="mt-1.5 text-xs text-muted-foreground">{c.key === "todayCount" ? `of ${props.habitsCount} habits` : c.sub}</p>
              </div>
              <div className={`rounded-xl p-2.5 ${t.icon} transition-transform duration-300 group-hover:scale-110`}>{c.icon}</div>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}

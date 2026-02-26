import { motion } from "framer-motion";
import { CheckCircle, Flame, Trophy } from "lucide-react";

type KpiGridProps = {
  habitsCount: number;
  todayCount: number;
  maxStreak: number;
  totalDone: number;
};

type CardTone = "cyan" | "blue" | "purple";

const cards: { label: string; value: (p: KpiGridProps) => string; tone: CardTone; icon: React.ReactNode; chip: string }[] = [
  { label: "Current Streak", value: (p) => `${p.maxStreak} Days`, tone: "cyan", icon: <Flame className="h-5 w-5" />, chip: "+2% IQ" },
  { label: "Daily Progress", value: (p) => `${p.todayCount}/${p.habitsCount} Habits`, tone: "blue", icon: <CheckCircle className="h-5 w-5" />, chip: "+5% Energy" },
  { label: "Total Points", value: (p) => `${p.totalDone} XP`, tone: "purple", icon: <Trophy className="h-5 w-5" />, chip: "+10% Focus" },
];

const toneMap = {
  cyan: {
    icon: "bg-primary/15 text-primary",
    chip: "bg-mint/15 text-mint",
    border: "border-primary/30",
  },
  blue: {
    icon: "bg-rose/20 text-rose",
    chip: "bg-peach/20 text-peach",
    border: "border-rose/30",
  },
  purple: {
    icon: "bg-peach/20 text-peach",
    chip: "bg-primary/15 text-primary",
    border: "border-peach/30",
  },
};

export function KpiGrid(props: KpiGridProps) {
  return (
    <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((c, i) => {
        const t = toneMap[c.tone];
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className={`glass-card glass-card-hover overflow-hidden rounded-2xl border ${t.border} p-5`}
          >
            <div className="mb-5 flex items-start justify-between">
              <div className={`rounded-xl p-3 ${t.icon}`}>{c.icon}</div>
              <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${t.chip}`}>{c.chip}</span>
            </div>
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <h3 className="mt-1 text-4xl font-black text-foreground">{c.value(props)}</h3>
          </motion.div>
        );
      })}
    </section>
  );
}

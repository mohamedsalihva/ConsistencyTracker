import { motion } from "framer-motion";
import { Sparkles, Flame, CalendarCheck } from "lucide-react";
import { MONTHS, MONTHS_S } from "../utils/theme";

type HeroProps = {
  today: Date;
  habitsCount: number;
  todayPct: number;
  maxStreak: number;
  activeDays: number;
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getMotivation(pct: number) {
  if (pct === 100) return "Perfect day! Keep it up!";
  if (pct >= 75) return "Almost there, you're crushing it!";
  if (pct >= 50) return "Halfway done, stay focused!";
  if (pct > 0) return "Great start, keep going!";
  return "Let's make today count!";
}

export function Hero({ today, habitsCount, todayPct, maxStreak, activeDays }: HeroProps) {
  const chips = [
    { label: `${todayPct}% today`, variant: "lavender" as const, icon: <Sparkles className="h-3 w-3" /> },
    { label: `${maxStreak}d streak`, variant: "peach" as const, icon: <Flame className="h-3 w-3" /> },
    { label: `${activeDays} active days`, variant: "mint" as const, icon: <CalendarCheck className="h-3 w-3" /> },
  ];

  const chipStyles = {
    lavender: "border-lavender/30 bg-lavender-soft text-lavender",
    peach: "border-peach/30 bg-peach-soft text-peach",
    mint: "border-mint/30 bg-mint-soft text-mint",
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card relative overflow-hidden p-6 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-lavender/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-rose/10 blur-3xl" />

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm text-muted-foreground">
        {getGreeting()}
      </motion.p>
      <h1 className="gradient-text mt-1 font-serif text-5xl leading-none sm:text-6xl lg:text-7xl">{MONTHS[today.getMonth()]}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {String(today.getDate()).padStart(2, "0")} {MONTHS_S[today.getMonth()]} {today.getFullYear()} · {habitsCount} habit{habitsCount !== 1 ? "s" : ""}
      </p>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-2 text-xs font-medium text-primary/80"
      >
        {getMotivation(todayPct)}
      </motion.p>

      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((chip, i) => (
          <motion.span
            key={chip.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className={`chip flex items-center gap-1.5 ${chipStyles[chip.variant]}`}
          >
            {chip.icon}
            {chip.label}
          </motion.span>
        ))}
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Today&apos;s progress</span>
          <span className="font-semibold text-primary">{todayPct}%</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-border/60">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--gradient-cta)" }}
            initial={{ width: 0 }}
            animate={{ width: `${todayPct}%` }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.section>
  );
}

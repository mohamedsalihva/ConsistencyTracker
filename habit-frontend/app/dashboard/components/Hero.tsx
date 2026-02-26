import { motion } from "framer-motion";
import { Bolt, History } from "lucide-react";

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

export function Hero({ todayPct }: HeroProps) {
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (circumference * todayPct) / 100;

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="glass-card relative overflow-hidden border-primary/20 p-6 sm:p-8"
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-60 w-60 rounded-full bg-primary/15 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-rose/20 blur-[100px]" />

      <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">{todayPct >= 75 ? "In the zone" : "Keep building"}</p>
          <h1 className="mt-2 text-5xl font-black leading-[0.95] sm:text-6xl">
            <span className="text-foreground">{getGreeting()},</span>
            <br />
            <span className="gradient-text italic">champ!</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            You&apos;ve completed <span className="font-semibold text-foreground">{todayPct}%</span> of your daily rituals. Keep momentum and finish strong.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-cta inline-flex items-center gap-2 px-7 py-3">
              <Bolt className="h-4 w-4" />
              Start Focus Mode
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-foreground transition hover:bg-white/10">
              <History className="h-4 w-4" />
              View History
            </button>
          </div>
        </div>

        <div className="relative mx-auto h-48 w-48 sm:h-56 sm:w-56 lg:mx-0">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 192 192">
            <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/10" />
            <motion.circle
              cx="96"
              cy="96"
              r={radius}
              stroke="var(--color-primary)"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              strokeLinecap="round"
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
              style={{ filter: "drop-shadow(0 0 10px rgba(255,123,26,0.65))" }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-foreground">{todayPct}%</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Daily Goal</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

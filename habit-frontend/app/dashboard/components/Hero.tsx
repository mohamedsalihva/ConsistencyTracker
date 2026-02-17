import { MONTHS, MONTHS_S } from "../utils/theme";

type HeroProps = {
  today: Date;
  habitsCount: number;
  todayPct: number;
  maxStreak: number;
  activeDays: number;
};

export function Hero({ today, habitsCount, todayPct, maxStreak, activeDays }: HeroProps) {
  return (
    <section className="rounded-2xl border border-[#e5dcf2] bg-gradient-to-br from-[#ede8f7] to-[#fde8ed] p-5 shadow-[0_10px_30px_rgba(130,102,176,.14)] sm:p-7">
      <p className="text-[11px] uppercase tracking-[0.12em] text-[#8b77c2]">Habit Tracker</p>
      <h1
        className="mt-1 bg-gradient-to-r from-[#7f63b7] via-[#e87797] to-[#5ca8dc] bg-clip-text font-serif text-4xl leading-none text-transparent sm:text-5xl lg:text-6xl"
      >
        {MONTHS[today.getMonth()]}
      </h1>
      <p className="mt-2 text-sm text-[#6b6560]">
        {String(today.getDate()).padStart(2, "0")} {MONTHS_S[today.getMonth()]} {today.getFullYear()} · {habitsCount} habits
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-[#b8a9d9] bg-[#ede8f7] px-2.5 py-1 text-xs text-[#8b77c2]">{todayPct}% today</span>
        <span className="rounded-full border border-[#f7c5a0] bg-[#fef0e6] px-2.5 py-1 text-xs text-[#e8925a]">{maxStreak}d streak</span>
        <span className="rounded-full border border-[#90cfc0] bg-[#ddf2ed] px-2.5 py-1 text-xs text-[#4db6a0]">{activeDays} active days</span>
      </div>
    </section>
  );
}


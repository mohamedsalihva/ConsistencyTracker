type KpiGridProps = {
  habitsCount: number;
  todayCount: number;
  maxStreak: number;
  totalDone: number;
};

type CardTone = "lav" | "pink" | "mint" | "peach";

export function KpiGrid({ habitsCount, todayCount, maxStreak, totalDone }: KpiGridProps) {
  return (
    <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card label="Total Habits" value={habitsCount} sub="being tracked" tone="lav" />
      <Card label="Done Today" value={todayCount} sub={`of ${habitsCount} habits`} tone="pink" />
      <Card label="Best Streak" value={maxStreak} sub="consecutive days" tone="mint" />
      <Card label="All-Time Done" value={totalDone} sub="total completions" tone="peach" />
    </section>
  );
}

function Card({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string | number;
  sub: string;
  tone: CardTone;
}) {
  const toneClasses = {
    lav: {
      card: "from-[#fffaff] to-[#f1e9ff]",
      bar: "from-[#b8a9d9] to-[#ede8f7]",
    },
    pink: {
      card: "from-[#fff9fb] to-[#ffeaf1]",
      bar: "from-[#f4a7b9] to-[#fde8ed]",
    },
    mint: {
      card: "from-[#f7fffd] to-[#e6f8f3]",
      bar: "from-[#90cfc0] to-[#ddf2ed]",
    },
    peach: {
      card: "from-[#fffaf5] to-[#fff0e4]",
      bar: "from-[#f7c5a0] to-[#fef0e6]",
    },
  }[tone];

  return (
    <div className={`relative rounded-2xl border border-[#e5dcf2] bg-gradient-to-br ${toneClasses.card} px-4 pb-4 pt-5 shadow-[0_8px_24px_rgba(141,116,184,.12)]`}>
      <div className={`absolute left-0 right-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r ${toneClasses.bar}`} />
      <p className="mt-1 text-[11px] uppercase tracking-[.1em] text-[#a09990]">{label}</p>
      <p className="mt-1 font-serif text-4xl leading-none text-[#2d2a26]">{value}</p>
      <p className="mt-1 text-xs text-[#a09990]">{sub}</p>
    </div>
  );
}

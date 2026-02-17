import { T } from "../utils/theme";

type RingSectionProps = {
  todayPct: number;
  weekPct: number;
  monthPct: number;
  allPct: number;
};

export function RingSection({ todayPct, weekPct, monthPct, allPct }: RingSectionProps) {
  return (
    <section className="rounded-2xl border border-[#cfeee2] bg-gradient-to-br from-white to-[#ecfbf5] p-5 shadow-[0_10px_30px_rgba(130,102,176,.14)]">
      <p className="mb-4 text-sm font-bold">Completion Overview</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Meter pct={todayPct} stroke={T.lavender} label="Today" />
        <Meter pct={weekPct} stroke={T.mint} label="Week" />
        <Meter pct={monthPct} stroke={T.pink} label="Month" />
        <Meter pct={allPct} stroke={T.peach} label="All-Time" />
      </div>
    </section>
  );
}

function Meter({ pct, stroke, label }: { pct: number; stroke: string; label: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="74" height="74" viewBox="0 0 74 74">
        <circle cx="37" cy="37" r={r} fill="none" stroke="#f0ece6" strokeWidth="7" />
        <circle cx="37" cy="37" r={r} fill="none" stroke={stroke} strokeWidth="7" strokeDasharray={`${dash} ${c}`} strokeLinecap="round" transform="rotate(-90 37 37)" />
        <text x="37" y="41" textAnchor="middle" fontSize="13" fontWeight="700" fill={T.text} style={{ fontFamily: "serif" }}>
          {pct}%
        </text>
      </svg>
      <span className="text-[10px] uppercase tracking-[.1em] text-[#a09990]">{label}</span>
    </div>
  );
}


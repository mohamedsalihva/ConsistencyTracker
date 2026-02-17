import { DAYS, PALETTE } from "../utils/theme";
import { formatDay } from "../utils/date";

type WeekStripProps = {
  last7: Date[];
  map: Record<string, number>;
  habitsCount: number;
  todayKey: string;
};

export function WeekStrip({ last7, map, habitsCount, todayKey }: WeekStripProps) {
  return (
    <section className="mt-4 overflow-hidden rounded-2xl border border-[#e6d9cc] bg-gradient-to-br from-[#fff9f4] to-[#edf7ff] shadow-[0_10px_30px_rgba(130,102,176,.14)]">
      <div className="flex items-center justify-between gap-2 px-5 pb-1 pt-4">
        <p className="text-sm font-bold">This Week</p>
        <p className="text-xs text-[#a09990]">daily completion %</p>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4 xl:grid-cols-7">
        {last7.map((d, i) => {
          const count = map[formatDay(d)] ?? 0;
          const pct = habitsCount ? Math.round((count / habitsCount) * 100) : 0;
          const col = PALETTE[i % PALETTE.length];
          const isToday = formatDay(d) === todayKey;

          return (
            <div
              key={i}
              className={`rounded-xl border px-2 py-3 text-center ${
                isToday ? "border-[#b8a9d9] bg-[#ede8f7]" : "border-[#e5dcf2] bg-[#f4eefc]"
              }`}
            >
              <p className="text-[9px] text-[#a09990]">{DAYS[d.getDay()]}</p>
              <p className="font-serif text-3xl leading-none">{d.getDate()}</p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#e5dcf2]">
                <div className={`h-full ${col.fillClass}`} style={{ width: `${pct}%` }} />
              </div>
              <p className={`mt-1 text-[10px] ${col.textClass}`}>{pct}%</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

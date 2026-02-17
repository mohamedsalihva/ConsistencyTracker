type ChartPoint = { label: string; count: number; col: { fill: string } };

type DailyChartProps = {
  chartMode: "14d" | "7d";
  setChartMode: (mode: "14d" | "7d") => void;
  chartData: ChartPoint[];
  maxBar: number;
};

export function DailyChart({ chartMode, setChartMode, chartData, maxBar }: DailyChartProps) {
  return (
    <section className="rounded-2xl border border-[#cde3f5] bg-gradient-to-br from-white to-[#e9f4ff] p-5 shadow-[0_10px_30px_rgba(130,102,176,.14)] sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold">Daily Activity</p>
          <p className="text-xs text-[#a09990]">completions/day</p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setChartMode("14d")}
            className={`rounded-full border px-2.5 py-1 text-xs ${
              chartMode === "14d"
                ? "border-[#b8a9d9] bg-[#ede8f7] text-[#8b77c2]"
                : "border-[#e5dcf2] bg-transparent text-[#6b6560]"
            }`}
          >
            14 days
          </button>
          <button
            onClick={() => setChartMode("7d")}
            className={`rounded-full border px-2.5 py-1 text-xs ${
              chartMode === "7d"
                ? "border-[#b8a9d9] bg-[#ede8f7] text-[#8b77c2]"
                : "border-[#e5dcf2] bg-transparent text-[#6b6560]"
            }`}
          >
            This week
          </button>
        </div>
      </div>

      <div className="flex h-[140px] items-end gap-1.5">
        {chartData.map((d, i) => {
          const h = Math.max((d.count / maxBar) * 116, d.count ? 8 : 3);
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t-md" style={{ height: h, background: d.count ? d.col.fill : "#e5dcf2" }} />
              <span className="text-[9px] text-[#a09990]">{d.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

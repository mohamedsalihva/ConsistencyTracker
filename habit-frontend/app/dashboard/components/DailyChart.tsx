import { T } from "../utils/theme";

type ChartPoint = { label: string; count: number; col: { fill: string } };

type DailyChartProps = {
  chartMode: "14d" | "7d";
  setChartMode: (mode: "14d" | "7d") => void;
  chartData: ChartPoint[];
  maxBar: number;
  cardStyle: React.CSSProperties;
};

export function DailyChart({ chartMode, setChartMode, chartData, maxBar, cardStyle }: DailyChartProps) {
  return (
    <section className="hero-card reveal" style={{ ...cardStyle, background: "linear-gradient(135deg,#ffffff,#e9f4ff)", borderColor: "#cde3f5", padding: "24px 24px", ["--d" as string]: "150ms" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 14 }}>Daily Activity</p>
          <p style={{ color: T.text3, fontSize: 11 }}>completions/day</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setChartMode("14d")} style={{ border: `1px solid ${chartMode === "14d" ? T.lavender : T.border}`, background: chartMode === "14d" ? T.lavL : "transparent", color: chartMode === "14d" ? T.lavD : T.text2, borderRadius: 999, padding: "5px 11px", fontSize: 11 }}>14 days</button>
          <button onClick={() => setChartMode("7d")} style={{ border: `1px solid ${chartMode === "7d" ? T.lavender : T.border}`, background: chartMode === "7d" ? T.lavL : "transparent", color: chartMode === "7d" ? T.lavD : T.text2, borderRadius: 999, padding: "5px 11px", fontSize: 11 }}>This week</button>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "end", height: 140, gap: 5 }}>
        {chartData.map((d, i) => {
          const h = Math.max((d.count / maxBar) * 116, d.count ? 8 : 3);
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", height: h, borderRadius: "6px 6px 0 0", background: d.count ? d.col.fill : T.border }} />
              <span style={{ fontSize: 9, color: T.text3 }}>{d.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}


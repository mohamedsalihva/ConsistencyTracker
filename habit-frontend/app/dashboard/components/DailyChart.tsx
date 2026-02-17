import { useState } from "react";
import { motion } from "framer-motion";

type ChartPoint = { label: string; count: number; col: { fill: string } };

type DailyChartProps = {
  chartMode: "14d" | "7d";
  setChartMode: (mode: "14d" | "7d") => void;
  chartData: ChartPoint[];
  maxBar: number;
};

export function DailyChart({ chartMode, setChartMode, chartData, maxBar }: DailyChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card relative overflow-hidden p-6 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-sky/10 blur-3xl" />

      <div className="mb-5 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-foreground">Daily Activity</p>
          <p className="text-xs text-muted-foreground">completions / day</p>
        </div>
        <div className="flex gap-1.5">
          {(["14d", "7d"] as const).map((mode) => (
            <button key={mode} onClick={() => setChartMode(mode)} className={`chip ${chartMode === mode ? "chip-active" : "chip-inactive"}`}>
              {mode === "14d" ? "14 days" : "This week"}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex h-[150px] items-end gap-1.5">
        {chartData.map((d, i) => {
          const h = Math.max((d.count / maxBar) * 126, d.count ? 10 : 4);
          const isHovered = hoveredIdx === i;
          return (
            <motion.div
              key={i}
              className="group relative flex flex-1 flex-col items-center gap-1.5"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3 + i * 0.03, duration: 0.4, ease: "backOut" }}
              style={{ transformOrigin: "bottom" }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {isHovered && d.count > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-7 z-10 rounded-md bg-foreground px-2 py-0.5 text-[10px] font-semibold text-white shadow-lg"
                >
                  {d.count} done
                </motion.div>
              )}
              <div
                className="w-full transition-all duration-200"
                style={{
                  height: h,
                  background: d.count ? d.col.fill : "hsl(var(--border))",
                  borderRadius: "6px 6px 2px 2px",
                  opacity: isHovered ? 1 : d.count ? 0.85 : 0.5,
                  transform: isHovered ? "scaleX(1.15)" : "scaleX(1)",
                }}
              />
              <span className={`text-[9px] font-medium transition-colors ${isHovered ? "text-foreground" : "text-muted-foreground"}`}>{d.label}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

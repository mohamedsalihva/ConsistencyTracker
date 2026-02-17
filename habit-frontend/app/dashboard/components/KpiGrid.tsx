import { T } from "../utils/theme";

type KpiGridProps = {
  habitsCount: number;
  todayCount: number;
  maxStreak: number;
  totalDone: number;
};

export function KpiGrid({ habitsCount, todayCount, maxStreak, totalDone }: KpiGridProps) {
  return (
    <section className="kpi-grid reveal" style={{ marginTop: 16, ["--d" as string]: "220ms" }}>
      <Card label="Total Habits" value={habitsCount} sub="being tracked" bar={`linear-gradient(90deg,${T.lavender},${T.lavL})`} tint="linear-gradient(145deg,#fffaff,#f1e9ff)" />
      <Card label="Done Today" value={todayCount} sub={`of ${habitsCount} habits`} bar={`linear-gradient(90deg,${T.pink},${T.pinkL})`} tint="linear-gradient(145deg,#fff9fb,#ffeaf1)" />
      <Card label="Best Streak" value={maxStreak} sub="consecutive days" bar={`linear-gradient(90deg,${T.mint},${T.mintL})`} tint="linear-gradient(145deg,#f7fffd,#e6f8f3)" />
      <Card label="All-Time Done" value={totalDone} sub="total completions" bar={`linear-gradient(90deg,${T.peach},${T.peachL})`} tint="linear-gradient(145deg,#fffaf5,#fff0e4)" />
    </section>
  );
}

function Card({
  label,
  value,
  sub,
  bar,
  tint,
}: {
  label: string;
  value: string | number;
  sub: string;
  bar: string;
  tint: string;
}) {
  return (
    <div
      className="kpi-card"
      style={{
        background: tint,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: "18px 18px 16px",
        position: "relative",
        boxShadow: "0 8px 24px rgba(141,116,184,.12)",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "14px 14px 0 0", background: bar }} />
      <p style={{ marginTop: 6, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: T.text3 }}>{label}</p>
      <p className="kpi-value" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.1rem", lineHeight: 1.1, color: T.text, marginTop: 6 }}>
        {value}
      </p>
      <p style={{ fontSize: 11, color: T.text3 }}>{sub}</p>
    </div>
  );
}

import { T } from "../utils/theme";

type RingSectionProps = {
  todayPct: number;
  weekPct: number;
  monthPct: number;
  allPct: number;
  cardStyle: React.CSSProperties;
};

export function RingSection({ todayPct, weekPct, monthPct, allPct, cardStyle }: RingSectionProps) {
  return (
    <section className="section-pad" style={{ ...cardStyle, background: "linear-gradient(135deg,#ffffff,#ecfbf5)", borderColor: "#cfeee2", padding: "20px 20px" }}>
      <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Completion Overview</p>
      <div className="rings-wrap" style={{ display: "flex", justifyContent: "space-around", gap: 10 }}>
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width="74" height="74" viewBox="0 0 74 74">
        <circle cx="37" cy="37" r={r} fill="none" stroke="#f0ece6" strokeWidth="7" />
        <circle cx="37" cy="37" r={r} fill="none" stroke={stroke} strokeWidth="7" strokeDasharray={`${dash} ${c}`} strokeLinecap="round" transform="rotate(-90 37 37)" />
        <text x="37" y="41" textAnchor="middle" fontSize="13" fontWeight="700" fill={T.text} style={{ fontFamily: "'Playfair Display', serif" }}>
          {pct}%
        </text>
      </svg>
      <span style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: T.text3 }}>{label}</span>
    </div>
  );
}

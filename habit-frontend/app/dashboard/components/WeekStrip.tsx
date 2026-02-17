import { DAYS, PALETTE, T } from "../utils/theme";
import { formatDay } from "../utils/date";

type WeekStripProps = {
  last7: Date[];
  map: Record<string, number>;
  habitsCount: number;
  todayKey: string;
  cardStyle: React.CSSProperties;
};

export function WeekStrip({ last7, map, habitsCount, todayKey, cardStyle }: WeekStripProps) {
  return (
    <section className="reveal" style={{ ...cardStyle, background: "linear-gradient(135deg,#fff9f4,#edf7ff)", borderColor: "#e6d9cc", overflow: "hidden", marginTop: 16, ["--d" as string]: "380ms" }}>
      <div className="section-pad" style={{ padding: "16px 20px 6px", display: "flex", justifyContent: "space-between", gap: 10 }}>
        <p style={{ fontSize: 14, fontWeight: 700 }}>This Week</p>
        <p style={{ fontSize: 11, color: T.text3 }}>daily completion %</p>
      </div>
      <div className="week-grid section-pad" style={{ padding: "12px 14px 16px" }}>
        {last7.map((d, i) => {
          const count = map[formatDay(d)] ?? 0;
          const pct = habitsCount ? Math.round((count / habitsCount) * 100) : 0;
          const col = PALETTE[i % PALETTE.length];
          const isToday = formatDay(d) === todayKey;
          return (
            <div key={i} style={{ background: isToday ? T.lavL : T.bg, border: `1px solid ${isToday ? T.lavender : T.border}`, borderRadius: 10, padding: "11px 8px", textAlign: "center" }}>
              <p style={{ fontSize: 9, color: T.text3 }}>{DAYS[d.getDay()]}</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", lineHeight: 1.1 }}>{d.getDate()}</p>
              <div style={{ marginTop: 8, height: 4, borderRadius: 999, background: T.border, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: col.fill }} />
              </div>
              <p style={{ marginTop: 4, fontSize: 10, color: col.text }}>{pct}%</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}


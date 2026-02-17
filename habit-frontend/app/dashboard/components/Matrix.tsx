import type { Habit } from "@/store/habitSlice";
import { formatDay } from "../utils/date";
import { habitStreak } from "../utils/analytics";
import { PALETTE, T } from "../utils/theme";

type MatrixProps = {
  habits: Habit[];
  last35: Date[];
  todayKey: string;
  cardStyle: React.CSSProperties;
};

export function Matrix({ habits, last35, todayKey, cardStyle }: MatrixProps) {
  return (
    <section style={{ ...cardStyle, background: "linear-gradient(135deg,#fffcff,#f0ecfb)", borderColor: "#ddd3f0", overflow: "hidden" }}>
      <div className="section-pad" style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700 }}>35-Day Consistency Matrix</p>
          <p style={{ fontSize: 11, color: T.text3 }}>each square = one day</p>
        </div>
      </div>
      <div className="m-scroll">
        <div className="m-inner">
          <div style={{ display: "flex", gap: 5, paddingLeft: 176, marginBottom: 8 }}>
            {last35.map((d, i) => (
              <div key={i} style={{ width: 18, fontSize: 8, textAlign: "center", color: T.text3 }}>
                {d.getDate()}
              </div>
            ))}
          </div>
          {habits.map((h, hi) => {
            const col = PALETTE[hi % PALETTE.length];
            const str = habitStreak(h);
            return (
              <div key={h._id} className="m-row" style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 6px", borderRadius: 8 }}>
                <div style={{ width: 170, display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 3, height: 16, borderRadius: 999, background: col.dot }} />
                  <span style={{ fontSize: 12, color: T.text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.title}</span>
                </div>
                {last35.map((d, i) => {
                  const hit = h.history?.some((e) => e.date === formatDay(d) && e.completed);
                  return (
                    <div
                      key={i}
                      className="m-cell"
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        background: hit ? col.fill : T.border,
                        outline: formatDay(d) === todayKey ? `2px solid ${col.dot}` : "none",
                        transition: "transform .15s",
                      }}
                    />
                  );
                })}
                {str > 0 && <span style={{ fontSize: 10, color: T.peachD, marginLeft: 4 }}>{str}d</span>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


import type { Habit } from "@/store/habitSlice";
import { PALETTE, T } from "../utils/theme";

type TopHabit = Habit & { pct: number; streak: number };

type TopHabitsProps = {
  topHabits: TopHabit[];
  cardStyle: React.CSSProperties;
};

export function TopHabits({ topHabits, cardStyle }: TopHabitsProps) {
  return (
    <aside style={{ ...cardStyle, background: "linear-gradient(135deg,#fffafd,#eaf5ff)", borderColor: "#d6e6f8", overflow: "hidden", alignSelf: "start" }}>
      <div className="section-pad" style={{ padding: "16px 18px", borderBottom: `1px solid ${T.border}` }}>
        <p style={{ fontSize: 14, fontWeight: 700 }}>Top Habits</p>
        <p style={{ fontSize: 11, color: T.text3 }}>ranked by completion rate</p>
      </div>
      {topHabits.map((h, r) => {
        const col = PALETTE[r % PALETTE.length];
        return (
          <div key={h._id} className="top-row" style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 18px", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 10, color: T.text3, width: 16 }}>{String(r + 1).padStart(2, "0")}</span>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: col.dot }} />
            <span style={{ flex: 1, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.title}</span>
            <span style={{ fontSize: 11, color: col.text }}>{h.pct}%</span>
          </div>
        );
      })}
    </aside>
  );
}


import { MONTHS, MONTHS_S, T } from "../utils/theme";

type HeroProps = {
  today: Date;
  habitsCount: number;
  todayPct: number;
  maxStreak: number;
  activeDays: number;
  cardStyle: React.CSSProperties;
};

export function Hero({ today, habitsCount, todayPct, maxStreak, activeDays, cardStyle }: HeroProps) {
  return (
    <section className="hero-card reveal" style={{ ...cardStyle, background: `linear-gradient(135deg,${T.lavL},${T.pinkL})`, padding: "28px 28px", ["--d" as string]: "90ms" }}>
      <p style={{ fontSize: 11, letterSpacing: ".12em", color: T.lavD, textTransform: "uppercase" }}>Habit Tracker</p>
      <h1 className="month-gradient" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem,5vw,3.7rem)", lineHeight: 1.02, marginTop: 6 }}>
        {MONTHS[today.getMonth()]}
      </h1>
      <p style={{ color: T.text2, fontSize: 13, marginTop: 8 }}>
        {String(today.getDate()).padStart(2, "0")} {MONTHS_S[today.getMonth()]} {today.getFullYear()} · {habitsCount} habits
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        <span style={{ background: T.lavL, color: T.lavD, border: `1px solid ${T.lavender}`, borderRadius: 999, padding: "4px 10px", fontSize: 11 }}>{todayPct}% today</span>
        <span style={{ background: T.peachL, color: T.peachD, border: `1px solid ${T.peach}`, borderRadius: 999, padding: "4px 10px", fontSize: 11 }}>{maxStreak}d streak</span>
        <span style={{ background: T.mintL, color: T.mintD, border: `1px solid ${T.mint}`, borderRadius: 999, padding: "4px 10px", fontSize: 11 }}>{activeDays} active days</span>
      </div>
    </section>
  );
}

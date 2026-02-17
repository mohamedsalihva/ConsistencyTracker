"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AxiosError } from "axios";
import { setHabits, type Habit } from "@/store/habitSlice";
import type { AppDispatch, RootState } from "@/store";
import api from "@/lib/axios";
import API from "@/lib/apiRoutes";

function formatDay(d: Date) {
  return d.toISOString().split("T")[0];
}

function getLast(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d;
  });
}

function completionMap(habits: Habit[]) {
  const map: Record<string, number> = {};
  habits.forEach((h) =>
    h.history?.forEach((e) => {
      if (e.completed) map[e.date] = (map[e.date] ?? 0) + 1;
    }),
  );
  return map;
}

function habitStreak(h: Habit) {
  let s = 0;
  const d = new Date();
  while (true) {
    const key = formatDay(d);
    if (h.history?.some((e) => e.date === key && e.completed)) {
      s++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return s;
}

const T = {
  bg: "#f4eefc",
  white: "#fff9ff",
  border: "#e5dcf2",
  text: "#2d2a26",
  text2: "#6b6560",
  text3: "#a09990",
  lavender: "#b8a9d9",
  lavL: "#ede8f7",
  lavD: "#8b77c2",
  pink: "#f4a7b9",
  pinkL: "#fde8ed",
  pinkD: "#e8798f",
  mint: "#90cfc0",
  mintL: "#ddf2ed",
  mintD: "#4db6a0",
  peach: "#f7c5a0",
  peachL: "#fef0e6",
  peachD: "#e8925a",
  sky: "#a8cff0",
  skyL: "#deeefa",
  skyD: "#5aabde",
  lemon: "#f5e090",
  lemonL: "#fdf7d6",
  lemonD: "#c9a830",
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_S = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const PALETTE = [
  { dot: T.lavender, fill: T.lavender, text: T.lavD },
  { dot: T.pink, fill: T.pink, text: T.pinkD },
  { dot: T.mint, fill: T.mint, text: T.mintD },
  { dot: T.peach, fill: T.peach, text: T.peachD },
  { dot: T.sky, fill: T.sky, text: T.skyD },
  { dot: T.lemon, fill: T.lemon, text: T.lemonD },
];

function RingMeter({ pct, stroke, label }: { pct: number; stroke: string; label: string }) {
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

function KpiCard({
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

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const habits = useSelector((s: RootState) => s.habits.list);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartMode, setChartMode] = useState<"14d" | "7d">("14d");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<Habit[] | { habits: Habit[] }>(API.HABITS.GET_ALL);
        dispatch(setHabits(Array.isArray(res.data) ? res.data : (res.data.habits ?? [])));
      } catch (err: unknown) {
        const e = err as AxiosError<{ message?: string }>;
        setError(e.response?.data?.message ?? "Failed to load habits");
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  const view = useMemo(() => {
    const today = new Date();
    const todayKey = formatDay(today);
    const map = completionMap(habits);
    const last35 = getLast(35);
    const last14 = getLast(14);
    const last7 = getLast(7);

    const todayCount = map[todayKey] ?? 0;
    const todayPct = habits.length ? Math.round((todayCount / habits.length) * 100) : 0;
    const totalDone = habits.flatMap((h) => h.history ?? []).filter((e) => e.completed).length;
    const activeDays = Object.keys(map).length;
    const maxStreak = Math.max(...habits.map(habitStreak), 0);
    const weekActive = last7.filter((d) => (map[formatDay(d)] ?? 0) > 0).length;
    const weekPct = Math.round((weekActive / 7) * 100);
    const monthStart = formatDay(new Date(today.getFullYear(), today.getMonth(), 1));
    const monthDone = habits.flatMap((h) => (h.history ?? []).filter((e) => e.completed && e.date >= monthStart)).length;
    const monthPct = Math.min(Math.round((monthDone / Math.max(habits.length * 30, 1)) * 100), 100);
    const allPct = Math.min(Math.round((totalDone / Math.max(habits.length * 90, 1)) * 100), 100);

    const chartData =
      chartMode === "14d"
        ? last14.map((d, i) => ({ label: `${d.getDate()}`, count: map[formatDay(d)] ?? 0, col: PALETTE[i % PALETTE.length] }))
        : last7.map((d, i) => ({ label: DAYS[d.getDay()].slice(0, 2), count: map[formatDay(d)] ?? 0, col: PALETTE[i % PALETTE.length] }));
    const maxBar = Math.max(...chartData.map((d) => d.count), 1);

    const topHabits = [...habits]
      .map((h) => {
        const total = h.history?.length ?? 0;
        const done = h.history?.filter((e) => e.completed).length ?? 0;
        return { ...h, pct: total ? Math.round((done / total) * 100) : 0, streak: habitStreak(h) };
      })
      .sort((a, b) => b.pct - a.pct);

    return { today, todayKey, map, last35, last7, todayCount, todayPct, totalDone, activeDays, maxStreak, weekPct, monthPct, allPct, chartData, maxBar, topHabits };
  }, [habits, chartMode]);

  const card: CSSProperties = {
    background: "linear-gradient(145deg, rgba(255,255,255,.96), rgba(247,240,255,.92))",
    border: `1px solid ${T.border}`,
    borderRadius: 14,
    boxShadow: "0 10px 30px rgba(130,102,176,.14)",
  };

  return (
    <div
      style={{
        background: "radial-gradient(circle at 8% 4%, #ffe8f2 0%, transparent 35%), radial-gradient(circle at 92% 0%, #e5efff 0%, transparent 34%), linear-gradient(180deg, #f3edfb 0%, #f7f2ff 100%)",
        color: T.text,
        minHeight: "100vh",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .page-wrap{max-width:1560px;margin:0 auto;padding:32px 28px 72px}
        .hero,.mid-grid{display:grid;gap:20px}
        .hero{grid-template-columns:1fr 1fr}
        .mid-grid{grid-template-columns:1fr 320px}
        .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .week-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:10px}
        .m-scroll{overflow-x:auto;padding:16px 20px 20px}
        .m-inner{min-width:860px}
        .top-row:hover,.m-row:hover{background:${T.bg}}
        .m-cell:hover{transform:scale(1.35)}
        .month-gradient{
          background: linear-gradient(115deg, #7f63b7 0%, #e87797 45%, #5ca8dc 100%);
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
        }
        .kpi-card:hover .kpi-value{animation:kpiGlow 1.9s ease-in-out infinite}
        @keyframes kpiGlow{
          0%,100%{filter:drop-shadow(0 0 0 rgba(129,99,179,0))}
          50%{filter:drop-shadow(0 0 10px rgba(129,99,179,.36))}
        }
        .reveal{
          opacity:0;
          transform:translateY(14px);
          animation:fadeUp .62s cubic-bezier(.22,1,.36,1) forwards;
          animation-delay:var(--d,0ms);
        }
        @keyframes fadeUp{
          to{
            opacity:1;
            transform:translateY(0);
          }
        }
        @media (max-width:1100px){.hero,.mid-grid{grid-template-columns:1fr}}
        @media (max-width:760px){
          .page-wrap{padding:16px 10px 28px}
          .topbar{flex-wrap:wrap;gap:10px}
          .topnav{display:none}
          .kpi-grid{grid-template-columns:repeat(2,1fr)}
          .week-grid{grid-template-columns:repeat(4,1fr)}
          .hero-card{padding:20px 16px!important}
          .section-pad{padding:16px!important}
          .rings-wrap{display:grid!important;grid-template-columns:repeat(2,1fr);gap:10px}
        }
        @media (max-width:430px){
          .kpi-grid{grid-template-columns:1fr}
          .week-grid{grid-template-columns:repeat(2,1fr)}
        }
      `}</style>

      <div className="page-wrap">
        <nav className="topbar reveal" style={{ ...card, background: "linear-gradient(135deg,#ffffff,#f7efff)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", marginBottom: 20, ["--d" as string]: "0ms" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22 }}>Habit Tracker</div>
          <div className="topnav" style={{ display: "flex", gap: 6 }}>
            {["Overview", "Habits", "Analytics"].map((t, i) => (
              <button key={t} style={{ borderRadius: 999, border: `1px solid ${i === 0 ? T.lavender : T.border}`, background: i === 0 ? T.lavL : "transparent", color: i === 0 ? T.lavD : T.text2, padding: "6px 12px", fontSize: 12 }}>
                {t}
              </button>
            ))}
          </div>
          <Link href="/habits/new" style={{ textDecoration: "none", background: `linear-gradient(135deg,${T.lavender},${T.pink})`, color: "#fff", borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 600 }}>
            + New Habit
          </Link>
        </nav>

        <div className="hero">
          <section className="hero-card reveal" style={{ ...card, background: `linear-gradient(135deg,${T.lavL},${T.pinkL})`, padding: "28px 28px", ["--d" as string]: "90ms" }}>
            <p style={{ fontSize: 11, letterSpacing: ".12em", color: T.lavD, textTransform: "uppercase" }}>Habit Tracker</p>
            <h1 className="month-gradient" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem,5vw,3.7rem)", lineHeight: 1.02, marginTop: 6 }}>
              {MONTHS[view.today.getMonth()]}
            </h1>
            <p style={{ color: T.text2, fontSize: 13, marginTop: 8 }}>
              {String(view.today.getDate()).padStart(2, "0")} {MONTHS_S[view.today.getMonth()]} {view.today.getFullYear()} · {habits.length} habits
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              <span style={{ background: T.lavL, color: T.lavD, border: `1px solid ${T.lavender}`, borderRadius: 999, padding: "4px 10px", fontSize: 11 }}>{view.todayPct}% today</span>
              <span style={{ background: T.peachL, color: T.peachD, border: `1px solid ${T.peach}`, borderRadius: 999, padding: "4px 10px", fontSize: 11 }}>{view.maxStreak}d streak</span>
              <span style={{ background: T.mintL, color: T.mintD, border: `1px solid ${T.mint}`, borderRadius: 999, padding: "4px 10px", fontSize: 11 }}>{view.activeDays} active days</span>
            </div>
          </section>

          <section className="hero-card reveal" style={{ ...card, background: "linear-gradient(135deg,#ffffff,#e9f4ff)", borderColor: "#cde3f5", padding: "24px 24px", ["--d" as string]: "150ms" }}>
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
              {view.chartData.map((d, i) => {
                const h = Math.max((d.count / view.maxBar) * 116, d.count ? 8 : 3);
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: "100%", height: h, borderRadius: "6px 6px 0 0", background: d.count ? d.col.fill : T.border }} />
                    <span style={{ fontSize: 9, color: T.text3 }}>{d.label}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <section className="kpi-grid reveal" style={{ marginTop: 16, ["--d" as string]: "220ms" }}>
          <KpiCard label="Total Habits" value={habits.length} sub="being tracked" bar={`linear-gradient(90deg,${T.lavender},${T.lavL})`} tint="linear-gradient(145deg,#fffaff,#f1e9ff)" />
          <KpiCard label="Done Today" value={view.todayCount} sub={`of ${habits.length} habits`} bar={`linear-gradient(90deg,${T.pink},${T.pinkL})`} tint="linear-gradient(145deg,#fff9fb,#ffeaf1)" />
          <KpiCard label="Best Streak" value={view.maxStreak} sub="consecutive days" bar={`linear-gradient(90deg,${T.mint},${T.mintL})`} tint="linear-gradient(145deg,#f7fffd,#e6f8f3)" />
          <KpiCard label="All-Time Done" value={view.totalDone} sub="total completions" bar={`linear-gradient(90deg,${T.peach},${T.peachL})`} tint="linear-gradient(145deg,#fffaf5,#fff0e4)" />
        </section>

        <div className="mid-grid reveal" style={{ marginTop: 16, ["--d" as string]: "300ms" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <section className="section-pad" style={{ ...card, background: "linear-gradient(135deg,#ffffff,#ecfbf5)", borderColor: "#cfeee2", padding: "20px 20px" }}>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Completion Overview</p>
              <div className="rings-wrap" style={{ display: "flex", justifyContent: "space-around", gap: 10 }}>
                <RingMeter pct={view.todayPct} stroke={T.lavender} label="Today" />
                <RingMeter pct={view.weekPct} stroke={T.mint} label="Week" />
                <RingMeter pct={view.monthPct} stroke={T.pink} label="Month" />
                <RingMeter pct={view.allPct} stroke={T.peach} label="All-Time" />
              </div>
            </section>

            <section style={{ ...card, background: "linear-gradient(135deg,#fffcff,#f0ecfb)", borderColor: "#ddd3f0", overflow: "hidden" }}>
              <div className="section-pad" style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700 }}>35-Day Consistency Matrix</p>
                  <p style={{ fontSize: 11, color: T.text3 }}>each square = one day</p>
                </div>
              </div>
              <div className="m-scroll">
                <div className="m-inner">
                  <div style={{ display: "flex", gap: 5, paddingLeft: 176, marginBottom: 8 }}>
                    {view.last35.map((d, i) => (
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
                        {view.last35.map((d, i) => {
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
                                outline: formatDay(d) === view.todayKey ? `2px solid ${col.dot}` : "none",
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
          </div>

          <aside style={{ ...card, background: "linear-gradient(135deg,#fffafd,#eaf5ff)", borderColor: "#d6e6f8", overflow: "hidden", alignSelf: "start" }}>
            <div className="section-pad" style={{ padding: "16px 18px", borderBottom: `1px solid ${T.border}` }}>
              <p style={{ fontSize: 14, fontWeight: 700 }}>Top Habits</p>
              <p style={{ fontSize: 11, color: T.text3 }}>ranked by completion rate</p>
            </div>
            {view.topHabits.map((h, r) => {
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
        </div>

        <section className="reveal" style={{ ...card, background: "linear-gradient(135deg,#fff9f4,#edf7ff)", borderColor: "#e6d9cc", overflow: "hidden", marginTop: 16, ["--d" as string]: "380ms" }}>
          <div className="section-pad" style={{ padding: "16px 20px 6px", display: "flex", justifyContent: "space-between", gap: 10 }}>
            <p style={{ fontSize: 14, fontWeight: 700 }}>This Week</p>
            <p style={{ fontSize: 11, color: T.text3 }}>daily completion %</p>
          </div>
          <div className="week-grid section-pad" style={{ padding: "12px 14px 16px" }}>
            {view.last7.map((d, i) => {
              const count = view.map[formatDay(d)] ?? 0;
              const pct = habits.length ? Math.round((count / habits.length) * 100) : 0;
              const col = PALETTE[i % PALETTE.length];
              const isToday = formatDay(d) === view.todayKey;
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

        {loading && <p style={{ marginTop: 18, color: T.text3 }}>Loading habits...</p>}
        {error && <p style={{ marginTop: 18, color: T.pinkD }}>{error}</p>}
      </div>
    </div>
  );
}

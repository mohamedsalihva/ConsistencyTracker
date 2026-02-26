import { motion } from "framer-motion";
import { T } from "../utils/theme";

type RingSectionProps = {
  todayPct: number;
  weekPct: number;
  monthPct: number;
  allPct: number;
};

const rings: { key: keyof RingSectionProps; stroke: string; label: string; emoji: string }[] = [
  { key: "todayPct", stroke: T.lavender, label: "Today", emoji: "📅" },
  { key: "weekPct", stroke: T.mint, label: "Week", emoji: "📊" },
  { key: "monthPct", stroke: T.pink, label: "Month", emoji: "📈" },
  { key: "allPct", stroke: T.peach, label: "All-Time", emoji: "🏆" },
];

function getPctEmoji(pct: number) {
  if (pct === 100) return "🎯";
  if (pct >= 75) return "🔥";
  if (pct >= 50) return "💪";
  return "";
}

export function RingSection(props: RingSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.45 }}
      className="glass-card p-6"
    >
      <p className="mb-5 text-sm font-bold text-foreground">Completion Overview</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {rings.map((r, i) => (
          <Meter key={r.label} pct={props[r.key]} stroke={r.stroke} label={r.label} emoji={r.emoji} delay={0.4 + i * 0.1} />
        ))}
      </div>
    </motion.section>
  );
}

function Meter({ pct, stroke, label, emoji, delay }: { pct: number; stroke: string; label: string; emoji: string; delay: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  const pctEmoji = getPctEmoji(pct);

  return (
    <motion.div className="flex flex-col items-center gap-2.5" whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}>
      <div className="relative">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="5" />
          <motion.circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={stroke}
            strokeWidth="5"
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
            initial={{ strokeDasharray: `0 ${c}` }}
            animate={{ strokeDasharray: `${dash} ${c}` }}
            transition={{ delay, duration: 0.8, ease: "easeOut" }}
          />
          <text x="40" y="44" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor" className="text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            {pct}%
          </text>
        </svg>
        {pctEmoji && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: delay + 0.5, type: "spring" }} className="absolute -right-1 -top-1 text-xs">
            {pctEmoji}
          </motion.span>
        )}
      </div>
      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground">
        <span>{emoji}</span> {label}
      </span>
    </motion.div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck2, Flame, Target, TrendingUp } from "lucide-react";

const previewStats = [
  { label: "Habits Active", value: "12", icon: <Target className="h-4 w-4" /> },
  { label: "Today Progress", value: "78%", icon: <CalendarCheck2 className="h-4 w-4" /> },
  { label: "Best Streak", value: "16d", icon: <Flame className="h-4 w-4" /> },
  { label: "Weekly Trend", value: "+14%", icon: <TrendingUp className="h-4 w-4" /> },
];

const workflow = [
  { step: "1", title: "Create habits", desc: "Add up to 15 focused habits and set your routine." },
  { step: "2", title: "Complete daily", desc: "Mark progress quickly from the matrix." },
  { step: "3", title: "Review trends", desc: "Use charts and rings to improve consistency." },
];

export default function Home() {
  return (
    <main className="min-h-screen text-foreground" style={{ background: "var(--gradient-page)" }}>
      <div className="mx-auto max-w-[1560px] px-4 pb-10 pt-5 sm:px-6 sm:pb-14 sm:pt-7 lg:px-8 lg:pb-20 lg:pt-9">
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card mb-6 flex flex-wrap items-center justify-between gap-3 px-5 py-3"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#ff7b1a,#ff3b2f)]">
              <span className="text-sm font-bold text-primary-foreground">H</span>
            </div>
            <span className="font-serif text-xl text-foreground">HabitFlow</span>
          </div>

          <div className="hidden gap-1.5 sm:flex">
            <span className="chip chip-active">Overview</span>
            <span className="chip chip-inactive">Habits</span>
            <span className="chip chip-inactive">Analytics</span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="chip chip-inactive">
              Login
            </Link>
            <Link href="/auth/register" className="btn-cta">
              Get Started
            </Link>
          </div>
        </motion.nav>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="glass-card p-6 sm:p-8"
          >
            <span className="chip chip-active inline-flex">Daily Momentum</span>
            <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
              Build consistency with a <span className="gradient-text">dashboard-first</span> habit system.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              Track habits, monitor streaks, and turn daily actions into measurable progress with the same analytics-driven
              interface you use inside the app.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/dashboard" className="btn-cta inline-flex items-center gap-1.5">
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/auth/register" className="chip chip-inactive px-5 py-2.5 text-sm">
                Create Account
              </Link>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="glass-card p-6 sm:p-7"
          >
            <p className="text-sm font-medium text-muted-foreground">Live Preview</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {previewStats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border/80 bg-card/70 p-4">
                  <div className="mb-2 inline-flex rounded-xl bg-secondary p-2 text-lavender">{item.icon}</div>
                  <p className="text-2xl font-semibold">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="glass-card p-6 sm:p-7">
            <p className="text-sm font-medium text-muted-foreground">How It Works</p>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {workflow.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border/80 bg-card/70 p-4">
                  <span className="chip chip-active inline-flex h-7 w-7 items-center justify-center p-0">{item.step}</span>
                  <p className="mt-3 text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card flex flex-col justify-between p-6 sm:p-7">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Why Consistency Wins</p>
              <h2 className="mt-3 font-serif text-2xl leading-tight">
                Small daily actions become <span className="gradient-text">long-term momentum</span>.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Keep your streaks visible, reduce friction, and stay accountable with one place for every habit.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="chip chip-inactive">Streak Tracking</span>
              <span className="chip chip-inactive">35-Day Matrix</span>
              <span className="chip chip-inactive">KPI Insights</span>
            </div>
          </section>
        </div>

        <section className="glass-card mt-5 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <p className="font-serif text-2xl">Ready to start your next streak?</p>
            <p className="mt-1 text-sm text-muted-foreground">Create your account and jump directly into your dashboard.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/auth/register" className="btn-cta">
              Start Free
            </Link>
            <Link href="/auth/login" className="chip chip-inactive px-5 py-2.5 text-sm">
              I Have an Account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

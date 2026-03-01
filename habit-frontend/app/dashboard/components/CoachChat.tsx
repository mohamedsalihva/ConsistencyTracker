"use client";

import API from "@/lib/apiRoutes";
import api from "@/lib/axios";
import type { AppDispatch, RootState } from "@/store";
import { addMessage, setChatError, setLoading } from "@/store/chatSlice";
import type { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type CoachChatProps = {
  context: string;
};

export function CoachChat({ context }: CoachChatProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, error, loading } = useSelector((s: RootState) => s.chat);

  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [nowTs, setNowTs] = useState(Date.now());

  useEffect(() => {
    if (cooldownUntil <= Date.now()) return;

    const id = setInterval(() => {
      setNowTs(Date.now());
    }, 1000);

    return () => clearInterval(id);
  }, [cooldownUntil]);

  const inCooldown = cooldownUntil > nowTs;
  const cooldownSecs = Math.max(0, Math.ceil((cooldownUntil - nowTs) / 1000));

  const send = async () => {
    const text = input.trim();
    if (!text || loading || inCooldown) return;

    const userMsg = { role: "user" as const, content: text };
    const updated = [...messages, userMsg];
    const payloadMessages = updated.slice(-20);

    dispatch(addMessage(userMsg));
    dispatch(setChatError(""));
    dispatch(setLoading(true));
    setInput("");

    try {
      const res = await api.post<{ reply: string }>(API.AI.CHAT, {
        messages: payloadMessages,
        context,
      });

      dispatch(addMessage({ role: "assistant", content: res.data.reply }));
    } catch (err: unknown) {
      const e = err as AxiosError<{ message?: string }>;
      if (e.response?.status === 429) {
        setCooldownUntil(Date.now() + 30_000);
        dispatch(setChatError("AI quota exceeded. Try again in 30 seconds."));
      } else {
        dispatch(setChatError(e.response?.data?.message ?? "Failed to get AI reply."));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-24 right-4 z-[90] flex flex-col items-end sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto mb-3 h-[520px] w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-border/80 bg-card shadow-[0_28px_64px_rgba(40,18,9,.36)]"
          >
            <div className="flex items-center justify-between border-b border-border/70 bg-[linear-gradient(120deg,rgba(255,123,26,.18),rgba(255,59,47,.16))] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff7b1a,#ff3b2f)] text-white">
                  <Bot className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">AI Habit Coach</p>
                  <p className="text-[11px] text-muted-foreground">Personal guidance for your next step</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-border/80 bg-white/90 p-1.5 text-muted-foreground transition hover:text-foreground"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex h-[calc(100%-61px)] flex-col">
              <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {messages.map((m, i) => (
                  <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                    <p
                      className={`inline-block max-w-[90%] rounded-2xl px-3 py-2 text-xs sm:text-sm ${
                        m.role === "user"
                          ? "bg-[linear-gradient(135deg,#ff7b1a,#ff3b2f)] text-white"
                          : "border border-border bg-secondary text-foreground"
                      }`}
                    >
                      {m.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/70 p-3">
                {error && <p className="mb-2 text-xs text-destructive">{error}</p>}

                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") send();
                    }}
                    placeholder="Ask: I missed 4 days, how do I restart?"
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    disabled={loading || inCooldown}
                  />
                  <button
                    onClick={send}
                    disabled={loading || inCooldown}
                    className="btn-cta whitespace-nowrap px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Sending..." : inCooldown ? `Wait ${cooldownSecs}s` : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="pointer-events-auto relative flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff7b1a,#ff3b2f)] text-white shadow-[0_20px_40px_rgba(255,123,26,.45)]"
        aria-label={open ? "Close AI coach" : "Open AI coach"}
      >
        <Bot className="h-6 w-6" />
        {!open && messages.length > 1 && (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-rose" />
        )}
      </motion.button>
    </div>
  );
}

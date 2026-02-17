import { motion, AnimatePresence } from "framer-motion";

type CreateHabitModalProps = {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  titles: string[];
  setTitles: React.Dispatch<React.SetStateAction<string[]>>;
  createError: string;
  creatingHabit: boolean;
  currentHabitsCount: number;
  remainingSlots: number;
};

export function CreateHabitModal({
  show,
  onClose,
  onSubmit,
  titles,
  setTitles,
  createError,
  creatingHabit,
  currentHabitsCount,
  remainingSlots,
}: CreateHabitModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[1000] grid place-items-center bg-foreground/20 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card w-full max-w-[460px] p-6"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-2xl text-foreground">Create Habit</h3>
              <button type="button" onClick={onClose} className="rounded-lg border border-border bg-card px-2.5 py-1 text-sm text-muted-foreground transition-colors hover:bg-secondary">
                ✕
              </button>
            </div>

            <p className="mb-1 text-xs text-muted-foreground">You can create up to 5 habits.</p>
            <p className={`mb-1 text-xs font-medium ${currentHabitsCount >= 5 ? "text-destructive" : "text-mint"}`}>Current: {currentHabitsCount}/5</p>
            <p className="mb-4 text-xs text-muted-foreground">You can add {remainingSlots} more habit(s).</p>

            <form onSubmit={onSubmit}>
              <div className="grid gap-2.5">
                {titles.map((title, idx) => {
                  const isLast = idx === titles.length - 1;
                  const canAdd = isLast && titles.length < remainingSlots && titles.length < 5;
                  const canRemove = titles.length > 1;

                  return (
                    <div key={idx} className="grid grid-cols-[1fr_auto_auto] gap-2">
                      <input
                        value={title}
                        onChange={(e) => setTitles((prev) => prev.map((v, i) => (i === idx ? e.target.value : v)))}
                        placeholder={`Habit ${idx + 1}`}
                        maxLength={100}
                        disabled={creatingHabit}
                        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        type="button"
                        disabled={!canAdd || creatingHabit}
                        onClick={() => setTitles((prev) => [...prev, ""])}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition-all disabled:cursor-not-allowed ${
                          canAdd ? "border-lavender/30 bg-lavender-soft text-lavender hover:bg-lavender/20" : "border-border bg-card text-muted-foreground/40"
                        }`}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        disabled={!canRemove || creatingHabit}
                        onClick={() => setTitles((prev) => prev.filter((_, i) => i !== idx))}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition-all disabled:cursor-not-allowed ${
                          canRemove ? "border-rose/30 bg-rose-soft text-rose hover:bg-rose/20" : "border-border bg-card text-muted-foreground/40"
                        }`}
                      >
                        -
                      </button>
                    </div>
                  );
                })}
              </div>

              {createError && <p className="mt-2.5 text-xs font-medium text-destructive">{createError}</p>}

              <div className="mt-4 flex justify-end gap-2.5">
                <button type="button" onClick={onClose} className="chip chip-inactive px-4 py-2">
                  Cancel
                </button>
                <button type="submit" disabled={creatingHabit} className="btn-cta">
                  {creatingHabit ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

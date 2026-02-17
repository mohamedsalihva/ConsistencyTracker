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
  if (!show) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-[1000] grid place-items-center bg-[rgba(39,28,62,.42)] p-3 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[460px] rounded-2xl border border-[#e5dcf2] bg-gradient-to-br from-[#fffafd] to-[#f2ebff] p-5 shadow-[0_24px_55px_rgba(111,85,158,.28)]"
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-serif text-3xl leading-none">Create Habit</h3>
          <button type="button" onClick={onClose} className="rounded-md border border-[#e5dcf2] bg-white px-2 py-1 text-sm">
            x
          </button>
        </div>

        <p className="mb-1 text-xs text-[#a09990]">You can create up to 5 habits.</p>
        <p className={`mb-1 text-xs ${currentHabitsCount >= 5 ? "text-[#e8798f]" : "text-[#4db6a0]"}`}>Current: {currentHabitsCount}/5</p>
        <p className="mb-3 text-xs text-[#6b6560]">You can add {remainingSlots} more habit(s).</p>

        <form onSubmit={onSubmit}>
          <div className="grid gap-2">
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
                    className="w-full rounded-xl border border-[#e5dcf2] bg-white px-3 py-2.5 text-sm text-[#2d2a26] outline-none"
                  />

                  <button
                    type="button"
                    disabled={!canAdd || creatingHabit}
                    onClick={() => setTitles((prev) => [...prev, ""])}
                    className="h-10 w-10 rounded-lg border border-[#e5dcf2] text-xl leading-none disabled:cursor-not-allowed disabled:text-[#b7b2aa]"
                    style={{ background: canAdd ? "#f4edff" : "#f8f8f8", color: canAdd ? "#8b77c2" : "#b7b2aa" }}
                  >
                    +
                  </button>

                  <button
                    type="button"
                    disabled={!canRemove || creatingHabit}
                    onClick={() => setTitles((prev) => prev.filter((_, i) => i !== idx))}
                    className="h-10 w-10 rounded-lg border border-[#e5dcf2] text-lg leading-none disabled:cursor-not-allowed disabled:text-[#b7b2aa]"
                    style={{ background: canRemove ? "#fff0f4" : "#f8f8f8", color: canRemove ? "#e8798f" : "#b7b2aa" }}
                  >
                    -
                  </button>
                </div>
              );
            })}
          </div>

          {createError && <p className="mt-2 text-xs text-[#e8798f]">{createError}</p>}

          <div className="mt-3 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-full border border-[#e5dcf2] bg-white px-4 py-2 text-sm text-[#6b6560]">
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingHabit}
              className="rounded-full border-0 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#b8a9d9,#f4a7b9)" }}
            >
              {creatingHabit ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


import { T } from "../utils/theme";

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
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(39,28,62,.42)",
        backdropFilter: "blur(4px)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
        padding: 12,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 460,
          borderRadius: 16,
          border: `1px solid ${T.border}`,
          background: "linear-gradient(145deg,#fffafd,#f2ebff)",
          boxShadow: "0 24px 55px rgba(111,85,158,.28)",
          padding: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 30, lineHeight: 1.1 }}>Create Habit</h3>
          <button
            type="button"
            onClick={onClose}
            style={{ border: `1px solid ${T.border}`, background: "#fff", borderRadius: 8, padding: "4px 9px", cursor: "pointer" }}
          >
            x
          </button>
        </div>

        <p style={{ margin: "0 0 6px", fontSize: 12, color: T.text3 }}>You can create up to 5 habits.</p>
        <p style={{ margin: "0 0 14px", fontSize: 12, color: currentHabitsCount >= 5 ? T.pinkD : T.mintD }}>
          Current: {currentHabitsCount}/5
        </p>
        <p style={{ margin: "0 0 14px", fontSize: 12, color: T.text2 }}>
          You can add {remainingSlots} more habit(s).
        </p>

        <form onSubmit={onSubmit}>
          <div style={{ display: "grid", gap: 8 }}>
            {titles.map((title, idx) => {
              const isLast = idx === titles.length - 1;
              const canAdd = isLast && titles.length < remainingSlots && titles.length < 5;
              const canRemove = titles.length > 1;
              return (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8 }}>
                  <input
                    value={title}
                    onChange={(e) => setTitles((prev) => prev.map((v, i) => (i === idx ? e.target.value : v)))}
                    placeholder={`Habit ${idx + 1}`}
                    maxLength={100}
                    disabled={creatingHabit}
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      border: `1px solid ${T.border}`,
                      background: "#fff",
                      color: T.text,
                      padding: "12px 14px",
                      outline: "none",
                    }}
                  />

                  <button
                    type="button"
                    disabled={!canAdd || creatingHabit}
                    onClick={() => setTitles((prev) => [...prev, ""])}
                    style={{
                      width: 40,
                      borderRadius: 10,
                      border: `1px solid ${T.border}`,
                      background: canAdd ? "#f4edff" : "#f8f8f8",
                      color: canAdd ? T.lavD : "#b7b2aa",
                      fontSize: 20,
                      lineHeight: 1,
                      cursor: canAdd ? "pointer" : "not-allowed",
                    }}
                  >
                    +
                  </button>

                  <button
                    type="button"
                    disabled={!canRemove || creatingHabit}
                    onClick={() => setTitles((prev) => prev.filter((_, i) => i !== idx))}
                    style={{
                      width: 40,
                      borderRadius: 10,
                      border: `1px solid ${T.border}`,
                      background: canRemove ? "#fff0f4" : "#f8f8f8",
                      color: canRemove ? T.pinkD : "#b7b2aa",
                      fontSize: 18,
                      lineHeight: 1,
                      cursor: canRemove ? "pointer" : "not-allowed",
                    }}
                  >
                    -
                  </button>
                </div>
              );
            })}
          </div>

          {createError && (
            <p style={{ marginTop: 10, marginBottom: 0, fontSize: 12, color: T.pinkD }}>
              {createError}
            </p>
          )}

          <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ borderRadius: 999, border: `1px solid ${T.border}`, background: "#fff", color: T.text2, padding: "8px 14px", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingHabit}
              style={{
                borderRadius: 999,
                border: "none",
                background: `linear-gradient(135deg,${T.lavender},${T.pink})`,
                color: "#fff",
                padding: "8px 16px",
                fontWeight: 600,
                cursor: creatingHabit ? "not-allowed" : "pointer",
                opacity: creatingHabit ? 0.6 : 1,
              }}
            >
              {creatingHabit ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

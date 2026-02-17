import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AxiosError } from "axios";
import API from "@/lib/apiRoutes";
import api from "@/lib/axios";
import type { AppDispatch, RootState } from "@/store";
import { addHabit, setHabits, type Habit } from "@/store/habitSlice";
import { buildDashboardView } from "../utils/analytics";

export function useDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const habits = useSelector((s: RootState) => s.habits.list);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartMode, setChartMode] = useState<"14d" | "7d">("14d");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHabitTitles, setNewHabitTitles] = useState<string[]>([""]);
  const [createError, setCreateError] = useState("");
  const [creatingHabit, setCreatingHabit] = useState(false);

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

  const view = useMemo(() => buildDashboardView(habits, chartMode), [habits, chartMode]);
  const remainingSlots = Math.max(0, 5 - habits.length);

  const openCreateModal = () => {
    setCreateError("");
    setNewHabitTitles([""]);
    setShowCreateModal(true);
  };

  const closeCreateModal = () => setShowCreateModal(false);

  const handleCreateHabit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanTitles = newHabitTitles.map((v) => v.trim()).filter(Boolean);

    if (!cleanTitles.length) {
      setCreateError("Add at least one habit title.");
      return;
    }
    if (cleanTitles.length > remainingSlots) {
      setCreateError(`You can add only ${remainingSlots} more habit(s).`);
      return;
    }

    try {
      setCreatingHabit(true);
      setCreateError("");
      const created = await Promise.all(cleanTitles.map((title) => api.post<Habit>(API.HABITS.CREATE, { title })));
      created.forEach((res) => dispatch(addHabit(res.data)));
      setNewHabitTitles([""]);
      setShowCreateModal(false);
    } catch (err: unknown) {
      const e2 = err as AxiosError<{ message?: string }>;
      setCreateError(e2.response?.data?.message ?? "Failed to create habit.");
    } finally {
      setCreatingHabit(false);
    }
  };

  return {
    habits,
    loading,
    error,
    chartMode,
    setChartMode,
    showCreateModal,
    newHabitTitles,
    setNewHabitTitles,
    createError,
    creatingHabit,
    view,
    remainingSlots,
    openCreateModal,
    closeCreateModal,
    handleCreateHabit,
  };
}


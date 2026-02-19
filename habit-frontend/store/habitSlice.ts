import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type HabitHistory = {
  date: string;
  completed: boolean;
};

export type Habit = {
  _id: string;
  title: string;
  streak?: number;
  history?: HabitHistory[];
  createdAt?: string;
  updatedAt?: string;
};

type HabitState = {
  list: Habit[];
};

const initialState: HabitState = {
  list: [],
};

const habitSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    setHabits: (state, action: PayloadAction<Habit[]>) => {
      state.list = action.payload;
    },
    addHabit: (state, action: PayloadAction<Habit>) => {
      state.list.unshift(action.payload);
    },
    updateHabit: (state, action: PayloadAction<Habit>) => {
      const index = state.list.findIndex((h) => h._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeHabit: (state, action: PayloadAction<string>)=>{
      state.list = state.list.filter((h)=> h._id !== action.payload);
    },
  },
});

export const { setHabits, addHabit, updateHabit, removeHabit } = habitSlice.actions;
export default habitSlice.reducer;

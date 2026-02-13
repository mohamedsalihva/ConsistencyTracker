import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Habit {
  _id: string;
  title: string;
}

interface HabitState {
  list: Habit[];
}

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
      state.list.push(action.payload);
    },
  },
});

export const { setHabits, addHabit } = habitSlice.actions;
export default habitSlice.reducer;
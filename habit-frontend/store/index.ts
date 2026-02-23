import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import habitReducer from "../store/habitSlice";
import chatReducer from "../store/chatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

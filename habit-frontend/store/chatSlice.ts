import { createSlice , type PayloadAction } from "@reduxjs/toolkit";

export type ChatRole = "user" | "assistant";
export type  ChatMessage = { role: ChatRole; content: string};

type ChatState = {
    messages: ChatMessage[];
    loading: boolean;
    error:  string;
};

const initialState: ChatState = {
  messages: [{ role: "assistant", content: "I am your habit coach. Tell me what you are struggling with today." }],
  loading: false,
  error: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setChatError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearChat: (state) => {
      state.messages = initialState.messages;
      state.error = "";
      state.loading = false;
    },
  },
});

export const { addMessage, setLoading, setChatError, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
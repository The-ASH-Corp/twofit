import { createSlice } from "@reduxjs/toolkit";
import {
  getReminders,
} from "./reminder.thunk";

const initialState = {
  reminders: [],
  status: "idle",
  error: null,
};

const reminderSlice = createSlice({
  name: "reminder",
  initialState,
  reducers: {
    clearReminderError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getReminders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getReminders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reminders = action.payload;
      })
      .addCase(getReminders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearReminderError } = reminderSlice.actions;
export default reminderSlice.reducer;

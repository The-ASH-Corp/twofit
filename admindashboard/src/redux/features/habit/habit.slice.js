import { createSlice } from "@reduxjs/toolkit";
import {
  createHabitsThunk,
  getClientHabitByHabitId,
  getClientHabitsThunk,
} from "./habit.thunk";

 
const initialState = {
  habits: null,         
  habitDetails: null,   
  loading: false,
  error: null,
};
;

const habitSlice = createSlice({
  name: "habit",
  initialState,
  reducers: {
    clearHabitState: (state) => {
      state.habits = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
       .addCase(createHabitsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHabitsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = action.payload;
      })
      .addCase(createHabitsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       .addCase(getClientHabitsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClientHabitsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = action.payload;
      })
      .addCase(getClientHabitsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       .addCase(getClientHabitByHabitId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientHabitByHabitId.fulfilled, (state, action) => {
        state.loading = false;
        state.habitDetails = action.payload;
      })
      .addCase(getClientHabitByHabitId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearHabitState } = habitSlice.actions;
export default habitSlice.reducer;

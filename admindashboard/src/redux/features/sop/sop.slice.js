import { createSlice } from "@reduxjs/toolkit";
import { getSOPByCoach, getSopById, getSOPHistory, getSOPStats, todaySop } from "./sop.thunk";


const initialState = {
  tasks: [],
  todayTasks: [],
  task: [],
  stats: [],
  history: [],
  error: null,
  status: "idle",
};

const sopSlice = createSlice({
  name: "sop",
  initialState,
  reducers: {
    clearSopError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todaySop.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(todaySop.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.todayTasks = action.payload.data;
        state.error = null;
      })
      .addCase(todaySop.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getSopById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getSopById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.task = action.payload.data;
        state.error = null;
      })
      .addCase(getSopById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getSOPByCoach.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getSOPByCoach.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload.data;
        state.error = null;
      })
      .addCase(getSOPByCoach.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getSOPStats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getSOPStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      })
      .addCase(getSOPStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getSOPHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSOPHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.history = action.payload.data;
      })
      .addCase(getSOPHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
      
  },
});

export const { clearSopError } = sopSlice.actions;
export default sopSlice.reducer;
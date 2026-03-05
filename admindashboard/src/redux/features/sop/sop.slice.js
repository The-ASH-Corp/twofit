import { createSlice } from "@reduxjs/toolkit";
import { getSopById, todaySop } from "./sop.thunk";


const initialState = {
  tasks: [],
  task: [],
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
        state.tasks = action.payload.data;
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
      });
      
  },
});

export const { clearSopError } = sopSlice.actions;
export default sopSlice.reducer;
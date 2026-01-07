
import { createSlice } from "@reduxjs/toolkit";
import { createCoach, getAllCoaches, getSingleCoach } from "./coach.thunk";
import { getAllCoachesByAdminId } from "../admins/admin.thunk";

const initialState = {
  allCoaches: [],
  selectedCoach: null,
  error: null,
  status: "idle",
};

const coachSlice = createSlice({
  name: "coach",
  initialState,
  reducers: {
    clearCoach(state) {
      state.allCoaches =[];
      state.selectedCoach=null;
      state.status="idle"
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      //get all coach slices
      .addCase(getAllCoaches.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllCoaches.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allCoaches = action.payload;
        state.error = null;
      })
      .addCase(getAllCoaches.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // get a Single Coach
      .addCase(getSingleCoach.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getSingleCoach.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCoach = action.payload;
        state.error = null;
      })
      .addCase(getSingleCoach.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.selectedCoach = null;
      })

      // create Coach
      .addCase(createCoach.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createCoach.fulfilled, (state) => {
        state.status = "succeeded";
        state.selectedCoach = null;
        state.error = null;
      })
      .addCase(createCoach.rejected, (state, action) => {
        state.status = "failed"; 
        state.error = action.payload;
      })
      // get all coaches by admin id
      .addCase(getAllCoachesByAdminId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllCoachesByAdminId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allCoaches = action.payload;
        state.error = null;
      })
      .addCase(getAllCoachesByAdminId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});

export const { clearCoach } = coachSlice.actions;
export default coachSlice.reducer;

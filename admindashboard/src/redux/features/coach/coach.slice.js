import { createSlice } from "@reduxjs/toolkit";
import { getAllCoaches } from "./coach.thunk";

const initialState = {
  allCoaches:[],
  selectedCoach:null,
  error:null,
  status:"idle",
};

const coachSlice = createSlice({
  name: "coach",
  initialState,
  reducers: {
    clearCoachError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCoaches.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllCoaches.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allCoaches = action.payload;
      })
      .addCase(getAllCoaches.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});

export const { clearCoachError } = coachSlice.actions;
export default coachSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { createCoach, getAllCoaches, getSingleCoach } from "./coach.thunk";

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
        state.error = null
      })
      .addCase(getAllCoaches.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allCoaches = action.payload;
        state.error = null
      })
      .addCase(getAllCoaches.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // get a Single Coach
      .addCase(getSingleCoach.pending, (state) => {
        state.status = "loading";
        state.error = null
      })
      .addCase(getSingleCoach.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCoach = action.payload
        state.error = null
      })
      .addCase(getSingleCoach.rejected,(state,action)=>{
        state.status="failed",
        state.error =action.payload,
        state.selectedCoach =null
      })

      // create Coach 
      .addCase(createCoach.pending,(state)=>{
        state.status = "loading";
        state.error = null
      })
      .addCase(createCoach.fulfilled,(state,action)=>{
        state.status = "succeeded";
        state.selectedCoach = action.payload
        state.error = null
      })
      .addCase(createCoach.rejected,(state,action)=>{
        state.status="failed",
        state.error =action.payload
      })
  },
});

export const { clearCoach } = coachSlice.actions;
export default coachSlice.reducer;

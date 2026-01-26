import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTherapyPlans,
  getTherapyPlanById,
} from "./therapy.thunk";

const initialState = {
  plans: [],        // all therapy plans (for dropdown, listing)
  plan: null,       // single therapy plan (for client dashboard)
  loading: false,
  error: null,
};

const therapySlice = createSlice({
  name: "therapy",
  initialState,
  reducers: {
    clearTherapyPlan(state) {
      state.plan = null;
    },
  },
  extraReducers: (builder) => {
    builder

      
      .addCase(fetchTherapyPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTherapyPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload?.data || [];
      })
      .addCase(fetchTherapyPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })

      
       .addCase(getTherapyPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTherapyPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.plan = action.payload?.data || null;
      })
      .addCase(getTherapyPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
  },
});

export const { clearTherapyPlan } = therapySlice.actions;
export default therapySlice.reducer;

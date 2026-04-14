import { createSlice } from "@reduxjs/toolkit";
import {
  sendSupportRequest,
  fetchReceivedSupport,
  markSupportAsRead,
} from "./growthSupport.thunk";

const initialState = {
  requests: [],
  totalCount: 0,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const growthSupportSlice = createSlice({
  name: "growthSupport",
  initialState,
  reducers: {
    clearGrowthSupportError(state) {
      state.error = null;
    },
    resetGrowthSupportStatus(state) {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Request
      .addCase(sendSupportRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendSupportRequest.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(sendSupportRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch Received
      .addCase(fetchReceivedSupport.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReceivedSupport.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.requests = action.payload.data;
        state.totalCount = action.payload.totalCount;
        state.error = null;
      })
      .addCase(fetchReceivedSupport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Mark as Read
      .addCase(markSupportAsRead.fulfilled, (state, action) => {
        const index = state.requests.findIndex(
          (r) => r._id === action.payload.data._id,
        );
        if (index !== -1) {
          state.requests[index].status = "read";
        }
      });
  },
});

export const { clearGrowthSupportError, resetGrowthSupportStatus } =
  growthSupportSlice.actions;
export default growthSupportSlice.reducer;

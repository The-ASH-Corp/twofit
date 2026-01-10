import { createSlice } from "@reduxjs/toolkit";
import { createHead, getAllHeads, getHead } from "./head.thunk";

const initialState = {
  allHeads: [],
  createHead: null,
  head: null,
  status: "idle",
  error: null,
};

const headSlice = createSlice({
  name: "head",
  initialState,

  reducers: {
    clearHeadError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createHead.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createHead.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.createHead = action.payload;
        state.error = null;
      })
      .addCase(createHead.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getAllHeads.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllHeads.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allHeads = action.payload;
      })
      .addCase(getAllHeads.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getHead.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getHead.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.head = action.payload;
        state.error = null;
      })
      .addCase(getHead.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearHeadError } = headSlice.actions;
export default headSlice.reducer;

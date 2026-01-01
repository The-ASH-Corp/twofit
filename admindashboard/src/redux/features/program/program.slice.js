import { createSlice } from "@reduxjs/toolkit";
import { createProgram, getAllPrograms } from "./program.thunk";

const initialState = {
  allPrograms: [],
  selectedProgram: null,
  error: null,
  status: "idle",
};

const programSlice = createSlice({
  name: "program",
  initialState,
  reducers: {
    clearProgramError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      //get all program slices
      .addCase(getAllPrograms.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllPrograms.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allPrograms = action.payload;
        state.error = null;
      })
      .addCase(getAllPrograms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(createProgram.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createProgram.fulfilled, (state) => {
        state.status = "succeeded";
        state.selectedProgram = null;
        state.error = null;
      })
      .addCase(createProgram.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearProgramError } = programSlice.actions;
export default programSlice.reducer;

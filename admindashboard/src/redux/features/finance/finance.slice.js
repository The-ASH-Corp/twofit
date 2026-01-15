import { createSlice } from "@reduxjs/toolkit";
import { getAllEmployees } from "./finance.thunk";

const initialState = {
  allEmployees: [],
  employeeCount: null,
  totalSalary: null,
  error: null,
  status: "idle",
};

const employeeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    clearEmployeeError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllEmployees.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allEmployees = action.payload.data.employees;
        state.employeeCount = action.payload.data.employeeCount;
        state.totalSalary = action.payload.data.totalSalary;
        state.error = null;
      })
      .addCase(getAllEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearEmployeeError } = employeeSlice.actions;
export default employeeSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { getAllAdmins } from "./admin.thunk";

const initialState = {
  admins: [],
  selectedAdmin: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminSlice(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAdmins.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllAdmins.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.admins = action.payload;
        state.error =null;;
      })
      .addCase(getAllAdmins.rejected,(state,action)=>{
        state.status="failed"
        state.error=action.payload;
      })
  },
});

export const { clearAdminSlice } = adminSlice.actions;
export default adminSlice.reducer;

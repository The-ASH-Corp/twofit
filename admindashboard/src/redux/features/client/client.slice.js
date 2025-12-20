import { createSlice } from "@reduxjs/toolkit";
import { getAllClients, getClient } from "./client.thunk";

const initialState = {
  allClients:[],
  selectedClient:null,
  error:null,
  status:"idle",
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clearClientError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllClients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllClients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allClients = action.payload;
      })
      .addCase(getAllClients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getClient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getClient.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedClient = action.payload;
      })
      .addCase(getClient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearClientError } = clientSlice.actions;
export default clientSlice.reducer;

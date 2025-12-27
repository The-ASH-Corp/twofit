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
    clearClient(state) {
      state.allClients=[];
      state.selectedClient=null;
      state.error = null;
      state.status="idle"
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
        state.error = null;
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
        state.error = null;
      })
      .addCase(getClient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearClient } = clientSlice.actions;
export default clientSlice.reducer;

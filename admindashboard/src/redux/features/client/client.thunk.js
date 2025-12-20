import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";



export const getAllClients = createAsyncThunk(
  "client/getAllClients",
  async ({page,limit}, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/clients/all-clients/${page}/${limit}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get clients");
    }
  }
);
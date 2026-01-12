import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

export const founderDashboardData = createAsyncThunk(
  "founder/get-dashboard-data",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`founder/dashboard-data`);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get founder"
      );
    }
  }
);
import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createBroadcast = createAsyncThunk(
  "broadcast/create",
  async (broadcastData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/broadcast/create",
        broadcastData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        // console.log(error),
        error.response?.data?.message || "creating broadcast failed",
      );
    }
  },
);

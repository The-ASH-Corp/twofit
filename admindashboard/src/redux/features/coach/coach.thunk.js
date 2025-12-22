import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";



export const getAllCoaches = createAsyncThunk(
  "coach/getAllCoaches",
  async ({page,limit}, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/coach/get-all-coaches/${page}/${limit}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get coaches");
    }
  }
);
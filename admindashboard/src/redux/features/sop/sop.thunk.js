import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createSop = createAsyncThunk(
  "sop/create",
  async (sopData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/sop/assign", sopData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "creating task failed",
      );
    }
  },
);

export const todaySop = createAsyncThunk(
  "sop/today",
  async ({ coachId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/sop/today/${coachId}`);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get tasks",
      );
    }
  },
);

export const getSopById = createAsyncThunk(
  "sop/get",
  async ({ SOPId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/sop/get/${SOPId}`);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get tasks",
      );
    }
  },
);
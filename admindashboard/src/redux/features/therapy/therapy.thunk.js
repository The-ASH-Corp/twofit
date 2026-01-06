import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, { axiosFile } from "../../../utils/axiosInstance";

export const createTherapy = createAsyncThunk(
    "therapy/create",
    async (therapyData, { rejectWithValue }) => {
      try {
        const response = await axiosFile.post("/therapy/create", therapyData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add therapy");
      }
    })

export const getAllTherapies = createAsyncThunk(
  "therapy/get-all-therapy",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/therapy/get-all-therapy/${page}/${limit}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch therapies"
      );
    }
  }
);    
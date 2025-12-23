import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";



export const createCoach = createAsyncThunk("coach/createCoach", async (coachDetails, { rejectWithValue }) => {
  try {
    const data = await axiosInstance.post(`/coach/create`, coachDetails)
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to Create Expert");
  }
})


export const getAllCoaches = createAsyncThunk(
  "coach/getAllCoaches",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/coach/get-all-coaches/${page}/${limit}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get coaches");
    }
  }
);

export const getSingleCoach = createAsyncThunk("coach/getSingleCoach", async (id, { rejectWithValue }) => {
  try {
    const data = await axiosInstance.get(`/coach/get-coach/${id}`)
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to get coache");
  }
})


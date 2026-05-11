import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

// GET
export const getReminders = createAsyncThunk(
  "reminder/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/reminder");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// UPDATE
export const updateReminder = createAsyncThunk(
  "reminder/update",
  async ({ type, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/reminder/${type}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// TOGGLE
export const toggleReminder = createAsyncThunk(
  "reminder/toggle",
  async (type, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/reminder/toggle/${type}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);


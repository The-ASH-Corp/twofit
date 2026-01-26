import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

export const createCoach = createAsyncThunk(
  "coach/createCoach",
  async (coachDetails, { rejectWithValue }) => {
    try {
      const config =
        coachDetails instanceof FormData
          ? {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          : {};

      const data = await axiosInstance.post(
        `/coach/create`,
        coachDetails,
        config,
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to Create Expert",
      );
    }
  },
);

export const getAllCoaches = createAsyncThunk(
  "coach/getAllCoaches",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        `/coach/get-all-coaches/${page}/${limit}`,
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get coaches",
      );
    }
  },
);

export const getSingleCoach = createAsyncThunk(
  "coach/getSingleCoach",
  async (id, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/coach/get-coach/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get coache",
      );
    }
  },
);

export const getAllCoachesByAdmin = createAsyncThunk(
  "coach/getAllCoachesByAdmin",
  async (adminIds, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post(`/coach/get-coaches-by-admin`, {
        adminIds,
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get coaches by admin",
      );
    }
  },
);

export const getUsersAssignedToACoach = createAsyncThunk(
  "coach/getUsersAssignedToACoach",
  async ({ coachId, page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/coach/assigned-users/${coachId}/${page}/${limit}`,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get assigned users",
      );
    }
  },
);

export const getCoachDashboardStats = createAsyncThunk(
  "coach/getCoachDashboardStats",
  async (coachId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/coach/dashboard-stats/${coachId}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get coach dashboard stats",
      );
    }
  },
);

export const getFounderAllCoaches = createAsyncThunk(
  "/coach/founder/list",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        `/coach/founder/list/${page}/${limit}`,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get coaches",
      );
    }
  },
);
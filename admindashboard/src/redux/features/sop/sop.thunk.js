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
        error.response?.data?.message || "Failed to get task",
      );
    }
  },
);

export const updateSOP = createAsyncThunk(
  "sop/update",
  async ({ SOPId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/sop/update/${SOPId}`,
        updatedData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.status || "Failed to update task",
      );
    }
  },
);

export const deleteSOP = createAsyncThunk(
  "sop/delete",
  async ({ SOPId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/sop/delete/${SOPId}`);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get task",
      );
    }
  },
);

export const getSOPByCoach = createAsyncThunk(
  "sop/getByCoach",
  async ({ coachId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/sop/getByCoach/${coachId}`);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get tasks",
      );
    }
  },
);

export const completeSOP = createAsyncThunk(
  "sop/completeSOP",
  async ({ SOPId, coachId, completed }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/sop/complete/${SOPId}/${coachId}`,
        { completed },
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to complete tasks",
      );
    }
  },
);

export const getSOPStats = createAsyncThunk(
  "sop/stats",
  async ({ coachId, month, year }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/sop/stats/${coachId}/${month}/${year}`,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get stats",
      );
    }
  },
);

export const getSOPHistory = createAsyncThunk(
  "sop/history",
  async ({ coachId, month, year }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/sop/history/${coachId}/${month}/${year}`,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch history",
      );
    }
  },
);
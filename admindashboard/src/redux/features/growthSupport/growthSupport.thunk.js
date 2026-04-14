import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

export const sendSupportRequest = createAsyncThunk(
  "growthSupport/send",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/growth-support/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send support request",
      );
    }
  },
);

export const fetchReceivedSupport = createAsyncThunk(
  "growthSupport/fetchReceived",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/growth-support/received?page=${page}&limit=${limit}`,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch support requests",
      );
    }
  },
);

export const markSupportAsRead = createAsyncThunk(
  "growthSupport/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/growth-support/mark-read/${id}`,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark as read",
      );
    }
  },
);

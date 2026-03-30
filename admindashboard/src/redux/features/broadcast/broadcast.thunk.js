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
        error.response?.data?.message || "failed to create broadcast ",
      );
    }
  },
);

export const getAllBroadcast = createAsyncThunk(
  "broadcast/getAllBroadcast",
  async ({ page, limit, type }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        `/broadcast/get/${page}/${limit}/${type}`,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get Broadcast",
      );
    }
  },
);

export const getBroadcast = createAsyncThunk(
  "broadcast/getBroadcast",
  async (id, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/broadcast/get/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get Broadcast",
      );
    }
  },
);

export const deleteBroadcast = createAsyncThunk(
  "broadcast/delete",
  async (id, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.delete(`/broadcast/delete/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete Broadcast",
      );
    }
  },
);

export const updateBroadcast = createAsyncThunk(
  "broadcast/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.put(`/broadcast/update/${id}`, updatedData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update Broadcast",
      );
    }
  },
);

export const sentWhatsAppMessage = createAsyncThunk(
  "broadcast/sentWhatsAppMessage",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post(
        "/broadcast/sent-whatsapp-message",
        payload,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send WhatsApp message",
      );
    }
  },
);

export const getBroadcastAudience = createAsyncThunk(
  "broadcast/getBroadcastAudience",
  async ({ page = 1, limit = 20, search = "" }, { rejectWithValue }) => {
    try {
      const query = `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
      const data = await axiosInstance.get(`/broadcast/audience${query}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch audience",
      );
    }
  },
);

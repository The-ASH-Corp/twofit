import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";



export const getAllClients = createAsyncThunk(
  "client/getAllClients",
  async ({page,limit}, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/clients/all-clients/${page}/${limit}`);
      console.log("API response:", data.data);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get clients");
    }
  }
);

export const getClient = createAsyncThunk(
  "client/getClient",
  async ({id}, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/clients/get-client/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get client");
    }
  }
);

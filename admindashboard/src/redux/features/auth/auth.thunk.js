import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post("/auth/login", credentials);    
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const createClient = createAsyncThunk(
  "auth/createClient",
  async (clientData, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post("/admin/create-user", clientData);  

      return data;
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response?.data?.message || "Failed to create client");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

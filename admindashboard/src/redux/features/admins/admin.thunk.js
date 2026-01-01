import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

export const getAllAdmins = createAsyncThunk(
  "admins/all-admins",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        `/admin/all-admins/${page}/${limit}`
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const createAdmin = createAsyncThunk(
  "admins/create-admin",
  async (adminData, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post("/admin/add-admin",adminData)
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "creating admin failed"
      );
    }
  }
);

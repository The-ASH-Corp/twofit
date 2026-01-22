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
  },
);

export const createClient = createAsyncThunk(
  "auth/createClient",
  async (clientData, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post("/admin/create-user", clientData);

      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create client",
      );
    }
  },
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
  },
);

export const refreshProfile = createAsyncThunk(
  "auth/refreshProfile",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      let endpoint;

      // Determine the correct endpoint based on role
      if (role === "client" || role === "user") {
        endpoint = `/clients/get-client/${id}`;
      } else {
        endpoint = `/admin/admin-profile/${id}`;
      }

      const data = await axiosInstance.get(endpoint);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to refresh profile",
      );
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post("/auth/forgot-password", { email });
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP",
      );
    }
  },
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post("/auth/verify-otp", { email, otp });
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify OTP",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password",
      );
    }
  },
);

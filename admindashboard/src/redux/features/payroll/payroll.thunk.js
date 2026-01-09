import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

export const createPayroll = createAsyncThunk(
  "payroll/update",
  async(payrollData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.put(
          "/payroll/update",
          payrollData
        );
        return response.data
    } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to add payroll"
        );
    }
  }
);

export const getPayroll = createAsyncThunk(
  "payroll/get-payroll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/payroll/get-payroll");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to pay payroll"
      );
    }
  }
);
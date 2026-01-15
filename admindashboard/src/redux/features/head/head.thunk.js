import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

export const createHead = createAsyncThunk(
  "head/create",
  async (headData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("heads/create", headData);
        return response;
    } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to add head"
        ); 
    }
  }
);

export const getAllHeads = createAsyncThunk(
    "head/get-all-heads",
    async ({page, limit}, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get(`heads/get-all-heads/${page}/${limit}`);
            return response;
        } catch (error) {
             return rejectWithValue(
               error.response?.data?.message || "Failed to get heads"
             );
        }
    }
)

export const getHead = createAsyncThunk(
    "head/get-head",
    async (id, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get(`heads/get-head/${id}`);
            return response.data
        } catch (error) {
            return rejectWithValue(
              error.response?.data?.message || "Failed to get heads"
            );
        }
    }
)

export const getDashboardData = createAsyncThunk(
    "head/get-dashboard-data",
    async (headId, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get(`heads/dashboard-data/${headId}`);            
            return response.data
        } catch (error) {
             return rejectWithValue(
               error.response?.data?.message || "Failed to get heads"
             );
        }
    }
)
import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createCategory = createAsyncThunk(
  "category/create",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/category/create",
        categoryData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "creating category failed",
      );
    }
  },
);

export const getCategory = createAsyncThunk(
  "category/list/:catId",
  async ({ id }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`category/list/${id}`);
      // console.log(data.data)
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get categories",
      );
    }
  },
);

export const getAllCategories = createAsyncThunk(
  "category/getAllCategories",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/category/list/${page}/${limit}`);
      // console.log(data.data)
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get categories",
      );
    }
  },
);

export const getFounderCategories = createAsyncThunk(
  "category/founder/list",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        `/category/founder/list/${page}/${limit}`,
      );
      // console.log(data.data)
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get categories",
      );
    }
  },
);
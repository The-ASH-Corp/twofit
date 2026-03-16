import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

// Upload Recipe Image
export const uploadRecipeImageThunk = createAsyncThunk(
  "recipe/uploadImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/recipes/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload recipe image"
      );
    }
  }
);


// Create Recipe
export const createRecipeThunk = createAsyncThunk(
  "recipe/create",
  async (recipeData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/recipes", recipeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create recipe"
      );
    }
  }
);


// Get All Recipes
export const getRecipesThunk = createAsyncThunk(
  "recipe/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/recipes", {
        params,
      });

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch recipes"
      );
    }
  }
);


// Get Recipe By ID
export const getRecipeByIdThunk = createAsyncThunk(
  "recipe/getById",
  async (recipeId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/recipes/${recipeId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch recipe"
      );
    }
  }
);


// Update Recipe
export const updateRecipeThunk = createAsyncThunk(
  "recipe/update",
  async ({ recipeId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/recipes/${recipeId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update recipe"
      );
    }
  }
);


// Delete Recipe
export const deleteRecipeThunk = createAsyncThunk(
  "recipe/delete",
  async (recipeId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/recipes/${recipeId}`);
      return {
        recipeId,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete recipe"
      );
    }
  }
);


// Toggle Bookmark
export const toggleRecipeBookmarkThunk = createAsyncThunk(
  "recipe/toggleBookmark",
  async (recipeId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/recipes/${recipeId}/toggle-bookmark`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle bookmark"
      );
    }
  }
);

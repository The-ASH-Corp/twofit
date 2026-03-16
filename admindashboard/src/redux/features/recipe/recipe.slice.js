import { createSlice } from "@reduxjs/toolkit";
import {
  createRecipeThunk,
  getRecipesThunk,
  getRecipeByIdThunk,
  updateRecipeThunk,
  deleteRecipeThunk,
  toggleRecipeBookmarkThunk,
} from "./recipe.thunk";

const initialState = {
  recipes: [],
  recipeDetails: null,
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET RECIPES
      .addCase(getRecipesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecipesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload?.data?.recipes || [];
        state.total = action.payload?.data?.total || 0;
        state.page = action.payload?.data?.page || 1;
        state.totalPages = action.payload?.data?.totalPages || 1;
      })
      .addCase(getRecipesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE RECIPE
      .addCase(createRecipeThunk.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.recipes.unshift(action.payload.data);
        }
      })

      // GET RECIPE BY ID
      .addCase(getRecipeByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRecipeByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.recipeDetails = action.payload.data || null;
      })
      .addCase(getRecipeByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE RECIPE
      .addCase(updateRecipeThunk.fulfilled, (state, action) => {
        const updatedRecipe = action.payload.data;
        if (!updatedRecipe) {
          return;
        }

        const index = state.recipes.findIndex(
          (recipe) => recipe._id === updatedRecipe._id
        );

        if (index !== -1) {
          state.recipes[index] = updatedRecipe;
        }
      })

      // DELETE RECIPE
      .addCase(deleteRecipeThunk.fulfilled, (state, action) => {
        state.recipes = state.recipes.filter(
          (recipe) => recipe._id !== action.payload.recipeId
        );
      })

      // TOGGLE BOOKMARK
      .addCase(toggleRecipeBookmarkThunk.fulfilled, (state, action) => {
        const updatedRecipe = action.payload.data;
        if (!updatedRecipe) {
          return;
        }

        const index = state.recipes.findIndex(
          (recipe) => recipe._id === updatedRecipe._id
        );

        if (index !== -1) {
          state.recipes[index] = updatedRecipe;
        }

        if (state.recipeDetails?._id === updatedRecipe._id) {
          state.recipeDetails = updatedRecipe;
        }
      });
  },
});

export default recipeSlice.reducer;

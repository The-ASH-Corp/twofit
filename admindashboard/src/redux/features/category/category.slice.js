import { createSlice } from "@reduxjs/toolkit";
 import { getAllCategories } from "./category.thunk";

const initialState = {
  allCategories: [],
  selectedCategory: null,
  error: null,
  status: "idle",
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      //get all program slices
      .addCase(getAllCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allCategories = action.payload;
        state.error = null;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

       

      
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;

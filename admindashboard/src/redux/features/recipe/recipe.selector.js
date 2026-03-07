export const selectRecipes = (state) => state.recipe.recipes;

export const selectRecipeDetails = (state) => state.recipe.recipeDetails;

export const selectRecipeLoading = (state) => state.recipe.loading;

export const selectRecipeError = (state) => state.recipe.error;

export const selectRecipePagination = (state) => ({
  total: state.recipe.total,
  page: state.recipe.page,
  totalPages: state.recipe.totalPages,
});
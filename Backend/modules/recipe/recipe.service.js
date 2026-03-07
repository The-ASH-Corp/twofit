import Recipe from "./recipe.model.js";

export const createRecipe = async (payload) => {
  return await Recipe.create(payload);
};

export const getRecipes = async ({
  page = 1,
  limit = 20,
  search = "",
  category = "",
  bookmarked,
}) => {
  const pageNum = Number(page) > 0 ? Number(page) : 1;
  const limitNum = Number(limit) > 0 ? Number(limit) : 20;
  const skip = (pageNum - 1) * limitNum;
  const query = {};

  if (search?.trim()) {
    query.$or = [
      { name: { $regex: search.trim(), $options: "i" } },
      { ingredients: { $elemMatch: { $regex: search.trim(), $options: "i" } } },
    ];
  }

  if (category?.trim() && category !== "All") {
    query.category = category.trim();
  }

  if (bookmarked === "true" || bookmarked === true) {
    query.isBookmarked = true;
  }

  const [recipes, total] = await Promise.all([
    Recipe.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Recipe.countDocuments(query),
  ]);

  return {
    recipes,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

export const getRecipeById = async (id) => {
  return await Recipe.findById(id);
};

export const updateRecipeById = async (id, data) => {
  return await Recipe.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteRecipeById = async (id) => {
  return await Recipe.findByIdAndDelete(id);
};

export const toggleRecipeFlag = async (id, field) => {
  const recipe = await Recipe.findById(id);
  if (!recipe) return null;
  recipe[field] = !recipe[field];
  await recipe.save();
  return recipe;
};

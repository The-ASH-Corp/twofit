import Recipe from "./recipe.model.js";
import RecipeBookmark from "./recipeBookmark.model.js";

const attachBookmarkState = (recipes, bookmarkedIds) => {
  const bookmarkedSet = new Set(bookmarkedIds.map((id) => id.toString()));

  return recipes.map((recipe) => {
    const recipeObject =
      typeof recipe.toObject === "function" ? recipe.toObject() : { ...recipe };

    return {
      ...recipeObject,
      isBookmarked: bookmarkedSet.has(recipeObject._id.toString()),
    };
  });
};

export const createRecipe = async (data) => {
  return await Recipe.create(data);
};

export const getRecipes = async ({
  userId,
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

  let bookmarkedIds = [];
  if (userId) {
    const userBookmarks = await RecipeBookmark.find({ userId }).select("recipeId");
    bookmarkedIds = userBookmarks.map((bookmark) => bookmark.recipeId);
  }

  if (bookmarked === "true" || bookmarked === true) {
    if (!bookmarkedIds.length) {
      return {
        recipes: [],
        total: 0,
        page: pageNum,
        limit: limitNum,
        totalPages: 1,
      };
    }

    query._id = { $in: bookmarkedIds };
  }

  const [recipes, total] = await Promise.all([
    Recipe.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Recipe.countDocuments(query),
  ]);

  return {
    recipes: attachBookmarkState(recipes, bookmarkedIds),
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

export const getRecipeById = async (id, userId) => {
  const recipe = await Recipe.findById(id);
  if (!recipe) {
    return null;
  }

  if (!userId) {
    return {
      ...recipe.toObject(),
      isBookmarked: false,
    };
  }

  const bookmark = await RecipeBookmark.findOne({ userId, recipeId: id }).select("_id");

  return {
    ...recipe.toObject(),
    isBookmarked: Boolean(bookmark),
  };
};

export const updateRecipeById = async (id, data) => {
  return await Recipe.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteRecipeById = async (id) => {
  const deletedRecipe = await Recipe.findByIdAndDelete(id);

  if (deletedRecipe) {
    await RecipeBookmark.deleteMany({ recipeId: id });
  }

  return deletedRecipe;
};

export const toggleRecipeFlag = async (id, field) => {
  const recipe = await Recipe.findById(id);
  if (!recipe) return null;
  recipe[field] = !recipe[field];
  await recipe.save();
  return recipe;
};

export const toggleRecipeBookmark = async ({ recipeId, userId }) => {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    return null;
  }

  const existingBookmark = await RecipeBookmark.findOne({
    userId,
    recipeId,
  });

  if (existingBookmark) {
    await existingBookmark.deleteOne();
  } else {
    await RecipeBookmark.create({
      userId,
      recipeId,
    });
  }

  return {
    ...recipe.toObject(),
    isBookmarked: !existingBookmark,
  };
};

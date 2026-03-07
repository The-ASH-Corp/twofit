import * as recipeService from "./recipe.service.js";

export const createRecipeController = async (req, res) => {
  try {
    const data = {
      ...req.body,
      createdBy: req.user?._id || null,
    };

    const recipe = await recipeService.createRecipe(data);

    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecipesController = async (req, res) => {
  try {
    const { page, limit, search, category, bookmarked } = req.query;
    const data = await recipeService.getRecipes({
      page,
      limit,
      search,
      category,
      bookmarked,
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecipeByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await recipeService.getRecipeById(id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }
    res.status(200).json({ success: true, data: recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRecipeController = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await recipeService.updateRecipeById(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Recipe updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRecipeController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await recipeService.deleteRecipeById(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }
    res.status(200).json({ success: true, message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleBookmarkController = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await recipeService.toggleRecipeFlag(id, "isBookmarked");
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }
    res.status(200).json({ success: true, data: recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleSavedController = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await recipeService.toggleRecipeFlag(id, "isSaved");
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }
    res.status(200).json({ success: true, data: recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadRecipeImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: fileUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

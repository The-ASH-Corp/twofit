import { createCategory ,getAllCategory,getSingleCategory,updateCategory,deleteSingleCategory,deleteAllCategory} from "./category.service.js";
 
export const createCategoryController = async (req, res) => {
  try {
    const category = await createCategory(req.body);
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

 
export const getAllCategoryController = async (req, res) => {
  try {
    const categories = await getAllCategory();
    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 
export const getSingleCategoryController = async (req, res) => {
  try {
    const category = await getSingleCategory(req.params.id);
    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

 
export const updateCategoryController = async (req, res) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

 
export const deleteSingleCategoryController = async (req, res) => {
  try {
    const category = await deleteSingleCategory(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

 
export const deleteAllCategoriesController = async (req, res) => {
  try {
    const result = await deleteAllCategory();
    return res.status(200).json({
      success: true,
      message: "All categories deleted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

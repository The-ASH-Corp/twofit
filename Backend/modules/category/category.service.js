import categoryModel from "./category.model.js"

export const createCategory= async (data)=>{
    try {
    if (!data?.name) {
      throw new Error("Category name is required");
    }

    const exists = await categoryModel.findOne({
      name: data.name.trim(),
    });

    if (exists) {
      throw new Error("Category already exists");
    }
   return await categoryModel.create(data)
    } catch (error) {
    throw error;
  }
}

export const getAllCategory=async()=>{
     try {
    return await categoryModel.find().sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
 }

export const getSingleCategory=async(id)=>{
   try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid category ID");
    }

    const category = await categoryModel.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  } catch (error) {
    throw error;
  }
}

export const updateCategory=async(id,data)=>{
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid category ID");
    }

    if (!data?.name) {
      throw new Error("Category name is required");
    }

    const duplicate = await categoryModel.findOne({
      name: data.name.trim(),
      _id: { $ne: id },
    });

    if (duplicate) {
      throw new Error("Category name already exists");
    }

    const updated = await categoryModel.findByIdAndUpdate(
      id,
      { name: data.name.trim() },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new Error("Category not found");
    }

    return updated;
  } catch (error) {
    throw error;
  }
}
export const deleteSingleCategory=async(id)=>{
   try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid category ID");
    }

    const deleted = await categoryModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new Error("Category not found");
    }

    return deleted;
  } catch (error) {
    throw error;
  }
}

export const deleteAllCategory=async( )=>{
 try {
    return await categoryModel.deleteMany({});
  } catch (error) {
    throw error;
  }
}
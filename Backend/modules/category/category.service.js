import { categoryModel } from "./category.model.js"

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

export const getAllCategory = async (page, limit) => {
  try {
    const skip = (page - 1) * limit;
    const totalCount = await categoryModel.countDocuments()
    const category =  await categoryModel.find().skip(skip).limit(limit)
     return {
      category,
      totalCount
     }
  } catch (error) {
    throw error;
  }
};

export const getSingleCategory=async(id)=>{
   try {
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
    console.log(id, data)
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

export const founderCategoryList = async (page, limit) => {
  try {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const totalCount = await categoryModel.countDocuments();

    const data = await categoryModel.aggregate([
      { $skip: skip },
      { $limit: limit },

      // ===== Programs under category =====
      {
        $lookup: {
          from: "programslists",
          localField: "_id",
          foreignField: "category",
          as: "programs",
        },
      },

      // ===== Heads under category =====
      {
        $lookup: {
          from: "heads",
          localField: "_id",
          foreignField: "programCategory",
          as: "heads",
        },
      },

      // ===== Admins under heads =====
      {
        $lookup: {
          from: "admins",
          localField: "heads._id",
          foreignField: "headId",
          as: "admins",
        },
      },

      // ===== Coaches under programs =====
      {
        $lookup: {
          from: "coaches",
          localField: "programs._id",
          foreignField: "assignedPrograms",
          as: "coaches",
        },
      },

      // ===== Users under programs =====
      {
        $lookup: {
          from: "users",
          localField: "programs._id",
          foreignField: "programType",
          as: "users",
        },
      },

      // ===== Final Shape =====
      {
        $project: {
          _id: 0,
          _id: "$_id",
          categoryName: "$name",

          programsCount: { $size: "$programs" },
          // headsCount: { $size: "$heads" },
          adminsCount: { $size: "$admins" },
          expertCount: { $size: "$coaches" },
          clientCount: { $size: "$users" },
        },
      },
    ]);

    return {
      data,
      totalCount,
    };
  } catch (error) {
    throw error;
  }
};
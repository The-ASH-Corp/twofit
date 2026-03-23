import mongoose from "mongoose";

const recipeBookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

recipeBookmarkSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

const RecipeBookmark = mongoose.model("RecipeBookmark", recipeBookmarkSchema);

export default RecipeBookmark;

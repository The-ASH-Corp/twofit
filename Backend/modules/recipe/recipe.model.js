import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    calories: { type: Number, required: true, min: 0 },
    protein: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    ingredients: [{ type: String, trim: true }],
    steps: [{ type: String, trim: true }],
    isBookmarked: { type: Boolean, default: false },
    isSaved: { type: Boolean, default: true },
  },
  { timestamps: true },
);

recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ name: "text", ingredients: "text", category: "text" });

const Recipe =  mongoose.model("Recipe", recipeSchema);

export default Recipe;

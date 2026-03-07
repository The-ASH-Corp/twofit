import { useState } from "react";
import {
  Plus,
  X,
  ChefHat,
} from "lucide-react";

const CATEGORY_OPTIONS = [
  "Fat loss meals",
  "Muscle gain meals",
  "Vegetarian meals",
  "High-protein snacks",
  "Low-calorie desserts",
];

const INITIAL_RECIPES = [
  {
    id: 1,
    name: "Greek Chicken Power Bowl",
    category: "Fat loss meals",
    calories: 420,
    protein: 38,
    ingredients: [
      "150 g grilled chicken breast",
      "1 cup mixed greens",
      "1/2 cup cucumber and tomato",
      "2 tbsp Greek yogurt dressing",
      "1 tbsp pumpkin seeds",
    ],
    steps: [
      "Grill seasoned chicken breast and slice.",
      "Layer greens, veggies, and seeds in a bowl.",
      "Top with chicken and drizzle yogurt dressing.",
    ],
    isBookmarked: false,
    isSaved: true,
  },
  {
    id: 2,
    name: "Paneer Quinoa Fuel Plate",
    category: "Muscle gain meals",
    calories: 590,
    protein: 42,
    ingredients: [
      "120 g paneer cubes",
      "1 cup cooked quinoa",
      "1/2 cup sauteed bell peppers",
      "1 tsp olive oil",
      "1 tsp chili garlic spice mix",
    ],
    steps: [
      "Pan sear paneer in olive oil and spices.",
      "Warm cooked quinoa and vegetables.",
      "Assemble together and serve hot.",
    ],
    isBookmarked: true,
    isSaved: true,
  },
  {
    id: 3,
    name: "Chickpea Avocado Crunch Wrap",
    category: "Vegetarian meals",
    calories: 465,
    protein: 24,
    ingredients: [
      "1 whole wheat tortilla",
      "3/4 cup mashed chickpeas",
      "1/4 avocado, sliced",
      "1/2 cup shredded lettuce",
      "1 tbsp lemon tahini sauce",
    ],
    steps: [
      "Season and mash chickpeas with lemon and pepper.",
      "Spread chickpeas over tortilla and add fillings.",
      "Wrap tightly, toast lightly, then slice.",
    ],
    isBookmarked: false,
    isSaved: false,
  },
  {
    id: 4,
    name: "Cottage Cheese Protein Bites",
    category: "High-protein snacks",
    calories: 210,
    protein: 20,
    ingredients: [
      "1/2 cup low-fat cottage cheese",
      "1 tbsp oats flour",
      "1 tbsp chia seeds",
      "1 tsp cocoa powder",
      "1 tsp honey",
    ],
    steps: [
      "Blend all ingredients into a thick mix.",
      "Roll into small bite-sized balls.",
      "Chill for 20 minutes before serving.",
    ],
    isBookmarked: true,
    isSaved: false,
  },
  {
    id: 5,
    name: "Berry Yogurt Cloud Mousse",
    category: "Low-calorie desserts",
    calories: 155,
    protein: 14,
    ingredients: [
      "3/4 cup Greek yogurt",
      "1/2 cup fresh mixed berries",
      "1 tsp vanilla extract",
      "1 tsp maple syrup",
      "1 tbsp crushed pistachios",
    ],
    steps: [
      "Whisk yogurt, vanilla, and maple syrup.",
      "Fold in half of the berries.",
      "Top with remaining berries and pistachios.",
    ],
    isBookmarked: false,
    isSaved: true,
  },
];

const emptyForm = {
  name: "",
  category: CATEGORY_OPTIONS[0],
  calories: "",
  protein: "",
  image: "",
  ingredients: [""],
  steps: [""],
};

export default function RecipeForm() {
  const [, setRecipes] = useState(INITIAL_RECIPES);
  const [formData, setFormData] = useState(emptyForm);

  const handleImageFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      if (typeof fileReader.result === "string") {
        handleFieldChange("image", fileReader.result);
      }
    };
    fileReader.readAsDataURL(file);
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateListField = (field, index, value) => {
    setFormData((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addListField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeListField = (field, index) => {
    setFormData((prev) => {
      if (prev[field].length === 1) {
        return prev;
      }

      return {
        ...prev,
        [field]: prev[field].filter((_, itemIndex) => itemIndex !== index),
      };
    });
  };

  // const toggleFlag = (id, field) => {
  //   setRecipes((prev) =>
  //     prev.map((recipe) =>
  //       recipe.id === id ? { ...recipe, [field]: !recipe[field] } : recipe
  //     )
  //   );
  // };

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanedIngredients = formData.ingredients
      .map((item) => item.trim())
      .filter(Boolean);
    const cleanedSteps = formData.steps.map((item) => item.trim()).filter(Boolean);

    if (
      !formData.name.trim() ||
      !formData.calories ||
      !formData.protein ||
      cleanedIngredients.length === 0 ||
      cleanedSteps.length === 0
    ) {
      return;
    }

    const createdRecipe = {
      id: Date.now(),
      name: formData.name.trim(),
      category: formData.category,
      calories: Number(formData.calories),
      protein: Number(formData.protein),
      image: formData.image.trim(),
      ingredients: cleanedIngredients,
      steps: cleanedSteps,
      isBookmarked: false,
      isSaved: true,
    };

    setRecipes((prev) => [createdRecipe, ...prev]);
    setFormData(emptyForm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6fbf8] via-[#eef7ff] to-[#fffaf1] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-emerald-700">
                Founder Nutrition Library
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Comprehensive Categorized Recipe Hub
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Build meal plans that improve diet adherence and user satisfaction with
                rich nutrition metadata and fast recipe discovery.
              </p>
            </div>

            {/* <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-4">
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-center">
                <p className="text-xs font-semibold uppercase text-emerald-700">Recipes</p>
                <p className="text-xl font-bold text-emerald-900">{recipes.length}</p>
              </div>
              <div className="rounded-2xl bg-blue-50 px-4 py-3 text-center">
                <p className="text-xs font-semibold uppercase text-blue-700">Bookmarked</p>
                <p className="text-xl font-bold text-blue-900">
                  {recipes.filter((item) => item.isBookmarked).length}
                </p>
              </div>
            </div> */}
          </div>
        </section>

        <section className="">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8"
          >
            <h2 className="text-xl font-bold text-slate-900">Create Recipe</h2>
            <p className="mt-1 text-sm text-slate-500">
              Each recipe includes calories, protein, ingredient list, and preparation steps.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Recipe Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleFieldChange("name", event.target.value)}
                  placeholder="Enter recipe title"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(event) => handleFieldChange("category", event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  >
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Calories
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.calories}
                    onChange={(event) => handleFieldChange("calories", event.target.value)}
                    placeholder="kcal"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.protein}
                    onChange={(event) => handleFieldChange("protein", event.target.value)}
                    placeholder="grams"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(event) => handleFieldChange("image", event.target.value)}
                    placeholder="https://example.com/recipe-image.jpg"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 outline-none transition file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
              </div>

              {formData.image ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <img
                    src={formData.image}
                    alt="Recipe preview"
                    className="h-48 w-full object-cover"
                  />
                </div>
              ) : null}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">Ingredients</label>
                  <button
                    type="button"
                    onClick={() => addListField("ingredients")}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={`ingredient-${index}`} className="flex gap-2">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(event) =>
                          updateListField("ingredients", index, event.target.value)
                        }
                        placeholder={`Ingredient ${index + 1}`}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      />
                      <button
                        type="button"
                        onClick={() => removeListField("ingredients", index)}
                        className="rounded-xl border border-slate-200 px-3 text-slate-400 hover:text-rose-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">Preparation Steps</label>
                  <button
                    type="button"
                    onClick={() => addListField("steps")}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.steps.map((step, index) => (
                    <div key={`step-${index}`} className="flex gap-2">
                      <textarea
                        value={step}
                        onChange={(event) =>
                          updateListField("steps", index, event.target.value)
                        }
                        rows={2}
                        placeholder={`Step ${index + 1}`}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      />
                      <button
                        type="button"
                        onClick={() => removeListField("steps", index)}
                        className="h-fit rounded-xl border border-slate-200 px-3 py-2 text-slate-400 hover:text-rose-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <ChefHat size={16} /> Save Recipe
              </button>
            </div>
          </form>

          {/* <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-bold text-slate-900">Recipe Library</h2>

              <button
                onClick={() => setShowBookmarkedOnly((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  showBookmarkedOnly
                    ? "bg-amber-100 text-amber-800"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                <Filter size={15} />
                {showBookmarkedOnly ? "Showing Bookmarked" : "Show Bookmarked"}
              </button>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search by recipe or ingredient"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <select
                value={activeCategory}
                onChange={(event) => setActiveCategory(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="All">All Categories</option>
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              {["All", ...CATEGORY_OPTIONS].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    activeCategory === category
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid gap-4 max-h-[62vh] overflow-y-auto pr-1">
              {filteredRecipes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                  No recipes match the selected filters.
                </div>
              ) : (
                filteredRecipes.map((recipe) => (
                  <article
                    key={recipe.id}
                    className="rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                          {recipe.category}
                        </p>
                        <h3 className="mt-1 text-base font-bold text-slate-900">{recipe.name}</h3>
                      </div>

                      <button
                        onClick={() => toggleFlag(recipe.id, "isBookmarked")}
                        className={`rounded-lg p-2 transition ${
                          recipe.isBookmarked
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                        aria-label="Toggle bookmark"
                      >
                        <Bookmark size={15} fill={recipe.isBookmarked ? "currentColor" : "none"} />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 font-semibold text-orange-700">
                        <Flame size={13} /> {recipe.calories} kcal
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                        <Dumbbell size={13} /> {recipe.protein} g protein
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
                      <div>
                        <p className="mb-1 font-semibold text-slate-800">Ingredients</p>
                        <ul className="space-y-1 text-xs leading-relaxed text-slate-600">
                          {recipe.ingredients.map((item, idx) => (
                            <li key={`${recipe.id}-ingredient-${idx}`}>- {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="mb-1 font-semibold text-slate-800">Preparation</p>
                        <ol className="space-y-1 text-xs leading-relaxed text-slate-600">
                          {recipe.steps.map((item, idx) => (
                            <li key={`${recipe.id}-step-${idx}`}>{idx + 1}. {item}</li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <p
                        className={`text-xs font-semibold ${
                          recipe.isSaved ? "text-emerald-700" : "text-slate-400"
                        }`}
                      >
                        {recipe.isSaved ? "Saved to library" : "Not saved"}
                      </p>

                      <button
                        onClick={() => toggleFlag(recipe.id, "isSaved")}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          recipe.isSaved
                            ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        {recipe.isSaved ? "Unsave" : "Save"}
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div> */}
        </section>
      </div>
    </div>
  );
}

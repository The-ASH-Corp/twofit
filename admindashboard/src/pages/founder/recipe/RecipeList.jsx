import React from "react";
import { useState, useMemo } from "react";
import {
  Bookmark,
  Search,
  Filter,
  Plus,
  X,
  ChefHat,
  Flame,
  Dumbbell,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function RecipeList() {
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

  const [recipes, setRecipes] = useState(INITIAL_RECIPES);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesCategory =
        activeCategory === "All" || recipe.category === activeCategory;
      const matchesSearch =
        recipe.name.toLowerCase().includes(searchText.toLowerCase()) ||
        recipe.ingredients.some((item) =>
          item.toLowerCase().includes(searchText.toLowerCase()),
        );
      const matchesBookmark = !showBookmarkedOnly || recipe.isBookmarked;

      return matchesCategory && matchesSearch && matchesBookmark;
    });
  }, [recipes, activeCategory, searchText, showBookmarkedOnly]);
  return (
    <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-slate-900">Recipe Library</h2>

        <div className="flex justify-end gap-4">
        <Link to={"create"}> <button className="bg-green-700 px-2 py-1 rounded-md text-white text-sm font-semibold" >
            Add New Recipe
          </button>
</Link> 
          <button
            onClick={() => setShowBookmarkedOnly((prev) => !prev)}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
              showBookmarkedOnly
                ? "bg-amber-100 text-amber-800"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            <Filter size={15} />
            {showBookmarkedOnly ? "Showing Bookmarked" : "Show Bookmarked"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
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
                  <h3 className="mt-1 text-base font-bold text-slate-900">
                    {recipe.name}
                  </h3>
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
                  <Bookmark
                    size={15}
                    fill={recipe.isBookmarked ? "currentColor" : "none"}
                  />
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
                  <p className="mb-1 font-semibold text-slate-800">
                    Ingredients
                  </p>
                  <ul className="space-y-1 text-xs leading-relaxed text-slate-600">
                    {recipe.ingredients.map((item, idx) => (
                      <li key={`${recipe.id}-ingredient-${idx}`}>- {item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-1 font-semibold text-slate-800">
                    Preparation
                  </p>
                  <ol className="space-y-1 text-xs leading-relaxed text-slate-600">
                    {recipe.steps.map((item, idx) => (
                      <li key={`${recipe.id}-step-${idx}`}>
                        {idx + 1}. {item}
                      </li>
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
    </div>
  );
}

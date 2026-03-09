import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  Search,
  Filter,
  Plus,
  Flame,
  Dumbbell,
  FolderOpen,
  Pencil,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import {
  deleteRecipeThunk,
  getRecipesThunk,
  toggleRecipeBookmarkThunk,
} from "@/redux/features/recipe/recipe.thunk";
import { selectRecipes, selectRecipeLoading } from "@/redux/features/recipe/recipe.selector";

// import { CATEGORY_OPTIONS } from "./recipeLibrary";

export default function RecipeList() {
  const dispatch = useDispatch();

  const recipes = useSelector(selectRecipes);
  const loading = useSelector(selectRecipeLoading);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  const CATEGORY_OPTIONS = useMemo(() => {
  const categories = recipes.map((recipe) => recipe.category);
  return [...new Set(categories)].filter(Boolean);
}, [recipes]);

 

  useEffect(() => {
    dispatch(getRecipesThunk());
  }, [dispatch]);

  const toDisplayText = (item) => {
    if (typeof item === "string") {
      return item;
    }

    if (typeof item === "number") {
      return String(item);
    }

    if (!item || typeof item !== "object") {
      return "";
    }

    return (
      item.name ||
      item.title ||
      item.value ||
      item.text ||
      item.description ||
      item.step ||
      item.ingredient ||
      ""
    );
  };

  const normalizeList = (value) => {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => toDisplayText(item).trim())
      .filter(Boolean);
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesCategory =
        activeCategory === "All" || recipe.category === activeCategory;

      const query = searchText.trim().toLowerCase();
      const recipeIngredients = normalizeList(recipe.ingredients);
      const recipeSteps = normalizeList(recipe.steps);

      const matchesSearch =
        query.length === 0 ||
        recipe.name.toLowerCase().includes(query) ||
        recipeIngredients.some((item) => item.toLowerCase().includes(query)) ||
        recipeSteps.some((item) => item.toLowerCase().includes(query));

      const matchesBookmark = !showBookmarkedOnly || recipe.isBookmarked;

      return matchesCategory && matchesSearch && matchesBookmark;
    });
  }, [recipes, activeCategory, searchText, showBookmarkedOnly]);

  const toggleBookmark = (id) => {
    dispatch(toggleRecipeBookmarkThunk(id));
  };

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm("Delete this recipe?")) {
      return;
    }

    try {
      await dispatch(deleteRecipeThunk(id)).unwrap();
      toast.success("Recipe deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete recipe");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-sm text-slate-500">
        Loading recipes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              

              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Recipe Library
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Manage categorized meal options with macros, photos, and preparation details.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-xl bg-emerald-50 px-4 py-2 text-sm">
                <p className="text-xs font-semibold text-emerald-700">Total Recipes</p>
                <p className="text-lg font-bold text-emerald-900">
                  {recipes.length}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* FILTERS */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-2">
              <FolderOpen size={18} className="text-emerald-700" />
              <h2 className="text-xl font-bold text-slate-900">
                All Recipes
              </h2>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">

              {/* <Link
                to="create"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Plus size={16} />
                Add Recipe
              </Link> */}

              <button
                onClick={() => setShowBookmarkedOnly((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  showBookmarkedOnly
                    ? "bg-amber-100 text-amber-800"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Filter size={15} />
                {showBookmarkedOnly ? "Bookmarked Only" : "Filter Bookmarked"}
              </button>

            </div>
          </div>

          {/* SEARCH + CATEGORY */}
          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">

            <div className="relative">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search recipe name or ingredient"
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />

            </div>

            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >

              <option value="All">All Categories</option>

              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}

            </select>

          </div>

          {/* CATEGORY BUTTONS */}
          <div className="mt-4 flex flex-wrap gap-2">

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

          {/* RECIPE GRID */}
          <div className="mt-5 grid gap-4 lg:grid-cols-2">

            {filteredRecipes.length === 0 ? (

              <div className="lg:col-span-2 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                No recipes found with the current filters.
              </div>

            ) : (

              filteredRecipes.map((recipe) => {
                const ingredients = normalizeList(recipe.ingredients);
                const steps = normalizeList(recipe.steps);

                return (
                  <article
                    key={recipe._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-sm"
                  >

                  {/* IMAGE */}
                  <div className="relative h-44 w-full bg-slate-100">

                    {recipe.image ? (
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-500">
                        No image
                      </div>
                    )}

                    <button
                      onClick={() => toggleBookmark(recipe._id)}
                      className={`absolute right-3 top-3 rounded-full p-2 backdrop-blur-sm transition ${
                        recipe.isBookmarked
                          ? "bg-amber-100/90 text-amber-700"
                          : "bg-white/80 text-slate-500"
                      }`}
                    >
                      <Bookmark
                        size={15}
                        fill={recipe.isBookmarked ? "currentColor" : "none"}
                      />
                    </button>

                  </div>

                  {/* DETAILS */}
                  <div className="p-4">

                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      {recipe.category}
                    </p>

                    <h3 className="mt-1 text-base font-bold text-slate-900">
                      {recipe.name}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">

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
                          {ingredients.length === 0 ? (
                            <li>No ingredients added.</li>
                          ) : (
                            ingredients.map((item, idx) => (
                              <li key={`${recipe._id}-ingredient-${idx}`}>- {item}</li>
                            ))
                          )}
                        </ul>
                      </div>

                      <div>
                        <p className="mb-1 font-semibold text-slate-800">Preparation</p>
                        <ol className="space-y-1 text-xs leading-relaxed text-slate-600">
                          {steps.length === 0 ? (
                            <li>No steps added.</li>
                          ) : (
                            steps.map((item, idx) => (
                              <li key={`${recipe._id}-step-${idx}`}>{idx + 1}. {item}</li>
                            ))
                          )}
                        </ol>
                      </div>
                    </div>

                    {/* <div className="mt-4 flex items-center justify-end gap-2">
                      <Link
                        to={`/founder/recipe/edit/${recipe._id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        <Pencil size={13} />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDeleteRecipe(recipe._id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div> */}

                  </div>

                  </article>
                );
              })

            )}

          </div>

        </section>

      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Bookmark, ChevronRight, Flame, Soup, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  getRecipesThunk,
  toggleRecipeBookmarkThunk,
} from "@/redux/features/recipe/recipe.thunk";
import {
  selectRecipeLoading,
  selectRecipes,
} from "@/redux/features/recipe/recipe.selector";

export default function BookmarkedRecipes() {
  const dispatch = useDispatch();
  const recipes = useSelector(selectRecipes);
  const loading = useSelector(selectRecipeLoading);
  const [bookmarkLoadingId, setBookmarkLoadingId] = useState(null);

  useEffect(() => {
    if (!recipes.length) {
      dispatch(getRecipesThunk()).unwrap().catch(() => {
        toast.error("Failed to load recipes");
      });
    }
  }, [dispatch, recipes.length]);

  const bookmarkedRecipes = useMemo(
    () => recipes.filter((recipe) => recipe.isBookmarked).slice(0, 3),
    [recipes],
  );

  const handleToggleBookmark = async (recipeId) => {
    try {
      setBookmarkLoadingId(recipeId);
      await dispatch(toggleRecipeBookmarkThunk(recipeId)).unwrap();
      await dispatch(getRecipesThunk()).unwrap();
    } catch (error) {
      toast.error(error || "Failed to update bookmark");
    } finally {
      setBookmarkLoadingId(null);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#0A4F48]">
            <Bookmark size={18} className="fill-current" />
            <h2 className="text-lg font-bold">Bookmarked Recipes</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Quick access to meals you want to revisit.
          </p>
        </div>

        <Link
          to="/client/recipe?filter=bookmarked"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#0A4F48] transition hover:text-[#116D63]"
        >
          View all
          <ChevronRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">
          Loading recipes...
        </div>
      ) : bookmarkedRecipes.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-700">
            No bookmarked recipes yet
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Save meals from the recipe library and they will show up here.
          </p>
          <Link
            to="/client/recipe"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0A4F48] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#116D63]"
          >
            Explore recipes
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid gap-4">
          {bookmarkedRecipes.map((recipe) => (
            <article
              key={recipe._id}
              className="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {recipe.category || "Recipe"}
                  </p>
                  <h3 className="truncate text-base font-bold text-slate-900">
                    {recipe.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleBookmark(recipe._id)}
                  disabled={bookmarkLoadingId === recipe._id}
                  className={`rounded-full bg-amber-100 p-2 text-amber-700 transition hover:bg-amber-200 ${
                    bookmarkLoadingId === recipe._id
                      ? "cursor-not-allowed opacity-60"
                      : ""
                  }`}
                  aria-label={`Remove ${recipe.name} from bookmarks`}
                >
                  <Bookmark size={15} fill="currentColor" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-orange-700">
                  <Flame size={13} />
                  {recipe.calories || 0} kcal
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                  <Dumbbell size={13} />
                  {recipe.protein || 0} g protein
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                  <Soup size={13} />
                  {Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 0} ingredients
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

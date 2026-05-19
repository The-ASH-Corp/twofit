import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, Search, Star, Plus, UtensilsCrossed } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { assets } from "@/assets/asset";

import { useDispatch, useSelector } from "react-redux";
import {
  getRecipesThunk,
  toggleRecipeBookmarkThunk,
} from "@/redux/features/recipe/recipe.thunk";
import { selectRecipes } from "@/redux/features/recipe/recipe.selector";
import MobileBottomNav from "../components/MobileBottomNav";

function toHeadline(value = "") {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function parseArrayLike(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Fallback below
  }

  if (trimmed.includes("\n")) {
    return trimmed
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return trimmed
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function RecipeList() {
  const dispatch = useDispatch();
  const featuredSectionRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const recipes = useSelector(selectRecipes);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [, setBookmarkLoadingId] = useState(null);
  const [featuredId, setFeaturedId] = useState(null);

  const showBookmarkedOnly = useMemo(() => {
    return searchParams.get("filter") === "bookmarked";
  }, [searchParams]);

  const CATEGORY_OPTIONS = useMemo(() => {
    const categories = recipes.map((recipe) => recipe.category);
    return [...new Set(categories)].filter(Boolean);
  }, [recipes]);

  useEffect(() => {
    dispatch(getRecipesThunk()).unwrap().catch(() => {
      toast.error("Failed to load recipes");
    });
  }, [dispatch]);

  useEffect(() => {
    setFeaturedId(null);
  }, [activeCategory, searchText, showBookmarkedOnly]);

  const handleToggleBookmarkFilter = () => {
    const nextParams = new URLSearchParams(searchParams);
    if (showBookmarkedOnly) {
      nextParams.delete("filter");
    } else {
      nextParams.set("filter", "bookmarked");
    }
    setSearchParams(nextParams, { replace: true });
  };

  const toDisplayText = useCallback((item) => {
    if (typeof item === "string") return item;
    if (typeof item === "number") return String(item);
    if (!item || typeof item !== "object") return "";

    if (
      item.quantity !== undefined ||
      item.unit !== undefined ||
      item.name !== undefined
    ) {
      const quantity = item.quantity != null ? String(item.quantity).trim() : "";
      const unit = item.unit != null ? String(item.unit).trim() : "";
      const name = item.name != null ? String(item.name).trim() : "";
      const merged = [quantity, unit, name].filter(Boolean).join(" ").trim();
      if (merged) return merged;
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
  }, []);

  const normalizeList = useCallback(
    (value) => {
      const source = parseArrayLike(value);
      return source
        .map((item) => toDisplayText(item).trim())
        .filter(Boolean);
    },
    [toDisplayText],
  );

  const filteredRecipes = useMemo(() => {
    const baseFiltered = recipes.filter((recipe) => {
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

    if (!featuredId) return baseFiltered;

    const featured = baseFiltered.find((recipe) => recipe._id === featuredId);
    if (!featured) return baseFiltered;

    const others = baseFiltered.filter((recipe) => recipe._id !== featuredId);
    return [featured, ...others];
  }, [recipes, activeCategory, searchText, showBookmarkedOnly, featuredId, normalizeList]);

  const toggleBookmark = async (id) => {
    try {
      setBookmarkLoadingId(id);
      await dispatch(toggleRecipeBookmarkThunk(id)).unwrap();
      await dispatch(getRecipesThunk()).unwrap();
    } catch (error) {
      toast.error(error || "Failed to update bookmark");
    } finally {
      setBookmarkLoadingId(null);
    }
  };

  const handleSelectRecipe = (id) => {
    setFeaturedId(id);

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches
    ) {
      requestAnimationFrame(() => {
        featuredSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  };

  const featuredRecipe = filteredRecipes[0] || null;
  const gridRecipes = filteredRecipes.slice(1);

  const featuredIngredients = useMemo(
    () => normalizeList(featuredRecipe?.ingredients),
    [featuredRecipe?.ingredients, normalizeList],
  );

  // const featuredDescription = useMemo(() => {
  //   if (featuredIngredients.length > 0) {
  //     return `Rich in ${featuredIngredients.slice(0, 4).join(", ")}. Precision-crafted nutrition for better recovery and sustained energy.`;
  //   }
  //   const steps = normalizeList(featuredRecipe?.steps);
  //   if (steps.length > 0) {
  //     return steps[0];
  //   }
  //   return "Precision-crafted nutritional meals that fuel your wellness goals and keep your momentum high.";
  // }, [featuredIngredients, featuredRecipe?.steps, normalizeList]);

  const featuredSteps = useMemo(
    () => normalizeList(featuredRecipe?.steps),
    [featuredRecipe?.steps, normalizeList],
  );

  const featuredPrep = useMemo(() => {
    const stepsCount = normalizeList(featuredRecipe?.steps).length;
    const minutes = Math.max(15, stepsCount * 5);
    return `${minutes} MIN PREP`;
  }, [featuredRecipe?.steps, normalizeList]);

  const recipeGridItems = useMemo(() => {
    if (gridRecipes.length === 0) return [];
    const items = [...gridRecipes];
    const insertionIndex = Math.min(4, items.length);
    items.splice(insertionIndex, 0, { _id: "__builder__", isBuilder: true });
    return items;
  }, [gridRecipes]);

  return (
    <div className="client-page-container p-5 sm:p-6 lg:p-7">
      <div className="client-page-shell">
        <section className="mb-6 flex flex-wrap items-center gap-2.5">
          {["All", ...CATEGORY_OPTIONS].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full px-5 py-2.5 text-[14px] font-black transition-all",
                activeCategory === category
                  ? "bg-white text-[#0A7B4E] shadow-[0_8px_16px_rgba(17,38,29,0.08)]"
                  : "bg-[#F4F8F5] text-[#808E87] hover:bg-white",
              )}
            >
              {category === "All" ? "All" : toHeadline(category)}
            </button>
          ))}

          <button
            onClick={handleToggleBookmarkFilter}
            className={cn(
              "ml-auto inline-flex h-10 items-center justify-center rounded-full px-3 text-[12px] font-black transition-all",
              showBookmarkedOnly
                ? "bg-[#0A7B4E] text-white"
                : "bg-white text-[#6C7B74]",
            )}
          >
            <Bookmark
              size={16}
              fill={showBookmarkedOnly ? "currentColor" : "none"}
              className="mr-1"
            />
            Saved
          </button>

          <div className="relative min-w-[210px]">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#93A09A]"
            />
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search recipes"
              className="h-10 w-full rounded-full border border-[#DEE7E2] bg-white pl-9 pr-4 text-[13px] font-semibold text-[#30413A] placeholder:text-[#98A59F] outline-none"
            />
          </div>
        </section>

        {featuredRecipe && (
          <section
            ref={featuredSectionRef}
            className="client-card overflow-hidden rounded-[28px] p-4 sm:p-5"
          >
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.45fr_1fr]">
              <div className="relative overflow-hidden rounded-[20px]">
                <img
                  src={featuredRecipe?.image || assets.MealPlaceholder}
                  alt={featuredRecipe?.name || "Featured recipe"}
                  className="h-[360px] w-full object-cover sm:h-[430px]"
                />

                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <span className="rounded-full bg-[#057843] px-4 py-1 text-[11px] font-black tracking-[0.1em] text-[#C7FFE4]">
                    CHEF&apos;S CHOICE
                  </span>
                  <span className="rounded-full bg-white/92 px-4 py-1 text-[11px] font-black text-[#364841]">
                    {featuredPrep}
                  </span>
                </div>

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleBookmark(featuredRecipe._id);
                  }}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#0A7B4E] shadow-[0_8px_18px_rgba(17,38,29,0.18)]"
                >
                  <Bookmark
                    size={18}
                    fill={featuredRecipe?.isBookmarked ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <div className="rounded-[20px] bg-[#F9FCFA] p-5 sm:p-6">
                <p className="inline-flex items-center gap-2 text-[13px] font-black text-[#0A7B4E]">
                  <Star size={14} fill="currentColor" />
                  Top Rated Nutritional Balance
                </p>

                <h2 className="mt-4 text-[52px] leading-[1.02] font-black text-[#1F2D27]">
                  {featuredRecipe?.name || "Featured Recipe"}
                </h2>

                {/* <p className="mt-4 text-[17px] font-medium leading-relaxed text-[#66766E]">
                  {featuredDescription}
                </p> */}

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <StatBox label="KCAL" value={featuredRecipe?.calories || 0} />
                  <StatBox label="PROTEIN" value={`${featuredRecipe?.protein || 0}g`} />
                  {/* <StatBox label="CARBS" value={`${featuredCarbs}g`} /> */}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[14px] border border-[#E3ECE7] bg-white p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#7B8C84]">
                      Ingredients
                    </p>
                    {featuredIngredients.length > 0 ? (
                      <ul className="mt-3 space-y-2">
                        {featuredIngredients.map((ingredient, index) => (
                          <li
                            key={`featured-ingredient-${index}`}
                            className="flex items-start gap-2 text-[13px] font-semibold text-[#2E3F38]"
                          >
                            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0A7B4E]" />
                            <span>{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-[13px] font-medium text-[#8B9A93]">
                        Ingredients not available.
                      </p>
                    )}
                  </div>

                  <div className="rounded-[14px] border border-[#E3ECE7] bg-white p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#7B8C84]">
                      Steps
                    </p>
                    {featuredSteps.length > 0 ? (
                      <ol className="mt-3 space-y-2">
                        {featuredSteps.map((step, index) => (
                          <li
                            key={`featured-step-${index}`}
                            className="flex items-start gap-2 text-[13px] font-semibold text-[#2E3F38]"
                          >
                            <span className="mt-[1px] inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E8F5EF] px-1 text-[11px] font-black text-[#0A7B4E]">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="mt-3 text-[13px] font-medium text-[#8B9A93]">
                        Steps not available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {recipeGridItems.length > 0 && (
          <section className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {recipeGridItems.map((item) => {
              if (item.isBuilder) return null; // Simplified for now
              const recipe = item;
              const ingredients = normalizeList(recipe.ingredients);
              const snippet =
                ingredients.slice(0, 2).join(", ") ||
                normalizeList(recipe.steps).slice(0, 1).join(" ") ||
                "Balanced nutrition designed for consistent progress.";

              const proteinTag =
                Number(recipe?.protein || 0) >= 30
                  ? "High Protein"
                  : Number(recipe?.protein || 0) <= 15
                    ? "Light"
                    : "Balanced";

              return (
                <article
                  key={recipe._id}
                  onClick={() => handleSelectRecipe(recipe._id)}
                  className="client-card cursor-pointer rounded-[24px] p-4 transition-all hover:-translate-y-0.5"
                >
                  <div className="relative overflow-hidden rounded-[16px]">
                    <img
                      src={recipe.image || assets.MealPlaceholder}
                      alt={recipe.name}
                      className="h-[250px] w-full object-cover"
                    />

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleBookmark(recipe._id);
                      }}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#0A7B4E] shadow-[0_8px_14px_rgba(17,38,29,0.18)]"
                    >
                      <Bookmark
                        size={16}
                        fill={recipe?.isBookmarked ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-[5px] bg-[#54F1B6] px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-[#075E38]">
                      {toHeadline(recipe?.category || "General")}
                    </span>
                    <span className="rounded-[5px] bg-[#E5ECE8] px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-[#7B8B84]">
                      {proteinTag}
                    </span>
                  </div>

                  <h3 className="mt-3 text-[33px] leading-[1.08] font-black text-[#1F2D27]">
                    {recipe.name}
                  </h3>

                  <p
                    className="mt-2 text-[15px] font-medium leading-relaxed text-[#72837A]"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {snippet}
                  </p>

                  <div className="mt-4 flex items-end justify-between">
                    <div className="flex items-end gap-5">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.09em] text-[#9AA8A1]">
                          Prot
                        </p>
                        <p className="text-[24px] leading-none font-black text-[#1F2D27]">
                          {recipe?.protein || 0}g
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.09em] text-[#9AA8A1]">
                          Kcal
                        </p>
                        <p className="text-[24px] leading-none font-black text-[#1F2D27]">
                          {recipe?.calories || 0}
                        </p>
                      </div>
                     
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {filteredRecipes.length === 0 && (
          <div className="py-24 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#9AA8A1]">
              <Bookmark size={30} />
            </div>
            <h3 className="mt-5 text-[42px] leading-none font-black text-[#1F2D27]">
              No Recipes Found
            </h3>
            <p className="mx-auto mt-3 max-w-md text-[16px] font-medium text-[#718179]">
              {showBookmarkedOnly
                ? "You have not bookmarked any recipes yet."
                : "No recipes match your current search and filters."}
            </p>
            {(showBookmarkedOnly || activeCategory !== "All" || searchText) && (
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchText("");
                  setSearchParams({}, { replace: true });
                }}
                className="mt-7 rounded-full border border-[#D4E1DA] bg-white px-5 py-2.5 text-[12px] font-black uppercase tracking-[0.1em] text-[#0A7B4E]"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
      <MobileBottomNav />
    </div>
  );
}

function StatBox({ label, value }) {
  const boxDepthStyle = {
    boxShadow:
      "inset 7px 7px 14px rgba(186, 201, 193, 0.55), inset -7px -7px 14px rgba(255, 255, 255, 0.96), 0 6px 12px rgba(22, 41, 31, 0.08)",
  };

  const valueDepthStyle = {
    textShadow:
      "1px 1px 0 rgba(255,255,255,0.92), -1px -1px 1px rgba(10, 79, 72, 0.16)",
  };

  const labelDepthStyle = {
    textShadow: "1px 1px 0 rgba(255,255,255,0.9)",
  };

  return (
    <div
      className="rounded-[12px] border border-[#D9E4DE] bg-[linear-gradient(160deg,#F7FCF9_0%,#EAF2EE_100%)] p-3 text-center"
      style={boxDepthStyle}
    >
      <p
        className="text-[30px] leading-none font-black text-[#0A7B4E]"
        style={valueDepthStyle}
      >
        {value}
      </p>
      <p
        className="mt-1 text-[9px] font-black uppercase tracking-[0.11em] text-[#7A8B83]"
        style={labelDepthStyle}
      >
        {label}
      </p>
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  Search,
  ChevronRight,
  Plus,
  Clock,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

import { useDispatch, useSelector } from "react-redux";
import {
  getRecipesThunk,
  toggleRecipeBookmarkThunk,
} from "@/redux/features/recipe/recipe.thunk";
import { selectRecipes, selectRecipeLoading } from "@/redux/features/recipe/recipe.selector";
import MobileBottomNav from "../components/MobileBottomNav";

// import { CATEGORY_OPTIONS } from "./recipeLibrary";

export default function RecipeList() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const bookmarkedFilter = searchParams.get("filter") === "bookmarked";

  const recipes = useSelector(selectRecipes);
  const loading = useSelector(selectRecipeLoading);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [bookmarkLoadingId, setBookmarkLoadingId] = useState(null);
  const [featuredId, setFeaturedId] = useState(null);

  const showBookmarkedOnly = useMemo(() => {
    return searchParams.get("filter") === "bookmarked";
  }, [searchParams]);

  const CATEGORY_OPTIONS = useMemo(() => {
    const categories = recipes.map((recipe) => recipe.category);
    return [...new Set(categories)].filter(Boolean);
  }, [recipes]);

  const bookmarkedCount = useMemo(
    () => recipes.filter((recipe) => recipe.isBookmarked).length,
    [recipes],
  );

  useEffect(() => {
    dispatch(getRecipesThunk()).unwrap().catch(() => {
      toast.error("Failed to load recipes");
    });
  }, [dispatch]);

  // Reset featured view when filters change to show most relevant results
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

    const featured = baseFiltered.find(r => r._id === featuredId);
    if (!featured) return baseFiltered;

    const others = baseFiltered.filter(r => r._id !== featuredId);
    return [featured, ...others];
  }, [recipes, activeCategory, searchText, showBookmarkedOnly, featuredId]);

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

  const featuredRecipe = filteredRecipes[0] || null;
  const secondaryRecipe = filteredRecipes[1] || null;
  const otherRecipes = filteredRecipes.slice(2);

  return (
    <div className="bg-[#F8FBFA] min-h-screen pb-32 font-sans selection:bg-[#0A4F48]/10">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-10 space-y-12">
        
        {/* =========================================
            HEADER SECTION
            ========================================= */}
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 px-2">
          <div className="flex-1">
            <h1 className="text-[#0A4F48] font-black text-4xl lg:text-5xl tracking-tighter leading-tight">
              Recipe Library
            </h1>
            <p className="text-gray-400 font-bold text-sm lg:text-base mt-2">
              Discover performance-driven fuel for your body.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-[320px] group">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#0A4F48]"
              />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search recipes..."
                className="w-full bg-gray-100/50 border-none rounded-[20px] py-3.5 pl-12 pr-6 text-sm font-bold text-gray-700 placeholder:text-gray-400/60 focus:ring-2 focus:ring-[#0A4F48]/10 transition-all shadow-inner"
              />
            </div>

            <button
              onClick={handleToggleBookmarkFilter}
              className={cn(
                "flex items-center gap-2 px-6 py-3.5 rounded-[20px] text-sm font-black tracking-tight transition-all shadow-sm active:scale-95",
                showBookmarkedOnly 
                  ? "bg-[#0A4F48] text-[#71FEE2]" 
                  : "bg-[#71FEE2]/20 text-[#0A4F48] hover:bg-[#71FEE2]/30"
              )}
            >
              <Bookmark size={16} fill={showBookmarkedOnly ? "currentColor" : "none"} />
              <span className="uppercase tracking-widest text-[11px]">Filter Bookmarked</span>
            </button>

            
          </div>
        </header>

        {/* =========================================
            CATEGORY FILTERS
            ========================================= */}
        <nav className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 px-2 scroll-smooth">
          {["All", ...CATEGORY_OPTIONS].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "whitespace-nowrap px-8 py-3.5 rounded-full text-[13px] font-black tracking-tight transition-all active:scale-95",
                activeCategory === category
                  ? "bg-[#0A4F48] text-white shadow-xl shadow-[#0A4F48]/20"
                  : "bg-white text-gray-400 hover:text-[#0A4F48] hover:bg-gray-50 border border-gray-100"
              )}
            >
              {category === "All" ? "All" : category}
            </button>
          ))}
        </nav>

        {/* =========================================
            FEATURED GRID
            ========================================= */}
        {featuredRecipe && (
          <section className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Main Featured Card (Left) */}
            <div className={cn(
              "group transition-all duration-500",
              secondaryRecipe ? "lg:col-span-8" : "lg:col-span-12"
            )}>
              <div className="bg-white rounded-[40px] overflow-hidden shadow-[0_4px_40px_rgba(0,0,0,0.03)] border border-gray-50 h-full flex flex-col md:flex-row">
                
                <div className={cn(
                  "relative h-[400px] md:h-auto overflow-hidden",
                  secondaryRecipe ? "w-full md:w-[45%]" : "w-full md:w-[35%]"
                )}>
                  <div className="absolute top-6 left-6 z-10">
                     {/* <span className="bg-[#0A4F48] text-[#71FEE2] text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                        Selected
                     </span> */}
                  </div>
                  <img
                    src={featuredRecipe?.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1200"}
                    alt={featuredRecipe?.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="flex-1 p-8 lg:p-12 flex flex-col justify-between">
                  <div>
                     <div className="flex justify-between items-start mb-6 font-bold">
                        <h2 className="text-[#0A4F48] font-black text-3xl lg:text-4xl leading-tight tracking-tighter max-w-[80%]">
                          {featuredRecipe?.name}
                        </h2>
                        <button 
                          onClick={() => featuredRecipe && toggleBookmark(featuredRecipe._id)}
                          className="w-12 h-12 rounded-full flex items-center justify-center text-[#0A4F48] hover:bg-gray-50 border border-gray-100 transition-all"
                        >
                          <Bookmark size={20} fill={featuredRecipe?.isBookmarked ? "currentColor" : "none"} strokeWidth={3} />
                        </button>
                     </div>

                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-full border-2 border-[#71FEE2] flex flex-col items-center justify-center text-center">
                           <span className="text-[8px] font-black text-[#0A4F48]/40 uppercase">Calories</span>
                           <span className="text-[12px] font-black text-[#0A4F48]">{featuredRecipe?.calories || 420}</span>
                        </div>
                        <div className="w-16 h-16 rounded-full border-2 border-[#71FEE2] flex flex-col items-center justify-center text-center">
                           <span className="text-[8px] font-black text-[#0A4F48]/40 uppercase">Protein</span>
                           <span className="text-[12px] font-black text-[#0A4F48]">{featuredRecipe?.protein || 52}g</span>
                        </div>
                        <div className="w-16 h-16 rounded-full border-2 border-[#71FEE2] flex flex-col items-center justify-center text-center">
                           <span className="text-[8px] font-black text-[#0A4F48]/40 uppercase">Carbs</span>
                           <span className="text-[12px] font-black text-[#0A4F48]">12g</span>
                        </div>
                     </div>

                     <div className="mb-8">
                        <h4 className="text-[#0A4F48]/40 font-black text-[9px] uppercase tracking-[0.2em] mb-3">Key Ingredients</h4>
                        <p className="text-gray-500 font-bold text-sm leading-relaxed truncate-2-lines">
                           {normalizeList(featuredRecipe?.ingredients).join(", ") || "No ingredients specified."}
                        </p>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Recipe Card (Right) */}
            {secondaryRecipe && (
              <div 
                onClick={() => setFeaturedId(secondaryRecipe._id)}
                className="lg:col-span-4 cursor-pointer"
              >
                <div className="bg-white rounded-[40px] overflow-hidden shadow-[0_4px_40px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col h-full group/side hover:shadow-xl transition-all duration-500">
                   <div className="relative h-[220px] overflow-hidden">
                      <div className="absolute top-4 right-4 z-10">
                         <button 
                           onClick={() => secondaryRecipe && toggleBookmark(secondaryRecipe._id)}
                           className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#0A4F48] shadow-lg active:scale-90 transition-all font-bold"
                         >
                            <Bookmark size={18} fill={secondaryRecipe?.isBookmarked ? "currentColor" : "none"} strokeWidth={3}/>
                         </button>
                      </div>
                      <img
                        src={secondaryRecipe?.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200"}
                        alt={secondaryRecipe?.name}
                        className="w-full h-full object-cover group-hover/side:scale-105 transition-transform duration-700"
                      />
                   </div>
                   
                   <div className="p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h5 className="text-[#0A4F48] font-black text-[10px] uppercase tracking-[0.2em] mb-2">{secondaryRecipe?.category || "HIGH PROTEIN"}</h5>
                        <h3 className="text-[#0A4F48] font-black text-2xl tracking-tighter mb-4">{secondaryRecipe?.name}</h3>
                        
                        <div className="flex gap-2 mb-6">
                           <span className="bg-gray-50 px-4 py-1.5 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">{secondaryRecipe?.calories || 250} kcal</span>
                           <span className="bg-gray-50 px-4 py-1.5 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">{secondaryRecipe?.protein || 60}g protein</span>
                        </div>

                        <div className="space-y-4 mb-4">
                           {normalizeList(secondaryRecipe?.steps).slice(0, 2).map((step, idx) => (
                             <div key={idx} className="flex gap-4">
                                <span className="w-5 h-5 rounded-full bg-[#71FEE2] text-[#0A4F48] text-[10px] font-black flex items-center justify-center shrink-0">{idx + 1}</span>
                                <p className="text-gray-500 font-bold text-xs leading-relaxed line-clamp-2">{step}</p>
                             </div>
                           ))}
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* =========================================
            BOTTOM MINI CARDS
            ========================================= */}
        {otherRecipes.length > 0 && (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {otherRecipes.slice(0, 3).map((recipe, idx) => (
               <div 
                  key={recipe._id} 
                  onClick={() => setFeaturedId(recipe._id)}
                  className="bg-white rounded-[32px] p-5 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-gray-50 flex items-center justify-between group cursor-pointer hover:bg-gray-100/50 hover:shadow-md transition-all active:scale-[0.98]"
               >
                  <div className="flex items-center gap-4">
                     <img src={recipe.image || assets.MealPlaceholder} alt={recipe.name} className="w-14 h-14 rounded-[20px] object-cover shadow-md group-hover:scale-105 transition-transform" />
                     <div>
                        <h4 className="text-[#0A4F48] font-black text-[14px] tracking-tight">{recipe.name}</h4>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">15 min Prep • {recipe.calories} kcal</p>
                     </div>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 group-hover:text-[#0A4F48] transition-colors">
                     <ChevronRight size={20} />
                  </div>
               </div>
             ))}
          </section>
        )}

        {/* Global Empty State - Only when truly NO recipes match filters */}
        {filteredRecipes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6">
                <Bookmark size={32} />
             </div>
             <h3 className="text-[#0A4F48] font-black text-2xl tracking-tight mb-2">No Recipes Found</h3>
             <p className="text-gray-400 font-bold text-sm max-w-xs">{showBookmarkedOnly ? "You haven't bookmarked any recipes yet." : "No recipes match your current search and filters."}</p>
             { (showBookmarkedOnly || activeCategory !== "All" || searchText) && (
                <button 
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchText("");
                    setSearchParams({}, { replace: true });
                  }}
                  className="mt-8 text-[#0A4F48] font-black text-xs uppercase tracking-widest border-b-2 border-[#71FEE2] pb-1 hover:text-black transition-colors"
                >
                   Clear all filters
                </button>
             )}
          </div>
        )}

        {/* =========================================
            ACTION BANNER
            ========================================= */}
        <section className="relative rounded-[48px] bg-[#0A4F48] p-10 lg:p-16 overflow-hidden mt-12 group">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-linear-to-bl from-white/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
           
           <div className="relative z-10 max-w-2xl">
              <h5 className="text-[#71FEE2] font-black text-[10px] uppercase tracking-[0.3em] mb-4">Personalized Coaching</h5>
              <h2 className="text-white font-black text-4xl lg:text-5xl tracking-tighter leading-[1.1] mb-6">
                Tailored meal plans for your physiology.
              </h2>
              <p className="text-white/60 font-medium text-base lg:text-lg mb-10 leading-relaxed">
                Our AI analyzes your metabolic data to suggest the exact macro-ratio your body needs today.
              </p>
              <button className="bg-[#71FEE2] text-[#0A4F48] px-10 py-4.5 rounded-full text-xs font-black tracking-widest uppercase shadow-xl shadow-[#71FEE2]/20 hover:scale-[1.05] transition-all active:scale-95">
                 Generate My Plan
              </button>
           </div>
        </section>

      </div>

      <MobileBottomNav />
    </div>
  );
}

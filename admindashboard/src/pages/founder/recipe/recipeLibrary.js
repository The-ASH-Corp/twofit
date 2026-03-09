export const CATEGORY_OPTIONS = [
  "Fat loss meals",
  "Muscle gain meals",
  "Vegetarian meals",
  "High-protein snacks",
  "Low-calorie desserts",
];

export const RECIPE_STORAGE_KEY = "founder_recipe_library";

export const INITIAL_RECIPES = [
  {
    id: 1,
    name: "Greek Chicken Power Bowl",
    category: "Fat loss meals",
    calories: 420,
    protein: 38,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
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
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
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
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
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
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80",
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
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
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

export const loadRecipes = () => {
  try {
    const raw = localStorage.getItem(RECIPE_STORAGE_KEY);
    if (!raw) {
      return INITIAL_RECIPES;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return INITIAL_RECIPES;
    }

    return parsed;
  } catch {
    return INITIAL_RECIPES;
  }
};

export const saveRecipes = (recipes) => {
  localStorage.setItem(RECIPE_STORAGE_KEY, JSON.stringify(recipes));
};

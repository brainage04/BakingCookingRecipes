/** Nutrient amounts per 100g (or per 100mL when `basis` is `ml`), copied from the product's own nutrition panel. */
export interface MealProduct {
  key: string;
  name: string;
  /** Woolworths product id, or the maker's name when the panel comes from the maker's site. */
  id: string;
  basis: 'g' | 'ml';
  energyKj: number;
  protein: number;
  carbohydrate: number;
  fat: number;
  url: string;
  /** The panel line the numbers were copied from. */
  panel: string;
  note?: string;
}

export interface MealIngredient {
  label: string;
  /** Amount as written in the recipe. */
  amountText: string;
  /** Amount in the product's basis unit (g or mL). */
  quantity: number;
  product: MealProduct;
  /** Marks an amount Thomas has not fixed yet. The page shows it as a placeholder. */
  placeholder?: boolean;
  assumption?: string;
  /** A remark shown under the amount, such as which choice is the usual one. */
  note?: string;
}

export interface MealExtra {
  label: string;
  /** Product keys of shared ingredients this addition takes the place of. */
  replaces?: readonly string[];
  ingredients: readonly MealIngredient[];
}

export interface MealVariant {
  key: string;
  title: string;
  /** Ingredients that differ from the other variants. */
  ingredients: readonly MealIngredient[];
  /** Optional additions, each shown as its own nutrition row. */
  extras?: readonly MealExtra[];
}

export interface MealRecipe {
  slug: string;
  navTitle: string;
  cardTitle: string;
  pageTitle: string;
  description: string;
  intro: string;
  /** Ingredients in every variant. */
  shared: readonly MealIngredient[];
  variants: readonly MealVariant[];
  /** Serves per batch; the nutrition table shows one serve and the whole batch. */
  servings: number;
  servingLabel: string;
  batchLabel: string;
  method: readonly string[];
  notes: readonly string[];
  /** Panel and placeholder remarks shown under the ingredient tables. */
  sourceNotes: readonly string[];
}

export interface Nutrition {
  kcal: number;
  protein: number;
  carbohydrate: number;
  fat: number;
}

import type { MealExtra, MealIngredient, MealRecipe, MealVariant, Nutrition } from '../data/meals/types';

/** Panels list energy in kilojoules; 1 kcal is 4.184 kJ. */
export const KJ_PER_KCAL = 4.184;

export const zeroNutrition: Nutrition = { kcal: 0, protein: 0, carbohydrate: 0, fat: 0 };

export function ingredientNutrition(ingredient: MealIngredient): Nutrition {
  const share = ingredient.quantity / 100;
  const { product } = ingredient;
  return {
    kcal: (product.energyKj * share) / KJ_PER_KCAL,
    protein: product.protein * share,
    carbohydrate: product.carbohydrate * share,
    fat: product.fat * share,
  };
}

export function addNutrition(a: Nutrition, b: Nutrition): Nutrition {
  return {
    kcal: a.kcal + b.kcal,
    protein: a.protein + b.protein,
    carbohydrate: a.carbohydrate + b.carbohydrate,
    fat: a.fat + b.fat,
  };
}

export function sumNutrition(ingredients: readonly MealIngredient[]): Nutrition {
  return ingredients.reduce((total, ingredient) => addNutrition(total, ingredientNutrition(ingredient)), zeroNutrition);
}

export function scaleNutrition(nutrition: Nutrition, factor: number): Nutrition {
  return {
    kcal: nutrition.kcal * factor,
    protein: nutrition.protein * factor,
    carbohydrate: nutrition.carbohydrate * factor,
    fat: nutrition.fat * factor,
  };
}

export function variantBatch(recipe: MealRecipe, variant: MealVariant, extra?: MealExtra): Nutrition {
  const ingredients = [...recipe.shared, ...variant.ingredients, ...(extra?.ingredients ?? [])];
  return sumNutrition(ingredients);
}

export function perServing(batch: Nutrition, servings: number): Nutrition {
  return scaleNutrition(batch, 1 / servings);
}

export function formatKcal(value: number): string {
  return `${Math.round(value)} kcal`;
}

export function formatGrams(value: number): string {
  return `${value.toFixed(1)}g`;
}

import type { MealIngredient, MealProduct } from './types';

interface IngredientOptions {
  placeholder?: boolean;
  assumption?: string;
}

export function ingredient(
  label: string,
  amountText: string,
  quantity: number,
  product: MealProduct,
  options: IngredientOptions = {},
): MealIngredient {
  return { label, amountText, quantity, product, ...options };
}

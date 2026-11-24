import type { IngredientChoice, ProductChoice } from './types';

interface MealIngredientInput {
  key: string;
  label: string;
  sourceAmount: string;
  /** Amount in grams or millilitres (the product's package unit). */
  quantity: number;
  product: ProductChoice;
  when?: IngredientChoice['when'];
  perUnitOf?: string;
}

/** A meal ingredient counted in the product's own package unit, so the panel, cost and mass all use one quantity. */
export function mealIngredient({ quantity, product, ...rest }: MealIngredientInput): IngredientChoice {
  const unit = product.packageUnit === 'ml' ? 'ml' : 'g';
  return {
    ...rest,
    metricQuantity: quantity,
    metricUnit: unit,
    costQuantity: quantity,
    costUnit: unit,
    batchGrams: quantity,
    products: { default: product },
  };
}

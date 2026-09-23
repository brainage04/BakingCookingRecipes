export type Unit = 'g' | 'ml' | 'egg';

/** Units for the scaled recipe amount; `yolk` counts egg yolks, which are still bought as whole eggs. */
export type MetricUnit = Unit | 'yolk';

export interface MacroBreakdown {
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface ProductChoice {
  id: string;
  name: string;
  packageQuantity: number;
  packageUnit: Unit;
  priceAud: number;
  unitPriceLabel: string;
  url: string;
  source: string;
  kcalPer100g: number | null;
  macrosPer100g: MacroBreakdown | null;
  nutritionNote?: string;
}

export interface IngredientChoice {
  key: string;
  label: string;
  sourceAmount: string;
  metricQuantity: number;
  metricUnit: MetricUnit;
  costQuantity: number;
  costUnit: Unit;
  /**
   * Weight of one batch's worth of this ingredient in grams. Product nutrition is per 100g, so this drives calories
   * and macros as well as the batch mass estimate. Volume ingredients convert millilitres to grams here and state
   * the density they assume in the product's `nutritionNote`.
   */
  batchGrams: number;
  products: {
    default: ProductChoice;
    stevia?: ProductChoice;
    brownMonkfruit?: ProductChoice;
    proteinFlour?: ProductChoice;
  };
}

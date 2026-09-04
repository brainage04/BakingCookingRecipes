export type Unit = 'g' | 'ml' | 'egg';

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
  metricUnit: Unit;
  costQuantity: number;
  costUnit: Unit;
  nutritionQuantity: number;
  nutritionUnit: 'g' | 'ml';
  products: {
    default: ProductChoice;
    stevia?: ProductChoice;
    brownMonkfruit?: ProductChoice;
    proteinFlour?: ProductChoice;
  };
}

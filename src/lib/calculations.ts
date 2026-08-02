import type { AlternativeControl } from '../data/recipes';
import type { IngredientChoice, MacroBreakdown, ProductChoice, Unit } from '../data/recipe';

export type AlternativeState = Readonly<Record<string, boolean>>;

export interface IngredientCalculation {
  ingredient: IngredientChoice;
  product: ProductChoice;
  scaledMetric: number;
  scaledCost: number;
  basket: BasketCalculation;
}

export interface BasketCalculation {
  packageCount: number;
  cost: number;
}

export interface RecipeCalculation {
  rows: IngredientCalculation[];
  servings: number;
  massGrams: number;
  caloriesPerBatch: number;
  caloriesPerServing: number;
  macrosPerBatch: MacroBreakdown;
  macrosPerServing: MacroBreakdown;
  usedTotal: number;
  basketTotal: number;
}

export interface ShoppingRecipe {
  slug: string;
  title: string;
  ingredients: readonly IngredientChoice[];
  alternativeControls: readonly AlternativeControl[];
}

export interface ShoppingBreakdown {
  recipeTitle: string;
  ingredientLabel: string;
  quantity: number;
  unit: Unit;
}

export interface ShoppingRow {
  product: ProductChoice;
  quantity: number;
  unit: Unit;
  breakdown: ShoppingBreakdown[];
  packageCount: number;
  basketCost: number;
}

export interface ShoppingCalculation {
  rows: ShoppingRow[];
  usedTotal: number;
  basketTotal: number;
}

const quantityNumber = new Intl.NumberFormat('en-AU', { maximumFractionDigits: 1 });

export function normalizeBatchInput(value: string): number {
  const batches = Number.parseFloat(value);
  return Number.isFinite(batches) && batches >= 0 ? batches : 0;
}

export function formatQuantity(value: number, unit: Unit): string {
  const formatted = Number.isInteger(value) ? String(value) : quantityNumber.format(value);
  return `${formatted}${unit === 'egg' ? ` ${value === 1 ? 'egg' : 'eggs'}` : unit}`;
}

export function productFor(
  ingredient: IngredientChoice,
  controls: readonly AlternativeControl[],
  alternatives: AlternativeState,
): ProductChoice {
  for (const control of controls) {
    const product = ingredient.products[control.productKey];
    if (product && alternatives[control.key]) return product;
  }
  return ingredient.products.default;
}

export function usedCost(ingredient: IngredientChoice, product: ProductChoice, batches: number): number {
  return (ingredient.costQuantity * batches * product.priceAud) / product.packageQuantity;
}

export function basketFor(ingredient: IngredientChoice, product: ProductChoice, batches: number): BasketCalculation {
  const packageCount = Math.ceil((ingredient.costQuantity * batches) / product.packageQuantity);
  return { packageCount, cost: packageCount * product.priceAud };
}

export function caloriesForBatch(ingredient: IngredientChoice, product: ProductChoice): number {
  if (product.kcalPer100g === null) return 0;
  return (ingredient.nutritionQuantity * product.kcalPer100g) / 100;
}

export function macrosForBatch(ingredient: IngredientChoice, product: ProductChoice): MacroBreakdown {
  if (product.macrosPer100g === null) return { protein: 0, carbohydrates: 0, fat: 0 };
  return scaleMacros(product.macrosPer100g, ingredient.nutritionQuantity / 100);
}

export function addMacros(left: MacroBreakdown, right: MacroBreakdown): MacroBreakdown {
  return {
    protein: left.protein + right.protein,
    carbohydrates: left.carbohydrates + right.carbohydrates,
    fat: left.fat + right.fat,
  };
}

export function scaleMacros(macros: MacroBreakdown, multiplier: number): MacroBreakdown {
  return {
    protein: macros.protein * multiplier,
    carbohydrates: macros.carbohydrates * multiplier,
    fat: macros.fat * multiplier,
  };
}

export function calculateRecipe(
  ingredients: readonly IngredientChoice[],
  controls: readonly AlternativeControl[],
  alternatives: AlternativeState,
  batches: number,
  servingsPerBatch: number,
): RecipeCalculation {
  let caloriesPerBatch = 0;
  let macrosPerBatch: MacroBreakdown = { protein: 0, carbohydrates: 0, fat: 0 };
  let usedTotal = 0;
  let basketTotal = 0;
  let massGramsPerBatch = 0;

  const rows = ingredients.map((ingredient) => {
    const product = productFor(ingredient, controls, alternatives);
    const scaledCost = usedCost(ingredient, product, batches);
    const basket = basketFor(ingredient, product, batches);

    caloriesPerBatch += caloriesForBatch(ingredient, product);
    macrosPerBatch = addMacros(macrosPerBatch, macrosForBatch(ingredient, product));
    usedTotal += scaledCost;
    basketTotal += basket.cost;

    if (ingredient.key === 'eggs') massGramsPerBatch += ingredient.nutritionQuantity;
    else if (ingredient.metricUnit === 'g' || ingredient.metricUnit === 'ml') {
      massGramsPerBatch += ingredient.metricQuantity;
    }

    return {
      ingredient,
      product,
      scaledMetric: ingredient.metricQuantity * batches,
      scaledCost,
      basket,
    };
  });

  return {
    rows,
    servings: servingsPerBatch * batches,
    massGrams: massGramsPerBatch * batches,
    caloriesPerBatch,
    caloriesPerServing: caloriesPerBatch / servingsPerBatch,
    macrosPerBatch,
    macrosPerServing: scaleMacros(macrosPerBatch, 1 / servingsPerBatch),
    usedTotal,
    basketTotal,
  };
}

export function calculateShoppingList(
  recipes: readonly ShoppingRecipe[],
  batchesBySlug: Readonly<Record<string, number>>,
  alternatives: AlternativeState,
): ShoppingCalculation {
  const combined = new Map<string, Omit<ShoppingRow, 'packageCount' | 'basketCost'>>();
  let usedTotal = 0;

  for (const recipe of recipes) {
    const batches = batchesBySlug[recipe.slug] ?? 0;
    if (batches <= 0) continue;

    for (const ingredient of recipe.ingredients) {
      const product = productFor(ingredient, recipe.alternativeControls, alternatives);
      const quantity = ingredient.costQuantity * batches;
      const key = `${product.id}:${product.name}:${product.packageUnit}`;
      usedTotal += (quantity * product.priceAud) / product.packageQuantity;

      const entry = combined.get(key) ?? {
        product,
        quantity: 0,
        unit: ingredient.costUnit,
        breakdown: [],
      };
      entry.quantity += quantity;
      entry.breakdown.push({
        recipeTitle: recipe.title,
        ingredientLabel: ingredient.label,
        quantity,
        unit: ingredient.costUnit,
      });
      combined.set(key, entry);
    }
  }

  let basketTotal = 0;
  const rows = Array.from(combined.values())
    .sort((left, right) => left.product.name.localeCompare(right.product.name))
    .map((entry): ShoppingRow => {
      const packageCount = Math.ceil(entry.quantity / entry.product.packageQuantity);
      const basketCost = packageCount * entry.product.priceAud;
      basketTotal += basketCost;
      return { ...entry, packageCount, basketCost };
    });

  return { rows, usedTotal, basketTotal };
}

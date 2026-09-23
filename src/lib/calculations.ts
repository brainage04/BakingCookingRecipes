import type { AlternativeControl } from '../data/recipes';
import type { IngredientChoice, MacroBreakdown, MetricUnit, ProductChoice, Unit } from '../data/types';

export type AlternativeState = Readonly<Record<string, boolean>>;

export interface IngredientCalculation {
  ingredient: IngredientChoice;
  product: ProductChoice;
  scaledMetric: number;
  scaledCost: number;
  /**
   * Whole packs for this row's product. Ingredients sharing a product (egg and egg yolk) are bought together: the
   * first row carries the combined basket and later rows point at it.
   */
  basket: BasketCalculation | SharedBasket;
}

export interface BasketCalculation {
  packageCount: number;
  cost: number;
}

export interface SharedBasket {
  /** Label of the ingredient row whose basket includes this row. */
  sharedWith: string;
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

export function formatQuantity(value: number, unit: MetricUnit): string {
  const formatted = Number.isInteger(value) ? String(value) : quantityNumber.format(value);
  if (unit === 'g' || unit === 'ml') return `${formatted}${unit}`;
  return `${formatted} ${value === 1 ? unit : `${unit}s`}`;
}

/** Products are the same purchase when these match, so their quantities share whole packs. */
function productKey(product: ProductChoice): string {
  return `${product.id}:${product.name}:${product.packageUnit}`;
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

/** `quantity` is in the product's package unit. */
export function usedCost(product: ProductChoice, quantity: number): number {
  return (quantity * product.priceAud) / product.packageQuantity;
}

/** `quantity` is in the product's package unit. */
export function basketFor(product: ProductChoice, quantity: number): BasketCalculation {
  const packageCount = Math.ceil(quantity / product.packageQuantity);
  return { packageCount, cost: packageCount * product.priceAud };
}

export function caloriesForBatch(ingredient: IngredientChoice, product: ProductChoice): number {
  if (product.kcalPer100g === null) return 0;
  return (ingredient.batchGrams * product.kcalPer100g) / 100;
}

export function macrosForBatch(ingredient: IngredientChoice, product: ProductChoice): MacroBreakdown {
  if (product.macrosPer100g === null) return { protein: 0, carbohydrates: 0, fat: 0 };
  return scaleMacros(product.macrosPer100g, ingredient.batchGrams / 100);
}

export function batchMassGrams(ingredients: readonly IngredientChoice[]): number {
  return ingredients.reduce((total, ingredient) => total + ingredient.batchGrams, 0);
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

  const selections = ingredients.map((ingredient) => ({
    ingredient,
    product: productFor(ingredient, controls, alternatives),
    quantity: ingredient.costQuantity * batches,
  }));
  const productTotals = new Map<string, { owner: IngredientChoice; quantity: number }>();
  for (const { ingredient, product, quantity } of selections) {
    const total = productTotals.get(productKey(product));
    if (total) total.quantity += quantity;
    else productTotals.set(productKey(product), { owner: ingredient, quantity });
  }

  const rows = selections.map(({ ingredient, product, quantity }): IngredientCalculation => {
    const scaledCost = usedCost(product, quantity);
    const total = productTotals.get(productKey(product));
    let basket: BasketCalculation | SharedBasket;
    if (total && total.owner !== ingredient) basket = { sharedWith: total.owner.label };
    else {
      basket = basketFor(product, total?.quantity ?? quantity);
      basketTotal += basket.cost;
    }

    caloriesPerBatch += caloriesForBatch(ingredient, product);
    macrosPerBatch = addMacros(macrosPerBatch, macrosForBatch(ingredient, product));
    usedTotal += scaledCost;

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
    massGrams: batchMassGrams(ingredients) * batches,
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
      const key = productKey(product);
      usedTotal += usedCost(product, quantity);

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
      const basket = basketFor(entry.product, entry.quantity);
      basketTotal += basket.cost;
      return { ...entry, packageCount: basket.packageCount, basketCost: basket.cost };
    });

  return { rows, usedTotal, basketTotal };
}
